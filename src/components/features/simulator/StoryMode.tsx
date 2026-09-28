'use client';

import React from 'react';
import { ProtectionPlan, ScenarioResult } from '@/engine/types';
import { formatRupiah } from '@/lib/currency';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ShieldCheck,
  ArrowDown,
  Sparkles,
  Heart,
  Activity,
  HeartCrack,
  UserCheck,
  AlertTriangle,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoryModeProps {
  plan: ProtectionPlan;
  result: ScenarioResult;
}

export const StoryMode: React.FC<StoryModeProps> = ({ plan, result }) => {
  const events = result.eventsProcessed;
  const endAge = plan.currentAge + plan.protectionDurationYears;

  return (
    <div className="space-y-6">
      {/* Chapter 1: Starting Protection */}
      <div className="relative pl-6 sm:pl-8 pb-6 border-l-2 border-brand-200">
        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px] font-bold">
          1
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black tracking-wider uppercase text-brand-700">
              USIA {plan.currentAge} TAHUN
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Awal Perlindungan
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 mb-1">
            Perlindungan Anda resmi dimulai
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 mb-3">
            Anda terlindungi dengan jumlah perlindungan dasar:
          </p>

          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            {formatRupiah(plan.mainProtectionAmount)}
          </p>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>
              Rencana pembayaran: {formatRupiah(plan.paymentAmount)} ({plan.paymentFrequency === 'monthly' ? 'per bulan' : 'per tahun'})
            </span>
            <span className="font-semibold text-slate-700">
              Dibayarkan selama {plan.paymentDurationYears} tahun
            </span>
          </div>
        </div>
      </div>

      {/* Chapter 2..N: Sequential Life Events */}
      {events.length > 0 ? (
        events.map((ev, idx) => (
          <div
            key={ev.id || idx}
            className="relative pl-6 sm:pl-8 pb-6 border-l-2 border-brand-200"
          >
            <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px] font-bold">
              {idx + 2}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-wider uppercase text-brand-700">
                  USIA {ev.age} TAHUN (Tahun ke-{ev.year})
                </span>
                <StatusBadge
                  status={ev.remainingProtectionAfter > 0 ? 'active' : 'terminated'}
                  size="sm"
                  label={ev.statusText}
                />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {ev.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Berdasarkan skenario ini, manfaat yang dapat diterima:
                </p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight mt-1">
                  {formatRupiah(ev.payoutAmount)}
                </p>
                {ev.payoutBreakdown && (
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    {ev.payoutBreakdown}
                  </p>
                )}
              </div>

              {/* Status after this event */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">
                    Sisa perlindungan:{' '}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatRupiah(ev.remainingProtectionAfter)}
                  </span>
                </div>
                {ev.isWaiverTriggered && (
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                    Pembayaran berikutnya dibebaskan
                  </span>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Langkah selanjutnya: </span>
                {ev.whatHappensNext}
              </div>
            </div>
          </div>
        ))
      ) : (
        /* If no events, healthy until end */
        <div className="relative pl-6 sm:pl-8 pb-6 border-l-2 border-brand-200">
          <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px] font-bold">
            2
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black tracking-wider uppercase text-emerald-800">
                SELAMA MASA PERLINDUNGAN
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Kondisi Sehat
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-1">
              Alhamdulillah, Anda tetap sehat walafiat
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Keluarga Anda selalu memiliki kepastian perlindungan penuh sebesar{' '}
              <strong className="text-slate-900">{formatRupiah(plan.mainProtectionAmount)}</strong>{' '}
              sepanjang {plan.protectionDurationYears} tahun.
            </p>
          </div>
        </div>
      )}

      {/* Chapter Final: End of Term */}
      <div className="relative pl-6 sm:pl-8">
        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-brand-900 text-white flex items-center justify-center text-[10px] font-bold">
          ★
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black tracking-wider uppercase text-slate-500">
              USIA {endAge} TAHUN
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Akhir Periode
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 mb-1">
            Periode perlindungan {plan.protectionDurationYears} tahun berakhir
          </h4>

          {result.endOfPeriodCashAmount > 0 ? (
            <div className="mt-3 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Manfaat Tunai di Akhir Periode (Hasanah Cash)</span>
              </div>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {formatRupiah(result.endOfPeriodCashAmount)}
              </p>
              <p className="text-xs text-emerald-800 mt-1">
                Dana tunai ini dapat Anda terima kembali setelah masa perlindungan selesai sesuai ketentuan produk.
              </p>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {result.protectionStatus === 'terminated'
                ? 'Perlindungan telah selesai karena seluruh manfaat telah dicairkan pada kejadian sebelumnya.'
                : 'Masa kontrak perlindungan telah selesai dijalankan dengan penuh kepastian.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
