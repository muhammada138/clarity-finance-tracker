## 2024-05-02 - Chat Interface Accessibility
**Learning:** AI chat interfaces require `aria-live="polite"` on the message container to announce new messages to screen readers, and explicit `aria-label`s on standalone inputs.
**Action:** Always add `aria-live` to dynamic content regions like chat logs or activity feeds.
