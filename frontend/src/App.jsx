import { useState, useMemo } from "react";
import ConnectBank from "./components/ConnectBank";
import TransactionList from "./components/TransactionList";
import Dashboard from "./components/Dashboard";
import InsightsPanel from "./components/InsightsPanel";
import ClarityLogo from "./components/ClarityLogo";
import { getInsights, disconnect } from "./services/api";
import "./App.css";

function App() {
  const [connected, setConnected] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState("");
  const [insightsLoading, setInsightsLoading] = useState(false);

  async function handleDisconnect() {
    await disconnect();
    setConnected(false);
    setTransactions([]);
    setInsights("");
  }

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

  const total = useMemo(
    () => transactions.filter((t) => t.category !== "income").reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [transactions]
  );

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.category === "income").reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [transactions]
  );

  const topCat = useMemo(() => {
    const totals = {};
    for (const t of transactions) {
      const c = t.category || "other";
      if (c === "income") continue;
      totals[c] = (totals[c] || 0) + Math.abs(t.amount);
    }
    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "--";
  }, [transactions]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app">
      <header>
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: "pointer" }}>
          <ClarityLogo />
          Clarity
        </div>
        {connected && (
          <div className="header-actions">
            <span className="badge">Connected</span>
            <button className="btn-ghost" onClick={handleDisconnect}>Switch account</button>
            <button className="btn-ghost btn-ghost-danger" onClick={handleDisconnect}>Log out</button>
          </div>
        )}
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
              <span className="stat-label">Income</span>
              <span className="stat-value stat-value-income">${totalIncome.toFixed(2)}</span>
              <span className="stat-sub">deposits & transfers</span>
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
