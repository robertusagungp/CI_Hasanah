'use client';

import React from 'react';
import { ScenarioResult, ProtectionPlan } from '@/engine/types';
import { formatRupiah, formatRupiahCompact } from '@/lib/currency';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import {
  Shield,
  CreditCard,
  ArrowDownCircle,
  HelpCircle,
  CheckCircle,
  Sparkles,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScenarioSummaryProps {
  plan: ProtectionPlan;
  result: ScenarioResult;
  onOpenShare: () => void;
  onOpenCompare: () => void;
  className?: string;
}

export const ScenarioSummary: React.FC<ScenarioSummaryProps> = ({
  plan,
  result,
  onOpenShare,
  onOpenCompare,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 transition-all',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Ringkasan Hasil
          </span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Status Finansial Anda
          </h3>
        </div>

        <button
          type="button"
          onClick={onOpenShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors"
          title="Bagikan Simulasi"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Bagikan</span>
        </button>
      </div>

      {/* 4 Primary Financial Status Blocks */}
      <div className="space-y-4">
        {/* Item 1: Pembayaran yang sudah dilakukan */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Pembayaran yang sudah dilakukan
            </span>
            <InfoTooltip content="Akumulasi dana iuran perlindungan yang telah disetorkan hingga tahun kejadian terakhir atau akhir masa bayar." />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {formatRupiah(result.totalPaymentsMade)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Setara {formatRupiahCompact(result.totalPaymentsMade)} dari rencana {plan.paymentDurationYears} tahun
          </p>
        </div>

        {/* Item 2: Manfaat yang sudah diterima */}
        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
              <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Manfaat yang sudah diterima</span>
            </span>
            <InfoTooltip content="Total santunan tunai yang telah dicairkan kepada Anda atau keluarga sesuai skenario kejadian." />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight mt-1">
            {formatRupiah(result.benefitsReceived)}
          </p>
          <p className="text-[11px] text-emerald-800/80 font-medium mt-0.5">
            Berdasarkan skenario kejadian yang dipilih
          </p>
        </div>

        {/* Item 3: Sisa Perlindungan */}
        <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-brand-600" />
              <span>Sisa perlindungan</span>
            </span>
            <InfoTooltip content="Ini adalah jumlah perlindungan yang masih tersedia setelah manfaat sebelumnya dibayarkan." />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-900 tracking-tight mt-1">
            {formatRupiah(result.remainingProtection)}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <StatusBadge
              status={result.remainingProtection > 0 ? 'active' : 'terminated'}
              label={result.protectionStatusLabel}
              size="sm"
            />
          </div>
        </div>

        {/* Item 4: Pembayaran Berikutnya (Waiver Status) */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-600">
              Pembayaran Berikutnya
            </span>
            <InfoTooltip content="Menunjukkan apakah Anda masih perlu menyetor pembayaran rutin atau sudah dibebaskan karena kondisi kritis." />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              {result.futurePaymentsLabel}
            </span>
            <StatusBadge
              status={
                result.futurePaymentsRequired === 'waived'
                  ? 'waived'
                  : result.futurePaymentsRequired === 'completed'
                  ? 'completed'
                  : 'continue'
              }
              label={
                result.futurePaymentsRequired === 'waived'
                  ? 'Dibebaskan'
                  : result.futurePaymentsRequired === 'completed'
                  ? 'Selesai'
                  : 'Aktif'
              }
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Action: Compare Scenarios Button */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onOpenCompare}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-brand-700" />
          <span>Bandingkan dengan Skenario Lain</span>
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-2.5">
          Ilustrasi berdasarkan skenario yang dipilih.
        </p>
      </div>
    </div>
  );
};
