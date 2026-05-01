## 2024-05-01 - AI Chat Accessibility
**Learning:** Asynchronous AI chat responses in InsightsPanel are not announced to screen readers by default. Adding `aria-live="polite"` to the chat container is a critical pattern for accessible AI interfaces. Also, standalone chat inputs need explicit `aria-label`s when lacking a visual `<label>`.
**Action:** Always add `aria-live` regions to dynamically updating content containers like AI chat logs and ensure all inputs have accessible labels.
