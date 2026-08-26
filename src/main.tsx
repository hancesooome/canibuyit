import React, { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Info,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import {
  AffordabilityInput,
  calculateAffordability,
  formatMoney,
  getAffordabilityBand,
  getPositionScore,
  hasVisibleImprovement,
  roundIncomeMultiple,
} from "./calculator";
import "./styles.css";
import logo from "./logo.png";

type Step = 1 | 2 | 3 | 4;
const initial: AffordabilityInput = {
  propertyPrice: 250000,
  deposit: 25000,
  annualIncome: 50000,
};

function Header({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false);
  const go = (action: () => void) => {
    setOpen(false);
    action();
  };
  return (
    <header className="site-header">
      <button className="brand" onClick={() => go(onStart)}>
        <img src={logo} alt="" />
        <span>Can I Buy It?</span>
      </button>
      <nav>
        <button onClick={onStart}>Calculator</button>
        <button
          onClick={() =>
            document
              .getElementById("how")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          How it works
        </button>
        <button
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          About us
        </button>
      </nav>
      <button
        className="menu"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <Menu size={22} />
      </button>
      <div
        className={`mobile-nav ${open ? "open" : ""}`}
        id="mobile-navigation"
      >
        <button onClick={() => go(onStart)}>Calculator</button>
        <button
          onClick={() =>
            go(() =>
              document
                .getElementById("how")
                ?.scrollIntoView({ behavior: "smooth" }),
            )
          }
        >
          How it works
        </button>
        <button
          onClick={() =>
            go(() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" }),
            )
          }
        >
          About us
        </button>
      </div>
    </header>
  );
}

function MoneyInput({
  id,
  label,
  value,
  onChange,
  hint,
  error,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className={`money-input ${error ? "invalid" : ""}`}>
        <b>£</b>
        <input
          id={id}
          inputMode="numeric"
          value={value ? value.toLocaleString("en-GB") : ""}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")))}
          aria-invalid={!!error}
        />
      </div>
      {hint && <small>{hint}</small>}
      {error && <small className="error">{error}</small>}
    </label>
  );
}

function Gauge({ value }: { value: number }) {
  const band = getAffordabilityBand(value);
  const color = {
    strong: "#16866f",
    good: "#16866f",
    borderline: "#d88b21",
    challenging: "#c64b4b",
  }[band];
  const positionScore = getPositionScore(value);
  return (
    <div
      className="gauge"
      role="img"
      aria-label={`Affordability indicator: required mortgage is ${value.toFixed(1)} times annual household income. ${band} position.`}
    >
      <div className="gauge-visual">
        <svg className="svg-gauge" viewBox="0 0 250 185" aria-hidden="true">
          <path
            className="svg-gauge-track"
            d="M 38.4 160 A 100 100 0 1 1 211.6 160"
            pathLength="100"
          />
          <path
            className="svg-gauge-progress"
            d="M 38.4 160 A 100 100 0 1 1 211.6 160"
            pathLength="100"
            style={{ stroke: color, strokeDasharray: `${positionScore} 100` }}
          />
        </svg>
        <div className="gauge-content" style={{ color }}>
          <small>
            {band === "strong"
              ? "Strong position"
              : band === "good"
                ? "Good position"
                : band === "borderline"
                  ? "Watch closely"
                  : "Higher risk"}
          </small>
          <strong>{value.toFixed(1)}x</strong>
          <span>
            Required income multiple <Info size={13} />
          </span>
        </div>
      </div>
      <div className="gauge-labels">
        <span>Higher risk</span>
        <span>Watch closely</span>
        <span>Good position</span>
      </div>
    </div>
  );
}

function Details({
  values,
  setValues,
  next,
}: {
  values: AffordabilityInput;
  setValues: React.Dispatch<React.SetStateAction<AffordabilityInput>>;
  next: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (values.propertyPrice <= 0)
      nextErrors.propertyPrice = "Enter a property price";
    if (values.deposit < 0) nextErrors.deposit = "Deposit cannot be negative";
    if (values.deposit >= values.propertyPrice)
      nextErrors.deposit = "Deposit must be less than the property price";
    if (values.annualIncome <= 0)
      nextErrors.annualIncome = "Enter your annual household income";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) next();
  };
  return (
    <main className="details-page">
      <section className="intro">
        <div className="eyebrow">Mortgage affordability calculator</div>
        <h1>
          Can I buy this
          <br />
          property?
        </h1>
        <p>
          Get a clear, instant indication of what you could borrow — and see how
          your finances stack up.
        </p>
        <div className="trust-row desktop-trust" id="about">
          <div>
            <Timer />
            <b>Instant results</b>
            <span>See your position in seconds</span>
          </div>
          <div>
            <ShieldCheck />
            <b>100% confidential</b>
            <span>Your details stay secure</span>
          </div>
          <div>
            <Sparkles />
            <b>No credit check</b>
            <span>Your score won’t be affected</span>
          </div>
        </div>
      </section>
      <form className="calculator-card" onSubmit={submit}>
        <div className="card-heading">
          <h2>Tell us about your plans</h2>
        </div>
        <MoneyInput
          id="price"
          label="Property price"
          value={values.propertyPrice}
          onChange={(v) => setValues((s) => ({ ...s, propertyPrice: v }))}
          error={errors.propertyPrice}
        />
        <MoneyInput
          id="deposit"
          label="Your deposit"
          value={values.deposit}
          onChange={(v) => setValues((s) => ({ ...s, deposit: v }))}
          hint={
            values.propertyPrice > 0
              ? `${((values.deposit / values.propertyPrice) * 100).toFixed(0)}% of the property price`
              : ""
          }
          error={errors.deposit}
        />
        <MoneyInput
          id="income"
          label="Annual household income"
          value={values.annualIncome}
          onChange={(v) => setValues((s) => ({ ...s, annualIncome: v }))}
          hint="Before tax, including joint income"
          error={errors.annualIncome}
        />
        <button className="primary" type="submit">
          Show my result <ArrowRight size={18} />
        </button>
        <div className="trust-row mobile-trust">
          <div>
            <Sparkles />
            <b>It’s free</b>
            <span>No impact on your credit score</span>
          </div>
          <div>
            <Timer />
            <b>Instant results</b>
            <span>See your affordability in seconds</span>
          </div>
          <div>
            <ShieldCheck />
            <b>100% confidential</b>
            <span>Your details are safe and secure</span>
          </div>
        </div>
        <p className="secure">
          <LockKeyhole size={14} /> Your information stays private and secure.
        </p>
      </form>
    </main>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function Results({
  values,
  adjust,
  help,
}: {
  values: AffordabilityInput;
  adjust: () => void;
  help: () => void;
}) {
  const r = calculateAffordability(values);
  const band = getAffordabilityBand(r.incomeMultiple);
  const positive = band === "good" || band === "strong";
  return (
    <main className="results-page">
      <section className="result-hero">
        <div className="result-copy">
          <h1 className="result-title">
            {positive ? (
              <>
                Good news — this looks{" "}
                <span className="outcome achievable">achievable.</span>
              </>
            ) : band === "borderline" ? (
              <>
                This could be{" "}
                <span className="outcome borderline">within reach.</span>
              </>
            ) : (
              <>
                This may need{" "}
                <span className="outcome challenging">some adjustment.</span>
              </>
            )}
          </h1>
          <p>
            Based on the details you shared, here’s how your mortgage position
            looks.
          </p>
        </div>
        <Gauge value={r.incomeMultiple} />
      </section>
      <section className="metrics">
        <Metric
          label="Mortgage required"
          value={formatMoney(r.mortgageRequired)}
          note="Property price minus deposit"
        />
        <Metric
          label="Your deposit"
          value={formatMoney(values.deposit)}
          note={`${r.depositPercentage.toFixed(0)}% of property price`}
        />
        <Metric
          label="Loan to value (LTV)"
          value={`${r.ltv.toFixed(0)}%`}
          note="The portion you need to borrow"
        />
        <Metric
          label="Income multiple"
          value={`${r.incomeMultiple.toFixed(1)}x`}
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
        <button className="primary" onClick={adjust}>
          Adjust my numbers <ArrowRight size={18} />
        </button>
      </section>
      <button className="text-link" onClick={help}>
        Or speak to a mortgage expert <ArrowRight size={15} />
      </button>
    </main>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  const [draft, setDraft] = useState(value.toLocaleString("en-GB"));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(value.toLocaleString("en-GB"));
  }, [value, editing]);

  useEffect(() => {
    if (value > max) onChange(max);
    else if (value < min) onChange(min);
  }, [value, min, max, onChange]);

  const commit = () => {
    const parsed = Number(draft.replace(/\D/g, ""));
    const nextValue = parsed ? Math.min(max, Math.max(min, parsed)) : value;
    onChange(nextValue);
    setDraft(nextValue.toLocaleString("en-GB"));
    setEditing(false);
  };

  return (
    <label className="slider">
      <span>
        <b>{label}</b>
        <span className="slider-value-text">
          <span>£</span>
          <input
            className="slider-plain-input"
            aria-label={`${label} exact amount`}
            inputMode="numeric"
            size={draft.length || 1}
            value={draft}
            onFocus={() => {
              setEditing(true);
              setDraft(String(value));
            }}
            onChange={(event) => {
              const raw = event.target.value.replace(/\D/g, "");
              const parsed = Number(raw);
              if (parsed > max) {
                setDraft(max.toLocaleString("en-GB"));
                onChange(max);
                return;
              }
              setDraft(raw);
              if (parsed >= min) onChange(parsed);
            }}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
          />
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <div>
        <small>{formatMoney(min)}</small>
        <small>{formatMoney(max)}</small>
      </div>
    </label>
  );
}

function Adjust({
  original,
  values,
  setValues,
  back,
  help,
}: {
  original: AffordabilityInput;
  values: AffordabilityInput;
  setValues: React.Dispatch<React.SetStateAction<AffordabilityInput>>;
  back: () => void;
  help: () => void;
}) {
  const r = calculateAffordability(values),
    o = calculateAffordability(original);
  const displayedOriginalMultiple = roundIncomeMultiple(o.incomeMultiple);
  const displayedCurrentMultiple = roundIncomeMultiple(r.incomeMultiple);
  const improved = hasVisibleImprovement(o.incomeMultiple, r.incomeMultiple);

  // Dynamic limits and steps for Sliders, based on the customer's original input
  const maxPropertyPrice = Math.max(750000, original.propertyPrice);
  const propertyPriceStep = maxPropertyPrice > 10000000 ? 100000 : (maxPropertyPrice > 5000000 ? 50000 : (maxPropertyPrice > 2000000 ? 25000 : 5000));

  const maxDepositLimit = Math.max(375000, original.propertyPrice - 1000);
  const maxDeposit = Math.min(maxDepositLimit, values.propertyPrice - 1000);
  const depositStep = maxDepositLimit > 10000000 ? 100000 : (maxDepositLimit > 5000000 ? 50000 : (maxDepositLimit > 1000000 ? 10000 : 1000));

  const maxIncome = Math.max(200000, original.annualIncome);
  const incomeStep = maxIncome > 1000000 ? 50000 : (maxIncome > 500000 ? 25000 : (maxIncome > 200000 ? 10000 : 1000));

  return (
    <main className="adjust-page">
      <div className="adjust-grid">
        <section className="slider-card">
          <h2>Adjust your numbers</h2>
          <Slider
            label="Property price"
            value={values.propertyPrice}
            min={100000}
            max={maxPropertyPrice}
            step={propertyPriceStep}
            onChange={(v) =>
              setValues((s) => ({
                ...s,
                propertyPrice: v,
                deposit: s.deposit >= v ? v - 1000 : s.deposit,
              }))
            }
          />
          <Slider
            label="Your deposit"
            value={values.deposit}
            min={5000}
            max={maxDeposit}
            step={depositStep}
            onChange={(v) =>
              setValues((s) => ({
                ...s,
                deposit: v,
              }))
            }
          />
          <Slider
            label="Annual household income"
            value={values.annualIncome}
            min={20000}
            max={maxIncome}
            step={incomeStep}
            onChange={(v) => setValues((s) => ({ ...s, annualIncome: v }))}
          />
          <button className="reset" onClick={() => setValues(original)}>
            Reset to original numbers
          </button>
        </section>
        <section className="live-card">
          <div className="scenario-summary">
            <Gauge value={r.incomeMultiple} />
            <div className="mini-metrics">
              <Metric
                label="Mortgage required"
                value={formatMoney(r.mortgageRequired)}
              />
              <Metric label="Deposit" value={formatMoney(values.deposit)} />
              <Metric label="Loan to value" value={`${r.ltv.toFixed(0)}%`} />
              <Metric
                label="Income multiple"
                value={`${r.incomeMultiple.toFixed(1)}x`}
              />
            </div>
          </div>
          <div className={`improvement ${improved ? "" : "neutral"}`}>
            <Check size={17} />
            <span>
              <b>
                {improved
                  ? "You’ve improved your position"
                  : "Explore your options"}
              </b>
              {improved
                ? `Your income multiple is down from ${displayedOriginalMultiple.toFixed(1)}x to ${displayedCurrentMultiple.toFixed(1)}x.`
                : "Adjust the numbers to see how they affect your position."}
            </span>
          </div>
          <button className="primary" onClick={help}>
            Talk to an expert <ArrowRight size={18} />
          </button>
        </section>
      </div>
      <button className="back-link" onClick={back}>
        <ArrowLeft size={16} /> Back to my original result
      </button>
    </main>
  );
}

function Contact({ back }: { back: () => void }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  if (sent)
    return (
      <main className="success">
        <div className="success-icon">
          <Check size={32} />
        </div>
        <span className="step-tag">ENQUIRY SENT</span>
        <h1>Thanks{name ? `, ${name.split(" ")[0]}` : ""}!</h1>
        <p>
          We’ve received your enquiry. A mortgage expert will be in touch within
          one business day.
        </p>
        <div className="what-next">
          <b>What happens next?</b>
          <span>
            <i>1</i>We’ll review your details
          </span>
          <span>
            <i>2</i>An expert will call you
          </span>
          <span>
            <i>3</i>You’ll explore your options
          </span>
        </div>
        <button className="secondary" onClick={back}>
          Back to my results
        </button>
      </main>
    );
  return (
    <main className="contact-page">
      <section className="help-copy">
        <h1>Let’s find the right path forward.</h1>
        <div className="desktop-support">
          <p>
            Share a few details and one of our mortgage experts will get in
            touch to talk through your options.
          </p>
          <ul>
            <li>
              <Check /> Whole-of-market advice
            </li>
            <li>
              <Check /> Access to thousands of mortgage deals
            </li>
            <li>
              <Check /> No obligation, just helpful guidance
            </li>
          </ul>
        </div>
        <div className="quote desktop-quote">
          “Speaking to someone made everything feel much clearer.”
          <span>— Recent homebuyer</span>
        </div>
      </section>
      <form
        className="contact-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (name && email) setSent(true);
        }}
      >
        <h2>Tell us how to reach you</h2>
        <label>
          Full name{" "}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
          />
        </label>
        <label>
          Email address{" "}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
          />
        </label>
        <label>
          Phone number <small>(optional)</small>
          <input type="tel" placeholder="07123 456789" />
        </label>
        <label>
          When are you looking to buy?{" "}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
          <div className="select-wrap">
            <select required defaultValue="">
              <option value="" disabled>
                Select a timeframe
              </option>
              <option>As soon as possible</option>
              <option>Within 3 months</option>
              <option>3–6 months</option>
              <option>6+ months</option>
            </select>
            <ChevronDown />
          </div>
        </label>
        <button className="primary">
          Send my enquiry <ArrowRight size={18} />
        </button>
        <p className="secure">
          <LockKeyhole size={14} /> Your details are secure and never shared.
        </p>
      </form>
      <div className="mobile-support">
        <p>
          Share a few details and one of our mortgage experts will get in touch
          to talk through your options.
        </p>
        <ul>
          <li>
            <Check /> Whole-of-market advice
          </li>
          <li>
            <Check /> Access to thousands of mortgage deals
          </li>
          <li>
            <Check /> No obligation, just helpful guidance
          </li>
        </ul>
      </div>
      <div className="quote mobile-quote">
        “Speaking to someone made everything feel much clearer.”
        <span>— Recent homebuyer</span>
      </div>
    </main>
  );
}

function App() {
  const [step, setStep] = useState<Step>(1);
  const [values, setValues] = useState(initial);
  const [original, setOriginal] = useState(initial);
  const content = (() => {
    if (step === 1)
      return (
        <Details
          values={values}
          setValues={setValues}
          next={() => {
            setOriginal(values);
            setStep(2);
          }}
        />
      );
    if (step === 2)
      return (
        <Results
          values={values}
          adjust={() => setStep(3)}
          help={() => setStep(4)}
        />
      );
    if (step === 3)
      return (
        <Adjust
          original={original}
          values={values}
          setValues={setValues}
          back={() => {
            setValues(original);
            setStep(2);
          }}
          help={() => setStep(4)}
        />
      );
    return <Contact back={() => setStep(2)} />;
  })();
  return (
    <div className="app">
      <Header
        onStart={() => {
          setValues(initial);
          setStep(1);
        }}
      />
      {content}
      <footer id="how">
        <span>Simple answers for one of life’s biggest decisions.</span>
        <small>Prototype only · Not financial advice</small>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
