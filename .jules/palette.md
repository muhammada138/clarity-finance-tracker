## 2024-05-18 - Accessible Sortable Tables in TransactionList
**Learning:** Adding basic accessibility hints to custom sortable tables significantly improves screen reader support. It involves adding `aria-sort="ascending|descending|none"` to the column headers (`<th>`), explicitly describing what will happen on click with an `aria-label` on the sort button, and hiding decorative components like arrow spans using `aria-hidden="true"`.
**Action:** When creating or editing custom sortable tables, always apply these ARIA roles to ensure accessibility.
