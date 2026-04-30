import { useState, useMemo } from "react";
import { categoryColors } from "../constants/colors";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount", right: true },
];

// ⚡ Bolt: Optimized sorting using a Schwartzian transform (map -> sort -> map)
// This avoids repeated expensive operations like .toLowerCase() inside the sorting loop,
// turning O(N log N) string transformations into O(N) operations.
function sortTransactions(txs, key, dir) {
  const mapped = txs.map((t) => {
    let val;
    if (key === "amount") {
      // Cash flow: expenses are positive in Plaid, income/refunds are negative
      // We want to sort by cash flow where positive cash flow (income/refunds) > negative
      val = -t.amount;
    } else if (key === "name") {
      val = (t.merchant_name || t.name || "").toLowerCase();
    } else if (key === "category") {
      // sort alphabetically
      val = (t.category || "other").toLowerCase();
    } else {
      val = t.date;
    }
    return { t, val };
  });

  mapped.sort((a, b) => {
    if (a.val < b.val) return dir === "asc" ? -1 : 1;
    if (a.val > b.val) return dir === "asc" ? 1 : -1;
    return 0;
  });

  return mapped.map((m) => m.t);
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

  if (!transactions.length) {
    return (
      <div className="transaction-list">
        <div className="card-header">
          <span className="card-title">Recent Transactions</span>
          <span className="card-sub">0 total</span>
        </div>
        <div style={{ padding: "40px 0", textAlign: "center", color: "#7d8590", fontSize: "0.85rem" }}>
          No transactions yet.
        </div>
      </div>
    );
  }

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "amount" || key === "category" ? "desc" : "asc");
    }
  }

  // ⚡ Bolt: Removed unused catCounts computation that was iterating over all
  // transactions on every column sort change.
  const sorted = useMemo(() => {
    return sortTransactions(transactions, sortKey, sortDir);
  }, [transactions, sortKey, sortDir]);
  const arrow = sortDir === "asc" ? " ↑" : " ↓";

  function exportToCSV() {
    const headers = ["Name", "Date", "Category", "Amount"];
    const rows = sorted.map((t) => [
      `"${(t.merchant_name || t.name || "").replace(/"/g, '""')}"`,
      t.date,
      t.category || "other",
      t.amount < 0 ? Math.abs(t.amount).toFixed(2) : `-${Math.abs(t.amount).toFixed(2)}`
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clarity_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="transaction-list">
      <div className="card-header">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="card-title">Recent Transactions</span>
          <span className="card-sub">{transactions.length} total</span>
        </div>
        <button className="btn-ghost" onClick={exportToCSV} style={{ marginLeft: "auto", fontSize: "0.8rem" }}>
          ↓ Export CSV
        </button>
      </div>
      <table className="tx-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="tx-th-sortable"
                style={col.right ? { textAlign: "right" } : undefined}
                aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                <button
                  className="sort-btn"
                  onClick={() => handleSort(col.key)}
                  style={col.right ? { marginLeft: "auto" } : undefined}
                  title={`Sort by ${col.label}`}
                >
                  {col.label}
                  <span className="sort-arrow" aria-hidden="true">
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
