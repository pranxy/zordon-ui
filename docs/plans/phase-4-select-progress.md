# Phase 4 Select progress

**Row:** INP-10 Select  
**Status:** Partial — automated evidence complete; manual accessibility review pending  
**Last updated:** 2026-09-08

| ID  | Requirement                                                      | Status   | Evidence                                                           |
| --- | ---------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| T01 | Record daisyUI candidates and native ownership                   | Verified | daisyUI Select inventory                                           |
| T02 | Package directive, types, API report, and type evidence          | Verified | `@pranxy/zordon-ui/select`                                         |
| T03 | Prove selection, options, keyboard, Forms, SSR, and axe behavior | Verified | Unit, Chromium, SSR, and axe suites                                |
| T04 | Record visual and manual accessibility boundaries                | Verified | Select visual matrix and accessibility review                      |
| T05 | Update plan and Conventional Commit handoff                      | Verified | `feat(select): add native select directive and automated evidence` |

Native select elements own single and multiple selection, option and optgroup semantics, disabled options, keyboard behavior, Forms, validity, and serialization. Consumers own labels, placeholders, option content, and option sources. Searchable, async, tagging, and virtualized choices remain a distinct Angular Aria Combobox/Listbox plus CDK Overlay component.
