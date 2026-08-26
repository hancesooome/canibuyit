import { describe, expect, it } from 'vitest'
import { calculateAffordability, getAffordabilityBand } from './calculator'

describe('affordability calculation', () => {
  it('calculates the baseline scenario', () => {
    expect(calculateAffordability({ propertyPrice: 250000, deposit: 25000, annualIncome: 50000 }))
      .toEqual({ mortgageRequired: 225000, depositPercentage: 10, ltv: 90, incomeMultiple: 4.5 })
  })
  it('uses the declared band thresholds', () => {
    expect(getAffordabilityBand(4)).toBe('strong')
    expect(getAffordabilityBand(4.5)).toBe('good')
    expect(getAffordabilityBand(4.8)).toBe('borderline')
    expect(getAffordabilityBand(5.1)).toBe('challenging')
  })
})
