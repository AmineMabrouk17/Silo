import type { PlanResult } from "../lib/computePlan";
import { money } from "../lib/format";

export default function YearTable({ d }: { d: PlanResult }) {
  const totalDep = d.totalDeposited;

  return (
    <div className="card table-card" id="table">
      <h2>
        📅 Year-by-Year Breakdown{" "}
        <span className="card-title" style={{ color: "var(--muted)", fontWeight: 400, fontSize: "0.8rem" }}>
          (gold rows = withdrawal phase)
        </span>
      </h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Age</th>
              <th>Start Balance</th>
              <th>Deposits</th>
              <th>Withdrawals</th>
              <th>Interest Gained</th>
              <th>End Balance</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((rw) => (
              <tr key={rw.year} className={rw.phase === "w" ? "wphase" : ""}>
                <td>{rw.year}</td>
                <td>{rw.age}</td>
                <td>{money(rw.start)}</td>
                <td>{rw.deposits > 0 ? money(rw.deposits) : "—"}</td>
                <td className="neg">{rw.withdrawals > 0 ? `−${money(rw.withdrawals)}` : "—"}</td>
                <td className="pos">+{money(rw.interest)}</td>
                <td className="strong">{money(rw.end)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Σ</td>
              <td>—</td>
              <td>{money(d.initial)}</td>
              <td>{money(totalDep - d.initial)}</td>
              <td className="neg">−{money(d.totalWithdrawn)}</td>
              <td className="pos">+{money(d.totalInterest)}</td>
              <td className="strong">{money(d.leftover)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}