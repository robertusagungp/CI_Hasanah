# Simulasi Perlindungan Finansial Syariah Hasanah
> **Interactive Life Protection Story Simulator** terinspirasi dari konsep perlindungan penyakit kritis syariah (*AlliSya CI Hasanah Concept*).

Aplikasi web interaktif, responsif, dan siap produksi yang dirancang untuk menjawab pertanyaan fundamental nasabah:
> **"Apa yang terjadi pada uang dan proteksi saya jika sesuatu terjadi di tahun ke-X?"**

---

## ⚠️ Pemberitahuan Penting & Legal (Disclaimer)

1. **Bukan Website Resmi Allianz**: Aplikasi ini merupakan platform edukasi independen untuk membantu calon nasabah dan perencana keuangan memahami mekanisme perlindungan secara visual, sederhana, dan transparan.
2. **Tidak Menggunakan Logo / Aset Berhak Cipta**: Aplikasi ini tidak menggunakan logo resmi maupun klaim afiliasi resmi.
3. **Bukan Keputusan Klaim**: Hasil simulasi merupakan ilustrasi skenario edukasi. Ketentuan manfaat, definisi medis, masa tunggu, underwriting, dan pembayaran manfaat tetap mengacu pada polis dan ketentuan resmi produk terkait.

---

## 🌟 Prinsip Pengalaman Pengguna (Customer-First UX)

Aplikasi ini menghindari jargon asuransi teknis yang membingungkan:

| Istilah Teknis Asuransi | Istilah Ramah Nasabah di Aplikasi |
| :--- | :--- |
| Kontribusi / Premi | **Pembayaran Perlindungan** |
| Santunan Asuransi / Uang Pertanggungan | **Jumlah Perlindungan** |
| Masa Pembayaran Kontribusi | **Bayar Selama** |
| Masa Asuransi | **Dilindungi Selama** |
| Rider | **Manfaat Tambahan** |
| Early Critical Illness | **Penyakit Serius Tahap Awal** |
| Advanced Critical Illness | **Penyakit Serius Tahap Lanjut** |
| Remaining Sum Assured | **Sisa Perlindungan** |
| Policy Active / In Force | **Perlindungan Masih Berjalan** |
| Policy Terminated | **Perlindungan Selesai** |
| Claim | **Manfaat Diterima** |
| Waiver of Premium | **Pembayaran Berikutnya Dibebaskan** |
| Hasanah Booster | **Perlindungan Ekstra hingga Usia 60** *(Hasanah Booster)* |
| Hasanah Cash | **Manfaat Tunai di Akhir Periode** *(Hasanah Cash)* |
| Payor Syariah | **Pembayaran Berikutnya Dibebaskan** *(Payor Syariah)* |

---

## ✨ Fitur Unggulan

- 🧭 **Garis Waktu Interaktif (Hero Feature)**:
  - Visualisasi tahun ke-X dan usia secara bersamaan.
  - Tambah, ubah, atau hapus kejadian hidup (Tetap Sehat, Penyakit Serius Tahap Awal, Tahap Lanjut, Meninggal Dunia, Kecelakaan) langsung dari timeline.
  - Kartu rincian kejadian menjawab 4 pertanyaan kunci:
    1. *Apa yang terjadi?*
    2. *Berapa uang yang diterima?*
    3. *Berapa sisa perlindungan?*
    4. *Apa yang terjadi setelah ini?*
- 📖 **Dua Mode Tampilan**:
  - **Cerita Sederhana (Story Mode)**: Alur narasi hidup langkah-demi-langkah yang hangat dan mudah dicerna dalam 1–2 menit.
  - **Detail Angka**: Tampilan angka finansial yang terstruktur tanpa tabel spreadsheet yang rumit.
- 💸 **Visualisasi Arus Dana**:
  - Pemisahan tegas antara **Uang Keluar** (*Pembayaran Anda*) dan **Uang Masuk** (*Manfaat Diterima*).
  - Tanpa istilah investasi menyesatkan (tidak ada istilah ROI, profit, imbal hasil).
- ⚡ **Preset Skenario Instan**:
  - *Tetap Sehat sampai Akhir*
  - *Penyakit Serius di Tahun ke-5*
  - *Penyakit Serius Tahap Awal → Tahap Lanjut*
  - *Meninggal Dunia*
  - *Kecelakaan*
  - *Buat Skenario Sendiri*
- ⚖️ **Bandingkan Skenario**:
  - Menyimpan dan membandingkan hingga 3 skenario berbeda (Slot A, B, C) secara berdampingan.
- 🔗 **Tautan Berbagi Ringan (Zero Backend)**:
  - Bagikan hasil simulasi langsung lewat URL parameter aman tanpa menyimpan nama, email, nomor HP, maupun rekam medis nasabah.
- 📱 **Desain Mobile-First & Presentasi Tablet/Laptop**:
  - Optimal untuk layar smartphone (320px+) hingga mode presentasi layar besar dengan panel ringkasan *sticky*.

---

## 🏗️ Arsitektur Proyek

Sistem memisahkan secara tegas antara antarmuka (UI) dan logika kalkulasi finansial:

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout & meta tags
│   │   ├── page.tsx           # Halaman utama simulator
│   │   └── globals.css        # Styling Tailwind CSS
│   ├── engine/                # Core Rule & Scenario Engine
│   │   ├── types.ts           # Type definitions TypeScript
│   │   ├── productRules.ts    # Aturan produk terpusat & terkonfigurasi
│   │   └── scenarioEngine.ts  # Mesin simulasi tahunan murni (pure functions)
│   ├── lib/
│   │   ├── currency.ts        # Parser & formatter Rupiah (lengkap & kompak)
│   │   ├── urlState.ts        # Serializer URL ramah privasi
│   │   └── utils.ts           # Class merger helpers
│   └── components/
│       ├── ui/
│       │   ├── CurrencyInput.tsx # Input Rupiah cerdas
│       │   ├── InfoTooltip.tsx   # Tooltip ramah nasabah
│       │   └── StatusBadge.tsx   # Badge status perlindungan
│       └── features/simulator/
│           ├── ProtectionSetup.tsx      # Form pengaturan perlindungan
│           ├── BenefitOptionCard.tsx    # Kartu manfaat tambahan
│           ├── InteractiveTimeline.tsx  # Hero interactive timeline
│           ├── LifeEventModal.tsx       # Modal & bottom-sheet pemilih kejadian
│           ├── EventCard.tsx            # Kartu 4 pertanyaan kejadian
│           ├── MoneyFlow.tsx            # Visualisasi uang keluar vs masuk
│           ├── StoryMode.tsx            # Alur cerita naratif
│           ├── DetailedNumbersMode.tsx  # Rincian angka
│           ├── ScenarioPreset.tsx       # Tombol skenario cepat
│           ├── ScenarioSummary.tsx      # Panel ringkasan sticky
│           ├── ScenarioComparison.tsx   # Pembanding 3 skenario
│           ├── ShareDialog.tsx          # Dialog bagikan simulasi
│           ├── SimulationAssumptions.tsx# Transparansi ketentuan simulasi
│           └── Disclaimer.tsx           # Penafian hukum & non-official notice
```

---

## ⚙️ Konfigurasi Aturan Produk (`productRules.ts`)

Seluruh parameter bisnis disimpan terpusat di `src/engine/productRules.ts` dengan dokumentasi transparan:

```typescript
// VERIFY AGAINST OFFICIAL PRODUCT DOCUMENT BEFORE PRODUCTION USE
export const DEFAULT_PRODUCT_RULES: ProductRuleDefinition = {
  productName: "Simulasi Perlindungan Syariah Hasanah",
  allowedPaymentTerms: [5, 10, 15, 20],
  allowedCoverageTerms: [20, 25, 30],
  minEntryAge: 18,
  maxEntryAge: 60,
  maxCoverageAge: 85,
  ...
};
```

---

## 🚀 Panduan Menjalankan Proyek (Local Development)

### 1. Prasyarat
- Node.js versi 18+ atau 20+
- npm (atau pnpm / yarn)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 4. Menjalankan Production Build
```bash
npm run build
```

### 5. Menjalankan Hasil Build
```bash
npm run start
```

---

## 🌐 Panduan Deployment ke Vercel

Proyek ini dirancang tanpa dependensi backend atau database, dan **TIDAK MEMBUTUHKAN Environment Variables tambahan**.

Langkah deploy otomatis dari GitHub:
1. Hubungkan repositori GitHub ini (`https://github.com/robertusagungp/CI_Hasanah.git`) ke akun **Vercel**.
2. Framework Preset: pilih **Next.js**.
3. Build Command: `npm run build` (atau biarkan default).
4. Output Directory: `.next` (default).
5. Klik **Deploy**. Setiap `git push` ke branch `main` akan memicu deployment otomatis secara instan.
