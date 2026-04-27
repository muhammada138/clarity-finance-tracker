## 2024-06-25 - Sorting Optimization
**Learning:** Checking dynamic `key` inside a sorting comparator (e.g. `if (key === 'amount')`) causes the condition to be evaluated $O(N \log N)$ times. Additionally, calculating unnecessary loop aggregates inside a `useMemo` specifically designated for sort dependencies scales suboptimally.
**Action:** Hoist invariant condition checks out of the comparator function using separate sort loops for distinct property keys. Remove non-functional variable processing inside `useMemo`.
