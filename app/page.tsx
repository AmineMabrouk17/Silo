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

  return (
    <>
      <div className="page-head">
        <h1>📈 Compound Interest &amp; Retirement Income</h1>
        <p>Monthly savings plan → future monthly income · All in Tunisian Dinar (TND)</p>
      </div>
      <div className="calc-layout">
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
      <section>
        <div id="results">
          <KpiGrid d={d} />
        </div>
        <ChartPanel d={d} view={view} onView={setView} />
        <YearTable d={d} />
      </section>
      </div>
    </>
  );
}