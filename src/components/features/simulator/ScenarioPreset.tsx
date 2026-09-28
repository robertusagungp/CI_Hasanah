'use client';

import React from 'react';
import { LifeEvent, LifeEventType } from '@/engine/types';
import {
  Heart,
  Activity,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PresetDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  getEvents: (currentAge: number) => LifeEvent[];
}

export const SCENARIO_PRESETS: PresetDefinition[] = [
  {
    id: 'healthy_end',
    name: 'Tetap Sehat (100% Uang Kembali Thn 20)',
    description: 'Di tahun ke-20 seluruh iuran kembali 100%, lanjut masa garansi hingga tahun ke-30',
    icon: ShieldCheck,
    color: 'emerald',
    getEvents: () => [],
  },
  {
    id: 'early_ci_y5',
    name: 'Penyakit Serius di Tahun ke-5',
    description: 'Klaim tahap awal thn 5, uang iuran tetap kembali 100% di thn 20',
    icon: Activity,
    color: 'blue',
    getEvents: (age) => [
      {
        id: 'evt-preset-1',
        year: 5,
        age: age + 5,
        eventType: 'early_ci',
      },
    ],
  },
  {
    id: 'warranty_claim',
    name: 'Klaim di Masa Garansi (Thn 24)',
    description: 'Uang kembali 100% di Thn 20, santunan sakit lanjut tetap cair penuh di Thn 24',
    icon: Sparkles,
    color: 'purple',
    getEvents: (age) => [
      {
        id: 'evt-preset-2a',
        year: 5,
        age: age + 5,
        eventType: 'early_ci',
      },
      {
        id: 'evt-preset-2b',
        year: 24,
        age: age + 24,
        eventType: 'advanced_ci',
      },
    ],
  },
  {
    id: 'death_y8',
    name: 'Meninggal Dunia',
    description: 'Meninggal dunia di tahun ke-8',
    icon: UserCheck,
    color: 'slate',
    getEvents: (age) => [
      {
        id: 'evt-preset-3',
        year: 8,
        age: age + 8,
        eventType: 'death',
      },
    ],
  },
  {
    id: 'accident_y6',
    name: 'Kecelakaan',
    description: 'Santunan meninggal + tambahan santunan Rp50 jt (< 85 thn)',
    icon: AlertTriangle,
    color: 'red',
    getEvents: (age) => [
      {
        id: 'evt-preset-4',
        year: 6,
        age: age + 6,
        eventType: 'accident_death',
      },
    ],
  },
];

interface ScenarioPresetProps {
  currentAge: number;
  activePresetId: string | null;
  onSelectPreset: (preset: PresetDefinition) => void;
  onCustomScenario: () => void;
  isCustomActive: boolean;
}

export const ScenarioPreset: React.FC<ScenarioPresetProps> = ({
  currentAge,
  activePresetId,
  onSelectPreset,
  onCustomScenario,
  isCustomActive,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          Coba Contoh Skenario
        </h3>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Pilih untuk melihat simulasi langsung
        </span>
      </div>

      {/* Horizontal scrollable or flex wrap chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {SCENARIO_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = activePresetId === preset.id && !isCustomActive;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0',
                isSelected
                  ? 'bg-brand-900 text-white border-brand-900 shadow-sm scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <Icon
                className={cn(
                  'w-3.5 h-3.5',
                  isSelected ? 'text-brand-200' : 'text-slate-500'
                )}
              />
              <span>{preset.name}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onCustomScenario}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0',
            isCustomActive
              ? 'bg-brand-900 text-white border-brand-900 shadow-sm'
              : 'bg-slate-100 text-slate-700 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-200/70'
          )}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Buat Skenario Sendiri</span>
        </button>
      </div>
    </div>
  );
};
