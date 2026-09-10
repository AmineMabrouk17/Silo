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
import { fmt, money } from "../lib/format";

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
        borderColor: "#38bdf8",
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
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "#334155",
        borderWidth: 1,
        titleColor: "#94a3b8",
        bodyColor: "#34d399",
        titleFont: { family: "'JetBrains Mono', monospace", size: 10 },
        bodyFont: { family: "'JetBrains Mono', monospace", size: 12, weight: "bold" as const },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (items: { label: string }[]) => `Age ${items[0].label}`,
          label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) =>
            ` ${ctx.dataset.label}: ${money(ctx.parsed.y)} TND`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { family: "'JetBrains Mono', monospace", size: 10 } },
        grid: { color: "rgba(30, 41, 59, 0.5)" },
        border: { color: "#1e293b" },
      },
      y: {
        ticks: {
          color: "#64748b",
          font: { family: "'JetBrains Mono', monospace", size: 10 },
          callback: (v: number | string) => Math.round(Number(v) / 1000) + "k TND",
        },
        grid: { color: "rgba(30, 41, 59, 0.5)" },
        border: { color: "#1e293b" },
      },
    },
  };

  return (
    <div className="chart-card">
      {/* Chart Header & Mode Tabs */}
      <div className="chart-header">
        <div className="chart-header-left">
          <div className="chart-header-icon">&#128200;</div>
          <div className="chart-header-text">
            <h2>Net Worth Trajectory</h2>
            <p>Accumulation curve against amortized capital</p>
          </div>
        </div>
        <div className="chart-toggle">
          <button className={view === "growth" ? "active" : ""} onClick={() => onView("growth")}>
            Balance / Withdrawals
          </button>
          <button className={view === "yearly" ? "active" : ""} onClick={() => onView("yearly")}>
            Interest Breakdown
          </button>
        </div>
      </div>

      {/* Milestone Callout */}
      {d.M > 0 && (
        <div className="insight-callout">
          <span className="insight-callout-icon">&#10024;</span>
          <div>
            At age{" "}
            <span className="highlight-emerald">{d.stopAge}</span> you will reach{" "}
            <span className="highlight-white">{fmt(d.pot)}</span> — sufficient to distribute a steady{" "}
            <span className="highlight-amber">{fmt(d.M).replace(" TND", "")} TND/month</span> until age{" "}
            <span className="highlight-white">{d.untilAge}</span>. Total money received:{" "}
            <span className="highlight-emerald">{fmt(d.totalReceived)}</span>.
          </div>
        </div>
      )}

      {/* Legend Bar */}
      <div className="chart-legend">
        <div className="chart-legend-items">
          <div className="chart-legend-item">
            <span className="chart-legend-dot emerald"></span>
            <span className="chart-legend-label">Total Balance</span>
          </div>
          <div className="chart-legend-item">
            <span className="chart-legend-dot sky"></span>
            <span className="chart-legend-label muted">Deposits (Your Capital)</span>
          </div>
          <div className="chart-legend-item">
            <span className="chart-legend-dash"></span>
            <span className="chart-legend-label muted">Cumulative Withdrawn</span>
          </div>
        </div>
        <span className="chart-legend-interactive">Interactive Canvas (Hoverable)</span>
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        {view === "growth" ? (
          <Line data={lineData} options={baseOptions as ChartOptions<"line">} />
        ) : (
          <Bar data={barData} options={baseOptions as ChartOptions<"bar">} />
        )}
      </div>
    </div>
  );
}
