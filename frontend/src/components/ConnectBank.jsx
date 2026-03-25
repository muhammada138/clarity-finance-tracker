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
    <div className="connect-bank">
      <h2>Connect your bank</h2>
      <p>Uses Plaid sandbox, no real account needed.</p>
      {error && <p className="error">{error}</p>}
      <button onClick={() => open()} disabled={!ready}>
        Connect Bank Account
      </button>
    </div>
  );
}

export default ConnectBank;
