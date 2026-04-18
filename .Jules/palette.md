## 2024-04-18 - Missing semantic labels in InsightsPanel
**Learning:** Found that the custom chat input in InsightsPanel used a generic `<span>` for its label text instead of a semantic `<label>` element, which negatively impacts screen reader accessibility and makes the form less usable for keyboard users (can't click label to focus input).
**Action:** When creating custom forms or chat inputs, always ensure a `<label>` element is used with an `htmlFor` attribute that matches the `id` of the target `<input>` field.
