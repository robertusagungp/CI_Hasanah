'use client';

import React, { useState } from 'react';
import { ShareableState, encodeStateToQuery } from '@/lib/urlState';
import { Copy, Check, X, ShieldCheck, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  state: ShareableState;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate shareable URL
  const encoded = encodeStateToQuery(state);
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?sim=${encoded}`
      : `?sim=${encoded}`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-floating z-10 p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Bagikan Simulasi Ini
              </h3>
              <p className="text-xs text-slate-500">
                Kirim tautan ke calon nasabah atau simpan untuk presentasi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input Box */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl font-mono truncate outline-none select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs',
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-900 hover:bg-brand-800 text-white'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security & Privacy Reassurance */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Privasi Terjamin:</strong> Tautan ini hanya menyimpan pengaturan angka simulasi tanpa mencatat identitas nama, nomor kontak, maupun data rekam medis pribadi.
          </p>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
