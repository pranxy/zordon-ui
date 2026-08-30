# Phase 3 Aura specification progress

**Row:** DSP-03 Aura  
**Status:** In progress  
**Last updated:** 2026-08-30

Template loaded from: `implement-plan/assets/progress-tracker-template.md`

| ID  | Requirement                                                                | Deps    | Status   | Acceptance check                                                                  | Evidence                                                  |
| --- | -------------------------------------------------------------------------- | ------- | -------- | --------------------------------------------------------------------------------- | --------------------------------------------------------- |
| T01 | Record exact daisyUI Aura candidates, CSS behavior, and internal variables | —       | Verified | Public candidates and customization boundaries are explicit                       | `.progress/aura-specification-research.md`                |
| T02 | Define the native directive API and semantic/composition boundary          | T01     | Verified | No wrapper semantics, interaction, color system, or animation service is invented | `docs/components/aura.md`                                 |
| T03 | Define the reduced-motion, SSR, customization, and evidence contract       | T01–T02 | Verified | Upstream slowing is rejected for a scoped static reduced-motion path              | `docs/components/aura.md`                                 |
| T04 | Approve the DSP-03 specification cell                                      | T01–T03 | Verified | Master matrix records the implementation-ready specification                      | `DAISYUI_ANGULAR_BUILD_PLAN.md`                           |
| T05 | Package the Aura directive and scoped motion policy                        | T04     | Verified | Public entry point builds with the reviewed surface and a static `reduce` path    | Unit coverage, type, API, bundle, and tarball checks pass |
| T06 | Add browser, SSR/hydration, axe, and visual evidence                       | T05     | Pending  | Native semantics and motion policy survive supported render paths                 | —                                                         |

No subagent was used: the shared workspace remains serialized by instruction.

## Next

- Add browser, SSR/hydration, axe, and visual evidence for native wrapper semantics and motion preference changes.

## Loop log

| ID  | Owner  | Checks                                                                                                           | Review                                                                              |
| --- | ------ | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| T05 | Parent | `test:lib:coverage`, `test:lib:types`, `lint:lib`, `build:lib`, `check:api`, tooling, bundle, and tarball checks | The built manifest exports `./aura/aura-motion.css` and marks it as side-effectful. |
