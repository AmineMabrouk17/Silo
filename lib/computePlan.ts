export type CreditingFrequency = "yearly" | "monthly";
export type Phase = "a" | "w";

export interface PlanInputs {
  initial: number;
  monthly: number;
  ratePct: number;
  currentAge: number;
  stopAge: number;
  untilAge: number;
  freq: CreditingFrequency;
}

export interface YearRow {
  year: number;
  age: number;
  start: number;
  deposits: number;
  withdrawals: number;
  interest: number;
  end: number;
  phase: Phase;
}

export interface PlanResult {
  inputs: PlanInputs;
  initial: number;
  monthly: number;
  r: number;
  currentAge: number;
  stopAge: number;
  untilAge: number;
  accumYears: number;
  withdrawalYears: number;
  rows: YearRow[];
  pot: number;
  W: number;
  M: number;
  perpetual: number;
  totalDeposited: number;
  totalWithdrawn: number;
  leftover: number;
  totalReceived: number;
  totalInterest: number;
  annualDeposits: number;
  crossing: { year: number; age: number } | null;
}

const num = (v: number, fallback: number) => {
  const n = Number.isFinite(v) ? v : Number.NaN;
  return Number.isNaN(n) ? fallback : n;
};

export function computePlan(inputs: PlanInputs): PlanResult {
  const initial = Math.max(0, num(inputs.initial, 0));
  const monthly = Math.max(0, num(inputs.monthly, 0));
  const ratePct = Math.max(0, num(inputs.ratePct, 0));
  const r = ratePct / 100;
  const freq = inputs.freq;

  const currentAge = Math.min(100, Math.max(0, Math.trunc(num(inputs.currentAge, 30))));
  const rawStop = Math.min(100, Math.max(1, Math.trunc(num(inputs.stopAge, 45))));
  const stopAge = rawStop <= currentAge ? currentAge + 1 : rawStop;
  const rawUntil = Math.min(100, Math.max(1, Math.trunc(num(inputs.untilAge, 80))));
  const untilAge = rawUntil <= stopAge ? stopAge + 1 : rawUntil;

  const accumYears = stopAge - currentAge;
  const N = untilAge - stopAge;

  let balance = initial;
  const rows: YearRow[] = [];
  for (let y = 1; y <= accumYears; y++) {
    const start = balance;
    let deposits = 0;
    let interest = 0;
    if (freq === "yearly") {
      deposits = monthly * 12;
      interest = (start + deposits) * r;
    } else {
      const mr = r / 12;
      for (let m = 0; m < 12; m++) {
        const i = balance * mr;
        interest += i;
        balance += i + monthly;
        deposits += monthly;
      }
    }
    balance = start + deposits + interest;
    rows.push({ year: y, age: currentAge + y, start, deposits, withdrawals: 0, interest, end: balance, phase: "a" });
  }
  const pot = balance;

  let W = 0;
  let M = 0;
  let perpetual = 0;
  if (pot > 0) {
    perpetual = (pot * r) / 12;
    if (N > 0) {
      if (r === 0) {
        W = pot / N;
      } else {
        const f = Math.pow(1 + r, N);
        W = (pot * r * f) / (f - 1);
      }
      M = W / 12;
      let bal = pot;
      for (let k = 1; k <= N; k++) {
        const start = bal;
        const interest = start * r;
        bal = start + interest - W;
        if (k === N) bal = 0;
        rows.push({ year: accumYears + k, age: stopAge + k, start, deposits: 0, withdrawals: W, interest, end: bal, phase: "w" });
      }
    }
  }

  const totalDeposited = initial + monthly * 12 * accumYears;
  const totalWithdrawn = rows.reduce((s, rw) => s + rw.withdrawals, 0);
  const leftover = rows.length ? rows[rows.length - 1].end : pot;
  const totalReceived = totalWithdrawn + leftover;
  const totalInterest = totalReceived - totalDeposited;
  const annualDeposits = monthly * 12;

  const crossingRow = rows.find((rw) => annualDeposits > 0 && rw.phase === "a" && rw.interest > annualDeposits);
  const crossing = crossingRow ? { year: crossingRow.year, age: crossingRow.age } : null;

  return {
    inputs,
    initial,
    monthly,
    r,
    currentAge,
    stopAge,
    untilAge,
    accumYears,
    withdrawalYears: N,
    rows,
    pot,
    W,
    M,
    perpetual,
    totalDeposited,
    totalWithdrawn,
    leftover,
    totalReceived,
    totalInterest,
    annualDeposits,
    crossing,
  };
}