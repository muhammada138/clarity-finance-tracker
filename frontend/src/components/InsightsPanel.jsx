import { useState } from "react";
import { askQuestion } from "../services/api";

function InsightsPanel({ insights, loading }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const response = await askQuestion(userMsg);
      setMessages((prev) => [...prev, { role: "ai", text: response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: `Error: ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="insights-panel">
      <h2>AI Insights</h2>
      {loading && <p className="muted">Analyzing your spending...</p>}
      {insights && <p className="insights-text">{insights}</p>}

      <h3>Ask about your spending</h3>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <span>{m.text}</span>
          </div>
        ))}
        {chatLoading && <div className="message ai muted">Thinking...</div>}
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="How much did I spend on food last week?"
          disabled={chatLoading}
        />
        <button type="submit" disabled={chatLoading || !question.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default InsightsPanel;
