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

function TransactionList({ transactions }) {
  if (!transactions.length) return null;

  return (
    <div className="transaction-list">
      <div className="card-header">
        <span className="card-title">Recent Transactions</span>
        <span className="card-sub">{transactions.length} total</span>
      </div>
      <table className="tx-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Category</th>
            <th style={{ textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
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
              <td className="tx-amount">-${t.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
