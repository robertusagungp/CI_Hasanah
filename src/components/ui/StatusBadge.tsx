import React from 'react';
import { CheckCircle2, ShieldCheck, AlertCircle, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'terminated' | 'completed' | 'waived' | 'continue';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className,
}) => {
  let displayLabel = label;
  let colorClasses = '';
  let Icon = CheckCircle2;

  switch (status) {
    case 'active':
      displayLabel = displayLabel || 'Perlindungan Masih Berjalan';
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      Icon = ShieldCheck;
      break;
    case 'terminated':
      displayLabel = displayLabel || 'Perlindungan Selesai';
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
      Icon = Ban;
      break;
    case 'completed':
      displayLabel = displayLabel || 'Perlindungan Selesai';
      colorClasses = 'bg-teal-50 text-teal-800 border-teal-200';
      Icon = CheckCircle2;
      break;
    case 'waived':
      displayLabel = displayLabel || 'Pembayaran Berikutnya Dibebaskan';
      colorClasses = 'bg-amber-50 text-amber-900 border-amber-300';
      Icon = AlertCircle;
      break;
    case 'continue':
      displayLabel = displayLabel || 'Tetap Dilanjutkan';
      colorClasses = 'bg-blue-50 text-blue-800 border-blue-200';
      Icon = CheckCircle2;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-3 py-1 gap-1.5 font-semibold',
    lg: 'text-sm sm:text-base px-4 py-1.5 gap-2 font-bold',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-xs transition-colors',
        sizeClasses,
        colorClasses,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{displayLabel}</span>
    </span>
  );
};
