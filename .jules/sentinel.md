## 2026-04-20 - Exception Handling Information Leakage

**Vulnerability:** Fast API exception handling (HTTPException) exposing raw error messages (`str(e)`) directly to the client in 500 error responses (`backend/app/routes/plaid.py` and `backend/app/routes/insights.py`).

**Learning:** Internal exceptions can leak sensitive system details like stack traces, variable values, or internal paths, giving attackers valuable information to craft targeted exploits.

**Prevention:** To prevent information leakage, backend API endpoints must log raw exceptions internally via the `logging` module and return generic, safe error messages (e.g., 'An internal error occurred. Please try again later.') in HTTP 500 responses rather than exposing `str(e)` to the client.
