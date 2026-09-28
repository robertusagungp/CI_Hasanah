import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <footer className="mt-12 pt-8 pb-12 border-t border-slate-200/80 text-slate-500 text-xs space-y-4">
      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">
            Penafian Penting (Disclaimer)
          </p>
          <p className="leading-relaxed">
            Simulasi ini dibuat untuk membantu memahami cara kerja perlindungan berdasarkan data dan skenario yang dimasukkan. Hasil simulasi bukan merupakan keputusan klaim maupun kontrak asuransi. Ketentuan manfaat, definisi kondisi, pengecualian, masa tunggu, proses underwriting, dan pembayaran manfaat tetap mengacu pada polis serta dokumen resmi produk.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <p>
          Aplikasi independen edukasi perlindungan finansial. Bukan situs web atau perwakilan resmi Allianz.
        </p>
        <p>
          Dibuat untuk memudahkan konsultasi dan pemahaman rencana perlindungan keluarga.
        </p>
      </div>
    </footer>
  );
};
