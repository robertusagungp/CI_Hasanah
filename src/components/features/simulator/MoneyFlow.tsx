'use client';

import React from 'react';
import { ScenarioResult, ProtectionPlan } from '@/engine/types';
import { formatRupiah, formatRupiahCompact } from '@/lib/currency';
import { ArrowUpRight, ArrowDownLeft, Shield, Gift, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoneyFlowProps {
  plan: ProtectionPlan;
  result: ScenarioResult;
}

export const MoneyFlow: React.FC<MoneyFlowProps> = ({ plan, result }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 sm:p-6 transition-all">
      <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Arus Dana Perlindungan
          </h3>
          <p className="text-xs text-slate-500">
            Perbandingan dana yang Anda bayarkan dan perlindungan yang Anda miliki
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          Bukan Investasi
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Money Out: Pembayaran Anda */}
        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
                <span>Pembayaran Anda</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Uang Keluar</span>
            </div>

            <p className="text-xs text-slate-500 mb-1">
              Total yang telah dibayarkan:
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatRupiah(result.totalPaymentsMade)}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span>Rencana Bayar:</span>
              <span className="font-semibold text-slate-800">
                {plan.paymentDurationYears} tahun
              </span>
            </div>
            {result.totalPaymentsSavedByWaiver > 0 && (
              <div className="flex items-center justify-between text-amber-800 font-bold bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                <span>Dibebaskan (Hemat):</span>
                <span>{formatRupiah(result.totalPaymentsSavedByWaiver)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Money In: Manfaat yang Diterima */}
        <div className="rounded-xl border border-emerald-200 p-4 bg-emerald-50/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>Manfaat Diterima</span>
              </span>
              <span className="text-xs text-emerald-700 font-medium">Uang Masuk</span>
            </div>

            <p className="text-xs text-emerald-800/80 mb-1">
              Total manfaat dicairkan:
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              {formatRupiah(result.benefitsReceived)}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/80 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center justify-between">
              <span>Sisa Perlindungan:</span>
              <span className="font-bold">
                {formatRupiah(result.remainingProtection)}
              </span>
            </div>
            {result.endOfPeriodCashAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-900 font-bold bg-emerald-100/70 p-1.5 rounded-lg">
                <span className="flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Pengembalian Iuran (Thn 20):</span>
                </span>
                <span>{formatRupiah(result.endOfPeriodCashAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
