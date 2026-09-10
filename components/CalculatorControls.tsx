import type { CreditingFrequency } from "../lib/computePlan";

export type AgeKey = "current" | "stop" | "until";

export interface AgeFields {
  current: string;
  stop: string;
  until: string;
}

const sanitizeDecimal = (v: string) => {
  const clean = v.replace(/[^0-9.]/g, "");
  const [head, tail] = clean.split(".");
  return tail === undefined ? head : head + "." + tail;
};

const sanitizeInt = (v: string) => v.replace(/\D/g, "");

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
    <div className="bento-card">
      <div className="bento-card-header">
        <div className="bento-card-header-left">
          <span className="bento-card-header-icon">&#9776;</span>
          <h3>Investment Parameters</h3>
        </div>
        <span className="bento-badge">Config Mode</span>
      </div>

      <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
        {/* Initial Capital */}
        <div>
          <div className="field-label-row">
            <label className="field-label" htmlFor="initial-capital">Initial Amount (TND)</label>
            <span className="field-hint">one-time</span>
          </div>
          <div className="field-input-wrap">
            <input
              className="field-input"
              id="initial-capital"
              type="text"
              inputMode="decimal"
              value={initial}
              onChange={(e) => onInitial(sanitizeDecimal(e.target.value))}
            />
            <span className="field-input-unit">TND</span>
          </div>
        </div>

        {/* Monthly Contribution */}
        <div>
          <div className="field-label-row">
            <label className="field-label" htmlFor="monthly-deposit">Monthly Deposit (TND)</label>
            <span className="field-hint">recurring</span>
          </div>
          <div className="field-input-wrap">
            <input
              className="field-input"
              id="monthly-deposit"
              type="text"
              inputMode="decimal"
              value={monthly}
              onChange={(e) => onMonthly(sanitizeDecimal(e.target.value))}
            />
            <span className="field-input-unit">TND</span>
          </div>
        </div>

        {/* Interest Rate Slider */}
        <div style={{ paddingTop: 4 }}>
          <div className="field-label-row">
            <label className="field-label" htmlFor="interest-rate">Annual Interest Rate (%)</label>
            <span
              className="bento-badge"
              style={{ fontSize: "0.75rem", fontWeight: 700 }}
            >
              {parseFloat(rate).toFixed(1)}%
            </span>
          </div>
          <input
            style={{ width: "100%", height: 6, background: "#1e293b", borderRadius: 8, appearance: "none", cursor: "pointer", accentColor: "#10b981" }}
            id="interest-rate"
            type="range"
            min={0}
            max={20}
            step={0.25}
            value={rate}
            onChange={(e) => onRate(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.625rem", fontFamily: "'JetBrains Mono', monospace", color: "#64748b", marginTop: 4 }}>
            <span>1.0%</span>
            <span>Conservative (5-7%)</span>
            <span>15.0%</span>
          </div>
        </div>

        {/* Ages Milestone Triad */}
        <div style={{ paddingTop: 8 }}>
          <label className="age-milestone-label">Ages Milestones</label>
          <div className="age-grid">
            <div className="age-cell">
              <span className="age-cell-label">Current</span>
              <input
                className="age-cell-input"
                type="text"
                inputMode="numeric"
                value={ageFields.current}
                onChange={(e) => onAgeChange("current", sanitizeInt(e.target.value))}
                onBlur={onAgeBlur}
                onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
              />
            </div>
            <div className="age-cell retirement">
              <span className="age-cell-label">Stop Pay</span>
              <input
                className="age-cell-input"
                type="text"
                inputMode="numeric"
                value={ageFields.stop}
                onChange={(e) => onAgeChange("stop", sanitizeInt(e.target.value))}
                onBlur={onAgeBlur}
                onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
              />
            </div>
            <div className="age-cell">
              <span className="age-cell-label">Lasts Till</span>
              <input
                className="age-cell-input"
                type="text"
                inputMode="numeric"
                value={ageFields.until}
                onChange={(e) => onAgeChange("until", sanitizeInt(e.target.value))}
                onBlur={onAgeBlur}
                onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
              />
            </div>
          </div>
        </div>

        {/* Compounding Frequency */}
        <div style={{ paddingTop: 4 }}>
          <label className="field-label" htmlFor="interest-mode" style={{ display: "block", marginBottom: 6 }}>Interest Credited</label>
          <div className="field-select-wrap">
            <select
              className="field-select"
              id="interest-mode"
              value={freq}
              onChange={(e) => onFreq(e.target.value as CreditingFrequency)}
            >
              <option value="yearly">Yearly — on balance + deposits</option>
              <option value="monthly">Monthly Compound — accrued monthly</option>
            </select>
            <span className="field-select-icon">&#9662;</span>
          </div>
        </div>
      </form>

      {/* Informational Notes */}
      <div className="form-notes">
        <div className="form-note-item">
          <div className="form-note-dot emerald"></div>
          <p><strong>Phase 1:</strong> Accumulation phase where regular deposits compound monthly until target stop age.</p>
        </div>
        <div className="form-note-item">
          <div className="form-note-dot amber"></div>
          <p><strong>Phase 2:</strong> Capital distribution annuity. Balance keeps compounding interest while amortizing until specified age.</p>
        </div>
      </div>
    </div>
  );
}
