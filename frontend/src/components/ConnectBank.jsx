import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { getLinkToken, exchangePublicToken } from "../services/api";
import ClarityLogo from "./ClarityLogo";

const features = [
  {
    title: "Secure bank connection",
    desc: "Powered by Plaid, the same technology used by thousands of financial apps.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="8" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "AI-powered categorization",
    desc: "Every transaction is read and grouped into categories automatically.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.22 4.22l1.42 1.42M12.36 12.36l1.42 1.42M4.22 13.78l1.42-1.42M12.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="9" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Ask anything",
    desc: "Chat with your finances. Ask how much you spent, where, and when.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 4.5A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5v7a1.5 1.5 0 01-1.5 1.5H6L3 16V4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function ConnectBank({ onConnected }) {
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLinkToken()
      .then(setLinkToken)
      .catch((e) => setError(e.message));
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      try {
        await exchangePublicToken(public_token);
        onConnected();
      } catch (e) {
        setError(e.message);
      }
    },
  });

  return (
    <div className="connect-page">
      <div className="connect-inner">
        <div className="connect-card">
          <div className="card-logo">
            <ClarityLogo />
            Clarity
          </div>
          <h1>
            Spend smarter,{" "}
            <span className="gradient-text">see clearly</span>
          </h1>
          <p>
            Connect your bank and get an instant breakdown of where your money is
            going, powered by AI.
          </p>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn-primary" onClick={() => open()} disabled={!ready}>
            {ready ? "Connect Bank Account" : "Loading..."}
          </button>
          <p className="fine-print">Uses Plaid sandbox. No real credentials needed.</p>
        </div>

        <div className="connect-features">
          {features.map((f) => (
            <div className="connect-feature" key={f.title}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConnectBank;
