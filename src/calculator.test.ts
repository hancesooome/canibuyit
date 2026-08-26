import { describe, expect, it } from 'vitest'
import { calculateAffordability, getAffordabilityBand, getPositionScore, hasVisibleImprovement } from './calculator'

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
  it('does not report improvements hidden by display rounding', () => {
    expect(hasVisibleImprovement(4.5, 4.46)).toBe(false)
    expect(hasVisibleImprovement(4.5, 4.44)).toBe(true)
  })
  it('maps stronger positions toward the good end of the gauge', () => {
    expect(getPositionScore(4)).toBe(100)
    expect(getPositionScore(4.5)).toBeCloseTo(83.33, 1)
    expect(getPositionScore(6)).toBe(4)
  })
  it('preserves invariants across 10,000 valid scenarios', () => {
    for (let index = 1; index <= 10_000; index += 1) {
      const propertyPrice = 100_000 + index * 71
      const deposit = 5_000 + (index * 37) % Math.floor(propertyPrice * 0.45)
      const annualIncome = 20_000 + (index * 53) % 180_000
      const result = calculateAffordability({ propertyPrice, deposit, annualIncome })
      expect(Number.isFinite(result.incomeMultiple)).toBe(true)
      expect(result.mortgageRequired).toBe(propertyPrice - deposit)
      expect(result.depositPercentage + result.ltv).toBeCloseTo(100, 10)
      expect(result.ltv).toBeGreaterThan(0)
      expect(result.ltv).toBeLessThan(100)
    }
  })
})
