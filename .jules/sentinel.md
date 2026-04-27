## 2024-05-24 - Exception details exposed in HTTP 500 responses
**Vulnerability:** The backend FastAPI endpoints were passing `str(e)` directly to `HTTPException(status_code=500, detail=str(e))`, which exposes internal stack traces or database schema details to clients when an unhandled exception occurs.
**Learning:** Unhandled exceptions often contain sensitive system information. Directly surfacing this text in API responses creates an information leakage vulnerability.
**Prevention:** Use `logger.exception("Contextual error message")` to log the full trace securely on the server, and return a generic, static message like "Internal server error" to the client.
