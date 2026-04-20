import { useState, useMemo } from "react";
import { categoryColors } from "../constants/colors";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount", right: true },
];

// Optimizes sort operations by pre-calculating sort values (Schwartzian transform)
// Reduces expensive string operations like .toLowerCase() from O(N log N) to O(N)
function sortTransactions(txs, key, dir, catCounts) {
  // Fast path for non-string properties
  if (key === "amount" || key === "date") {
    return [...txs].sort((a, b) => {
      let av = key === "amount" ? -a.amount : a.date;
      let bv = key === "amount" ? -b.amount : b.date;
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Schwartzian transform for string properties
  const mapped = txs.map(t => {
    let val = "";
    if (key === "name") {
      val = (t.merchant_name || t.name || "").toLowerCase();
    } else if (key === "category") {
      val = (t.category || "other").toLowerCase();
    }
    return { t, val };
  });

  mapped.sort((a, b) => {
    if (a.val < b.val) return dir === "asc" ? -1 : 1;
    if (a.val > b.val) return dir === "asc" ? 1 : -1;
    return 0;
  });

  return mapped.map(item => item.t);
}

function TransactionList({ transactions, loading }) {
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  if (loading) {
    return (
      <div className="transaction-list">
        <div className="card-header">
          <span className="card-title">Recent Transactions</span>
          <span className="card-sub">Loading...</span>
        </div>
        <div className="tx-skeleton-list">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="tx-skeleton-row">
              <div className="skeleton skeleton-name" />
              <div className="skeleton skeleton-date" />
              <div className="skeleton skeleton-tag" />
              <div className="skeleton skeleton-amount" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions.length) return null;

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "amount" || key === "category" ? "desc" : "asc");
    }
  }

  const { catCounts, sorted } = useMemo(() => {
    const counts = {};
    for (const t of transactions) {
      const c = t.category || "other";
      counts[c] = (counts[c] || 0) + 1;
    }
    return {
      catCounts: counts,
      sorted: sortTransactions(transactions, sortKey, sortDir, counts),
    };
  }, [transactions, sortKey, sortDir]);
  const arrow = sortDir === "asc" ? " ↑" : " ↓";

  return (
    <div className="transaction-list">
      <div className="card-header">
        <span className="card-title">Recent Transactions</span>
        <span className="card-sub">{transactions.length} total</span>
      </div>
      <table className="tx-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="tx-th-sortable"
                style={col.right ? { textAlign: "right" } : undefined}
              >
                <button
                  className="sort-btn"
                  onClick={() => handleSort(col.key)}
                  style={col.right ? { marginLeft: "auto" } : undefined}
                >
                  {col.label}
                  <span className="sort-arrow">
                    {sortKey === col.key ? arrow : " ↕"}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => {
            const isPositiveCashFlow = t.amount < 0; // Negative amount in Plaid is money in
            return (
              <tr key={t.id}>
                <td className="tx-name">{t.merchant_name || t.name}</td>
                <td className="tx-date">{t.date}</td>
                <td>
                  <span
                    className="tag"
                    style={{ background: categoryColors[t.category] || categoryColors.other }}
                  >
                    {t.category || "other"}
                  </span>
                </td>
                <td className="tx-amount" style={isPositiveCashFlow ? { color: "#3fb950" } : undefined}>
                  {isPositiveCashFlow ? "+" : "-"}${Math.abs(t.amount || 0).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
