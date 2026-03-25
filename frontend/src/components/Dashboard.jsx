import React from "react";
import TransactionList from "./TransactionList";
import InsightsPanel from "./InsightsPanel";
import ConnectBank from "./ConnectBank";

// main view after the user is connected
function Dashboard() {
  return (
    <div>
      <ConnectBank />
      <TransactionList />
      <InsightsPanel />
    </div>
  );
}

export default Dashboard;
