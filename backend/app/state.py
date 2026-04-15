# shared in-memory state, good enough for sandbox/demo use
store = {
    "access_token": None,
    "transactions": None,  # cached after first fetch so chat doesn't re-fetch every message
    "insights": None,  # cached so reloading doesn't re-run expensive LLM queries
}
