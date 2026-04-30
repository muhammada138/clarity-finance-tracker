import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { categoryColors } from "../constants/colors";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{payload[0].payload.category}</p>
      <p className="value">${payload[0].value.toFixed(2)}</p>
    </div>
  );
}

function Dashboard({ transactions }) {
  if (!transactions.length) {
    return (
      <div className="dashboard">
        <div className="card-header">
          <span className="card-title">Spending by Category</span>
          <span className="card-sub">last 30 days</span>
        </div>
        <div style={{ padding: "40px 0", textAlign: "center", color: "#7d8590", fontSize: "0.85rem" }}>
          No transactions to display.
        </div>
      </div>
    );
  }

  const chartData = useMemo(() => {
    const totals = {};
    for (const t of transactions) {
      const cat = t.category || "other";
      if (cat === "income") continue;
      totals[cat] = (totals[cat] || 0) + t.amount;
    }

    return Object.entries(totals)
      .filter(([_, amount]) => amount > 0) // optionally exclude negative categories
      .map(([category, amount]) => ({ category, amount: parseFloat(amount.toFixed(2)) }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <div className="dashboard">
      <div className="card-header">
        <span className="card-title">Spending by Category</span>
        <span className="card-sub">last 30 days</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "#7d8590", fontFamily: "Inter, sans-serif" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#7d8590", fontFamily: "Inter, sans-serif" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="amount" radius={[5, 5, 0, 0]} maxBarSize={48}>
            {chartData.map((entry) => (
              <Cell
                key={entry.category}
                fill={categoryColors[entry.category] || categoryColors.other}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;
