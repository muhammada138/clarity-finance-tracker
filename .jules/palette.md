## 2024-05-04 - AI Chat Interface Accessibility
**Learning:** Dynamic chat interfaces and AI loading states are completely invisible to screen readers without ARIA live regions. Standalone chat inputs also fail accessibility audits without explicit labels or aria-labels.
**Action:** Always add `aria-live="polite"` to chat message containers and ensure text inputs have explicit `aria-label`s when visual labels are omitted for design reasons.
