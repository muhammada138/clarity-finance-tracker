## 2025-02-28 - Optimize React App.jsx transaction calculations
**Learning:** Found separate iterations for `total`/`totalIncome` and `topCat` that could be combined to reduce O(2N) to O(N) operations inside `useMemo`.
**Action:** Always look for opportunities to fuse loops across independent calculations that process the same array data, especially inside expensive hooks like `useMemo`.
