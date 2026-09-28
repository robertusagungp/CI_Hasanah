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
    appliesTo: ('advanced_ci' | 'death')[];
  };

  endOfPeriodBenefitHasanahCash: {
    enabled: boolean;
    // VERIFY AGAINST OFFICIAL PRODUCT DOCUMENT BEFORE PRODUCTION USE
    // Hasanah Cash returns up to 100% of total basic payments if customer reaches end of coverage period
    refundPercentageOfTotalPaid: number;
    reducedByPreviousClaims: boolean;
  };

  futurePaymentWaiverPayor: {
    enabled: boolean;
    // VERIFY AGAINST OFFICIAL PRODUCT DOCUMENT BEFORE PRODUCTION USE
    // Automatically waives future payments if critical illness is diagnosed during payment term
    activeOnEarlyCI: boolean;
    activeOnAdvancedCI: boolean;
  };

  deathBenefit: {
    payoutPercentageOfRemaining: number;
    accidentMultiplier: number; // e.g. 2x for accidental death
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
    // VERIFY AGAINST OFFICIAL PRODUCT DOCUMENT BEFORE PRODUCTION USE
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
    appliesTo: ['advanced_ci', 'death'],
  },

  endOfPeriodBenefitHasanahCash: {
    enabled: true,
    refundPercentageOfTotalPaid: 1.0, // 100% of total contributions
    reducedByPreviousClaims: true,
  },

  futurePaymentWaiverPayor: {
    enabled: true,
    activeOnEarlyCI: true,
    activeOnAdvancedCI: true,
  },

  deathBenefit: {
    payoutPercentageOfRemaining: 1.0,
    accidentMultiplier: 2.0, // 200% for accident death
    terminatesPolicy: true,
  },
};
