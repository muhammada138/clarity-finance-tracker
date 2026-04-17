const transactions = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  category: i % 10 === 0 ? "income" : ["food", "transport", "entertainment", "bills", "other"][i % 5],
  amount: Math.random() * 100,
}));

function calculateChartData() {
  const totals = {};
  for (const t of transactions) {
    const cat = t.category || "other";
    if (cat === "income") continue;
    totals[cat] = (totals[cat] || 0) + t.amount;
  }

  return Object.entries(totals)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({ category, amount: parseFloat(amount.toFixed(2)) }))
    .sort((a, b) => b.amount - a.amount);
}

// Warm up
for (let i = 0; i < 10; i++) calculateChartData();

console.time("Baseline (Without useMemo - 100 re-renders)");
for (let i = 0; i < 100; i++) {
  calculateChartData();
}
console.timeEnd("Baseline (Without useMemo - 100 re-renders)");

// With useMemo (cache hit)
let cachedData = calculateChartData();
console.time("Optimized (With useMemo - 100 re-renders)");
for (let i = 0; i < 100; i++) {
  const chartData = cachedData; // useMemo cache hit
}
console.timeEnd("Optimized (With useMemo - 100 re-renders)");
