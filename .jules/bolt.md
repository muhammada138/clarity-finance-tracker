## 2024-05-20 - Expensive Date Formatting in React Renders
**Learning:** `toLocaleDateString` is surprisingly slow and can bottleneck React renders if called on every render.
**Action:** Always memoize `toLocaleDateString` and similar `Intl` API calls with `useMemo` in React components to avoid re-evaluating them on every render.