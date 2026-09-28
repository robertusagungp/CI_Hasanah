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
  let hasTerminalClaimOccurred = false;
  let hasHasanahCashTriggered = false;
  let hasanahCashAmount = 0;

  const processedEvents: ProcessedTimelineEvent[] = [];

  // Filter events that happen within the protection period and sort by year
  const validEvents = [...scenario.events]
    .filter((e) => e.year >= 1 && e.year <= plan.protectionDurationYears)
    .sort((a, b) => a.year - b.year);

  // Map events by year
  const eventByYear = new Map<number, LifeEvent>();
  validEvents.forEach((ev) => {
    if (!eventByYear.has(ev.year)) {
      eventByYear.set(ev.year, ev);
    }
  });

  // Calculate year-by-year progression
  for (let y = 1; y <= plan.protectionDurationYears; y++) {
    const ageAtYear = plan.currentAge + y;
    const isWarrantyYear = y > 20;

    // Track payment for this year if within payment duration and policy not yet terminated
    if (y <= plan.paymentDurationYears && !policyTerminated) {
      if (!isWaiverActive) {
        cumulativePaid += annualPayment;
      }
    }

    const currentEvent = eventByYear.get(y);

    // Process life event if present
    if (currentEvent && !policyTerminated) {
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
          whatHappensNext = isWarrantyYear
            ? 'Anda berada dalam Masa Garansi (Tahun 21–30) dengan proteksi aktif tanpa biaya pembayaran iuran.'
            : 'Anda tetap terlindungi hingga akhir periode tanpa pengurangan manfaat.';
          break;
        }

        case 'early_ci': {
          title = 'Penyakit Serius Tahap Awal';
          const percent = plan.selectedBenefits.earlySeriousIllness.enabled
            ? plan.selectedBenefits.earlySeriousIllness.percent
            : 0;
          const initialCalculated = plan.mainProtectionAmount * (percent / 100);
          payout = Math.min(initialCalculated, remainingProtection);
          payoutBreakdown = `Manfaat ${percent}% dari nilai perlindungan dasar`;
          remainingProtection = Math.max(0, remainingProtection - payout);
          benefitsReceived += payout;

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
            hasTerminalClaimOccurred = true;
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
            boosterAmount = plan.mainProtectionAmount * (rules.extraProtectionHasanahBooster.multiplier - 1.0);
          }

          payout = remainingProtection + boosterAmount;
          if (isWarrantyYear && hasHasanahCashTriggered) {
            payoutBreakdown = `100% sisa perlindungan tetap cair penuh di Masa Garansi (Thn 21–30)${isBoosterActive ? ' + Booster (< 60 th)' : ''}`;
          } else if (isBoosterActive) {
            payoutBreakdown = `Sisa perlindungan + Perlindungan Ekstra hingga Usia 60 (Hasanah Booster)`;
          } else {
            payoutBreakdown = `100% sisa jumlah perlindungan`;
          }

          benefitsReceived += payout;
          remainingProtection = 0;
          policyTerminated = true;
          hasTerminalClaimOccurred = true;
          statusText = 'Perlindungan Selesai';
          whatHappensNext = isWarrantyYear
            ? 'Santunan tahap lanjut tetap cair penuh pada masa garansi (tahun 21–30) meskipun uang iuran telah Anda terima kembali 100% di tahun ke-20.'
            : 'Manfaat perlindungan telah dibayarkan penuh dan kontrak perlindungan selesai.';
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
          if (isWarrantyYear && hasHasanahCashTriggered) {
            payoutBreakdown = `100% sisa perlindungan tetap cair penuh di Masa Garansi (Thn 21–30)${isBoosterActive ? ' + Booster (< 60 th)' : ''}`;
          } else if (isBoosterActive) {
            payoutBreakdown = `Sisa perlindungan + Perlindungan Ekstra hingga Usia 60`;
          } else {
            payoutBreakdown = `100% sisa jumlah perlindungan`;
          }

          benefitsReceived += payout;
          remainingProtection = 0;
          policyTerminated = true;
          hasTerminalClaimOccurred = true;
          statusText = 'Perlindungan Selesai';
          whatHappensNext = isWarrantyYear
            ? 'Santunan duka tetap diserahkan utuh kepada ahli waris pada masa garansi (tahun 21–30) setelah pengembalian dana di tahun ke-20.'
            : 'Santunan duka diserahkan kepada keluarga/ahli waris dan perlindungan selesai.';
          break;
        }

        case 'accident_death': {
          title = 'Meninggal karena Kecelakaan';
          const isBoosterActive =
            plan.selectedBenefits.extraProtectionAge60.enabled &&
            ageAtYear <= rules.extraProtectionHasanahBooster.maximumAge;

          let boosterAmount = 0;
          if (isBoosterActive) {
            boosterAmount = plan.mainProtectionAmount * (rules.extraProtectionHasanahBooster.multiplier - 1.0);
          }

          const basePayout = remainingProtection + boosterAmount;

          const isEligibleForAccidentBonus = ageAtYear < rules.accidentalDeathBenefit.maxAgeForAdditionalBenefit;
          const additionalAccidentAmount = isEligibleForAccidentBonus
            ? rules.accidentalDeathBenefit.additionalAccidentBenefitAmount
            : 0;

          payout = basePayout + additionalAccidentAmount;

          if (isWarrantyYear && hasHasanahCashTriggered) {
            payoutBreakdown = `Santunan meninggal tetap cair di Masa Garansi (Thn 21–30)${isEligibleForAccidentBonus ? ' + Tambahan Santunan Kecelakaan Rp50 jt (< 85 th)' : ''}`;
          } else if (isBoosterActive && isEligibleForAccidentBonus) {
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
          hasTerminalClaimOccurred = true;
          statusText = 'Perlindungan Selesai';
          whatHappensNext = isWarrantyYear
            ? 'Santunan duka dan tambahan kecelakaan Rp50 jt tetap cair penuh di masa garansi (tahun 21–30) setelah pengembalian dana di tahun ke-20.'
            : 'Santunan duka beserta tambahan santunan kecelakaan Rp50.000.000 diserahkan kepada keluarga/ahli waris dan perlindungan selesai.';
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
        isWarrantyPeriod: isWarrantyYear,
      });
    }

    // Special Check: HASANAH CASH DI TAHUN KE-20
    // Pada tahun ke-20, jika nasabah tidak meninggal / penyakit serius tahap lanjut,
    // maka nasabah pada tahun ke-20 akan menerima santunan sebesar seluruh iuran yang telah dibayarkan (100%).
    if (
      y === 20 &&
      plan.selectedBenefits.endOfPeriodCash.enabled &&
      !hasTerminalClaimOccurred
    ) {
      hasHasanahCashTriggered = true;
      hasanahCashAmount = cumulativePaid; // 100% dari seluruh iuran yang telah dibayarkan
      benefitsReceived += hasanahCashAmount;

      // Sisipkan milestone penerimaan dana tunai tahun ke-20 ke dalam timeline
      processedEvents.push({
        id: 'evt-hasanah-cash-milestone-y20',
        year: 20,
        age: ageAtYear,
        eventType: 'hasanah_cash',
        title: 'Manfaat Tunai di Tahun ke-20 (Hasanah Cash)',
        payoutAmount: hasanahCashAmount,
        payoutBreakdown: '100% pengembalian seluruh pembayaran perlindungan yang telah dilakukan',
        remainingProtectionAfter: remainingProtection, // Sisa perlindungan tetap utuh!
        isWaiverTriggered: false,
        isPolicyTerminated: false,
        statusText: 'Perlindungan Masih Berjalan',
        whatHappensNext:
          plan.protectionDurationYears > 20
            ? `Seluruh uang pembayaran Anda telah kembali 100%. Perlindungan Anda berlanjut ke tahun 21–${plan.protectionDurationYears} sebagai Masa Garansi Proteksi Bebas Biaya (santunan tetap cair jika terjadi sakit lanjut/meninggal).`
            : 'Seluruh uang pembayaran Anda telah kembali 100% di akhir masa perlindungan.',
        cumulativePaidAtYear: cumulativePaid,
        isWarrantyPeriod: false,
      });
    }
  }

  // End of period calculation if protection ended at y < 20 or other term
  if (
    plan.protectionDurationYears < 20 &&
    plan.selectedBenefits.endOfPeriodCash.enabled &&
    !hasTerminalClaimOccurred &&
    !hasHasanahCashTriggered
  ) {
    hasHasanahCashTriggered = true;
    hasanahCashAmount = cumulativePaid;
    benefitsReceived += hasanahCashAmount;
  }

  // Protection status determination
  let protectionStatus: 'active' | 'completed' | 'terminated' = 'active';
  let protectionStatusLabel = 'Perlindungan Masih Berjalan';

  if (policyTerminated) {
    protectionStatus = 'terminated';
    protectionStatusLabel = 'Perlindungan Selesai';
  } else {
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

  // Sort processed events chronologically by year
  processedEvents.sort((a, b) => a.year - b.year);

  return {
    totalPaymentsMade: cumulativePaid,
    benefitsReceived,
    remainingProtection,
    protectionStatus,
    protectionStatusLabel,
    futurePaymentsRequired,
    futurePaymentsLabel,
    endOfPeriodCashAmount: hasanahCashAmount,
    hasHasanahCashTriggered,
    hasanahCashYear: 20,
    eventsProcessed: processedEvents,
    annualEquivalentPayment: annualPayment,
    endAge,
    totalPlannedPayments,
    totalPaymentsSavedByWaiver,
  };
}
