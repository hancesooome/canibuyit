export type AffordabilityInput = { propertyPrice: number; deposit: number; annualIncome: number }
export type Band = 'strong' | 'good' | 'borderline' | 'challenging'

export function calculateAffordability({ propertyPrice, deposit, annualIncome }: AffordabilityInput) {
  const mortgageRequired = propertyPrice - deposit
  return {
    mortgageRequired,
    depositPercentage: (deposit / propertyPrice) * 100,
    ltv: (mortgageRequired / propertyPrice) * 100,
    incomeMultiple: mortgageRequired / annualIncome,
  }
}

export function getAffordabilityBand(value: number): Band {
  if (value <= 4) return 'strong'
  if (value <= 4.5) return 'good'
  if (value <= 5) return 'borderline'
  return 'challenging'
}

export const formatMoney = (value: number) => new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'GBP', maximumFractionDigits: 0,
}).format(value)
