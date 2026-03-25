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
  if (!transactions.length) return null;

  const totals = {};
  for (const t of transactions) {
    const cat = t.category || "other";
    if (cat === "income") continue; // income shown separately in stats
    totals[cat] = (totals[cat] || 0) + Math.abs(t.amount);
  }

  const chartData = Object.entries(totals)
    .map(([category, amount]) => ({ category, amount: parseFloat(amount.toFixed(2)) }))
    .sort((a, b) => b.amount - a.amount);

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
