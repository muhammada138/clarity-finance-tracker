import { useState } from "react";
import { categoryColors } from "../constants/colors";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount", right: true },
];

function sortTransactions(txs, key, dir) {
  return [...txs].sort((a, b) => {
    let av, bv;
    if (key === "amount") {
      av = a.amount;
      bv = b.amount;
    } else if (key === "name") {
      av = (a.merchant_name || a.name).toLowerCase();
      bv = (b.merchant_name || b.name).toLowerCase();
    } else if (key === "category") {
      av = (a.category || "other").toLowerCase();
      bv = (b.category || "other").toLowerCase();
    } else {
      av = a.date;
      bv = b.date;
    }
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

function TransactionList({ transactions }) {
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  if (!transactions.length) return null;

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "amount" ? "desc" : "asc");
    }
  }

  const sorted = sortTransactions(transactions, sortKey, sortDir);
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
                onClick={() => handleSort(col.key)}
                className="tx-th-sortable"
                style={col.right ? { textAlign: "right" } : undefined}
              >
                {col.label}
                <span className="sort-arrow">
                  {sortKey === col.key ? arrow : " ↕"}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => {
            const isIncome = t.category === "income";
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
                <td className="tx-amount" style={isIncome ? { color: "#3fb950" } : undefined}>
                  {isIncome ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
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
