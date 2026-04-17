import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById("root");
  if (root) {
    // Clear root content
    root.innerHTML = '';

    // Create container
    const container = document.createElement("div");
    container.style.cssText = "padding: 20px; color: #f85149; background: #161b22; height: 100vh;";

    // Create title
    const title = document.createElement("h2");
    title.textContent = "App Crash Detected";

    // Create message element
    const msgElement = document.createElement("p");
    msgElement.textContent = message;

    // Create source element
    const sourceElement = document.createElement("small");
    sourceElement.textContent = `${source}:${lineno}`;

    // Append children
    container.appendChild(title);
    container.appendChild(msgElement);
    container.appendChild(sourceElement);

    // Append container to root
    root.appendChild(container);
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
