# Review: shared testing-harness foundation

## Scope

Bounded review of the Phase 2 shared test-harness and interaction-helper foundation, its plan/tracker
updates, documentation links, and packaged-library boundary. It is not a review of future component
harnesses.

## Evidence matrix

| Authority / requirement                                                          | Expected evidence                                                                            | Implementation evidence                                                                    | Validation                                                              | Status   |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | -------- |
| Build plan: no Angular Aria leakage from `@pranxy/zordon-ui/testing`             | A component-first contract; no premature public entry point                                  | Foundation guide sections “Purpose”, “Ownership”, and “Angular Aria composition procedure” | Installed package and dry-run tarball contain only the root entry point | Complete |
| ADR 0008: Angular Aria remains a private, pinned first-consumer dependency       | No install/export before the first integration spike                                         | Research record and guide preserve exact-version and public-signature restrictions         | `@angular/aria` absent; installed CDK 21.2.14 surface inspected         | Complete |
| Entry-point policy: testing entry must be intentional and production-unreachable | No empty placeholder; package acceptance gates documented                                    | Foundation guide “First public harness gate”                                               | Partial-Ivy build, budget, and dry-run pack passed                      | Complete |
| Plan row: shared harness and helper foundation                                   | Progress is truthfully Partial until a real harness proves the package/browser boundary      | Main plan row and tracker state Partial; deferred gate stated                              | Documentation build and formatting pass                                 | Complete |
| Test-quality policy                                                              | Harnesses do not replace browser/SSR/manual checks; helpers retain observable-event fidelity | Foundation guide “Required proof by layer” and browser guide link                          | Existing browser/SSR policy retained; no false runtime-test claim       | Complete |

## Verdicts

1. **Plan/baseline quality:** Adequate. The plan row previously implied an implementation before a
   component existed; the documented component-first gate resolves that ambiguity without changing
   the intended future outcome.
2. **Implementation compliance:** Complete for the documented foundation and Partial for the original
   runtime outcome by design. No empty entry point, harness base, helper, or Angular Aria dependency
   is claimed as shipped.
3. **Implementation quality beyond the baseline:** Clear. The guide prevents common accidental API
   commitments, including CSS-selector helpers, leaked upstream harness types, TestBed-only overlay
   lookup, and unstable timing wrappers.
4. **Test and validation quality:** Clear for this documentation/package-boundary tranche. Formatting,
   docs build, library build, bundle budget, dry-run tarball, and diff hygiene passed. No harness
   behavior test is possible or claimed before a real component exists.

## Result

**Clear.** No material finding. Independent review was unavailable under the active coordination
restriction; this is a parent-owned, read-only plan-backed review.
