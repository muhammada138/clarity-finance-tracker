import { useState } from "react";
import ConnectBank from "./components/ConnectBank";
import TransactionList from "./components/TransactionList";
import Dashboard from "./components/Dashboard";
import InsightsPanel from "./components/InsightsPanel";
import { getInsights } from "./services/api";
import "./App.css";

function ClarityLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c6af7" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="url(#logo-grad)" />
      <path d="M14 5.5L6.5 13h15L14 5.5z" fill="white" />
      <path d="M6.5 13L14 22.5 21.5 13H6.5z" fill="white" fillOpacity="0.5" />
    </svg>
  );
}

function App() {
  const [connected, setConnected] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState("");
  const [insightsLoading, setInsightsLoading] = useState(false);

  async function handleConnected() {
    setConnected(true);
    setInsightsLoading(true);
    try {
      const data = await getInsights();
      setTransactions(data.transactions || []);
      setInsights(data.insights || "");
    } catch (e) {
      console.error("failed to load insights", e);
    } finally {
      setInsightsLoading(false);
    }
  }

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const topCat = (() => {
    const totals = {};
    for (const t of transactions) {
      const c = t.category || "other";
      totals[c] = (totals[c] || 0) + t.amount;
    }
    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "--";
  })();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app">
      <header>
        <div className="logo">
          <ClarityLogo />
          Clarity
        </div>
        {connected && <span className="badge">Connected</span>}
      </header>

      {!connected ? (
        <ConnectBank onConnected={handleConnected} />
      ) : (
        <main>
          <div className="welcome">
            <h2>Your spending overview</h2>
            <p>{today}</p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">${total.toFixed(2)}</span>
              <span className="stat-sub">last 30 days</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Transactions</span>
              <span className="stat-value">{transactions.length}</span>
              <span className="stat-sub">pulled from Plaid</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Top Category</span>
              <span className="stat-value" style={{ textTransform: "capitalize" }}>{topCat}</span>
              <span className="stat-sub">highest spending</span>
            </div>
          </div>

          <Dashboard transactions={transactions} />

          <div className="lower">
            <TransactionList transactions={transactions} />
            <InsightsPanel insights={insights} loading={insightsLoading} />
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
