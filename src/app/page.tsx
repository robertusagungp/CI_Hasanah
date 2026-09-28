'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ProtectionPlan,
  Scenario,
  LifeEvent,
  LifeEventType,
  ScenarioResult,
} from '@/engine/types';
import { runScenarioSimulation } from '@/engine/scenarioEngine';
import { decodeQueryToState } from '@/lib/urlState';
import { ProtectionSetup } from '@/components/features/simulator/ProtectionSetup';
import { BenefitOptionCard } from '@/components/features/simulator/BenefitOptionCard';
import { ScenarioPreset, PresetDefinition, SCENARIO_PRESETS } from '@/components/features/simulator/ScenarioPreset';
import { InteractiveTimeline } from '@/components/features/simulator/InteractiveTimeline';
import { EventCard } from '@/components/features/simulator/EventCard';
import { MoneyFlow } from '@/components/features/simulator/MoneyFlow';
import { StoryMode } from '@/components/features/simulator/StoryMode';
import { DetailedNumbersMode } from '@/components/features/simulator/DetailedNumbersMode';
import { ScenarioSummary } from '@/components/features/simulator/ScenarioSummary';
import { ScenarioComparison, SavedScenarioSlot } from '@/components/features/simulator/ScenarioComparison';
import { ShareDialog } from '@/components/features/simulator/ShareDialog';
import { SimulationAssumptions } from '@/components/features/simulator/SimulationAssumptions';
import { Disclaimer } from '@/components/features/simulator/Disclaimer';
import {
  Sparkles,
  BookOpen,
  Hash,
  ArrowRight,
  Shield,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiah, formatRupiahCompact } from '@/lib/currency';

// Initial Demo Configuration specified in prompt
const DEFAULT_PLAN: ProtectionPlan = {
  currentAge: 30,
  paymentFrequency: 'yearly',
  paymentAmount: 12_000_000,
  mainProtectionAmount: 1_000_000_000,
  paymentDurationYears: 10,
  protectionDurationYears: 20,
  selectedBenefits: {
    earlySeriousIllness: {
      enabled: true,
      percent: 25,
    },
    extraProtectionAge60: {
      enabled: true,
    },
    endOfPeriodCash: {
      enabled: true,
    },
    futurePaymentWaiver: {
      enabled: true,
    },
  },
};

const DEFAULT_EVENTS: LifeEvent[] = [
  {
    id: 'evt-default-1',
    year: 5,
    age: 35,
    eventType: 'early_ci',
  },
  {
    id: 'evt-default-2',
    year: 12,
    age: 42,
    eventType: 'advanced_ci',
  },
];

function SimulatorContent() {
  const searchParams = useSearchParams();

  // Primary State
  const [plan, setPlan] = useState<ProtectionPlan>(DEFAULT_PLAN);
  const [events, setEvents] = useState<LifeEvent[]>(DEFAULT_EVENTS);
  const [scenarioName, setScenarioName] = useState<string>('Skenario Contoh');
  const [activePresetId, setActivePresetId] = useState<string | null>('early_to_advanced');
  const [isCustomActive, setIsCustomActive] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // View Mode: 'story' (Cerita Sederhana) vs 'detail' (Detail Angka)
  const [viewMode, setViewMode] = useState<'story' | 'detail'>('story');

  // Modals & Panels
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Saved Slots for comparison
  const [savedSlots, setSavedSlots] = useState<SavedScenarioSlot[]>([
    {
      id: 'A',
      name: 'Tetap Sehat sampai Akhir',
      scenario: {
        id: 'slot-a-default',
        name: 'Tetap Sehat sampai Akhir',
        events: [],
      },
    },
    {
      id: 'B',
      name: 'Penyakit Serius di Tahun ke-5',
      scenario: {
        id: 'slot-b-default',
        name: 'Penyakit Serius di Tahun ke-5',
        events: [
          {
            id: 'evt-slotb-1',
            year: 5,
            age: 35,
            eventType: 'early_ci',
          },
        ],
      },
    },
    {
      id: 'C',
      name: 'Tahap Awal → Tahap Lanjut',
      scenario: {
        id: 'slot-c-default',
        name: 'Tahap Awal → Tahap Lanjut',
        events: [
          {
            id: 'evt-slotc-1',
            year: 5,
            age: 35,
            eventType: 'early_ci',
          },
          {
            id: 'evt-slotc-2',
            year: 12,
            age: 42,
            eventType: 'advanced_ci',
          },
        ],
      },
    },
  ]);

  // Load from URL query if present
  useEffect(() => {
    const simParam = searchParams.get('sim');
    if (simParam) {
      const decoded = decodeQueryToState(simParam);
      if (decoded) {
        setPlan(decoded.plan);
        setEvents(decoded.events);
        setActivePresetId(null);
        setIsCustomActive(true);
      }
    }
  }, [searchParams]);

  // Calculate current simulation result
  const currentScenario: Scenario = useMemo(() => {
    return {
      id: 'current-active-scenario',
      name: scenarioName,
      events,
    };
  }, [scenarioName, events]);

  const result: ScenarioResult = useMemo(() => {
    return runScenarioSimulation(plan, currentScenario);
  }, [plan, currentScenario]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetDefinition) => {
    setActivePresetId(preset.id);
    setIsCustomActive(false);
    setScenarioName(preset.name);
    setEvents(preset.getEvents(plan.currentAge));
    setSelectedYear(null);
  };

  const handleCustomScenario = () => {
    setActivePresetId(null);
    setIsCustomActive(true);
    setScenarioName('Skenario Kustom Saya');
    setEvents([]);
    setSelectedYear(null);
  };

  // Add / Update Event
  const handleAddOrUpdateEvent = (year: number, eventType: LifeEventType) => {
    setIsCustomActive(true);
    setActivePresetId(null);

    setEvents((prev) => {
      const filtered = prev.filter((e) => e.year !== year);
      if (eventType === 'healthy') {
        return filtered;
      }
      return [
        ...filtered,
        {
          id: `evt-${Date.now()}-${year}`,
          year,
          age: plan.currentAge + year,
          eventType,
        },
      ].sort((a, b) => a.year - b.year);
    });
  };

  // Remove Event
  const handleRemoveEvent = (year: number) => {
    setIsCustomActive(true);
    setActivePresetId(null);
    setEvents((prev) => prev.filter((e) => e.year !== year));
  };

  // Reset to default
  const handleReset = () => {
    setPlan(DEFAULT_PLAN);
    setEvents(DEFAULT_EVENTS);
    setActivePresetId('early_to_advanced');
    setIsCustomActive(false);
    setScenarioName('Skenario Contoh');
    setSelectedYear(null);
  };

  const isPlanModified =
    JSON.stringify(plan) !== JSON.stringify(DEFAULT_PLAN) ||
    JSON.stringify(events) !== JSON.stringify(DEFAULT_EVENTS);

  // Save to comparison slot
  const handleSaveToSlot = (slotId: 'A' | 'B' | 'C') => {
    setSavedSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          return {
            ...slot,
            name: scenarioName || `Skenario ${slotId}`,
            scenario: {
              id: `scenario-${slotId}-${Date.now()}`,
              name: scenarioName || `Skenario ${slotId}`,
              events: [...events],
            },
          };
        }
        return slot;
      })
    );
  };

  const handleLoadFromSlot = (loadedScenario: Scenario) => {
    setScenarioName(loadedScenario.name);
    setEvents([...loadedScenario.events]);
    setIsCustomActive(true);
    setActivePresetId(null);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Non-official Disclaimer Header Banner */}
      <header className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
            <span>
              Simulasi Interaktif Perlindungan Syariah Hasanah • <strong>Bukan Website Resmi Allianz</strong>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Platform Edukasi Perencanaan Finansial Mandiri
          </span>
        </div>
      </header>

      {/* Hero Intro: Section A */}
      <section className="bg-gradient-to-b from-brand-50/50 via-white to-[#FBFBFA] pt-8 sm:pt-12 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Simulasi Cerita Hidup & Proteksi Finansial</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Lihat bagaimana perlindungan Anda bekerja.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Coba berbagai kemungkinan hidup dan lihat kapan manfaat dapat diterima secara sederhana, visual, dan mudah dipahami.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="#simulator-main"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm shadow-card hover:shadow-floating transition-all transform hover:-translate-y-0.5"
            >
              <span>Mulai Simulasi</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main id="simulator-main" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Top Configuration Area: Section B & Section C */}
        <div className="space-y-6 mb-8">
          {/* Section B: Perlindungan Saya */}
          <ProtectionSetup
            plan={plan}
            onChange={setPlan}
            onReset={handleReset}
            isModified={isPlanModified}
          />

          {/* Section C: Manfaat Tambahan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 sm:p-6">
            <BenefitOptionCard
              plan={plan}
              onChange={(updatedBenefits) =>
                setPlan({ ...plan, selectedBenefits: updatedBenefits })
              }
            />
          </div>
        </div>

        {/* 2-Column Responsive Layout:
            Left/Main: Timeline, Presets, Story/Detail
            Right: Sticky Scenario Summary
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT / MAIN COLUMN (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Scenario Presets */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 sm:p-6">
              <ScenarioPreset
                currentAge={plan.currentAge}
                activePresetId={activePresetId}
                onSelectPreset={handleSelectPreset}
                onCustomScenario={handleCustomScenario}
                isCustomActive={isCustomActive}
              />
            </div>

            {/* HERO FEATURE: Interactive Timeline */}
            <InteractiveTimeline
              plan={plan}
              events={events}
              onAddOrUpdateEvent={handleAddOrUpdateEvent}
              onRemoveEvent={handleRemoveEvent}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />

            {/* Empty State when no events exist */}
            {events.length === 0 && (
              <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-950">
                  Bagaimana jika sesuatu terjadi?
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                  Pilih salah satu contoh skenario di atas atau klik tahun tertentu pada garis waktu untuk menambahkan kejadian hidup.
                </p>
              </div>
            )}

            {/* Active Events Detail Cards List (Answering 4 Questions) */}
            {result.eventsProcessed.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Rincian Kejadian Pada Garis Waktu
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    {result.eventsProcessed.length} Kejadian Tercatat
                  </span>
                </div>

                <div className="space-y-4">
                  {result.eventsProcessed.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      onEdit={(yr) => setSelectedYear(yr)}
                      onDelete={(yr) => handleRemoveEvent(yr)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Money Flow Visualization */}
            <MoneyFlow plan={plan} result={result} />

            {/* Story Mode vs Detailed Numbers Mode Switcher */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Alur Cerita Perlindungan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih cara melihat rangkuman perjalanan hidup Anda
                  </p>
                </div>

                {/* View Mode Toggle */}
                <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode('story')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                      viewMode === 'story'
                        ? 'bg-white text-brand-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Cerita Sederhana</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('detail')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                      viewMode === 'detail'
                        ? 'bg-white text-brand-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>Detail Angka</span>
                  </button>
                </div>
              </div>

              {/* Active Mode Content */}
              {viewMode === 'story' ? (
                <StoryMode plan={plan} result={result} />
              ) : (
                <DetailedNumbersMode plan={plan} result={result} />
              )}
            </div>

            {/* Simulation Assumptions & Transparent Rules */}
            <SimulationAssumptions />
          </div>

          {/* RIGHT COLUMN: Sticky Summary Panel (lg:col-span-4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
            <ScenarioSummary
              plan={plan}
              result={result}
              onOpenShare={() => setIsShareOpen(true)}
              onOpenCompare={() => setIsCompareOpen(true)}
            />
          </div>
        </div>

        {/* Disclaimer Section */}
        <Disclaimer />
      </main>

      {/* Comparison Modal */}
      <ScenarioComparison
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        plan={plan}
        currentScenario={currentScenario}
        savedSlots={savedSlots}
        onSaveToSlot={handleSaveToSlot}
        onLoadFromSlot={handleLoadFromSlot}
      />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        state={{ plan, events }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              Memuat Simulator Perlindungan...
            </p>
          </div>
        </div>
      }
    >
      <SimulatorContent />
    </Suspense>
  );
}
