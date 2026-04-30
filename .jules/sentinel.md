## 2026-04-18 - Prevented Stack Trace and Internal State Leakage
**Vulnerability:** The FastAPI endpoints were raising `HTTPException`s that directly included `str(e)` in the `detail` field, which exposes raw internal exception details and stack traces to clients.
**Learning:** Internal server state details and full error representations should never be leaked via API responses, as they can reveal underlying system architecture or vulnerabilities to attackers.
**Prevention:** Always catch raw exceptions internally using the `logging` module to log `e` with `exc_info=True`, and return generic, safe error messages (e.g., 'An internal error occurred.') in HTTP 500 responses.
