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
      <div className="card-header" style={{ marginBottom: 0 }}>
        <span className="card-title">AI Insights</span>
      </div>

      {loading ? (
        <div className="insights-skeleton">
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "80%" }} />
        </div>
      ) : (
        insights && <p className="insights-text">{insights}</p>
      )}

      <div className="chat-section">
        <label htmlFor="ai-chat-input" className="section-label">Ask anything</label>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              {m.text}
            </div>
          ))}
          {chatLoading && (
            <div className="message ai thinking">Thinking...</div>
          )}
        </div>

        <form onSubmit={handleSend} className="chat-form">
          <input
            id="ai-chat-input"
            className="chat-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="How much did I spend on food?"
            disabled={chatLoading}
          />
          <button className="btn-send" type="submit" disabled={chatLoading || !question.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default InsightsPanel;
