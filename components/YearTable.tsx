import type { PlanResult } from "../lib/computePlan";
import { money } from "../lib/format";

export default function YearTable({ d }: { d: PlanResult }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-header-left">
          <div className="table-header-icon">&#128203;</div>
          <div className="table-header-text">
            <h2>Year-by-Year Financial Schedule</h2>
            <p>Complete amortization, deposit logs, and interest allocations</p>
          </div>
        </div>
        <div className="table-legend">
          <div className="table-legend-item">
            <span className="table-legend-dot amber"></span>
            <span className="table-legend-text">Withdrawal Phase</span>
          </div>
          <div className="table-legend-item">
            <span className="table-legend-dot emerald"></span>
            <span className="table-legend-text">Accumulation Phase</span>
          </div>
        </div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Age</th>
              <th>Start Balance</th>
              <th>Annual Deposits</th>
              <th>Withdrawals</th>
              <th>Interest Gained</th>
              <th>End Balance</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((rw) => (
              <tr key={rw.year} className={rw.phase === "w" ? "wphase" : ""}>
                <td style={{ color: "#94a3b8" }}>{rw.year}</td>
                <td style={{ fontWeight: 600 }}>{rw.age}</td>
                <td style={{ color: "#94a3b8" }}>{money(rw.start)}</td>
                <td className={rw.deposits > 0 ? "text-sky" : "text-slate-dim"}>
                  {rw.deposits > 0 ? money(rw.deposits) : "\u2014"}
                </td>
                <td className={rw.withdrawals > 0 ? "text-amber font-bold" : "text-slate-dim"}>
                  {rw.withdrawals > 0 ? money(rw.withdrawals) : "\u2014"}
                </td>
                <td className="text-emerald">+{money(rw.interest)}</td>
                <td className="font-bold" style={{ color: "#f1f5f9" }}>{money(rw.end)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
