import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import {
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import type { AffordabilityInput } from "../calculator";
import { MoneyInput } from "../components/MoneyInput";

type DetailsPageProps = {
  values: AffordabilityInput;
  setValues: Dispatch<SetStateAction<AffordabilityInput>>;
  onContinue: () => void;
};

type ValidationErrors = Partial<Record<keyof AffordabilityInput, string>>;

function validateValues(values: AffordabilityInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (values.propertyPrice <= 0)
    errors.propertyPrice = "Enter a property price";
  if (values.deposit < 0) errors.deposit = "Deposit cannot be negative";
  if (values.deposit >= values.propertyPrice)
    errors.deposit = "Deposit must be less than the property price";
  if (values.annualIncome <= 0)
    errors.annualIncome = "Enter your annual household income";
  return errors;
}

export function DetailsPage({
  values,
  setValues,
  onContinue,
}: DetailsPageProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  function updateValue(field: keyof AffordabilityInput, newValue: number) {
    setValues((previousValues) => ({ ...previousValues, [field]: newValue }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationErrors = validateValues(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) onContinue();
  }

  const depositPercentageHint =
    values.propertyPrice > 0
      ? `${((values.deposit / values.propertyPrice) * 100).toFixed(0)}% of the property price`
      : "";

  return (
    <main className="details-page mx-[14px] mt-6 mb-12 flex min-h-0 flex-col items-stretch gap-6 md:mx-7 md:mb-16 lg:mx-auto lg:mt-11 lg:grid lg:min-h-[590px] lg:max-w-[1180px] lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-[85px]">
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
      <form className="calculator-card rounded-xl border border-line bg-white px-[18px] py-[22px] shadow-card md:mx-auto md:w-full md:max-w-[620px] md:p-[30px] lg:m-0 lg:max-w-none lg:p-8" onSubmit={handleSubmit}>
        <div className="card-heading">
          <h2>Tell us about your plans</h2>
        </div>
        <MoneyInput
          id="price"
          label="Property price"
          value={values.propertyPrice}
          onChange={(newPrice) => updateValue("propertyPrice", newPrice)}
          error={errors.propertyPrice}
        />
        <MoneyInput
          id="deposit"
          label="Your deposit"
          value={values.deposit}
          onChange={(newDeposit) => updateValue("deposit", newDeposit)}
          hint={depositPercentageHint}
          error={errors.deposit}
        />
        <MoneyInput
          id="income"
          label="Annual household income"
          value={values.annualIncome}
          onChange={(newIncome) => updateValue("annualIncome", newIncome)}
          hint="Before tax, including joint income"
          error={errors.annualIncome}
        />
        <button className="primary mt-2 inline-flex h-[50px] w-full items-center justify-center gap-[9px] rounded-[7px] border-0 bg-brand px-6 font-bold text-white shadow-[0_7px_16px_rgba(28,104,212,.2)] hover:bg-brand-hover" type="submit">
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
