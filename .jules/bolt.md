
## 2024-05-15 - React sort function re-evaluation overhead
**Learning:** In React components like `TransactionList.jsx`, a generic `sort` function that evaluates `if-else` branches for different keys *inside* the `.sort()` comparator adds a huge O(N log N) overhead, especially noticeable with large arrays. Additionally, calculating unused state values inside `useMemo` wastes cycles.
**Action:** Always hoist condition checks (like the sort key) outside the `.sort()` loop to branch once, and only calculate what is actually returned/used from `useMemo`.
