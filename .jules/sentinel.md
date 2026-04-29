## 2024-04-29 - Prevent Information Leakage in Error Responses
**Vulnerability:** The application was exposing raw exception messages (`str(e)`) in HTTP 500 error responses, which can leak sensitive internal details (such as stack traces, database queries, or external service errors) to the client.
**Learning:** Always catch exceptions, log the raw exception details internally using `logger.exception()`, and return a generic, safe error message to the user for 500 errors.
**Prevention:** Ensure that `raise HTTPException(status_code=500, detail="...")` only contains generic messages like "Internal server error" and never `str(e)`.
