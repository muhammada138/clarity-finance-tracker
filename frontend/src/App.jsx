import { useState, useMemo, useEffect } from "react";
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
  const [loadError, setLoadError] = useState(null);
  const [initializing, setInitializing] = useState(() => {
    try {
      return localStorage.getItem("connected") === "true";
    } catch (e) {
      return false;
    }
  });

  async function handleDisconnect() {
    await disconnect();
    localStorage.removeItem("connected");
    setConnected(false);
    setTransactions([]);
    setInsights("");
    setLoadError(null);
  }

  async function loadData() {
    setLoadError(null);
    setInsightsLoading(true);
    try {
      const data = await getInsights();
      setConnected(true);
      setTransactions(data.transactions || []);
      setInsights(data.insights || "");
      localStorage.setItem("connected", "true");
    } catch (e) {
      // if backend lost the token (e.g. restart), clear the flag
      if (e.message?.includes("no bank connected")) {
        localStorage.removeItem("connected");
      }
      setLoadError(e.message || "Something went wrong loading your data.");
    } finally {
      setInsightsLoading(false);
      setInitializing(false);
    }
  }

  // on first mount, resume session if backend still has the token
  useEffect(() => {
    if (localStorage.getItem("connected") === "true") {
      loadData();
    }
  }, []);

  async function handleConnected() {
    setInitializing(true);
    loadData();
  }

  const { total, totalIncome } = useMemo(() => {
    return (transactions || []).reduce(
      (acc, t) => {
        if (t) {
          if (t.category === "income") {
            acc.totalIncome -= t.amount || 0;
          } else {
            acc.total += t.amount || 0;
          }
        }
        return acc;
      },
      { total: 0, totalIncome: 0 }
    );
  }, [transactions]);

  const topCat = useMemo(() => {
    const totals = {};
    const txs = transactions || [];
    for (const t of txs) {
      if (!t) continue;
      const c = t.category || "other";
      if (c === "income") continue;
      totals[c] = (totals[c] || 0) + (t.amount || 0);
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
        <button
          className="logo"
          onClick={connected ? handleDisconnect : undefined}
          style={connected ? { cursor: "pointer" } : undefined}
          aria-label={connected ? "Disconnect bank account" : "Clarity Home"}
        >
          <ClarityLogo />
          Clarity
        </button>
        {connected && (
          <div className="header-actions">
            <span className="badge">Connected</span>
            <button className="btn-ghost" onClick={handleDisconnect}>Switch account</button>
            <button className="btn-ghost btn-ghost-danger" onClick={handleDisconnect}>Log out</button>
          </div>
        )}
      </header>

      {initializing ? (
        <div className="init-screen">
          <p className="init-label">Analyzing your transactions</p>
          <div className="dot-pulse">
            <span /><span /><span />
          </div>
        </div>
      ) : loadError && !connected ? (
        <div className="init-screen">
          <p className="init-error">{loadError}</p>
          <button className="btn-primary btn-retry" onClick={loadData}>Try again</button>
          <button className="btn-ghost btn-retry" onClick={() => { setLoadError(null); localStorage.removeItem("connected"); }}>Connect different account</button>
        </div>
      ) : !connected ? (
        <ConnectBank onConnected={handleConnected} />
      ) : loadError ? (
        <div className="init-screen">
          <p className="init-error">{loadError}</p>
          <button className="btn-primary btn-retry" onClick={loadData}>Try again</button>
        </div>
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
            <TransactionList transactions={transactions} loading={insightsLoading} />
            <InsightsPanel insights={insights} loading={insightsLoading} />
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
