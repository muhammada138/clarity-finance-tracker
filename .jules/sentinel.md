<<<<<<< HEAD
## 2026-04-18 - Prevented Stack Trace and Internal State Leakage
**Vulnerability:** The FastAPI endpoints were raising `HTTPException`s that directly included `str(e)` in the `detail` field, which exposes raw internal exception details and stack traces to clients.
**Learning:** Internal server state details and full error representations should never be leaked via API responses, as they can reveal underlying system architecture or vulnerabilities to attackers.
**Prevention:** Always catch raw exceptions internally using the `logging` module to log `e` with `exc_info=True`, and return generic, safe error messages (e.g., 'An internal error occurred.') in HTTP 500 responses.
=======
## 2024-05-24 - Prevent Sensitive Info Leakage in Error Messages
**Vulnerability:** Fast API routes in `plaid.py` and `insights.py` were returning the raw exception string to the client via `detail=str(e)`.
**Learning:** Returning `str(e)` directly exposes raw error messages to the client which may contain internal stack traces, variable names, or secret keys.
**Prevention:** Catch generic exceptions and log them internally using `logging.getLogger().error()`. Return generic, safe strings for 500 error `detail` responses.
>>>>>>> security-info-leakage-fix-14412034690119570363
