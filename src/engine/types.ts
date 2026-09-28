export type PaymentFrequency = 'monthly' | 'yearly';

export interface SelectedBenefits {
  earlySeriousIllness: {
    enabled: boolean;
    percent: 25 | 50;
  };
  extraProtectionAge60: {
    enabled: boolean; // Hasanah Booster: 150% multiplier up to age 60
  };
  endOfPeriodCash: {
    enabled: boolean; // Hasanah Cash: cash return at end of term if criteria met
  };
  futurePaymentWaiver: {
    enabled: boolean; // Payor Syariah: future payments waived
  };
}

export interface ProtectionPlan {
  currentAge: number;
  paymentFrequency: PaymentFrequency;
  paymentAmount: number;
  mainProtectionAmount: number;
  paymentDurationYears: number;
  protectionDurationYears: number;
  selectedBenefits: SelectedBenefits;
}

export type LifeEventType =
  | 'healthy'
  | 'early_ci'
  | 'advanced_ci'
  | 'death'
  | 'accident_death';

export interface LifeEvent {
  id: string;
  year: number; // 1 to protectionDurationYears
  age: number;
  eventType: LifeEventType;
  note?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  events: LifeEvent[];
}

export interface ProcessedTimelineEvent {
  id: string;
  year: number;
  age: number;
  eventType: LifeEventType;
  title: string;
  payoutAmount: number;
  payoutBreakdown?: string;
  remainingProtectionAfter: number;
  isWaiverTriggered: boolean;
  isPolicyTerminated: boolean;
  statusText: string;
  whatHappensNext: string;
  cumulativePaidAtYear: number;
}

export interface ScenarioResult {
  totalPaymentsMade: number;
  benefitsReceived: number;
  remainingProtection: number;
  protectionStatus: 'active' | 'completed' | 'terminated';
  protectionStatusLabel: string;
  futurePaymentsRequired: 'continue' | 'waived' | 'completed';
  futurePaymentsLabel: string;
  endOfPeriodCashAmount: number;
  eventsProcessed: ProcessedTimelineEvent[];
  annualEquivalentPayment: number;
  endAge: number;
  totalPlannedPayments: number;
  totalPaymentsSavedByWaiver: number;
}
