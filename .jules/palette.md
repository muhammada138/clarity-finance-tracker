## 2024-05-24 - Accessible Sortable Tables
**Learning:** When making table headers sortable, simply adding an onClick to the header is not enough for screen readers. Using `aria-sort` on the `<th>`, adding descriptive `aria-label`s to the sorting `<button>`, and hiding decorative sorting arrows with `aria-hidden="true"` is crucial for keyboard and screen reader accessibility.
**Action:** Always apply `aria-sort` on `<th>`, `aria-label` on sort buttons, and `aria-hidden="true"` on visual indicators for sortable tables.
