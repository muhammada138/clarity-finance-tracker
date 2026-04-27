## 2025-02-23 - Accessible Sortable Table Headers
**Learning:** The `TransactionList` table headers used visual arrows for sorting direction but lacked semantic meaning for screen readers. This is a common pattern in the application where visual indicators are present but ARIA attributes are missing.
**Action:** When implementing sortable tables, apply `aria-sort` to the `<th>` element, add explicit `aria-label`s to the sorting buttons indicating the next sort action, and use `aria-hidden="true"` on decorative visual sort indicators.
