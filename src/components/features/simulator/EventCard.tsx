'use client';

import React from 'react';
import { ProcessedTimelineEvent } from '@/engine/types';
import { formatRupiah } from '@/lib/currency';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ArrowDownCircle,
  Shield,
  HelpCircle,
  Sparkles,
  Edit2,
  Trash2,
  Activity,
  HeartCrack,
  UserCheck,
  AlertTriangle,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: ProcessedTimelineEvent;
  onEdit?: (year: number) => void;
  onDelete?: (year: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
}) => {
  const getEventIcon = () => {
    switch (event.eventType) {
      case 'early_ci':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'advanced_ci':
        return <HeartCrack className="w-5 h-5 text-amber-600" />;
      case 'death':
        return <UserCheck className="w-5 h-5 text-slate-700" />;
      case 'accident_death':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'healthy':
      default:
        return <Heart className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6 transition-all hover:border-slate-300">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            {getEventIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                Tahun ke-{event.year}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Usia {event.age} tahun
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(event.year)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Ubah kejadian"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(event.year)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Hapus kejadian"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Core Questions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* Q1: Apa yang terjadi? */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            1. Apa yang terjadi?
          </p>
          <p className="text-sm font-bold text-slate-900 mt-1">
            {event.title}
          </p>
          {event.payoutBreakdown && (
            <p className="text-xs text-slate-500 mt-0.5">
              {event.payoutBreakdown}
            </p>
          )}
        </div>

        {/* Q2: Berapa uang yang diterima? */}
        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
          <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
            <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Berapa uang yang diterima?</span>
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            {formatRupiah(event.payoutAmount)}
          </p>
          <p className="text-xs text-emerald-800/80 font-medium mt-0.5">
            Manfaat yang dapat diterima
          </p>
        </div>

        {/* Q3: Berapa perlindungan yang masih tersisa? */}
        <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
          <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wide flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>3. Berapa sisa perlindungan?</span>
          </p>
          <p className="text-lg sm:text-xl font-black text-blue-900 mt-1">
            {formatRupiah(event.remainingProtectionAfter)}
          </p>
          <div className="mt-1">
            <StatusBadge
              status={event.remainingProtectionAfter > 0 ? 'active' : 'terminated'}
              label={event.statusText}
              size="sm"
            />
          </div>
        </div>

        {/* Q4: Apa yang terjadi setelah ini? */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span>4. Apa yang terjadi setelah ini?</span>
          </p>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
            {event.whatHappensNext}
          </p>
          {event.isWaiverTriggered && (
            <div className="mt-2">
              <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100/80 border border-amber-300 px-2 py-0.5 rounded-md">
                ✓ Pembayaran berikutnya dibebaskan
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
