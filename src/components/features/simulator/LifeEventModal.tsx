'use client';

import React from 'react';
import { LifeEventType } from '@/engine/types';
import {
  Heart,
  Activity,
  HeartCrack,
  AlertTriangle,
  UserCheck,
  X,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LifeEventModalProps {
  isOpen: boolean;
  year: number;
  currentAge: number;
  existingEventType?: LifeEventType;
  onSelectEvent: (type: LifeEventType) => void;
  onDeleteEvent?: () => void;
  onClose: () => void;
}

export const LifeEventModal: React.FC<LifeEventModalProps> = ({
  isOpen,
  year,
  currentAge,
  existingEventType,
  onSelectEvent,
  onDeleteEvent,
  onClose,
}) => {
  if (!isOpen) return null;

  const age = currentAge + year;

  const eventOptions: {
    type: LifeEventType;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    color: string;
    borderActive: string;
  }[] = [
    {
      type: 'healthy',
      label: 'Tetap Sehat',
      sublabel: 'Tidak ada gangguan kesehatan serius pada tahun ini',
      icon: Heart,
      color: 'bg-emerald-50 text-emerald-600',
      borderActive: 'border-emerald-500 bg-emerald-50/40',
    },
    {
      type: 'early_ci',
      label: 'Penyakit Serius Tahap Awal',
      sublabel: 'Early Critical Illness (dapat klaim 25% - 50%)',
      icon: Activity,
      color: 'bg-blue-50 text-blue-600',
      borderActive: 'border-blue-500 bg-blue-50/40',
    },
    {
      type: 'advanced_ci',
      label: 'Penyakit Serius Tahap Lanjut',
      sublabel: 'Advanced Critical Illness (klaim 100% sisa + booster jika < 60 thn)',
      icon: HeartCrack,
      color: 'bg-amber-50 text-amber-600',
      borderActive: 'border-amber-500 bg-amber-50/40',
    },
    {
      type: 'death',
      label: 'Meninggal Dunia',
      sublabel: 'Santunan duka kepada ahli waris (100% sisa + booster jika < 60 thn)',
      icon: UserCheck,
      color: 'bg-slate-100 text-slate-700',
      borderActive: 'border-slate-500 bg-slate-100/50',
    },
    {
      type: 'accident_death',
      label: 'Meninggal karena Kecelakaan',
      sublabel: 'Santunan kecelakaan tambahan hingga 200%',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
      borderActive: 'border-red-500 bg-red-50/40',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box */}
      <div
        className={cn(
          'relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-floating z-10 overflow-hidden',
          'animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-250',
          'max-h-[90vh] flex flex-col'
        )}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                Tahun ke-{year}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Usia {age} tahun
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Apa yang terjadi di tahun ini?
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Options */}
        <div className="p-4 sm:p-6 space-y-2.5 overflow-y-auto">
          {eventOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = existingEventType === opt.type;

            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => {
                  onSelectEvent(opt.type);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all',
                  isSelected
                    ? opt.borderActive
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    opt.color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      {opt.label}
                    </p>
                    {isSelected && (
                      <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                        Terpilih
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {opt.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer with Delete Option if event exists */}
        {existingEventType && onDeleteEvent && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Hapus kejadian dari tahun ini
            </span>
            <button
              type="button"
              onClick={() => {
                onDeleteEvent();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Kejadian</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
