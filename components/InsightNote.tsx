import type { PlanResult } from "../lib/computePlan";
import { fmt } from "../lib/format";

export default function InsightNote({ d }: { d: PlanResult }) {
  return (
    <div className="insight">
      {d.M > 0 ? (
        <div>
          🧓 At age <b>{d.stopAge}</b> you&apos;ll have <b>{fmt(d.pot)}</b> — enough to pay yourself <b>≈ {fmt(d.M)}/month</b> until
          age <b>{d.untilAge}</b>. Total cash received: <b>≈ {fmt(d.totalReceived)}</b>.
        </div>
      ) : d.perpetual > 0 ? (
        <div>
          ♾️ You could withdraw <b>≈ {fmt(d.perpetual)}/month forever</b> (interest only) and keep the capital of {fmt(d.pot)}{" "}
          intact.
        </div>
      ) : null}
      {d.crossing && (
        <div>
          🚀 From year <b>{d.crossing.year}</b> (age {d.crossing.age}), yearly interest exceeds your yearly deposits — money earns
          more than you add!
        </div>
      )}
    </div>
  );
}