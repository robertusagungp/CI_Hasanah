'use client';

import React, { useState, useEffect } from 'react';
import { formatRupiah, formatRupiahCompact, parseRupiahInput } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helperText?: string;
  showCompactBadge?: boolean;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100_000_000_000,
  placeholder = 'Rp0',
  helperText,
  showCompactBadge = true,
  className,
}) => {
  // Display string with formatting
  const [displayValue, setDisplayValue] = useState<string>(() =>
    value ? formatRupiah(value, true) : ''
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value > 0 ? formatRupiah(value, true) : '');
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const parsed = parseRupiahInput(rawVal);
    const clamped = Math.min(Math.max(parsed, min), max);

    if (rawVal === '') {
      setDisplayValue('');
      onChange(0);
    } else {
      setDisplayValue(formatRupiah(clamped, true));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value > 0) {
      setDisplayValue(formatRupiah(value, true));
    } else {
      setDisplayValue('');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-semibold text-slate-800 tracking-tight">
            {label}
          </label>
          {showCompactBadge && value > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {formatRupiahCompact(value)}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            'w-full px-3.5 py-2.5 text-base sm:text-lg font-bold text-slate-900 bg-white border rounded-xl',
            'border-slate-200 hover:border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100',
            'transition-all duration-150 outline-none placeholder:text-slate-400 placeholder:font-normal'
          )}
        />
      </div>

      {helperText && (
        <p className="text-xs text-slate-500 font-medium">{helperText}</p>
      )}
    </div>
  );
};
