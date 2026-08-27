import { ArrowRight, Info } from "lucide-react";
import {
  calculateAffordability,
  formatMoney,
  getAffordabilityBand,
  type AffordabilityInput,
} from "../calculator";
import { Gauge } from "../components/Gauge";
import { Metric } from "../components/Metric";

type ResultsPageProps = {
  values: AffordabilityInput;
  onAdjust: () => void;
  onHelp: () => void;
};

export function ResultsPage({ values, onAdjust, onHelp }: ResultsPageProps) {
  const result = calculateAffordability(values);
  const band = getAffordabilityBand(result.incomeMultiple);
  const isPositive = band === "good" || band === "strong";

  function renderResultTitle() {
    if (isPositive)
      return (
        <>
          Good news — this looks{" "}
          <span className="outcome achievable">achievable.</span>
        </>
      );
    if (band === "borderline")
      return (
        <>
          This could be{" "}
          <span className="outcome borderline">within reach.</span>
        </>
      );
    return (
      <>
        This may need{" "}
        <span className="outcome challenging">some adjustment.</span>
      </>
    );
  }

  return (
    <main className="results-page mx-[14px] mt-6 mb-12 md:mx-7 md:mb-16 lg:mx-auto lg:mt-10 lg:mb-[72px] lg:max-w-[1060px]">
      <section className="result-hero grid grid-cols-1 items-center rounded-t-xl border border-line bg-white px-[18px] py-[26px] text-center md:grid-cols-[1.15fr_.85fr] md:px-[38px] md:py-9 md:text-left lg:px-[60px] lg:py-[42px]">
        <div className="result-copy">
          <h1 className="result-title">{renderResultTitle()}</h1>
          <p>
            Based on the details you shared, here’s how your mortgage position
            looks.
          </p>
        </div>
        <Gauge value={result.incomeMultiple} />
      </section>
      <section className="metrics grid grid-cols-1 border border-t-0 border-line bg-white md:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Mortgage required"
          value={formatMoney(result.mortgageRequired)}
          note="Property price minus deposit"
        />
        <Metric
          label="Your deposit"
          value={formatMoney(values.deposit)}
          note={`${result.depositPercentage.toFixed(0)}% of property price`}
        />
        <Metric
          label="Loan to value (LTV)"
          value={`${result.ltv.toFixed(0)}%`}
          note="The portion you need to borrow"
        />
        <Metric
          label="Income multiple"
          value={`${result.incomeMultiple.toFixed(1)}x`}
          note="Mortgage ÷ household income"
        />
      </section>
      <div className="notice flex gap-[13px] border border-[#d8e5f7] bg-[#edf4ff] px-4 py-[14px] text-[11px] text-[#31567e] md:px-[22px]">
        <Info size={19} />
        <p>
          <b>This is an indication, not a mortgage offer.</b>
          <br />
          Lenders have different criteria and will complete their own
          affordability assessment.
        </p>
      </div>
      <section className="next-card block rounded-b-xl border border-t-0 border-line bg-white px-[18px] py-[22px] md:flex md:items-center md:justify-between md:gap-6 md:px-[27px] md:py-[25px] lg:px-[30px] lg:py-7">
        <div>
          <span>WANT TO IMPROVE YOUR POSITION?</span>
          <h2>See what a few changes could do</h2>
          <p>
            Adjust your deposit, price or income and watch your result update
            instantly.
          </p>
        </div>
        <button className="primary mt-[18px] inline-flex h-[50px] w-full items-center justify-center gap-[9px] rounded-[7px] border-0 bg-brand px-6 font-bold text-white shadow-[0_7px_16px_rgba(28,104,212,.2)] hover:bg-brand-hover md:mt-0 md:w-auto" onClick={onAdjust}>
          Adjust my numbers <ArrowRight size={18} />
        </button>
      </section>
      <button className="text-link" onClick={onHelp}>
        Or speak to a mortgage expert <ArrowRight size={15} />
      </button>
    </main>
  );
}
