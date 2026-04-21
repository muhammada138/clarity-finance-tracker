## 2024-10-27 - Frontend Sorting Optimization (Schwartzian Transform)
**Learning:** React re-renders can trigger sorting operations on large lists. If the sorting function repeatedly applies expensive string operations like `.toLowerCase()` inside the `O(N log N)` `Array.prototype.sort` comparator, it becomes a performance bottleneck.
**Action:** Use the Schwartzian Transform (map-sort-map) to perform expensive string operations only once per item (`O(N)`) before sorting.
