## 2024-05-24 - Sorting Optimization with Schwartzian Transform
**Learning:** Using `sort` with expensive string operations like `.toLowerCase()` inside the comparison function causes $O(N \log N)$ transformations.
**Action:** Use a Schwartzian transform (map to values, sort, then map back to objects) to turn the transformations into an $O(N)$ operation before sorting.
