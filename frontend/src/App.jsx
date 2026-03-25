import { useState } from "react";
import ConnectBank from "./components/ConnectBank";
import TransactionList from "./components/TransactionList";
import Dashboard from "./components/Dashboard";
import InsightsPanel from "./components/InsightsPanel";
import { getInsights } from "./services/api";
import "./App.css";

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

  return (
    <div className="app">
      <header>
        <h1>Finance Tracker</h1>
        {connected && <span className="badge">Connected</span>}
      </header>

      {!connected ? (
        <ConnectBank onConnected={handleConnected} />
      ) : (
        <main>
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
