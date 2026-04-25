## 2024-05-20 - Information Exposure in API Error Messages
**Vulnerability:** API endpoints in `plaid.py` and `insights.py` returned raw exception details (`str(e)`) to the client inside HTTP 500 responses.
**Learning:** Returning raw exception details can leak sensitive information about the backend infrastructure, external service integrations, or internal system states, violating the principle of secure error handling.
**Prevention:** Catch raw exceptions, log them internally using `logger.exception()`, and return generic, safe error messages to clients while explicitly re-raising expected `HTTPException`s.
