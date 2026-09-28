'use client';

import React from 'react';
import { ProtectionPlan, Scenario, ScenarioResult } from '@/engine/types';
import { runScenarioSimulation } from '@/engine/scenarioEngine';
import { formatRupiah, formatRupiahCompact } from '@/lib/currency';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { X, Check, Save, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SavedScenarioSlot {
  id: 'A' | 'B' | 'C';
  name: string;
  scenario: Scenario | null;
}

interface ScenarioComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ProtectionPlan;
  currentScenario: Scenario;
  savedSlots: SavedScenarioSlot[];
  onSaveToSlot: (slotId: 'A' | 'B' | 'C') => void;
  onLoadFromSlot: (scenario: Scenario) => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  isOpen,
  onClose,
  plan,
  currentScenario,
  savedSlots,
  onSaveToSlot,
  onLoadFromSlot,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-floating z-10 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                Fitur Pembanding
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Bandingkan Berbagai Skenario Cerita Hidup
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Lihat perbedaan manfaat finansial dan sisa proteksi antar skenario secara berdampingan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: 3 Comparison Cards */}
        <div className="p-6 overflow-y-auto">
          {/* Quick slot save bar */}
          <div className="mb-6 p-4 rounded-2xl bg-brand-50/50 border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm font-bold text-brand-950">
                Simpan skenario yang sedang aktif ke slot pembanding:
              </p>
              <p className="text-xs text-brand-700/80">
                Skenario aktif saat ini memiliki {currentScenario.events.length} kejadian.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {(['A', 'B', 'C'] as const).map((slotId) => (
                <button
                  key={slotId}
                  type="button"
                  onClick={() => onSaveToSlot(slotId)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-brand-100 text-brand-900 border border-brand-200 shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan ke Slot {slotId}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3 Columns Responsive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {savedSlots.map((slot) => {
              const scenario = slot.scenario;
              const result: ScenarioResult | null = scenario
                ? runScenarioSimulation(plan, scenario)
                : null;

              return (
                <div
                  key={slot.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300"
                >
                  <div>
                    {/* Slot Title */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-brand-900 text-white font-black text-xs flex items-center justify-center">
                          {slot.id}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {scenario ? scenario.name : `Slot ${slot.id} (Kosong)`}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {scenario
                              ? `${scenario.events.length} Kejadian Tercatat`
                              : 'Belum ada data skenario'}
                          </span>
                        </div>
                      </div>

                      {scenario && (
                        <button
                          type="button"
                          onClick={() => {
                            onLoadFromSlot(scenario);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-brand-700 hover:text-brand-900 underline"
                          title="Terapkan ke Simulator"
                        >
                          Terapkan
                        </button>
                      )}
                    </div>

                    {result && scenario ? (
                      <div className="space-y-3.5 text-xs">
                        {/* 1. Kejadian Utama */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase">
                            Kejadian
                          </span>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">
                            {scenario.events.length === 0
                              ? 'Tetap Sehat sampai Akhir'
                              : scenario.events
                                  .map(
                                    (e) =>
                                      `Thn ${e.year} (${
                                        e.eventType === 'early_ci'
                                          ? 'Tahap Awal'
                                          : e.eventType === 'advanced_ci'
                                          ? 'Tahap Lanjut'
                                          : e.eventType === 'death'
                                          ? 'Meninggal'
                                          : 'Kecelakaan'
                                      })`
                                  )
                                  .join(' → ')}
                          </p>
                        </div>

                        {/* 2. Sudah Dibayarkan */}
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500">Sudah Dibayarkan:</span>
                          <span className="font-bold text-slate-900">
                            {formatRupiahCompact(result.totalPaymentsMade)}
                          </span>
                        </div>

                        {/* 3. Manfaat Diterima */}
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-emerald-800 font-semibold">
                            Manfaat Diterima:
                          </span>
                          <span className="font-black text-emerald-700 text-sm">
                            {formatRupiahCompact(result.benefitsReceived)}
                          </span>
                        </div>

                        {/* 4. Sisa Perlindungan */}
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-brand-800 font-semibold">
                            Sisa Perlindungan:
                          </span>
                          <span className="font-bold text-brand-900">
                            {formatRupiahCompact(result.remainingProtection)}
                          </span>
                        </div>

                        {/* 5. Kondisi Setelahnya */}
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-500">Kondisi Setelahnya:</span>
                          <StatusBadge
                            status={result.protectionStatus}
                            label={result.protectionStatusLabel}
                            size="sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p>Simpan skenario yang Anda rancang ke slot ini untuk membandingkannya.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSaveToSlot(slot.id)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                    >
                      Timpa dengan Skenario Aktif
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Perbandingan ini mempermudah Anda memilih rencana perlindungan terbaik.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
          >
            Tutup Pembanding
          </button>
        </div>
      </div>
    </div>
  );
};
