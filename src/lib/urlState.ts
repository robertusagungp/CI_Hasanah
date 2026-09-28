import { ProtectionPlan, LifeEvent } from '@/engine/types';

export interface ShareableState {
  plan: ProtectionPlan;
  events: LifeEvent[];
}

export function encodeStateToQuery(state: ShareableState): string {
  try {
    const compactObj = {
      ca: state.plan.currentAge,
      pf: state.plan.paymentFrequency === 'monthly' ? 'm' : 'y',
      pa: state.plan.paymentAmount,
      mp: state.plan.mainProtectionAmount,
      pd: state.plan.paymentDurationYears,
      cd: state.plan.protectionDurationYears,
      ec: state.plan.selectedBenefits.earlySeriousIllness.enabled
        ? state.plan.selectedBenefits.earlySeriousIllness.percent
        : 0,
      eb: state.plan.selectedBenefits.extraProtectionAge60.enabled ? 1 : 0,
      ecash: state.plan.selectedBenefits.endOfPeriodCash.enabled ? 1 : 0,
      ew: state.plan.selectedBenefits.futurePaymentWaiver.enabled ? 1 : 0,
      ev: state.events.map((e) => `${e.year}:${e.eventType}`).join(';'),
    };

    const jsonStr = JSON.stringify(compactObj);
    // Base64 encode safe for URL
    if (typeof window !== 'undefined') {
      return btoa(jsonStr);
    }
    return Buffer.from(jsonStr).toString('base64');
  } catch (err) {
    console.error('Failed to encode share state', err);
    return '';
  }
}

export function decodeQueryToState(encoded: string): ShareableState | null {
  try {
    let jsonStr = '';
    if (typeof window !== 'undefined') {
      jsonStr = atob(encoded);
    } else {
      jsonStr = Buffer.from(encoded, 'base64').toString('utf-8');
    }
    const data = JSON.parse(jsonStr);

    const plan: ProtectionPlan = {
      currentAge: Number(data.ca) || 30,
      paymentFrequency: data.pf === 'm' ? 'monthly' : 'yearly',
      paymentAmount: Number(data.pa) || 12000000,
      mainProtectionAmount: Number(data.mp) || 1000000000,
      paymentDurationYears: Number(data.pd) || 10,
      protectionDurationYears: Number(data.cd) || 20,
      selectedBenefits: {
        earlySeriousIllness: {
          enabled: Number(data.ec) > 0,
          percent: Number(data.ec) === 50 ? 50 : 25,
        },
        extraProtectionAge60: {
          enabled: Number(data.eb) === 1,
        },
        endOfPeriodCash: {
          enabled: Number(data.ecash) === 1,
        },
        futurePaymentWaiver: {
          enabled: Number(data.ew) === 1,
        },
      },
    };

    const events: LifeEvent[] = [];
    if (data.ev && typeof data.ev === 'string') {
      const parts = data.ev.split(';');
      parts.forEach((item: string, idx: number) => {
        const [yearStr, typeStr] = item.split(':');
        const year = parseInt(yearStr, 10);
        if (year && typeStr) {
          events.push({
            id: `evt-${idx}-${year}`,
            year,
            age: plan.currentAge + year,
            eventType: typeStr as any,
          });
        }
      });
    }

    return { plan, events };
  } catch (err) {
    console.error('Failed to decode share state', err);
    return null;
  }
}
