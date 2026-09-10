import type { PlanResult } from "../lib/computePlan";
import { fmt, money } from "../lib/format";

export default function KpiGrid({ d }: { d: PlanResult }) {
  const income = d.M > 0 ? d.M : d.perpetual > 0 ? d.perpetual : 0;
  const returnPct = d.totalDeposited > 0
    ? ((d.totalInterest / d.totalDeposited) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="metric-cards">
      {/* Card 1: Peak Balance */}
      <div className="metric-card">
        <div>
          <div className="metric-card-label">
            <span>Peak Balance</span>
          </div>
          <div className="metric-card-value emerald">
            {fmt(d.pot).replace(" TND", "")}{" "}
            <span className="metric-card-currency emerald">TND</span>
          </div>
        </div>
        <div className="metric-card-sub">
          <span className="metric-card-badge">
            Age <span className="badge-value">{d.stopAge}</span>
          </span>
          {" "}after {d.accumYears} yrs
        </div>
      </div>

      {/* Card 2: Monthly Income */}
      <div className="metric-card amber-accent">
        <div>
          <div className="metric-card-label amber">
            <span>Monthly Income</span>
          </div>
          <div className="metric-card-value amber">
            {fmt(income).replace(" TND", "")}{" "}
            <span className="metric-card-currency amber">TND</span>
          </div>
        </div>
        <div className="metric-card-sub">
          Withdrawn age {d.stopAge} &rarr; {d.untilAge}
        </div>
      </div>

      {/* Card 3: Total Principal */}
      <div className="metric-card">
        <div>
          <div className="metric-card-label">
            <span>Total Principal</span>
          </div>
          <div className="metric-card-value sky">
            {fmt(d.totalDeposited).replace(" TND", "")}{" "}
            <span className="metric-card-currency sky">TND</span>
          </div>
        </div>
        <div className="metric-card-sub">
          {money(d.monthly)} &times; 12 &times; {d.accumYears}
        </div>
      </div>

      {/* Card 4: Total Interest */}
      <div className="metric-card">
        <div>
          <div className="metric-card-label">
            <span>Total Interest</span>
          </div>
          <div className="metric-card-value teal">
            {fmt(d.totalInterest).replace(" TND", "")}{" "}
            <span className="metric-card-currency teal">TND</span>
          </div>
        </div>
        <div className="metric-card-return">
          <span>&#8593;</span>
          <span>+{returnPct}% return</span>
        </div>
      </div>
    </div>
  );
}
