
## 2024-05-24 - Array.prototype.sort Comparator Branch Hoisting
**Learning:** In Javascript engines like V8, conditionals inside `Array.prototype.sort` comparators are evaluated $O(N \log N)$ times. While JIT can sometimes optimize small loop bodies, complex branching (e.g., checking the sort key to determine sorting logic dynamically on every comparison) can cause measurable overhead for large lists.
**Action:** Always hoist logic that determines *how* to sort (like which key to sort by) outside of the `.sort()` function call. Evaluate the condition once, and pass a dedicated, specific comparator function to `.sort()`.
