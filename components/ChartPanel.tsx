"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import type { PlanResult } from "../lib/computePlan";
import { fmt } from "../lib/format";
import InsightNote from "./InsightNote";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Legend, Tooltip);

export type ChartView = "growth" | "yearly";

interface ChartPanelProps {
  d: PlanResult;
  view: ChartView;
  onView: (v: ChartView) => void;
}

export default function ChartPanel({ d, view, onView }: ChartPanelProps) {
  const labels = [String(d.currentAge)];
  const balances = [d.initial];
  const cumDep = [d.initial];
  const cumWith = [0];

  d.rows.forEach((rw) => {
    labels.push(String(rw.age));
    balances.push(+rw.end.toFixed(2));
    cumDep.push(d.initial + d.monthly * 12 * Math.min(rw.year, d.accumYears));
    cumWith.push(+((cumWith[cumWith.length - 1] + rw.withdrawals).toFixed(2)));
  });

  const lineData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Total balance",
        data: balances,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,.15)",
        fill: "origin",
        tension: 0.3,
        pointRadius: 2,
        borderWidth: 2.5,
      },
      {
        label: "Deposited (your money)",
        data: cumDep,
        borderColor: "#3b82f6",
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Withdrawn (money received)",
        data: cumWith,
        borderColor: "#f59e0b",
        borderDash: [6, 4],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const barData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Interest gained that year",
        data: d.rows.map((rw) => +rw.interest.toFixed(2)),
        backgroundColor: d.rows.map((rw) =>
          rw.phase === "a" && d.annualDeposits > 0 && rw.interest > d.annualDeposits ? "#f59e0b" : "rgba(16,185,129,.55)"
        ),
        borderRadius: 6,
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false } as const,
    plugins: {
      legend: { labels: { color: "#cbd5e1" } },
      tooltip: {
        callbacks: {
          title: (items: { label: string }[]) => `Age ${items[0].label}`,
          label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) =>
            ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(148,163,184,.07)" },
        title: { display: true, text: "Age", color: "#94a3b8" },
      },
      y: {
        ticks: { color: "#94a3b8", callback: (v: number | string) => Number(v).toLocaleString() + " TND" },
        grid: { color: "rgba(148,163,184,.10)" },
      },
    },
  };

  return (
    <div className="card" id="chart">
      <div className="chart-head">
        <h2 className="card-title" style={{ margin: 0 }}>
          Visualization
        </h2>
        <div className="toggle">
          <button className={view === "growth" ? "active" : ""} onClick={() => onView("growth")}>
            Balance / Deposits / Withdrawals
          </button>
          <button className={view === "yearly" ? "active" : ""} onClick={() => onView("yearly")}>
            Interest per Year
          </button>
        </div>
      </div>
      <InsightNote d={d} />
      <div className="chart-wrap">
        {view === "growth" ? (
          <Line data={lineData} options={baseOptions as ChartOptions<"line">} />
        ) : (
          <Bar data={barData} options={baseOptions as ChartOptions<"bar">} />
        )}
      </div>
    </div>
  );
}