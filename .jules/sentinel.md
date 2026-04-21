## 2024-04-21 - Fix Error Detail Leakage in API Responses
**Vulnerability:** Fast API endpoints were catching general exceptions and returning `str(e)` in 500 status code HTTPExceptions, leaking internal details.
**Learning:** Exception details must not be exposed to the user as they might contain stack traces, API keys, or database schemas.
**Prevention:** Ensure we catch generic errors, log them using `logging.getLogger(__name__).error(e)` internally, and return generic user-facing messages like "An internal server error occurred."
