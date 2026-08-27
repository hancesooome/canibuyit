import { useState } from "react";
import { Header } from "./components/Header";
import { INITIAL_AFFORDABILITY_VALUES } from "./constants";
import { AdjustPage } from "./pages/AdjustPage";
import { ContactPage } from "./pages/ContactPage";
import { DetailsPage } from "./pages/DetailsPage";
import { ResultsPage } from "./pages/ResultsPage";
import type { AppStep } from "./types";

export function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>("details");
  const [values, setValues] = useState(INITIAL_AFFORDABILITY_VALUES);
  const [originalValues, setOriginalValues] = useState(
    INITIAL_AFFORDABILITY_VALUES,
  );

  function startOver() {
    setValues(INITIAL_AFFORDABILITY_VALUES);
    setCurrentStep("details");
  }
  function showResults() {
    setOriginalValues(values);
    setCurrentStep("results");
  }
  function returnToOriginalResult() {
    setValues(originalValues);
    setCurrentStep("results");
  }

  function renderCurrentPage() {
    switch (currentStep) {
      case "details":
        return (
          <DetailsPage
            values={values}
            setValues={setValues}
            onContinue={showResults}
          />
        );
      case "results":
        return (
          <ResultsPage
            values={values}
            onAdjust={() => setCurrentStep("adjust")}
            onHelp={() => setCurrentStep("contact")}
          />
        );
      case "adjust":
        return (
          <AdjustPage
            originalValues={originalValues}
            values={values}
            setValues={setValues}
            onBack={returnToOriginalResult}
            onHelp={() => setCurrentStep("contact")}
          />
        );
      case "contact":
        return <ContactPage onBack={() => setCurrentStep("results")} />;
    }
  }

  return (
    <div className="app min-h-screen flex flex-col">
      <Header onStart={startOver} />
      {renderCurrentPage()}
      <footer id="how" className="mt-auto w-full">
        <span>Simple answers for one of life’s biggest decisions.</span>
        <small>Prototype only · Not financial advice</small>
      </footer>
    </div>
  );
}
