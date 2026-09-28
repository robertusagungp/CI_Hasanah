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
  Gift,
  ShieldCheck,
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
      case 'hasanah_cash':
        return <Gift className="w-4 h-4 text-amber-700" />;
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
      case 'hasanah_cash':
        return 'bg-amber-100 border-amber-400 text-amber-900';
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
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 self-start sm:self-auto font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand-600 inline-block" />
            <span>Masa Bayar ({plan.paymentDurationYears} thn)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span>Thn 20 (Uang Kembali 100%)</span>
          </div>
          {totalYears > 20 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
              <span>Thn 21–30 (Masa Garansi)</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Track Overview Bar */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-semibold">
          <span>Usia {plan.currentAge} ({startYearCalendar})</span>
          <span className="text-brand-700">
            Selesai Bayar: Usia {plan.currentAge + plan.paymentDurationYears}
          </span>
          {totalYears >= 20 && (
            <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Thn 20: 100% Uang Kembali
            </span>
          )}
          <span>Usia {plan.currentAge + totalYears} ({startYearCalendar + totalYears})</span>
        </div>

        {/* Multi-phase Track Representation Bar */}
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex relative shadow-inner">
          {/* Phase 1: Payment period */}
          <div
            className="h-full bg-brand-600 transition-all"
            style={{
              width: `${(Math.min(plan.paymentDurationYears, totalYears) / totalYears) * 100}%`,
            }}
            title={`Masa Pembayaran: ${plan.paymentDurationYears} Tahun`}
          />

          {/* Phase 2: Active coverage up to Year 20 */}
          {totalYears >= 20 && (
            <div
              className="h-full bg-emerald-300 transition-all"
              style={{
                width: `${((20 - plan.paymentDurationYears) / totalYears) * 100}%`,
              }}
              title="Masa Perlindungan Tanpa Pembayaran (Tahun 11 s.d. 20)"
            />
          )}

          {/* Phase 3: Warranty years (21 - 30) */}
          {totalYears > 20 && (
            <div
              className="h-full bg-purple-400 transition-all"
              style={{
                width: `${((totalYears - 20) / totalYears) * 100}%`,
              }}
              title="Masa Garansi Perlindungan Lanjutan Tanpa Biaya (Tahun 21 s.d. 30)"
            />
          )}

          {/* Fallback if totalYears < 20 */}
          {totalYears < 20 && (
            <div
              className="h-full bg-emerald-200 transition-all"
              style={{
                width: `${((totalYears - plan.paymentDurationYears) / totalYears) * 100}%`,
              }}
            />
          )}
        </div>

        {/* Phase Sub-Labels Under Track */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-medium">
          <span>Tahun 1–{plan.paymentDurationYears}: Masa Iuran</span>
          {totalYears > 20 && (
            <span className="text-purple-700 font-bold">
              ★ Tahun 21–30: Masa Garansi Bebas Biaya (Santunan Tetap Cair)
            </span>
          )}
          <span>Akhir Periode</span>
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
              const isYear20 = y === 20;
              const isWarrantyYear = y > 20;
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
                    ) : isYear20 ? (
                      <div className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-black text-amber-900 flex items-center gap-1 shadow-xs">
                        <Gift className="w-3 h-3 text-amber-700" />
                        <span>100% Uang Kembali</span>
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
                        : isYear20
                        ? 'border-amber-400 bg-amber-50/60 shadow-xs ring-1 ring-amber-300'
                        : isWarrantyYear
                        ? 'border-purple-200 bg-purple-50/30 hover:border-purple-300'
                        : event
                        ? 'border-brand-400 bg-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-wider font-semibold',
                        isWarrantyYear ? 'text-purple-600 font-bold' : 'text-slate-400'
                      )}
                    >
                      {isWarrantyYear ? `Garansi` : `Thn ${y}`}
                    </span>
                    <span className="text-sm font-black text-slate-900 leading-tight">
                      {age} th
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {calYear}
                    </span>

                    {/* Small status dot for year */}
                    <div className="mt-1.5">
                      {isPaymentYear ? (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-brand-600 inline-block"
                          title="Tahun Pembayaran Aktif"
                        />
                      ) : isYear20 ? (
                        <span
                          className="w-2 h-2 rounded-full bg-amber-500 inline-block ring-2 ring-amber-200"
                          title="Tahun ke-20: Pengembalian 100% Iuran"
                        />
                      ) : isWarrantyYear ? (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"
                          title="Masa Garansi Proteksi Bebas Biaya"
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
