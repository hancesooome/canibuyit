import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronDown, LockKeyhole } from "lucide-react";

export function ContactPage({ onBack }: { onBack: () => void }) {
  const [isSent, setIsSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (name && email) setIsSent(true);
  }

  if (isSent) {
    const firstName = name.split(" ")[0];
    return (
      <main className="success">
        <div className="success-icon">
          <Check size={32} />
        </div>
        <span className="step-tag">ENQUIRY SENT</span>
        <h1>Thanks{firstName ? `, ${firstName}` : ""}!</h1>
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
        <button className="secondary" onClick={onBack}>
          Back to my results
        </button>
      </main>
    );
  }

  const supportContent = (
    <>
      <p>
        Share a few details and one of our mortgage experts will get in touch to
        talk through your options.
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
    </>
  );
  const quote = (
    <>
      “Speaking to someone made everything feel much clearer.”
      <span>— Recent homebuyer</span>
    </>
  );
  return (
    <main className="contact-page">
      <section className="help-copy">
        <h1>Let’s find the right path forward.</h1>
        <div className="desktop-support">{supportContent}</div>
        <div className="quote desktop-quote">{quote}</div>
      </section>
      <form className="contact-card" onSubmit={handleSubmit}>
        <h2>Tell us how to reach you</h2>
        <label>
          Full name{" "}
          <span className="required-mark" aria-hidden="true">
            *
          </span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
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
            onChange={(event) => setEmail(event.target.value)}
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
      <div className="mobile-support">{supportContent}</div>
      <div className="quote mobile-quote">{quote}</div>
    </main>
  );
}
