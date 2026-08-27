export type AffordabilityInput = {
  propertyPrice: number;
  deposit: number;
  annualIncome: number;
};

export type Band = "strong" | "good" | "borderline" | "challenging";

export function calculateAffordability({
  propertyPrice,
  deposit,
  annualIncome,
}: AffordabilityInput) {
  const mortgageRequired = propertyPrice - deposit;
  return {
    mortgageRequired,
    depositPercentage: (deposit / propertyPrice) * 100,
    ltv: (mortgageRequired / propertyPrice) * 100,
    incomeMultiple: mortgageRequired / annualIncome,
  };
}

export function getAffordabilityBand(value: number): Band {
  if (value <= 4) return "strong";
  if (value <= 4.5) return "good";
  if (value <= 5) return "borderline";
  return "challenging";
}

export function getPositionScore(incomeMultiple: number) {
  return Math.max(4, Math.min(100, ((5.5 - incomeMultiple) / 1.2) * 100));
}

export function roundIncomeMultiple(value: number) {
  return Math.round(value * 10) / 10;
}

export function hasVisibleImprovement(original: number, current: number) {
  return roundIncomeMultiple(current) < roundIncomeMultiple(original);
}

const moneyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function formatMoney(value: number) {
  return moneyFormatter.format(value);
}
