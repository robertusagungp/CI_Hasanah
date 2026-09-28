'use client';

import React, { useState } from 'react';
import { ProtectionPlan, PaymentFrequency } from '@/engine/types';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { formatRupiah, formatRupiahCompact } from '@/lib/currency';
import { RotateCcw, Shield, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProtectionSetupProps {
  plan: ProtectionPlan;
  onChange: (updated: ProtectionPlan) => void;
  onReset: () => void;
  isModified: boolean;
}

export const ProtectionSetup: React.FC<ProtectionSetupProps> = ({
  plan,
  onChange,
  onReset,
  isModified,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFrequencyChange = (freq: PaymentFrequency) => {
    // If switching between monthly and yearly, adjust reasonable payment default if desired
    let newPayment = plan.paymentAmount;
    if (freq === 'monthly' && plan.paymentFrequency === 'yearly') {
      newPayment = Math.round(plan.paymentAmount / 12);
    } else if (freq === 'yearly' && plan.paymentFrequency === 'monthly') {
      newPayment = plan.paymentAmount * 12;
    }

    onChange({
      ...plan,
      paymentFrequency: freq,
      paymentAmount: newPayment,
    });
  };

  const handleResetClick = () => {
    if (isModified) {
      setShowResetConfirm(true);
    } else {
      onReset();
    }
  };

  const confirmReset = () => {
    setShowResetConfirm(false);
    onReset();
  };

  const annualEquivalent =
    plan.paymentFrequency === 'monthly'
      ? plan.paymentAmount * 12
      : plan.paymentAmount;

  const endAge = plan.currentAge + plan.protectionDurationYears;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 sm:p-6 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Perlindungan Saya
            </h2>
            <p className="text-xs text-slate-500">
              Atur detail rencana perlindungan sesuai ilustrasi Anda
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
          title="Mulai Ulang Simulasi"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mulai Ulang</span>
        </button>
      </div>

      {/* Reset Confirmation Alert */}
      {showResetConfirm && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-amber-900">
              Mulai ulang pengaturan simulasi?
            </p>
            <p className="text-xs text-amber-700">
              Semua nilai dan skenario yang Anda pilih akan kembali ke pengaturan awal.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmReset}
              className="px-3 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              Ya, Mulai Ulang
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Left Column: Age & Main Protection Amount */}
        <div className="space-y-5">
          {/* Current Age */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="current-age-input"
                className="text-sm font-semibold text-slate-800"
              >
                Usia Saat Ini
              </label>
              <span className="text-sm font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                {plan.currentAge} tahun
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="current-age-input"
                type="range"
                min={18}
                max={60}
                value={plan.currentAge}
                onChange={(e) =>
                  onChange({ ...plan, currentAge: Number(e.target.value) })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...plan,
                      currentAge: Math.max(18, plan.currentAge - 1),
                    })
                  }
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...plan,
                      currentAge: Math.min(60, plan.currentAge + 1),
                    })
                  }
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rentang usia masuk 18 hingga 60 tahun
            </p>
          </div>

          {/* Jumlah Perlindungan (Manually set by user/agent) */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label
                htmlFor="main-protection-input"
                className="text-sm font-semibold text-slate-800"
              >
                Jumlah Perlindungan
              </label>
              <InfoTooltip content="Nilai perlindungan dasar yang akan diterima keluarga atau Anda saat risiko penyakit serius atau meninggal dunia." />
            </div>
            <CurrencyInput
              id="main-protection-input"
              value={plan.mainProtectionAmount}
              onChange={(val) =>
                onChange({ ...plan, mainProtectionAmount: val })
              }
              placeholder="Rp1.000.000.000"
              helperText="Masukkan angka sesuai lembar ilustrasi resmi (tidak dihitung otomatis dari pembayaran)."
            />
            {/* Quick Chips for Protection Amount */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[500_000_000, 1_000_000_000, 1_500_000_000, 2_000_000_000].map(
                (amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() =>
                      onChange({ ...plan, mainProtectionAmount: amt })
                    }
                    className={cn(
                      'text-xs px-2.5 py-1 rounded-lg border font-medium transition-all',
                      plan.mainProtectionAmount === amt
                        ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    )}
                  >
                    {formatRupiahCompact(amt)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Details & Duration */}
        <div className="space-y-5">
          {/* Payment Frequency and Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="payment-amount-input"
                className="text-sm font-semibold text-slate-800"
              >
                Pembayaran Perlindungan
              </label>
              {/* Frequency Toggle */}
              <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleFrequencyChange('monthly')}
                  className={cn(
                    'px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all',
                    plan.paymentFrequency === 'monthly'
                      ? 'bg-white text-brand-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Bulanan
                </button>
                <button
                  type="button"
                  onClick={() => handleFrequencyChange('yearly')}
                  className={cn(
                    'px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all',
                    plan.paymentFrequency === 'yearly'
                      ? 'bg-white text-brand-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Tahunan
                </button>
              </div>
            </div>

            <CurrencyInput
              id="payment-amount-input"
              value={plan.paymentAmount}
              onChange={(val) => onChange({ ...plan, paymentAmount: val })}
              placeholder={
                plan.paymentFrequency === 'monthly'
                  ? 'Rp1.000.000 / bulan'
                  : 'Rp12.000.000 / tahun'
              }
              showCompactBadge={false}
            />

            {/* Equivalent indicator */}
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span>
                {plan.paymentFrequency === 'monthly'
                  ? `Setara ${formatRupiah(annualEquivalent)} per tahun`
                  : `Setara ${formatRupiah(Math.round(annualEquivalent / 12))} per bulan`}
              </span>
              <span className="font-semibold text-slate-700">
                {plan.paymentFrequency === 'monthly' ? '/ bulan' : '/ tahun'}
              </span>
            </div>
          </div>

          {/* Durations: Bayar Selama & Dilindungi Selama */}
          <div className="grid grid-cols-2 gap-3">
            {/* Bayar Selama */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <label className="text-xs font-semibold text-slate-700">
                  Bayar Selama
                </label>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[5, 10, 15, 20].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() =>
                      onChange({ ...plan, paymentDurationYears: term })
                    }
                    className={cn(
                      'py-1.5 px-2 text-xs font-bold rounded-lg border transition-all text-center',
                      plan.paymentDurationYears === term
                        ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    {term} thn
                  </button>
                ))}
              </div>
            </div>

            {/* Dilindungi Selama */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <label className="text-xs font-semibold text-slate-700">
                  Dilindungi Selama
                </label>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[20, 25, 30].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() =>
                      onChange({ ...plan, protectionDurationYears: term })
                    }
                    className={cn(
                      'py-1.5 px-2 text-xs font-bold rounded-lg border transition-all text-center',
                      plan.protectionDurationYears === term
                        ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    {term} thn
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Usia perlindungan berakhir calculated display */}
          <div className="p-3 bg-brand-50/70 border border-brand-100 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Usia perlindungan berakhir:
            </span>
            <span className="font-bold text-brand-900 text-sm">
              {endAge} tahun
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
