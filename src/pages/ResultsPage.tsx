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
    <main className="results-page">
      <section className="result-hero">
        <div className="result-copy">
          <h1 className="result-title">{renderResultTitle()}</h1>
          <p>
            Based on the details you shared, here’s how your mortgage position
            looks.
          </p>
        </div>
        <Gauge value={result.incomeMultiple} />
      </section>
      <section className="metrics">
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
      <div className="notice">
        <Info size={19} />
        <p>
          <b>This is an indication, not a mortgage offer.</b>
          <br />
          Lenders have different criteria and will complete their own
          affordability assessment.
        </p>
      </div>
      <section className="next-card">
        <div>
          <span>WANT TO IMPROVE YOUR POSITION?</span>
          <h2>See what a few changes could do</h2>
          <p>
            Adjust your deposit, price or income and watch your result update
            instantly.
          </p>
        </div>
        <button className="primary" onClick={onAdjust}>
          Adjust my numbers <ArrowRight size={18} />
        </button>
      </section>
      <button className="text-link" onClick={onHelp}>
        Or speak to a mortgage expert <ArrowRight size={15} />
      </button>
    </main>
  );
}
