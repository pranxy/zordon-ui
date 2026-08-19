# Visual story matrix template

Copy this matrix into a component's documentation/specification before adding visual baselines. It
selects representative visual boundaries; it is not a demand to snapshot every input permutation or
a substitute for browser behavior and manual accessibility testing.

Use the [environment test fixtures](../testing/environment-test-fixtures.md) and the
[visual-regression policy](../testing/visual-regression.md). Every row must name a public state,
the smallest environment needed to expose it, a screenshot or semantic test location, and its
review decision. Delete only a genuinely inapplicable row and record why.

---

# [Component] visual story matrix

> **Component/maturity:** [name and label]  
> **Entry point:** `@pranxy/zordon-ui/[component]`  
> **Fixture/spec:** [path]  
> **Reviewed on:** YYYY-MM-DD  
> **daisyUI/Angular evidence:** [supported versions]

## Scope selection

Describe which differences are visually material for this component. Group visually identical API
values in one story only after recording why. A matrix is a reviewable choice of boundaries, not a
coverage percentage.

| Area                            | Material visual boundary | Chosen representative(s) | Omitted values and rationale |
| ------------------------------- | ------------------------ | ------------------------ | ---------------------------- |
| Variants / colors / sizes       |                          |                          |                              |
| States                          |                          |                          |                              |
| Anatomy / projected content     |                          |                          |                              |
| Responsive layout               |                          |                          |                              |
| Themes / consumer overrides     |                          |                          |                              |
| Direction / long localized text |                          |                          |                              |

## Required story rows

| ID  | Public scenario                        | Setup and environment                                | Expected visual boundary                                                   | Evidence          | Review status |
| --- | -------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- | ----------------- | ------------- |
| V01 | Default semantic use                   | Desktop, light, LTR, reduced motion                  | Base anatomy, typography, spacing, and native semantics are visibly intact | [screenshot/spec] |               |
| V02 | Most visually distinct variant or size | [exact input/class]                                  | Modifier changes only the documented visual contract                       | [screenshot/spec] |               |
| V03 | Meaningful non-default state           | [open/selected/invalid/pending/etc.]                 | State is legible without relying only on color or motion                   | [screenshot/spec] |               |
| V04 | Theme boundary                         | Dark plus relevant low/high-radius or consumer theme | Theme tokens, contrast boundaries, and geometry remain coherent            | [screenshot/spec] |               |
| V05 | Responsive boundary                    | Mobile only when layout/overflow/targets change      | Reading and interaction order remain usable                                | [screenshot/spec] |               |
| V06 | RTL and long localized content         | RTL with representative long string                  | Logical alignment/order does not clip or reverse incorrectly               | [screenshot/spec] |               |
| V07 | Documented consumer customization      | [part/class/`--zd-*`/style]                          | Stable or consumer-owned hook affects only its documented target           | [screenshot/spec] |               |

Add rows for a visual boundary that has no representative above: empty/populated content, error
message, icon-only accessible name, overlay position, nested scope, high-density data, print, or a
component-specific responsive arrangement. Mark only the inapplicable rows `N/A` and explain why.

## Conditions that are not ordinary screenshots

Do not treat a standard Chromium screenshot as sufficient proof for these conditions. Record the
corresponding semantic or manual evidence alongside the matrix.

| Condition                           | Required evidence                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Forced colors                       | Browser assertions for meaningful state/boundaries/focus plus a manual Windows high-contrast review when the component is released |
| Reduced motion                      | Reduced-motion screenshot for static presentation; real-browser behavior for any JS/lifecycle motion or live preference change     |
| Keyboard and focus                  | Browser keyboard/focus test plus the applicable manual accessibility review                                                        |
| Screen-reader output                | Manual assistive-technology review; DOM/axe mutation checks are supporting evidence only                                           |
| Touch, virtual keyboard, safe areas | Physical/device-cloud evidence when the published behavior depends on them                                                         |
| SSR and hydration                   | Server-response and hydrated-browser scenarios, not a client visual baseline                                                       |

## Authoring rules

- Render real public APIs from the intended entry point. A test-only fixture can provide data or a
  host boundary, but must not reach into component internals or simulate unshipped styles.
- Set viewport and media conditions before navigation, then set `data-theme`/`dir` after navigation.
  Use the internal environment helper; a raw document `dir` does not test live CDK `Dir` behavior.
- Give the story stable, user-representative content. Include the accessible name in the fixture;
  use `data-testid` only for fixture boundaries when a role/name locator is unsuitable.
- Wait for a component-owned ready state. Stabilize known non-semantic animation only in the visual
  fixture; never suppress a transition to conceal a loading, focus, or lifecycle bug.
- Use a focused element or an explicitly open/selected state when that is the subject. Do not create
  snapshots differing only by transient hover/caret/clock/random data unless the public contract
  owns that state and the fixture makes it deterministic.
- Name snapshots predictably: `[component]--[scenario]--[theme]--[viewport].png`. Keep snapshots
  beside the Playwright project convention under `e2e/__screenshots__/`.
- Review expected, actual, and diff images. Updating a baseline is a product/API review event, not a
  way to make a failing test pass.

## Completion record

| Check                                                                          | Evidence / link | Status |
| ------------------------------------------------------------------------------ | --------------- | ------ |
| Every material API/visual boundary is represented or explicitly grouped        |                 |        |
| Theme, responsive, RTL, and localized-content decisions are recorded           |                 |        |
| Forced-colors and reduced-motion obligations have the right non-snapshot proof |                 |        |
| Accessibility/browser/SSR evidence is linked rather than inferred from pixels  |                 |        |
| Snapshot baselines were manually reviewed                                      |                 |        |
| Component matrix Visual cell and documentation evidence agree                  |                 |        |

## Related records

- [Component documentation template](component-documentation-template.md)
- [Visual regression policy](../testing/visual-regression.md)
- [Browser integration policy](../testing/browser-integration.md)
- [Environment test fixtures](../testing/environment-test-fixtures.md)
- [Manual accessibility review template](../testing/manual-accessibility-review-template.md)
- [Safe customization contract](../foundations/safe-customization.md)
