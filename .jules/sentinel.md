## 2026-04-30 - Fix error message information leakage
**Vulnerability:** API endpoints caught general exceptions and passed `str(e)` directly into the HTTP 500 response details, potentially exposing sensitive internal state, stack traces, or third-party API details.
**Learning:** Using `str(e)` in error responses is a common anti-pattern that violates the principle of "failing securely." Internal errors should be logged internally, while clients receive generic error messages.
**Prevention:** Always log exceptions internally (e.g., using `logger.exception()`) and return generic messages like "An internal server error occurred" for 500 errors.
