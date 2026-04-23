
## 2024-05-24 - Expensive Intl API Calls in Render
**Learning:** `Intl` API calls (like `new Date().toLocaleDateString()`) are surprisingly expensive inside React renders. Without memoization, recalculating this every render takes ~700ms for 1000 renders.
**Action:** Always wrap `toLocaleDateString` and similar `Intl` API calls in `useMemo` hooks, especially if their output only changes daily and the dependency array can be empty, to prevent significant performance degradation during component re-renders.
