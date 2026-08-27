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
      <main className="success mx-4 my-6 flex min-h-0 max-w-[550px] flex-col items-center pt-2 text-center md:mx-auto lg:my-10 lg:min-h-[620px] lg:pt-0">
        <div className="success-icon mb-5 grid size-[70px] place-items-center rounded-full border-2 border-[#20a17e] bg-[#e8f7f2] text-teal">
          <Check size={32} />
        </div>
        <span className="step-tag text-[11px] font-extrabold tracking-[.12em] text-brand uppercase">ENQUIRY SENT</span>
        <h1>Thanks{firstName ? `, ${firstName}` : ""}!</h1>
        <p>
          We’ve received your enquiry. A mortgage expert will be in touch within
          one business day.
        </p>
        <div className="what-next my-[22px] w-full rounded-[11px] border border-line bg-white px-[17px] py-5 text-left lg:my-[25px] lg:p-[22px]">
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
        <button className="secondary inline-flex min-h-[50px] items-center justify-center gap-[9px] rounded-[7px] border border-[#ccd6e0] bg-white px-6 font-bold text-[#273b53]" onClick={onBack}>
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
    <main className="contact-page mx-[14px] mt-6 mb-12 grid grid-cols-1 items-stretch gap-6 md:mx-7 md:mb-16 md:grid-cols-[.9fr_1.1fr] md:gap-[38px] lg:mx-auto lg:mt-10 lg:mb-[72px] lg:max-w-[1050px] lg:grid-cols-2 lg:items-center lg:gap-20">
      <section className="help-copy">
        <h1>Let’s find the right path forward.</h1>
        <div className="desktop-support hidden lg:block">{supportContent}</div>
        <div className="quote desktop-quote hidden border-l-[3px] border-[#66ac9c] px-4 py-2 text-[13px] text-[#43556c] italic lg:block">{quote}</div>
      </section>
      <form className="contact-card rounded-xl border border-line bg-white px-[18px] py-[22px] shadow-card md:p-7" onSubmit={handleSubmit}>
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
          <div className="select-wrap relative">
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
        <button className="primary mt-2 inline-flex h-[50px] w-full items-center justify-center gap-[9px] rounded-[7px] border-0 bg-brand px-6 font-bold text-white shadow-[0_7px_16px_rgba(28,104,212,.2)] hover:bg-brand-hover">
          Send my enquiry <ArrowRight size={18} />
        </button>
        <p className="secure">
          <LockKeyhole size={14} /> Your details are secure and never shared.
        </p>
      </form>
      <div className="mobile-support block text-[#69788b] lg:hidden">{supportContent}</div>
      <div className="quote mobile-quote mb-2 block border-l-[3px] border-[#66ac9c] px-4 py-2 text-[13px] text-[#43556c] italic lg:hidden">{quote}</div>
    </main>
  );
}
