## 2024-05-24 - Prevent Sensitive Info Leakage in Error Messages
**Vulnerability:** Fast API routes in `plaid.py` and `insights.py` were returning the raw exception string to the client via `detail=str(e)`.
**Learning:** Returning `str(e)` directly exposes raw error messages to the client which may contain internal stack traces, variable names, or secret keys.
**Prevention:** Catch generic exceptions and log them internally using `logging.getLogger().error()`. Return generic, safe strings for 500 error `detail` responses.
