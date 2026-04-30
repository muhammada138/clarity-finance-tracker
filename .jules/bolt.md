## 2024-04-30 - Unused O(N) calculation in React useMemo
**Learning:** The `TransactionList` component was performing a redundant $O(N)$ loop to calculate `catCounts` inside a `useMemo` block, which was then passed to a sort function that completely ignored it. This micro-inefficiency doubled the execution time of the memoized function.
**Action:** Always verify if the data produced by expensive loops inside `useMemo` or effects is actually utilized downstream. If not, remove the calculation entirely.
