import { useState, useMemo } from "react";
import { categoryColors } from "../constants/colors";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount", right: true },
];

function sortTransactions(txs, key, dir) {
  const isAsc = dir === "asc";
  const mod = isAsc ? -1 : 1;
  const sorted = [...txs];

  if (key === "amount") {
    // Cash flow: expenses are positive in Plaid, income/refunds are negative
    // We want to sort by cash flow where positive cash flow (income/refunds) > negative
    sorted.sort((a, b) => isAsc ? b.amount - a.amount : a.amount - b.amount);
  } else if (key === "name") {
    sorted.sort((a, b) => {
      const av = (a.merchant_name || a.name || "").toLowerCase();
      const bv = (b.merchant_name || b.name || "").toLowerCase();
      if (av < bv) return mod;
      if (av > bv) return -mod;
      return 0;
    });
  } else if (key === "category") {
    // sort alphabetically
    sorted.sort((a, b) => {
      const av = (a.category || "other").toLowerCase();
      const bv = (b.category || "other").toLowerCase();
      if (av < bv) return mod;
      if (av > bv) return -mod;
      return 0;
    });
  } else {
    sorted.sort((a, b) => {
      if (a.date < b.date) return mod;
      if (a.date > b.date) return -mod;
      return 0;
    });
  }
  return sorted;
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

  const sorted = useMemo(() => {
    return sortTransactions(transactions, sortKey, sortDir);
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
