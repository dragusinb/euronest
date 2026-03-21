import type { ROIParams, ROIProjection } from '../types';

export function calculateROI(params: ROIParams): ROIProjection[] {
  const {
    purchasePrice,
    monthlyRent,
    appreciationRate,
    inflationRate,
    annualCostsPct,
    holdingPeriodYears,
    mortgageLTV,
    mortgageRate,
    mortgageTermYears,
  } = params;

  const useMortgage = mortgageLTV > 0;
  const loanAmount = useMortgage ? purchasePrice * (mortgageLTV / 100) : 0;
  const initialCashInvested = purchasePrice - loanAmount;

  // Monthly mortgage payment using standard amortization formula
  let monthlyMortgagePayment = 0;
  if (useMortgage && loanAmount > 0 && mortgageRate > 0 && mortgageTermYears > 0) {
    const r = mortgageRate / 100 / 12;
    const n = mortgageTermYears * 12;
    monthlyMortgagePayment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else if (useMortgage && loanAmount > 0 && mortgageRate === 0) {
    // Zero interest rate edge case
    monthlyMortgagePayment = loanAmount / (mortgageTermYears * 12);
  }

  const annualMortgagePayment = monthlyMortgagePayment * 12;

  const projections: ROIProjection[] = [];
  let cumulativeRent = 0;
  let cumulativeCosts = 0;

  for (let year = 1; year <= holdingPeriodYears; year++) {
    const propertyValue = purchasePrice * Math.pow(1 + appreciationRate, year);
    const annualRent = monthlyRent * 12 * Math.pow(1 + inflationRate, year - 1);
    const annualCosts = purchasePrice * (annualCostsPct / 100);

    cumulativeRent += annualRent;

    // Mortgage payments only apply during the mortgage term
    const mortgagePaymentThisYear = year <= mortgageTermYears ? annualMortgagePayment : 0;
    cumulativeCosts += annualCosts + mortgagePaymentThisYear;

    const netCashFlow = cumulativeRent - cumulativeCosts;

    // Calculate remaining mortgage balance
    let remainingBalance = 0;
    if (useMortgage && loanAmount > 0 && year <= mortgageTermYears) {
      const r = mortgageRate / 100 / 12;
      const paymentsMade = year * 12;
      if (mortgageRate > 0) {
        remainingBalance =
          loanAmount * Math.pow(1 + r, paymentsMade) -
          monthlyMortgagePayment * ((Math.pow(1 + r, paymentsMade) - 1) / r);
      } else {
        remainingBalance = loanAmount - monthlyMortgagePayment * paymentsMade;
      }
      remainingBalance = Math.max(0, remainingBalance);
    }

    const equity = propertyValue - remainingBalance;
    const totalReturn = equity + netCashFlow - initialCashInvested;
    const totalROIPercent =
      initialCashInvested > 0 ? (totalReturn / initialCashInvested) * 100 : 0;

    projections.push({
      year,
      propertyValue: Math.round(propertyValue),
      cumulativeRent: Math.round(cumulativeRent),
      cumulativeCosts: Math.round(cumulativeCosts),
      netCashFlow: Math.round(netCashFlow),
      totalReturn: Math.round(totalReturn),
      totalROIPercent: Math.round(totalROIPercent * 10) / 10,
    });
  }

  return projections;
}

export function findBreakEvenYear(projections: ROIProjection[]): number | null {
  for (const p of projections) {
    if (p.totalReturn > 0) {
      return p.year;
    }
  }
  return null;
}
