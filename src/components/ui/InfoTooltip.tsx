'use client';

import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  content: string;
  title?: string;
  buttonLabel?: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  title,
  buttonLabel,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-slate-400 hover:text-brand-600 focus:outline-none focus:text-brand-700 transition-colors p-0.5 rounded-full"
        title="Penjelasan informasi"
        aria-label="Penjelasan informasi"
      >
        {buttonLabel ? (
          <span className="text-xs font-medium text-brand-600 underline underline-offset-2">
            {buttonLabel}
          </span>
        ) : (
          <HelpCircle className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile closing */}
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={cn(
              'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3.5',
              'bg-slate-900 text-white rounded-xl shadow-floating text-xs leading-relaxed',
              'sm:w-72'
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-white">
                {title || 'Informasi'}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-200">{content}</p>
            {/* Small arrow indicator */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
          </div>
        </>
      )}
    </div>
  );
};
