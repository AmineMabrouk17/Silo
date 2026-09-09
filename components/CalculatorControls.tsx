import type { CreditingFrequency } from "../lib/computePlan";

export type AgeKey = "current" | "stop" | "until";

export interface AgeFields {
  current: string;
  stop: string;
  until: string;
}

interface CalculatorControlsProps {
  initial: string;
  monthly: string;
  rate: string;
  ageFields: AgeFields;
  freq: CreditingFrequency;
  onInitial: (v: string) => void;
  onMonthly: (v: string) => void;
  onRate: (v: string) => void;
  onAgeChange: (key: AgeKey, v: string) => void;
  onAgeBlur: () => void;
  onFreq: (v: CreditingFrequency) => void;
}

export default function CalculatorControls({
  initial,
  monthly,
  rate,
  ageFields,
  freq,
  onInitial,
  onMonthly,
  onRate,
  onAgeChange,
  onAgeBlur,
  onFreq,
}: CalculatorControlsProps) {
  return (
    <section id="params" className="card">
      <h2>Parameters</h2>

      <div className="field">
        <label>Initial amount (TND)</label>
        <div className="input-wrap">
          <input type="number" inputMode="decimal" min={0} step={100} value={initial} onChange={(e) => onInitial(e.target.value)} />
          <span className="unit">TND</span>
        </div>
      </div>

      <div className="field">
        <label>Monthly deposit (TND)</label>
        <div className="input-wrap">
          <input type="number" inputMode="decimal" min={0} step={50} value={monthly} onChange={(e) => onMonthly(e.target.value)} />
          <span className="unit">TND</span>
        </div>
      </div>

      <div className="field">
        <label>Annual interest rate (%)</label>
        <div className="slider-row">
          <input type="range" min={0} max={20} step={0.25} value={rate} onChange={(e) => onRate(e.target.value)} />
          <input type="number" inputMode="decimal" min={0} max={100} step={0.1} value={rate} onChange={(e) => onRate(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Ages (type freely — validated when you click away)</label>
        <div className="age-grid">
          <div>
            <label>Current age</label>
            <input
              type="number"
              inputMode="numeric"
              value={ageFields.current}
              onChange={(e) => onAgeChange("current", e.target.value)}
              onBlur={onAgeBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </div>
          <div>
            <label>Stop investing at</label>
            <input
              type="number"
              inputMode="numeric"
              value={ageFields.stop}
              onChange={(e) => onAgeChange("stop", e.target.value)}
              onBlur={onAgeBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </div>
          <div>
            <label>Money lasts until</label>
            <input
              type="number"
              inputMode="numeric"
              value={ageFields.until}
              onChange={(e) => onAgeChange("until", e.target.value)}
              onBlur={onAgeBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </div>
        </div>
      </div>

      <div className="field">
        <label>Interest credited</label>
        <select value={freq} onChange={(e) => onFreq(e.target.value as CreditingFrequency)}>
          <option value="yearly">Yearly — on balance + this year&apos;s deposits</option>
          <option value="monthly">Monthly — rate ÷ 12 applied each month</option>
        </select>
      </div>

      <div className="note">
        <div><b>Phase 1:</b> you deposit monthly until the &ldquo;stop&rdquo; age.</div>
        <div><b>Phase 2:</b> the pot keeps earning interest while you withdraw it as a monthly salary until the &ldquo;lasts until&rdquo; age.</div>
        <div>All fields are plain typing — no arrows, no auto-rewrite while typing.</div>
      </div>
    </section>
  );
}