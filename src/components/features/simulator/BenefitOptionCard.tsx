'use client';

import React from 'react';
import { SelectedBenefits, ProtectionPlan } from '@/engine/types';
import { formatRupiah, formatRupiahCompact } from '@/lib/currency';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { Activity, ShieldAlert, Sparkles, Check, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenefitOptionCardProps {
  plan: ProtectionPlan;
  onChange: (updatedBenefits: SelectedBenefits) => void;
}

export const BenefitOptionCard: React.FC<BenefitOptionCardProps> = ({
  plan,
  onChange,
}) => {
  const { selectedBenefits, mainProtectionAmount } = plan;

  const toggleEarlyCI = () => {
    onChange({
      ...selectedBenefits,
      earlySeriousIllness: {
        ...selectedBenefits.earlySeriousIllness,
        enabled: !selectedBenefits.earlySeriousIllness.enabled,
      },
    });
  };

  const setEarlyCIPercent = (percent: 25 | 50) => {
    onChange({
      ...selectedBenefits,
      earlySeriousIllness: {
        enabled: true,
        percent,
      },
    });
  };

  const toggleBooster = () => {
    onChange({
      ...selectedBenefits,
      extraProtectionAge60: {
        enabled: !selectedBenefits.extraProtectionAge60.enabled,
      },
    });
  };

  const toggleCash = () => {
    onChange({
      ...selectedBenefits,
      endOfPeriodCash: {
        enabled: !selectedBenefits.endOfPeriodCash.enabled,
      },
    });
  };

  const toggleWaiver = () => {
    onChange({
      ...selectedBenefits,
      futurePaymentWaiver: {
        enabled: !selectedBenefits.futurePaymentWaiver.enabled,
      },
    });
  };

  const earlyPayoutAmount =
    mainProtectionAmount * (selectedBenefits.earlySeriousIllness.percent / 100);
  const boosterAmount = mainProtectionAmount * 1.5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Manfaat Tambahan
          </h3>
          <p className="text-xs text-slate-500">
            Pilihan perlindungan tambahan untuk melengkapi rencana Anda
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: Early Critical Illness */}
        <div
          className={cn(
            'relative rounded-2xl p-4 sm:p-5 border transition-all text-left flex flex-col justify-between',
            selectedBenefits.earlySeriousIllness.enabled
              ? 'bg-blue-50/50 border-brand-300 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          )}
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    selectedBenefits.earlySeriousIllness.enabled
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    Penyakit Serius Tahap Awal
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Early Critical Illness
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <InfoTooltip content="Manfaat dibayarkan lebih awal apabila terdiagnosa penyakit serius tahap awal, sehingga Anda memiliki dana penanganan sedini mungkin." />
                <button
                  type="button"
                  onClick={toggleEarlyCI}
                  role="switch"
                  aria-checked={selectedBenefits.earlySeriousIllness.enabled}
                  className={cn(
                    'w-11 h-6 flex items-center rounded-full p-1 transition-colors',
                    selectedBenefits.earlySeriousIllness.enabled
                      ? 'bg-brand-600'
                      : 'bg-slate-200'
                  )}
                >
                  <div
                    className={cn(
                      'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                      selectedBenefits.earlySeriousIllness.enabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Terima sebagian manfaat lebih awal apabila mengalami kondisi penyakit serius tahap awal sesuai ketentuan.
            </p>
          </div>

          {/* Controls & Value display */}
          <div className="pt-3 border-t border-slate-200/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Pilihan Persentase:
              </span>
              <div className="flex items-center gap-1">
                {[25, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    disabled={!selectedBenefits.earlySeriousIllness.enabled}
                    onClick={() => setEarlyCIPercent(pct as 25 | 50)}
                    className={cn(
                      'px-2.5 py-0.5 text-xs font-bold rounded-md transition-all',
                      selectedBenefits.earlySeriousIllness.enabled &&
                        selectedBenefits.earlySeriousIllness.percent === pct
                        ? 'bg-brand-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'
                    )}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-slate-200/60">
              <span className="text-slate-500 font-medium">Manfaat awal:</span>
              <span className="font-bold text-slate-900">
                {selectedBenefits.earlySeriousIllness.enabled
                  ? `${selectedBenefits.earlySeriousIllness.percent}% = ${formatRupiah(earlyPayoutAmount)}`
                  : 'Tidak aktif'}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: Extra Protection (Hasanah Booster) */}
        <div
          className={cn(
            'relative rounded-2xl p-4 sm:p-5 border transition-all text-left flex flex-col justify-between',
            selectedBenefits.extraProtectionAge60.enabled
              ? 'bg-blue-50/50 border-brand-300 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          )}
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    selectedBenefits.extraProtectionAge60.enabled
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    Perlindungan Ekstra hingga Usia 60
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Hasanah Booster (150%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <InfoTooltip content="Memberikan tambahan proteksi sebesar 50% ekstra (total 150%) saat kondisi kritis tahap lanjut atau meninggal dunia sebelum usia 60 tahun." />
                <button
                  type="button"
                  onClick={toggleBooster}
                  role="switch"
                  aria-checked={selectedBenefits.extraProtectionAge60.enabled}
                  className={cn(
                    'w-11 h-6 flex items-center rounded-full p-1 transition-colors',
                    selectedBenefits.extraProtectionAge60.enabled
                      ? 'bg-brand-600'
                      : 'bg-slate-200'
                  )}
                >
                  <div
                    className={cn(
                      'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                      selectedBenefits.extraProtectionAge60.enabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Jumlah perlindungan dapat menjadi lebih besar sampai usia 60 tahun sesuai pilihan perlindungan.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-slate-200/60">
              <span className="text-slate-500 font-medium">Normal:</span>
              <span className="text-slate-700 font-semibold">
                {formatRupiahCompact(mainProtectionAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-brand-200 text-brand-900 font-bold">
              <span>Dengan perlindungan ekstra:</span>
              <span className="text-brand-700">
                {selectedBenefits.extraProtectionAge60.enabled
                  ? formatRupiahCompact(boosterAmount)
                  : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: Cash at End of Period (Hasanah Cash) */}
        <div
          className={cn(
            'relative rounded-2xl p-4 sm:p-5 border transition-all text-left flex flex-col justify-between',
            selectedBenefits.endOfPeriodCash.enabled
              ? 'bg-blue-50/50 border-brand-300 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          )}
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    selectedBenefits.endOfPeriodCash.enabled
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    Manfaat Tunai di Akhir Periode
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Hasanah Cash
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <InfoTooltip content="Jika Anda tetap sehat hingga akhir masa perlindungan tanpa klaim tahap lanjut atau meninggal, dana pembayaran yang telah dilakukan dapat diterima kembali." />
                <button
                  type="button"
                  onClick={toggleCash}
                  role="switch"
                  aria-checked={selectedBenefits.endOfPeriodCash.enabled}
                  className={cn(
                    'w-11 h-6 flex items-center rounded-full p-1 transition-colors',
                    selectedBenefits.endOfPeriodCash.enabled
                      ? 'bg-brand-600'
                      : 'bg-slate-200'
                  )}
                >
                  <div
                    className={cn(
                      'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                      selectedBenefits.endOfPeriodCash.enabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Jika memenuhi ketentuan hingga akhir periode perlindungan, tersedia manfaat tunai berdasarkan pembayaran perlindungan yang telah dilakukan.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60">
            <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-slate-200/60">
              <span className="text-slate-500 font-medium">Status manfaat akhir:</span>
              <span
                className={cn(
                  'font-bold',
                  selectedBenefits.endOfPeriodCash.enabled
                    ? 'text-emerald-700'
                    : 'text-slate-500'
                )}
              >
                {selectedBenefits.endOfPeriodCash.enabled
                  ? 'Aktif (Kembali s.d. 100% Pembayaran)'
                  : 'Tidak Aktif'}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: Future Payment Waiver (Payor Syariah) */}
        <div
          className={cn(
            'relative rounded-2xl p-4 sm:p-5 border transition-all text-left flex flex-col justify-between',
            selectedBenefits.futurePaymentWaiver.enabled
              ? 'bg-blue-50/50 border-brand-300 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          )}
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    selectedBenefits.futurePaymentWaiver.enabled
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    Pembayaran Berikutnya Dibebaskan
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Payor Syariah
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <InfoTooltip content="Saat terdiagnosa kondisi kritis tahap awal/lanjut, Anda tidak perlu lagi membayar kewajiban iuran berikutnya, namun perlindungan tetap berjalan penuh." />
                <button
                  type="button"
                  onClick={toggleWaiver}
                  role="switch"
                  aria-checked={selectedBenefits.futurePaymentWaiver.enabled}
                  className={cn(
                    'w-11 h-6 flex items-center rounded-full p-1 transition-colors',
                    selectedBenefits.futurePaymentWaiver.enabled
                      ? 'bg-brand-600'
                      : 'bg-slate-200'
                  )}
                >
                  <div
                    className={cn(
                      'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                      selectedBenefits.futurePaymentWaiver.enabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Dalam kondisi tertentu, pembayaran berikutnya dapat dibebaskan sehingga perlindungan tetap dapat berjalan.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60">
            <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-lg border border-slate-200/60">
              <span className="text-slate-500 font-medium">Pembebasan iuran:</span>
              <span
                className={cn(
                  'font-bold',
                  selectedBenefits.futurePaymentWaiver.enabled
                    ? 'text-brand-700'
                    : 'text-slate-500'
                )}
              >
                {selectedBenefits.futurePaymentWaiver.enabled
                  ? 'Aktif Otomatis'
                  : 'Tidak Aktif'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
