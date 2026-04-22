## 2025-02-23 - Information Leakage in API Endpoints via Exceptions
**Vulnerability:** HTTP 500 error responses were returning the exact string representations of caught Python exceptions (`str(e)`) to API clients.
**Learning:** Returning `str(e)` directly inside `HTTPException` can expose sensitive internal state (such as stack traces, database states, API details) to end users when unexpected errors occur, acting as an information leakage vulnerability.
**Prevention:** API endpoints should always log the full exception internally (using `logger.exception(..., exc_info=True)`) and return generic, non-informative error messages to users, ensuring no internal implementation details are leaked during failures.
