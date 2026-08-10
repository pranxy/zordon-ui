# Decomplex review: Phase 1 governance documentation

## Overall status

One maturity label can be removed to prevent overlapping states. The remaining document split and
checklists map directly to the four required governance outcomes and existing repository contracts.

## Review contract

| Axis                          | Selection                                                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mode                          | Audit                                                                                                                                                      |
| Target                        | `CONTRIBUTING.md`, `docs/contributing/*.md`, and their navigation/policy integration                                                                       |
| Authority / required behavior | Phase 1 plan item: contribution, public API review, deprecation, and component maturity documentation; accepted ADRs and build-plan Ready/Done definitions |
| Scope                         | Complexity trade-offs in the new governance documentation only; defects and plan compliance belong to the independent final review                         |
| Report                        | `.reviews/governance-documentation-decomplex.md`                                                                                                           |

## Coverage

### Inspected

- Contributor workflow, validation matrix, release intent, and pull-request readiness.
- Public API surface inventory, review record, and approval checklist.
- SemVer/deprecation lifecycle and migration/emergency rules.
- Maturity vocabulary, transition gates, matrix recording, and package-channel distinction.
- Root, architecture, release, plan, and policy-index navigation.

### Skipped or partial

- Runtime/component source and earlier Phase 1 infrastructure changes.
- External repository settings and future Phase 2 API-extraction implementation.

## Potential findings

### DEX-001 — Remove Experimental from the catalog component maturity ladder

- **Evidence:** Supported
- **Recommendation:** Act
- **Surface and location / authority:** `docs/contributing/component-maturity.md` and
  `CONTRIBUTING.md`; the requested policy governs the 68 catalog components, while the accepted
  experimental `signal-forms` boundary is an optional integration entry point rather than a catalog
  component.
- **Current-need evidence:** Planned already covers non-public component work, and Preview covers the
  first publishable evaluation state. The draft's Experimental catalog state remains internal and
  therefore has no distinct consumer contract.
- **Added burden:** Contributors must choose between two non-public labels with overlapping entry
  criteria, and reviewers must reconcile an extra transition that does not change publication or
  compatibility behavior.
- **Reachable practical impact:** Matrix Notes can diverge between Planned and Experimental without
  any observable delivery or release difference, weakening the label as a source of truth.
- **Smallest simpler alternative:** Use Planned → Preview → Stable → Deprecated → Removed for catalog
  components. Keep the Signal Forms integration explicitly experimental in its entry-point/ADR
  documentation rather than generalizing that term into component maturity.
- **Exception / boundary check:** Do not rename or imply stability for
  `@pranxy/zordon-ui/signal-forms`; its experimental integration status remains intact and separate.
- **Required behavior and simplification risk:** Preview/stable labels, promotion gates, SemVer
  boundaries, and all accepted catalog requirements remain. Risk is limited to losing an internal
  progress nuance already represented by the Spec/Build matrix columns.
- **Bounded next step or user question:** Delete the Experimental row and transition, remove it from
  the matrix Notes vocabulary, and add one sentence that optional integration maturity is governed
  separately.
- **Acceptance signal:** The component policy contains five non-overlapping states; `signal-forms`
  remains explicitly experimental in `docs/architecture/entry-points.md`.

## User-decision queue

No user decision is needed; DEX-001 preserves the accepted component and optional-integration
boundaries.

## Confirmed proportionate areas

- One root contributor workflow plus three focused policy documents avoids a monolithic guide while
  keeping each rule canonical.
- The API checklist is detailed because the accepted public contract includes DOM, accessibility,
  forms, styling, SSR, lifecycle, packaging, and TypeScript surfaces.
- Separate Done and maturity concepts prevent implementation completion from silently creating a
  compatibility commitment.
- The policy index and root/architecture links provide discoverability without adding a second
  catalog or documentation-app route system.

## Limitations

- The audit does not judge prose defects or factual correctness; those remain with final review.
