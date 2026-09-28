'use client';

import React from 'react';
import { ProtectionPlan, ScenarioResult } from '@/engine/types';
import { formatRupiah, formatRupiahCompact } from '@/lib/currency';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Shield, Coins, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailedNumbersModeProps {
  plan: ProtectionPlan;
  result: ScenarioResult;
}

export const DetailedNumbersMode: React.FC<DetailedNumbersModeProps> = ({
  plan,
  result,
}) => {
  return (
    <div className="space-y-5">
      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">
            Perlindungan Dasar
          </p>
          <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
            {formatRupiahCompact(plan.mainProtectionAmount)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {formatRupiah(plan.mainProtectionAmount)}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">
            Total Dibayarkan
          </p>
          <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
            {formatRupiahCompact(result.totalPaymentsMade)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {formatRupiah(result.totalPaymentsMade)}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20">
          <p className="text-[11px] font-semibold text-emerald-800 uppercase">
            Manfaat Diterima
          </p>
          <p className="text-base sm:text-lg font-black text-emerald-700 mt-1">
            {formatRupiahCompact(result.benefitsReceived)}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">
            {formatRupiah(result.benefitsReceived)}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/20">
          <p className="text-[11px] font-semibold text-blue-800 uppercase">
            Sisa Perlindungan
          </p>
          <p className="text-base sm:text-lg font-black text-blue-900 mt-1">
            {formatRupiahCompact(result.remainingProtection)}
          </p>
          <p className="text-[11px] text-blue-600 mt-0.5">
            {formatRupiah(result.remainingProtection)}
          </p>
        </div>
      </div>

      {/* Events Breakdown List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span>Rincian Kejadian & Manfaat Finansial</span>
          <span className="text-xs font-normal text-slate-500">
            {result.eventsProcessed.length} Kejadian
          </span>
        </h4>

        {result.eventsProcessed.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            <p className="font-semibold text-slate-700 mb-1">
              Tidak ada kejadian risiko pada skenario ini.
            </p>
            <p>
              Semua perlindungan berjalan optimal hingga usia {result.endAge} tahun.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {result.eventsProcessed.map((ev, idx) => (
              <div
                key={ev.id || idx}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      Tahun ke-{ev.year}
                    </span>
                    <span className="text-xs text-slate-500">
                      Usia {ev.age} th
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {ev.title}
                    </span>
                  </div>
                  {ev.payoutBreakdown && (
                    <p className="text-xs text-slate-500 mt-1">
                      {ev.payoutBreakdown}
                    </p>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-base font-black text-emerald-700">
                    + {formatRupiah(ev.payoutAmount)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Sisa Proteksi: {formatRupiah(ev.remainingProtectionAfter)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Terms & Waivers Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-slate-600" />
            <span>Kewajiban Pembayaran</span>
          </p>
          <div className="flex justify-between text-slate-600">
            <span>Rencana Total Pembayaran:</span>
            <span className="font-semibold text-slate-800">
              {formatRupiah(result.totalPlannedPayments)}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Aktual Dibayarkan:</span>
            <span className="font-semibold text-slate-800">
              {formatRupiah(result.totalPaymentsMade)}
            </span>
          </div>
          {result.totalPaymentsSavedByWaiver > 0 && (
            <div className="flex justify-between text-amber-800 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
              <span>Dana Terbebas (Payor):</span>
              <span>{formatRupiah(result.totalPaymentsSavedByWaiver)}</span>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-slate-600" />
            <span>Status Perlindungan Akhir</span>
          </p>
          <div className="flex justify-between items-center text-slate-600">
            <span>Status Kontrak:</span>
            <StatusBadge
              status={result.protectionStatus}
              label={result.protectionStatusLabel}
              size="sm"
            />
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Status Pembayaran:</span>
            <span className="font-semibold text-slate-800">
              {result.futurePaymentsLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
