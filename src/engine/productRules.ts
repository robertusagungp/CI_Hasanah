/**
 * PRODUCT RULES CONFIGURATION
 * Concept based on Sharia Critical Illness Protection (AlliSya CI Hasanah Concept)
 * 
 * IMPORTANT:
 * // VERIFY AGAINST OFFICIAL PRODUCT DOCUMENT BEFORE PRODUCTION USE
 * This simulator is built for educational, illustrative, and customer-storytelling purposes.
 * It is NOT an official insurer calculation system or binding policy document.
 */

export interface ProductRuleDefinition {
  productName: string;
  allowedPaymentTerms: number[];
  allowedCoverageTerms: number[];
  minEntryAge: number;
  maxEntryAge: number;
  maxCoverageAge: number;
  
  earlySeriousIllness: {
    enabled: boolean;
    percentOptions: (25 | 50)[];
    reducesMainProtection: boolean; // Early CI payout reduces the remaining main protection
    triggersWaiverIfEnabled: boolean;
  };

  advancedSeriousIllness: {
    enabled: boolean;
    payoutPercentageOfRemaining: number; // 100% of remaining protection
    terminatesPolicy: boolean;
    triggersWaiverIfEnabled: boolean;
  };

  extraProtectionHasanahBooster: {
    enabled: boolean;
    multiplier: number; // e.g. 1.5x (150% of main protection)
    maximumAge: number; // up to age 60
    appliesTo: ('advanced_ci' | 'death' | 'accident_death')[];
  };

  hasanahCashYear20: {
    enabled: boolean;
    // Pada tahun ke-20, jika tidak mengalami penyakit serius tahap lanjut / meninggal,
    // nasabah menerima 100% dari seluruh iuran yang telah dibayarkan.
    triggerYear: number; // Tahun ke-20
    refundPercentageOfTotalPaid: number; // 100% dari seluruh iuran yang telah dibayarkan
    protectionContinuesIntoWarrantyYears: boolean; // Tahun 21-30 merupakan masa garansi proteksi aktif
  };

  futurePaymentWaiverPayor: {
    enabled: boolean;
    // Automatically waives future payments if critical illness is diagnosed during payment term
    activeOnEarlyCI: boolean;
    activeOnAdvancedCI: boolean;
  };

  deathBenefit: {
    payoutPercentageOfRemaining: number;
    terminatesPolicy: boolean;
  };

  accidentalDeathBenefit: {
    // Memiliki nilai dasar yang sama seperti santunan meninggal ataupun sakit tahap lanjut
    sameBaseAsDeath: boolean;
    // Tambahan santunan kecelakaan Rp50.000.000 jika umur < 85 tahun
    additionalAccidentBenefitAmount: number;
    maxAgeForAdditionalBenefit: number; // < 85 tahun
    terminatesPolicy: boolean;
  };
}

export const DEFAULT_PRODUCT_RULES: ProductRuleDefinition = {
  productName: "Simulasi Perlindungan Syariah Hasanah",
  allowedPaymentTerms: [5, 10, 15, 20],
  allowedCoverageTerms: [20, 25, 30],
  minEntryAge: 18,
  maxEntryAge: 60,
  maxCoverageAge: 85,

  earlySeriousIllness: {
    enabled: true,
    percentOptions: [25, 50],
    reducesMainProtection: true,
    triggersWaiverIfEnabled: true,
  },

  advancedSeriousIllness: {
    enabled: true,
    payoutPercentageOfRemaining: 1.0, // 100% of remaining
    terminatesPolicy: true,
    triggersWaiverIfEnabled: true,
  },

  extraProtectionHasanahBooster: {
    enabled: true,
    multiplier: 1.5, // 150% of main protection amount
    maximumAge: 60,
    appliesTo: ['advanced_ci', 'death', 'accident_death'],
  },

  hasanahCashYear20: {
    enabled: true,
    triggerYear: 20, // Tahun ke-20
    refundPercentageOfTotalPaid: 1.0, // 100% pengembalian seluruh iuran yang telah dibayarkan
    protectionContinuesIntoWarrantyYears: true, // Tahun 21-30 masa garansi berlanjut
  },

  futurePaymentWaiverPayor: {
    enabled: true,
    activeOnEarlyCI: true,
    activeOnAdvancedCI: true,
  },

  deathBenefit: {
    payoutPercentageOfRemaining: 1.0,
    terminatesPolicy: true,
  },

  accidentalDeathBenefit: {
    sameBaseAsDeath: true,
    additionalAccidentBenefitAmount: 50_000_000, // Tambahan Rp50 jt jika < 85 tahun
    maxAgeForAdditionalBenefit: 85,
    terminatesPolicy: true,
  },
};
