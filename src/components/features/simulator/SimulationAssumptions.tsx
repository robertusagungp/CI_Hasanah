'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SimulationAssumptions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-brand-700" />
          <span className="text-sm font-bold text-slate-900">
            Ketentuan & Asumsi Simulasi
          </span>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            Transparansi Aturan
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 text-xs text-slate-600 border-t border-slate-100 space-y-3.5 leading-relaxed animate-in fade-in">
          <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 text-brand-900 font-medium">
            Simulasi ini menerapkan parameter berbasis konsep asuransi syariah (AlliSya CI Hasanah Concept) untuk tujuan edukasi dan pemahaman alur perlindungan finansial.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Penyakit Serius Tahap Awal (Early CI)</span>
              </h5>
              <p>
                Membayarkan 25% atau 50% dari jumlah perlindungan dasar yang dipilih. Pembayaran ini mengurangi sisa jumlah perlindungan dasar untuk klaim lanjutan di masa depan.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Penyakit Serius Tahap Lanjut (Advanced CI)</span>
              </h5>
              <p>
                Membayarkan 100% dari sisa jumlah perlindungan. Apabila manfaat ekstra (Hasanah Booster) aktif dan kejadian terjadi sebelum usia 60 tahun, ditambahkan ekstra 50% perlindungan. Setelahnya kontrak perlindungan selesai.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Pembebasan Pembayaran (Payor Syariah)</span>
              </h5>
              <p>
                Apabila kondisi penyakit serius telah dialami selama masa pembayaran iuran, kewajiban pembayaran berikutnya otomatis dibebaskan sehingga nasabah tidak terbebani dan perlindungan tetap aktif.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Manfaat Tunai Akhir (Hasanah Cash)</span>
              </h5>
              <p>
                Jika peserta tetap sehat hingga akhir masa perlindungan tanpa klaim tahap lanjut atau meninggal dunia, akumulasi pembayaran perlindungan yang telah dilakukan dapat diterima kembali sesuai ketentuan resmi polis.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            *Catatan Pengembang: Seluruh parameter dapat diverifikasi langsung pada dokumen resmi polis dan ringkasan informasi produk sebelum penerbitan polis asuransi.
          </p>
        </div>
      )}
    </div>
  );
};
