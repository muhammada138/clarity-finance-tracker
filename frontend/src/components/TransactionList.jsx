import { useState, useMemo } from "react";
import { categoryColors } from "../constants/colors";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount", right: true },
];

function sortTransactions(txs, key, dir) {
  const sorted = [...txs];
  const factor = dir === "asc" ? 1 : -1;

  if (key === "amount") {
    // Cash flow: expenses are positive in Plaid, income/refunds are negative
    // We want to sort by cash flow where positive cash flow (income/refunds) > negative
    // i.e., sort by -amount. If we do -a.amount - -b.amount it is equal to b.amount - a.amount
    return sorted.sort((a, b) => (b.amount - a.amount) * factor);
  }

  if (key === "name") {
    return sorted.sort((a, b) => {
      const av = (a.merchant_name || a.name || "").toLowerCase();
      const bv = (b.merchant_name || b.name || "").toLowerCase();
      if (av < bv) return -factor;
      if (av > bv) return factor;
      return 0;
    });
  }

  if (key === "category") {
    return sorted.sort((a, b) => {
      const av = (a.category || "other").toLowerCase();
      const bv = (b.category || "other").toLowerCase();
      if (av < bv) return -factor;
      if (av > bv) return factor;
      return 0;
    });
  }

  // date fallback
  return sorted.sort((a, b) => {
    if (a.date < b.date) return -factor;
    if (a.date > b.date) return factor;
    return 0;
  });
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

  const { sorted } = useMemo(() => {
    return {
      sorted: sortTransactions(transactions, sortKey, sortDir),
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
