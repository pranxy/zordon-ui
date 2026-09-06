# Phase 3 Code Mockup specification progress

**Row:** MCK-02 Code Mockup  
**Status:** Implemented  
**Last updated:** 2026-09-06

Template loaded from: `implement-plan/assets/progress-tracker-template.md`.

| ID  | Requirement                                                                | Status      | Evidence                                           |
| --- | -------------------------------------------------------------------------- | ----------- | -------------------------------------------------- |
| T01 | Record the daisyUI Code Mockup container and `pre[data-prefix]` candidates | Verified    | `node_modules/daisyui/components/mockup/object.js` |
| T02 | Package native styling directive and preserve native code semantics        | Verified    | `projects/components/code-mockup/`                 |
| T03 | Document consumer ownership of highlighting, actions, and language labels  | Verified    | `docs/components/code-mockup.md`                   |
| T04 | Add unit, type, browser, SSR, axe, API, visual, and format evidence        | Verified    | 206 unit tests; 80 Chromium tests; 3 SSR; 38 visuals |

## Decisions / deviations

| Item                | Need / change                                                    | Evidence                                                    | Status   |
| ------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- | -------- |
| Syntax highlighting | Keep it consumer-owned to avoid a forced highlighter dependency. | MCK-02 plan note and daisyUI CSS only styles native markup. | Accepted |
