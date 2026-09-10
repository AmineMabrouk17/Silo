"use client";

import { useState } from "react";
import { computePlan, type CreditingFrequency, type PlanInputs } from "../lib/computePlan";
import CalculatorControls, { type AgeFields } from "../components/CalculatorControls";
import KpiGrid from "../components/KpiGrid";
import ChartPanel, { type ChartView } from "../components/ChartPanel";
import YearTable from "../components/YearTable";

const DEFAULT_AGES = { current: 30, stop: 45, until: 80 };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const parseOr = (field: string, fallback: number) => {
  const n = parseInt(field, 10);
  return Number.isNaN(n) ? fallback : n;
};

export default function Home() {
  const [initial, setInitial] = useState("0");
  const [monthly, setMonthly] = useState("300");
  const [rate, setRate] = useState("5");
  const [ageFields, setAgeFields] = useState<AgeFields>({ current: "30", stop: "45", until: "80" });
  const [lastValidAges, setLastValidAges] = useState(DEFAULT_AGES);
  const [freq, setFreq] = useState<CreditingFrequency>("yearly");
  const [view, setView] = useState<ChartView>("growth");

  const initialV = Math.max(0, parseFloat(initial) || 0);
  const monthlyV = Math.max(0, parseFloat(monthly) || 0);
  const rateV = Math.max(0, parseFloat(rate) || 0);
  const currentAge = clamp(parseOr(ageFields.current, lastValidAges.current), 0, 100);
  const stopRaw = clamp(parseOr(ageFields.stop, lastValidAges.stop), 1, 100);
  const untilRaw = clamp(parseOr(ageFields.until, lastValidAges.until), 1, 100);

  if (currentAge !== lastValidAges.current || stopRaw !== lastValidAges.stop || untilRaw !== lastValidAges.until) {
    setLastValidAges({ current: currentAge, stop: stopRaw, until: untilRaw });
  }

  const inputs: PlanInputs = {
    initial: initialV,
    monthly: monthlyV,
    ratePct: rateV,
    currentAge,
    stopAge: stopRaw,
    untilAge: untilRaw,
    freq,
  };

  const d = computePlan(inputs);

  const normalizeAges = () => {
    const r = computePlan(inputs);
    setAgeFields({ current: String(r.currentAge), stop: String(r.stopAge), until: String(r.untilAge) });
  };

  const handleReset = () => {
    setInitial("0");
    setMonthly("300");
    setRate("5");
    setAgeFields({ current: "30", stop: "45", until: "80" });
    setFreq("yearly");
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-head-dot"></div>
          <h1>Compound Interest &amp; Retirement Income</h1>
        </div>
        <p className="hidden sm:block">Monthly savings plan → future wealth longevity &bull; Figures calculated in Tunisian Dinar (TND)</p>
        <div className="page-head-actions">
          <button className="btn-reset" onClick={handleReset}>
            <span>&#8634;</span> Reset
          </button>
        </div>
      </div>

      {/* Bento Layout Grid */}
      <div className="bento-grid">
        {/* Left Column: Parameter Inputs (4 cols) */}
        <div className="bento-inputs">
          <CalculatorControls
            initial={initial}
            monthly={monthly}
            rate={rate}
            ageFields={ageFields}
            freq={freq}
            onInitial={setInitial}
            onMonthly={setMonthly}
            onRate={setRate}
            onAgeChange={(key, v) => setAgeFields((f) => ({ ...f, [key]: v }))}
            onAgeBlur={normalizeAges}
            onFreq={setFreq}
          />
        </div>

        {/* Right Column: Dashboard & Metrics (8 cols) */}
        <div className="bento-dashboard">
          <KpiGrid d={d} />
          <ChartPanel d={d} view={view} onView={setView} />
        </div>
      </div>

      {/* Year-by-Year Table */}
      <div className="table-section">
        <YearTable d={d} />
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <p>&copy; Silo Financial Intelligence. Formulas strictly compound interest based on periodic annuity mechanics.</p>
        <div className="footer-links">
          <span>Security Model</span>
          <span>API Specs</span>
          <span>Documentation</span>
        </div>
      </footer>
    </>
  );
}
