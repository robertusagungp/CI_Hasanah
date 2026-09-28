'use client';

import React, { useState } from 'react';
import { ProtectionPlan, LifeEvent, LifeEventType } from '@/engine/types';
import { LifeEventModal } from './LifeEventModal';
import {
  Heart,
  Activity,
  HeartCrack,
  AlertTriangle,
  UserCheck,
  Plus,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiahCompact } from '@/lib/currency';

interface InteractiveTimelineProps {
  plan: ProtectionPlan;
  events: LifeEvent[];
  onAddOrUpdateEvent: (year: number, eventType: LifeEventType) => void;
  onRemoveEvent: (year: number) => void;
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  plan,
  events,
  onAddOrUpdateEvent,
  onRemoveEvent,
  selectedYear,
  onSelectYear,
}) => {
  const [modalYear, setModalYear] = useState<number | null>(null);

  const startYearCalendar = new Date().getFullYear();
  const totalYears = plan.protectionDurationYears;

  // Map events by year for O(1) lookup
  const eventMap = new Map<number, LifeEvent>();
  events.forEach((ev) => eventMap.set(ev.year, ev));

  const handleYearClick = (y: number) => {
    onSelectYear(y);
    setModalYear(y);
  };

  const getEventIcon = (type: LifeEventType) => {
    switch (type) {
      case 'early_ci':
        return <Activity className="w-4 h-4 text-blue-600" />;
      case 'advanced_ci':
        return <HeartCrack className="w-4 h-4 text-amber-600" />;
      case 'death':
        return <UserCheck className="w-4 h-4 text-slate-700" />;
      case 'accident_death':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'healthy':
      default:
        return <Heart className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getEventBg = (type: LifeEventType) => {
    switch (type) {
      case 'early_ci':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'advanced_ci':
        return 'bg-amber-100 border-amber-400 text-amber-800';
      case 'death':
        return 'bg-slate-200 border-slate-400 text-slate-800';
      case 'accident_death':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'healthy':
      default:
        return 'bg-emerald-100 border-emerald-400 text-emerald-800';
    }
  };

  const existingModalEvent = modalYear ? eventMap.get(modalYear) : undefined;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 sm:p-6 transition-all">
      {/* Title & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Coba Cerita Hidup Anda</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Interaktif
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Klik tahun tertentu untuk melihat apa yang terjadi jika sebuah kejadian terjadi pada tahun tersebut.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-500 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand-600 inline-block" />
            <span>Masa Bayar ({plan.paymentDurationYears} thn)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Dilindungi ({plan.protectionDurationYears} thn)</span>
          </div>
        </div>
      </div>

      {/* Timeline Track Overview Bar */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1 font-semibold">
          <span>Usia {plan.currentAge} ({startYearCalendar})</span>
          <span className="text-brand-700">
            Selesai Bayar: Usia {plan.currentAge + plan.paymentDurationYears}
          </span>
          <span>Usia {plan.currentAge + plan.protectionDurationYears} ({startYearCalendar + plan.protectionDurationYears})</span>
        </div>

        {/* Progress Representation Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
          <div
            className="h-full bg-brand-600"
            style={{
              width: `${(plan.paymentDurationYears / totalYears) * 100}%`,
            }}
            title={`Masa Pembayaran: ${plan.paymentDurationYears} Tahun`}
          />
          <div
            className="h-full bg-emerald-100"
            style={{
              width: `${((totalYears - plan.paymentDurationYears) / totalYears) * 100}%`,
            }}
            title={`Masa Perlindungan Tanpa Pembayaran: ${totalYears - plan.paymentDurationYears} Tahun`}
          />
        </div>
      </div>

      {/* Horizontal Scrollable Timeline Year Markers */}
      <div className="relative">
        <p className="text-[11px] text-slate-400 font-medium mb-2 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>Geser horizontal atau sentuh tahun untuk menambahkan/mengubah kejadian hidup</span>
        </p>

        <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin">
          <div className="flex items-stretch gap-2.5 min-w-max">
            {Array.from({ length: totalYears }, (_, i) => i + 1).map((y) => {
              const age = plan.currentAge + y;
              const calYear = startYearCalendar + y;
              const isPaymentYear = y <= plan.paymentDurationYears;
              const event = eventMap.get(y);
              const isSelected = selectedYear === y;

              return (
                <div
                  key={y}
                  className="flex flex-col items-center group relative cursor-pointer"
                  onClick={() => handleYearClick(y)}
                >
                  {/* Event Marker Flag if exists */}
                  <div className="h-9 flex items-end justify-center mb-1">
                    {event ? (
                      <div
                        className={cn(
                          'px-2 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1 shadow-xs transition-transform hover:scale-105',
                          getEventBg(event.eventType)
                        )}
                      >
                        {getEventIcon(event.eventType)}
                        <span>Thn {y}</span>
                      </div>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center text-xs">
                          <Plus className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Year Node Card */}
                  <button
                    type="button"
                    className={cn(
                      'w-16 sm:w-18 p-2 rounded-xl border flex flex-col items-center justify-center transition-all text-center',
                      isSelected
                        ? 'ring-2 ring-brand-600 border-brand-600 bg-brand-50/70 shadow-sm'
                        : event
                        ? 'border-brand-400 bg-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
                    )}
                  >
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Thn ke-{y}
                    </span>
                    <span className="text-sm font-black text-slate-900 leading-tight">
                      {age} th
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {calYear}
                    </span>

                    {/* Small dot for payment active year */}
                    <div className="mt-1.5">
                      {isPaymentYear ? (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-brand-600 inline-block"
                          title="Tahun Pembayaran Aktif"
                        />
                      ) : (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
                          title="Perlindungan Berjalan Bebas Iuran"
                        />
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Picker Modal / Bottom Sheet */}
      {modalYear !== null && (
        <LifeEventModal
          isOpen={modalYear !== null}
          year={modalYear}
          currentAge={plan.currentAge}
          existingEventType={existingModalEvent?.eventType}
          onSelectEvent={(type) => {
            onAddOrUpdateEvent(modalYear, type);
            setModalYear(null);
          }}
          onDeleteEvent={() => {
            onRemoveEvent(modalYear);
            setModalYear(null);
          }}
          onClose={() => setModalYear(null)}
        />
      )}
    </div>
  );
};
