## 2024-05-04 - Denial of Service vulnerability in missing max length checks
**Vulnerability:** Models without Field(max_length=...) restrictions.
**Learning:** Pydantic strings should always be constrained by a max length.
**Prevention:** Always add Field(..., max_length=X) for user input strings in pydantic models.
