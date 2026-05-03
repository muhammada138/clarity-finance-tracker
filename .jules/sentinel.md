## 2026-05-03 - Missing Input Length Limits in Pydantic Models
**Vulnerability:** FastAPI endpoints accepting string inputs (like ChatRequest and ExchangeRequest) lacked explicit length restrictions, making the server susceptible to Denial of Service (DoS) attacks via oversized payloads that consume excessive memory or processing time.
**Learning:** Pydantic's default `str` type does not impose a maximum length limit. This is a common architectural gap where models implicitly trust input sizes.
**Prevention:** Always use `Field(..., max_length=X)` or annotated types with max limits for string attributes in request models, especially those processed by downstream services (like LLMs or external APIs).
