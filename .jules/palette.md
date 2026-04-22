## 2024-04-22 - ARIA support for Sortable Table headers
**Learning:** Adding sortable table header accessibility requires setting `aria-sort` to 'ascending'|'descending'|'none' on the `<th>`, setting `aria-hidden="true"` to visual icons/arrows, and including an explicit `aria-label` detailing the sorting action on the button.
**Action:** When implementing sortable columns in React components, ensure that these ARIA attributes are updated dynamically based on the active sorted column and direction for screen readers.
