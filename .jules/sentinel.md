## 2024-05-24 - Information Leakage in API Error Responses
**Vulnerability:** Backend API endpoints expose raw exception details (`str(e)`) to the client in HTTP 500 responses. This can leak sensitive internal information (such as stack traces or internal logic) to potentially malicious users.
**Learning:** Returning raw exception strings directly in HTTP responses is a common anti-pattern that violates the principle of failing securely. It existed because catching broad exceptions and returning them is an easy way to debug during early development.
**Prevention:** Always log raw exceptions internally using a logging library, and return generic, safe error messages (e.g., 'An internal error occurred...') to the client in production APIs.
