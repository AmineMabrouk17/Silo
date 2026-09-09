import { describe, expect, it } from "vitest";
import { computePlan, type PlanInputs } from "../lib/computePlan";

const defaults: PlanInputs = {
  initial: 0,
  monthly: 300,
  ratePct: 5,
  currentAge: 30,
  stopAge: 45,
  untilAge: 80,
  freq: "yearly",
};

describe("computePlan — defaults parity", () => {
  const d = computePlan(defaults);

  it("uses default ages and phases of 15 investing + 35 withdrawal years", () => {
    expect(d.currentAge).toBe(30);
    expect(d.stopAge).toBe(45);
    expect(d.untilAge).toBe(80);
    expect(d.accumYears).toBe(15);
    expect(d.withdrawalYears).toBe(35);
    expect(d.rows).toHaveLength(50);
  });

  it("matches reference pot, monthly income, and annuity payout", () => {
    expect(d.pot).toBeCloseTo(81566.97036349935, 8);
    expect(d.W).toBeCloseTo(4981.434133747034, 8);
    expect(d.M).toBeCloseTo(415.11951114558616, 8);
    expect(d.perpetual).toBeCloseTo(339.8623765145806, 8);
  });

  it("matches reference totals for the default scenario", () => {
    expect(d.totalDeposited).toBe(54000);
    expect(d.totalWithdrawn).toBeCloseTo(174350.1946811463, 8);
    expect(d.totalReceived).toBeCloseTo(174350.1946811463, 8);
    expect(d.totalInterest).toBeCloseTo(120350.1946811463, 8);
  });

  it("detects the year interest outpaces deposits", () => {
    expect(d.crossing).toEqual({ year: 15, age: 45 });
  });

  it("consumes the pot exactly at the end age", () => {
    expect(d.rows[d.rows.length - 1].end).toBe(0);
  });

  it("keeps phase rows internally consistent", () => {
    for (const row of d.rows) {
      if (row.phase === "a") {
        expect(row.end).toBeCloseTo(row.start + row.deposits + row.interest, 8);
      } else {
        expect(row.end).toBeCloseTo(row.start + row.interest - row.withdrawals, 8);
      }
    }
  });
});

describe("computePlan — crediting frequency", () => {
  it("monthly crediting compounds to a slightly lower pot than yearly", () => {
    const yearly = computePlan(defaults);
    const monthly = computePlan({ ...defaults, freq: "monthly" });
    expect(monthly.pot).toBeCloseTo(80186.68313557461, 8);
    expect(monthly.M).toBeCloseTo(408.09480302239444, 8);
    expect(monthly.totalReceived).toBeCloseTo(171399.8172694057, 8);
    expect(monthly.totalInterest).toBeCloseTo(117399.8172694057, 8);
    expect(monthly.pot).toBeLessThan(yearly.pot);
  });
});

describe("computePlan — zero-rate branch", () => {
  it("withdraws the pot evenly over the withdrawal years", () => {
    const d = computePlan({ ...defaults, ratePct: 0 });
    expect(d.pot).toBe(54000);
    expect(d.W).toBeCloseTo(1542.857142857143, 8);
    expect(d.M).toBeCloseTo(128.57142857142858, 8);
    expect(d.totalReceived).toBeCloseTo(54000, 8);
    expect(d.totalInterest).toBeCloseTo(0, 6);
    expect(d.perpetual).toBe(0);
    expect(d.crossing).toBeNull();
  });
});

describe("computePlan — perpetual refinement", () => {
  it("reports the interest-only monthly income as pot × r / 12", () => {
    const d = computePlan(defaults);
    expect(d.perpetual).toBeCloseTo((d.pot * d.r) / 12, 10);
  });
});

describe("computePlan — zero deposit / zero initial", () => {
  it("returns a zero plan without withdrawal rows when nothing is saved", () => {
    const d = computePlan({ ...defaults, monthly: 0, initial: 0 });
    expect(d.pot).toBe(0);
    expect(d.W).toBe(0);
    expect(d.M).toBe(0);
    expect(d.perpetual).toBe(0);
    expect(d.rows.every((rw) => rw.phase === "a")).toBe(true);
    expect(d.rows).toHaveLength(d.accumYears);
  });
});

describe("computePlan — age clamps and derivation", () => {
  it("clamps current age into 0..100", () => {
    expect(computePlan({ ...defaults, currentAge: -4 }).currentAge).toBe(0);
    expect(computePlan({ ...defaults, currentAge: 250 }).currentAge).toBe(100);
  });

  it("clamps stop/until into 1..100 before deriving", () => {
    const d = computePlan({ ...defaults, stopAge: 0, untilAge: 0 });
    expect(d.stopAge).toBe(31);
    expect(d.untilAge).toBe(32);
  });

  it("derives stopAge to current+1 when stop <= current", () => {
    const d = computePlan({ ...defaults, stopAge: 30, untilAge: 30 });
    expect(d.stopAge).toBe(31);
    expect(d.untilAge).toBe(32);
    expect(d.M).toBeCloseTo(330.7499999999997, 8);
  });

  it("derives untilAge to stop+1 when until <= stop", () => {
    const d = computePlan({ ...defaults, untilAge: 40 });
    expect(d.untilAge).toBe(46);
  });

  it("keeps phases sane at the age ceiling", () => {
    const d = computePlan({ ...defaults, currentAge: 100, stopAge: 100, untilAge: 100 });
    expect(d.stopAge).toBe(101);
    expect(d.untilAge).toBe(102);
    expect(d.accumYears).toBe(1);
    expect(d.withdrawalYears).toBe(1);
  });
});

describe("computePlan — interest crossing detection", () => {
  it("returns null when interest never outpaces deposits", () => {
    const d = computePlan({ ...defaults, ratePct: 1 });
    expect(d.crossing).toBeNull();
  });

  it("ignores withdrawal-phase interest when checking the crossing", () => {
    const d = computePlan({ ...defaults, ratePct: 20, monthly: 1 });
    const found = d.rows.find((rw) => rw.phase === "a" && rw.interest > d.annualDeposits);
    expect(d.crossing).not.toBeNull();
    expect(d.crossing?.year).toBe(found?.year);
  });
});

describe("computePlan — rounding drift", () => {
  it("keeps last row, pot, and KPI values within toFixed(2) of each other", () => {
    const d = computePlan(defaults);
    const lastEnd = d.rows[d.rows.length - 1].end;
    expect(parseFloat(lastEnd.toFixed(2))).toBe(0);
    expect(parseFloat(d.pot.toFixed(2))).toBe(parseFloat(d.rows[d.rows.length - 1 - d.withdrawalYears].end.toFixed(2)));
  });

  it("rounds every cell with toFixed(2) without NaN", () => {
    const d = computePlan(defaults);
    for (const rw of d.rows) {
      for (const v of [rw.start, rw.deposits, rw.withdrawals, rw.interest, rw.end]) {
        expect(Number.isFinite(parseFloat(v.toFixed(2)))).toBe(true);
      }
    }
  });
});