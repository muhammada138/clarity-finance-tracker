## 2024-05-01 - Fail Securely on Missing Secrets
**Vulnerability:** Missing environment variables for sensitive API keys resulted in fallback to dummy values or `None`, masking misconfigurations and potentially causing the application to fail open or send invalid credentials over the network.
**Learning:** Using `os.getenv` with dummy fallbacks for mandatory secrets prevents the application from failing fast. In Python, `os.environ['KEY']` raises an immediate `KeyError` at module-load time, which securely halts execution before any potential state corruption or network requests.
**Prevention:** Always use strict `os.environ` lookups for mandatory configuration parameters and API keys. Reserve `os.getenv` strictly for optional configuration with safe, non-sensitive defaults.
