# Live accessibility research

## Question

What is the smallest reusable foundation for live announcements and accessible description/error
association that reuses native HTML and supported Angular primitives without creating premature or
duplicate Zordon runtime APIs?

## Context and evidence bar

- Angular core 21.2.x and CDK 21.2.x; Angular 21–22 package policy.
- `@angular/aria` remains developer preview and must not leak through public Zordon contracts.
- Prefer native HTML, then `@angular/aria`, then Angular CDK, then narrowly justified custom code.
- Claims require installed-source behavior plus official accessibility guidance and behavior-sensitive
  unit/browser/SSR evidence where applicable.

## Search angles

- Installed `LiveAnnouncer`, `CdkAriaLive`, `AriaDescriber`, and any `@angular/aria` equivalents.
- WAI-ARIA live-region, `aria-describedby`, and `aria-errormessage` semantics.
- SSR/hydration, DOM ownership, duplicate announcements, cleanup, and consumer composition.
- Public API, dependency, tree-shaking, and Changeset impact.

## Findings

- `@angular/aria` is not installed and does not provide the application-specific announcement or
  description ownership required by this row. ADR 0008 leaves those responsibilities to native
  semantics and Zordon component policy.
- Native persistent regions and deterministic visible ID relationships are the smallest SSR-safe
  foundation. Existing `ZdIdGenerator` already covers library-owned hint/error IDs.
- Installed CDK 21.2.14 `LiveAnnouncer` eagerly appends a body element, uses a module-global ID,
  delays insertion by 100 ms, resolves on DOM insertion rather than speech, and gives overlapping
  callers latest-wins behavior. `clear()` does not cancel a pending insertion.
- `CdkAriaLive` forwards observed element text through `LiveAnnouncer`; it is not necessary for a
  local native status region.
- Installed CDK `AriaDescriber` creates a global hidden body container and generated IDs. It is a
  possible future tool for hidden imperative help, not the default for visible projected hints or
  errors and not an SSR relationship foundation.
- `role="status"` is the advisory default; `role="alert"` is reserved for urgent information; a
  labelled `role="log"` fits append-only history. One event must use one announcement path.
- `aria-errormessage` is active only with `aria-invalid="true"` and a visible pertinent error.
  Universally duplicating the error ID into `aria-describedby` can repeat speech and requires a
  component-specific compatibility decision.
- Automated DOM, focus, hydration, and axe evidence cannot prove spoken output. A real consuming
  component still needs NVDA and VoiceOver checks.
- No runtime/public package change is justified before the first concrete consumer; the row remains
  Partial and requires no Changeset.

## Sources

- Installed `node_modules/@angular/cdk/fesm2022/_a11y-module-chunk.mjs`, `LiveAnnouncer` and
  `CdkAriaLive` implementations.
- Installed `node_modules/@angular/cdk/fesm2022/a11y.mjs`, `AriaDescriber` implementation.
- <https://www.w3.org/TR/wai-aria-1.2/>
- <https://www.w3.org/WAI/WCAG22/Understanding/status-messages>
- <https://www.w3.org/WAI/WCAG22/Understanding/error-identification>
- <https://www.w3.org/WAI/tutorials/forms/notifications/>
- <https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/>
- <https://angular.dev/best-practices/a11y>
- <https://material.angular.dev/cdk/a11y/api>

## Open questions

- Which first concrete component establishes an imperative announcement ownership need.
- Exact duplicate/coalescing and cleanup policy for that consumer.
- Manual NVDA/VoiceOver results and minimum/latest Angular/CDK compatibility evidence.
