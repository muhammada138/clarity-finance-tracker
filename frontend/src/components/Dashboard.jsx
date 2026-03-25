import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const categoryColors = {
  food: "#f97316",
  transport: "#3b82f6",
  shopping: "#8b5cf6",
  subscriptions: "#ec4899",
  rent: "#ef4444",
  utilities: "#14b8a6",
  entertainment: "#f59e0b",
  health: "#22c55e",
  other: "#6b7280",
};

function Dashboard({ transactions }) {
  if (!transactions.length) return null;

  // tally spending by category
  const totals = {};
  for (const t of transactions) {
    const cat = t.category || "other";
    totals[cat] = (totals[cat] || 0) + t.amount;
  }

  const chartData = Object.entries(totals)
    .map(([category, amount]) => ({ category, amount: parseFloat(amount.toFixed(2)) }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="dashboard">
      <h2>Spending by Category</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(val) => `$${val}`} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.category}
                fill={categoryColors[entry.category] || categoryColors.other}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;
