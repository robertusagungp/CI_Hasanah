import {
  ProtectionPlan,
  Scenario,
  ScenarioResult,
  ProcessedTimelineEvent,
  LifeEvent,
} from './types';
import { DEFAULT_PRODUCT_RULES, ProductRuleDefinition } from './productRules';

export function calculateAnnualPayment(plan: ProtectionPlan): number {
  return plan.paymentFrequency === 'monthly'
    ? plan.paymentAmount * 12
    : plan.paymentAmount;
}

export function runScenarioSimulation(
  plan: ProtectionPlan,
  scenario: Scenario,
  rules: ProductRuleDefinition = DEFAULT_PRODUCT_RULES
): ScenarioResult {
  const annualPayment = calculateAnnualPayment(plan);
  const totalPlannedPayments = annualPayment * plan.paymentDurationYears;
  const endAge = plan.currentAge + plan.protectionDurationYears;

  let cumulativePaid = 0;
  let benefitsReceived = 0;
  let remainingProtection = plan.mainProtectionAmount;
  let isWaiverActive = false;
  let policyTerminated = false;
  let endOfPeriodCashAmount = 0;

  const processedEvents: ProcessedTimelineEvent[] = [];

  // Filter events that happen within the protection period and sort by year
  const validEvents = [...scenario.events]
    .filter((e) => e.year >= 1 && e.year <= plan.protectionDurationYears)
    .sort((a, b) => a.year - b.year);

  // We can track the events mapped by year
  const eventByYear = new Map<number, LifeEvent>();
  validEvents.forEach((ev) => {
    if (!eventByYear.has(ev.year)) {
      eventByYear.set(ev.year, ev);
    }
  });

  // Calculate year-by-year progression
  for (let y = 1; y <= plan.protectionDurationYears; y++) {
    const ageAtYear = plan.currentAge + y;

    // Track payment for this year if within payment duration and policy not yet terminated
    if (y <= plan.paymentDurationYears && !policyTerminated) {
      if (!isWaiverActive) {
        cumulativePaid += annualPayment;
      }
    }

    const currentEvent = eventByYear.get(y);
    if (!currentEvent || policyTerminated) {
      continue;
    }

    let payout = 0;
    let payoutBreakdown: string | undefined = undefined;
    let title = '';
    let statusText = '';
    let whatHappensNext = '';

    switch (currentEvent.eventType) {
      case 'healthy': {
        title = 'Kondisi Sehat';
        payout = 0;
        statusText = 'Perlindungan Masih Berjalan';
        whatHappensNext = 'Anda tetap terlindungi hingga akhir periode tanpa pengurangan manfaat.';
        break;
      }

      case 'early_ci': {
        title = 'Penyakit Serius Tahap Awal';
        const percent = plan.selectedBenefits.earlySeriousIllness.enabled
          ? plan.selectedBenefits.earlySeriousIllness.percent
          : 0;
        const initialCalculated = plan.mainProtectionAmount * (percent / 100);
        // Payout cannot exceed remaining protection
        payout = Math.min(initialCalculated, remainingProtection);
        payoutBreakdown = `Manfaat ${percent}% dari nilai perlindungan dasar`;
        remainingProtection = Math.max(0, remainingProtection - payout);
        benefitsReceived += payout;

        // Check waiver
        if (
          plan.selectedBenefits.futurePaymentWaiver.enabled &&
          rules.futurePaymentWaiverPayor.activeOnEarlyCI
        ) {
          isWaiverActive = true;
        }

        if (remainingProtection > 0) {
          statusText = 'Perlindungan Masih Berjalan';
          whatHappensNext = isWaiverActive
            ? 'Sisa perlindungan tetap aktif dan pembayaran berikutnya otomatis DIBEBASKAN.'
            : 'Sisa perlindungan tetap aktif melindungi Anda.';
        } else {
          statusText = 'Perlindungan Selesai';
          policyTerminated = true;
          whatHappensNext = 'Seluruh jumlah perlindungan telah diterima.';
        }
        break;
      }

      case 'advanced_ci': {
        title = 'Penyakit Serius Tahap Lanjut';
        const isBoosterActive =
          plan.selectedBenefits.extraProtectionAge60.enabled &&
          ageAtYear <= rules.extraProtectionHasanahBooster.maximumAge;

        let boosterAmount = 0;
        if (isBoosterActive) {
          // Hasanah booster adds 50% extra protection (150% total)
          boosterAmount = plan.mainProtectionAmount * (rules.extraProtectionHasanahBooster.multiplier - 1.0);
        }

        payout = remainingProtection + boosterAmount;
        if (isBoosterActive) {
          payoutBreakdown = `Sisa perlindungan + Perlindungan Ekstra hingga Usia 60 (Hasanah Booster)`;
        } else {
          payoutBreakdown = `100% sisa jumlah perlindungan`;
        }

        benefitsReceived += payout;
        remainingProtection = 0;
        policyTerminated = true;
        statusText = 'Perlindungan Selesai';
        whatHappensNext = 'Manfaat perlindungan telah dibayarkan penuh dan kontrak perlindungan selesai.';
        break;
      }

      case 'death': {
        title = 'Meninggal Dunia';
        const isBoosterActive =
          plan.selectedBenefits.extraProtectionAge60.enabled &&
          ageAtYear <= rules.extraProtectionHasanahBooster.maximumAge;

        let boosterAmount = 0;
        if (isBoosterActive) {
          boosterAmount = plan.mainProtectionAmount * (rules.extraProtectionHasanahBooster.multiplier - 1.0);
        }

        payout = remainingProtection + boosterAmount;
        if (isBoosterActive) {
          payoutBreakdown = `Sisa perlindungan + Perlindungan Ekstra hingga Usia 60`;
        } else {
          payoutBreakdown = `100% sisa jumlah perlindungan`;
        }

        benefitsReceived += payout;
        remainingProtection = 0;
        policyTerminated = true;
        statusText = 'Perlindungan Selesai';
        whatHappensNext = 'Santunan duka diserahkan kepada keluarga/ahli waris dan perlindungan selesai.';
        break;
      }

      case 'accident_death': {
        title = 'Meninggal karena Kecelakaan';
        // Nilai dasar sama seperti santunan meninggal ataupun sakit tahap lanjut
        const isBoosterActive =
          plan.selectedBenefits.extraProtectionAge60.enabled &&
          ageAtYear <= rules.extraProtectionHasanahBooster.maximumAge;

        let boosterAmount = 0;
        if (isBoosterActive) {
          boosterAmount = plan.mainProtectionAmount * (rules.extraProtectionHasanahBooster.multiplier - 1.0);
        }

        const basePayout = remainingProtection + boosterAmount;

        // Tambahan santunan Rp50.000.000 jika meninggal karena kecelakaan pada umur < 85 tahun
        const isEligibleForAccidentBonus = ageAtYear < rules.accidentalDeathBenefit.maxAgeForAdditionalBenefit;
        const additionalAccidentAmount = isEligibleForAccidentBonus
          ? rules.accidentalDeathBenefit.additionalAccidentBenefitAmount
          : 0;

        payout = basePayout + additionalAccidentAmount;

        if (isBoosterActive && isEligibleForAccidentBonus) {
          payoutBreakdown = `Sisa perlindungan + Ekstra Booster (< 60 th) + Tambahan Santunan Kecelakaan Rp50 jt (< 85 th)`;
        } else if (isEligibleForAccidentBonus) {
          payoutBreakdown = `100% sisa perlindungan + Tambahan Santunan Kecelakaan Rp50 jt (< 85 th)`;
        } else if (isBoosterActive) {
          payoutBreakdown = `Sisa perlindungan + Ekstra Booster (< 60 th)`;
        } else {
          payoutBreakdown = `100% sisa jumlah perlindungan`;
        }

        benefitsReceived += payout;
        remainingProtection = 0;
        policyTerminated = true;
        statusText = 'Perlindungan Selesai';
        whatHappensNext = isEligibleForAccidentBonus
          ? 'Santunan duka beserta tambahan santunan kecelakaan Rp50.000.000 diserahkan kepada keluarga/ahli waris dan perlindungan selesai.'
          : 'Santunan duka kecelakaan diserahkan kepada keluarga/ahli waris dan perlindungan selesai.';
        break;
      }
    }

    processedEvents.push({
      id: currentEvent.id,
      year: y,
      age: ageAtYear,
      eventType: currentEvent.eventType,
      title,
      payoutAmount: payout,
      payoutBreakdown,
      remainingProtectionAfter: remainingProtection,
      isWaiverTriggered: isWaiverActive,
      isPolicyTerminated: policyTerminated,
      statusText,
      whatHappensNext,
      cumulativePaidAtYear: cumulativePaid,
    });
  }

  // End of period calculation (Hasanah Cash)
  if (
    plan.selectedBenefits.endOfPeriodCash.enabled &&
    !policyTerminated &&
    remainingProtection > 0
  ) {
    // Check if end of period cash applies
    const refundBase = cumulativePaid * rules.endOfPeriodBenefitHasanahCash.refundPercentageOfTotalPaid;
    if (rules.endOfPeriodBenefitHasanahCash.reducedByPreviousClaims) {
      endOfPeriodCashAmount = Math.max(0, refundBase - benefitsReceived);
    } else {
      endOfPeriodCashAmount = refundBase;
    }
  }

  // Protection status determination
  let protectionStatus: 'active' | 'completed' | 'terminated' = 'active';
  let protectionStatusLabel = 'Perlindungan Masih Berjalan';

  if (policyTerminated) {
    protectionStatus = 'terminated';
    protectionStatusLabel = 'Perlindungan Selesai';
  } else {
    // If no terminal event occurred, it remains active or completes at end of term
    protectionStatus = 'active';
    protectionStatusLabel = 'Perlindungan Masih Berjalan';
  }

  // Future payments label
  let futurePaymentsRequired: 'continue' | 'waived' | 'completed' = 'continue';
  let futurePaymentsLabel = 'Tetap Dilanjutkan';

  if (isWaiverActive) {
    futurePaymentsRequired = 'waived';
    futurePaymentsLabel = 'Pembayaran Berikutnya Dibebaskan';
  } else if (cumulativePaid >= totalPlannedPayments) {
    futurePaymentsRequired = 'completed';
    futurePaymentsLabel = 'Selesai Sesuai Jadwal';
  }

  const totalPaymentsSavedByWaiver = isWaiverActive
    ? Math.max(0, totalPlannedPayments - cumulativePaid)
    : 0;

  return {
    totalPaymentsMade: cumulativePaid,
    benefitsReceived,
    remainingProtection,
    protectionStatus,
    protectionStatusLabel,
    futurePaymentsRequired,
    futurePaymentsLabel,
    endOfPeriodCashAmount,
    eventsProcessed: processedEvents,
    annualEquivalentPayment: annualPayment,
    endAge,
    totalPlannedPayments,
    totalPaymentsSavedByWaiver,
  };
}
