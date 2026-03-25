const BASE = "/api";

export async function getLinkToken() {
  const res = await fetch(`${BASE}/plaid/link-token`, { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "failed to get link token");
  return data.link_token;
}

export async function exchangePublicToken(public_token) {
  const res = await fetch(`${BASE}/plaid/exchange-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_token }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "failed to exchange token");
  return data;
}

export async function getTransactions() {
  const res = await fetch(`${BASE}/plaid/transactions`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "failed to fetch transactions");
  return data.transactions;
}

export async function getInsights() {
  const res = await fetch(`${BASE}/insights`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "failed to fetch insights");
  return data;
}

export async function askQuestion(question) {
  const res = await fetch(`${BASE}/insights/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "failed to get response");
  return data.response;
}
