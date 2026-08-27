import type { Dispatch, SetStateAction } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  calculateAffordability,
  formatMoney,
  hasVisibleImprovement,
  roundIncomeMultiple,
  type AffordabilityInput,
} from "../calculator";
import { Gauge } from "../components/Gauge";
import { Metric } from "../components/Metric";
import { Slider } from "../components/Slider";

type Props = {
  originalValues: AffordabilityInput;
  values: AffordabilityInput;
  setValues: Dispatch<SetStateAction<AffordabilityInput>>;
  onBack: () => void;
  onHelp: () => void;
};

function getSliderStep(
  maximum: number,
  thresholds: Array<[number, number]>,
  defaultStep: number,
) {
  for (const [threshold, step] of thresholds)
    if (maximum > threshold) return step;
  return defaultStep;
}

export function AdjustPage({
  originalValues,
  values,
  setValues,
  onBack,
  onHelp,
}: Props) {
  const result = calculateAffordability(values);
  const originalResult = calculateAffordability(originalValues);
  const originalMultiple = roundIncomeMultiple(originalResult.incomeMultiple);
  const currentMultiple = roundIncomeMultiple(result.incomeMultiple);
  const hasImproved = hasVisibleImprovement(
    originalResult.incomeMultiple,
    result.incomeMultiple,
  );
  const maximumPropertyPrice = Math.max(750000, originalValues.propertyPrice);
  const propertyPriceStep = getSliderStep(
    maximumPropertyPrice,
    [
      [10000000, 100000],
      [5000000, 50000],
      [2000000, 25000],
    ],
    5000,
  );
  const maximumDepositLimit = Math.max(
    375000,
    originalValues.propertyPrice - 1000,
  );
  const maximumDeposit = Math.min(
    maximumDepositLimit,
    values.propertyPrice - 1000,
  );
  const depositStep = getSliderStep(
    maximumDepositLimit,
    [
      [10000000, 100000],
      [5000000, 50000],
      [1000000, 10000],
    ],
    1000,
  );
  const maximumIncome = Math.max(200000, originalValues.annualIncome);
  const incomeStep = getSliderStep(
    maximumIncome,
    [
      [1000000, 50000],
      [500000, 25000],
      [200000, 10000],
    ],
    1000,
  );

  function handlePropertyPriceChange(newPrice: number) {
    setValues((previousValues) => ({
      ...previousValues,
      propertyPrice: newPrice,
      deposit:
        previousValues.deposit >= newPrice
          ? newPrice - 1000
          : previousValues.deposit,
    }));
  }
  function handleDepositChange(newDeposit: number) {
    setValues((previousValues) => ({ ...previousValues, deposit: newDeposit }));
  }
  function handleIncomeChange(newIncome: number) {
    setValues((previousValues) => ({
      ...previousValues,
      annualIncome: newIncome,
    }));
  }

  return (
    <main className="adjust-page mx-[14px] mt-6 mb-12 md:mx-7 md:mb-16 lg:mx-auto lg:mt-10 lg:mb-[72px] lg:max-w-[1060px]">
      <div className="adjust-grid grid grid-cols-1 gap-0 overflow-hidden rounded-[14px] border border-line bg-white shadow-card md:grid-cols-[minmax(290px,.8fr)_minmax(0,1.4fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="slider-card rounded-none border-0 border-b border-line bg-white px-[18px] py-[21px] shadow-none md:border-r md:border-b-0 md:p-7">
          <h2>Adjust your numbers</h2>
          <Slider
            label="Property price"
            value={values.propertyPrice}
            min={100000}
            max={maximumPropertyPrice}
            step={propertyPriceStep}
            onChange={handlePropertyPriceChange}
          />
          <Slider
            label="Your deposit"
            value={values.deposit}
            min={5000}
            max={maximumDeposit}
            step={depositStep}
            onChange={handleDepositChange}
          />
          <Slider
            label="Annual household income"
            value={values.annualIncome}
            min={20000}
            max={maximumIncome}
            step={incomeStep}
            onChange={handleIncomeChange}
          />
          <button className="reset" onClick={() => setValues(originalValues)}>
            Reset to original numbers
          </button>
        </section>
        <section className="live-card flex flex-col rounded-none border-0 bg-white px-[18px] py-[21px] shadow-none md:p-7">
          <div className="scenario-summary">
            <Gauge value={result.incomeMultiple} />
            <div className="mini-metrics">
              <Metric
                label="Mortgage required"
                value={formatMoney(result.mortgageRequired)}
              />
              <Metric label="Deposit" value={formatMoney(values.deposit)} />
              <Metric
                label="Loan to value"
                value={`${result.ltv.toFixed(0)}%`}
              />
              <Metric
                label="Income multiple"
                value={`${result.incomeMultiple.toFixed(1)}x`}
              />
            </div>
          </div>
          <div className={`improvement ${hasImproved ? "" : "neutral"}`}>
            <Check size={17} />
            <span>
              <b>
                {hasImproved
                  ? "You’ve improved your position"
                  : "Explore your options"}
              </b>
              {hasImproved
                ? `Your income multiple is down from ${originalMultiple.toFixed(1)}x to ${currentMultiple.toFixed(1)}x.`
                : "Adjust the numbers to see how they affect your position."}
            </span>
          </div>
          <button className="primary" onClick={onHelp}>
            Talk to an expert <ArrowRight size={18} />
          </button>
        </section>
      </div>
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={16} /> Back to my original result
      </button>
    </main>
  );
}
