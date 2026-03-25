import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { getLinkToken, exchangePublicToken } from "../services/api";

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
      <div className="connect-card">
        <div className="card-logo">
          <div className="logo-icon">F</div>
          Fintrack
        </div>
        <h1>
          Your finances,{" "}
          <span className="gradient-text">simplified</span>
        </h1>
        <p>
          Connect your bank account to get AI-powered insights on where your
          money is going.
        </p>
        {error && <div className="error-msg">{error}</div>}
        <button className="btn-primary" onClick={() => open()} disabled={!ready}>
          {ready ? "Connect Bank Account" : "Loading..."}
        </button>
        <p className="fine-print">Uses Plaid sandbox. No real credentials needed.</p>
      </div>
    </div>
  );
}

export default ConnectBank;
