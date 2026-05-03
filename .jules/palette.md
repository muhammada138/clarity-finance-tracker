## 2026-05-03 - AI Chat Interface Accessibility
**Learning:** The AI chat interface in the Insights Panel lacks accessibility features for screen readers, such as announcing new messages and providing clear labels for the input field.
**Action:** Always include `aria-live="polite"` on dynamic message containers and explicit `aria-label`s on standalone chat inputs to ensure screen reader compatibility.
