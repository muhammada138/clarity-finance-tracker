import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: #f85149; background: #161b22; height: 100vh;">
      <h2>App Crash Detected</h2>
      <p>${message}</p>
      <small>${source}:${lineno}</small>
    </div>`;
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
