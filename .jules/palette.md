## 2025-04-30 - Sortable Table Accessibility
**Learning:** Decorative sort arrows in custom table headers are read by screen readers as confusing text characters (e.g., "up arrow") if not hidden.
**Action:** Always add `aria-hidden="true"` to decorative span elements containing sort icons, and instead manage sorting state communication via `aria-sort` on the `<th>` and `aria-label` on the interacting button.
