import type { PlanResult } from "../lib/computePlan";
import { fmt, money } from "../lib/format";

export default function KpiGrid({ d }: { d: PlanResult }) {
  const income = d.M > 0 ? d.M : d.perpetual > 0 ? d.perpetual : 0;

  return (
    <div className="stats">
      <div className="card stat hero">
        <span className="stat-label">Balance When Investing Stops</span>
        <span className="stat-value">{fmt(d.pot)}</span>
        <span className="stat-sub">
          after {d.accumYears} yrs · age {d.currentAge} → {d.stopAge}
        </span>
      </div>

      <div className="card stat gold">
        <span className="stat-label">Monthly Income After</span>
        <span className="stat-value">{fmt(income)}</span>
        <span className="stat-sub">
          {d.withdrawalYears > 0
            ? `withdrawn age ${d.stopAge} → ${d.untilAge} (${d.withdrawalYears} yrs)`
            : "no withdrawal period set"}
        </span>
        {d.perpetual > 0 && d.withdrawalYears > 0 && (
          <span className="stat-sub">or {money(d.perpetual)}/mo forever (interest only)</span>
        )}
      </div>

      <div className="card stat">
        <span className="stat-label">Total Money Received</span>
        <span className="stat-value">{fmt(d.totalReceived)}</span>
        <span className="stat-sub">{d.totalWithdrawn > 0 ? "cash actually withdrawn + leftover" : ""}</span>
      </div>

      <div className="card stat">
        <span className="stat-label">Total Deposited</span>
        <span className="stat-value">{fmt(d.totalDeposited)}</span>
        <span className="stat-sub">
          {d.initial} initial + {d.monthly} × 12 × {d.accumYears}
        </span>
      </div>

      <div className="card stat">
        <span className="stat-label">Interest Earned (lifetime)</span>
        <span className="stat-value pos">{fmt(d.totalInterest)}</span>
        <span className="stat-sub">
          {d.totalDeposited > 0
            ? `+${((d.totalInterest / d.totalDeposited) * 100).toFixed(1)}% vs. money you put in`
            : ""}
        </span>
      </div>
    </div>
  );
}