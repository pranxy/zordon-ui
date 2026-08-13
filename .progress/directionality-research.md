# Directionality research

- **Question:** Define and implement the Phase 2 directionality and logical-placement foundation.
- **Target:** Angular 21–22, installed Angular 21.2.19 and CDK 21.2.14.
- **Evidence bar:** Accepted ADRs, installed source/types, official Angular/CDK documentation, behavior-sensitive tests, SSR and package inspection.
- **Constraints:** Preserve logical public vocabulary, avoid duplicate bidi machinery, keep the private overlay foundation out of the published entry point, and record unproven component/browser paths as future gates.

## Questions

- Which direction source owns component and portaled-overlay behavior?
- How do CDK connected/global strategies consume direction, and do they update live?
- What is the contract for nested `dir`, application overrides, SSR, and hydration?
- Which physical placements remain legitimate, and what is out of scope for vertical writing modes?
- Can this row be complete without a public Zordon direction service?

## Sources and findings

- Installed versions are Angular core 21.2.19 and CDK 21.2.14.
- Accepted ADR 0007 requires CDK `Directionality` and logical start/end public placement.
- CDK root `Directionality` snapshots `body.dir || html.dir || ltr` at construction; it does not
  observe later raw DOM mutations. CDK `Dir` provides the nearest source and emits input changes.
- CDK Overlay fills an omitted direction with the root source's current value as a string. The
  current private coordinator therefore ignored nested direction and never handled live changes.
- `OverlayRef.setDirection` updates its config and host attribute but does not reposition. Connected
  positioning reads `getDirection()`, so live changes require `setDirection` followed by
  `updatePosition`.
- Installed global positioning checks `config.direction === 'rtl'`; passing a `Directionality`
  object despite the declaration's broad type makes logical global placement behave as LTR.
- Connected/global start/end already map through CDK. Pre-flipping would be incorrect. Numeric x
  offsets remain physical and are not sign-inverted.
- CSS writing modes define axes beyond direction. CDK Overlay's mapping is horizontal x/y, so v1
  must explicitly limit this foundation to `horizontal-tb`.

Primary sources:

- https://material.angular.dev/cdk/bidi/overview
- https://material.angular.dev/cdk/bidi/api
- https://material.angular.dev/cdk/overlay/api
- https://github.com/angular/components/blob/main/src/cdk/bidi/directionality.ts
- https://github.com/angular/components/blob/main/src/cdk/bidi/dir.ts
- https://github.com/angular/components/blob/main/src/cdk/overlay/overlay-ref.ts
- https://www.w3.org/TR/css-writing-modes-4/
- https://www.w3.org/TR/css-logical-1/

## Decisions

- Keep CDK `Directionality` as the only direction state; add no public Zordon service/directive.
- Resolve each overlay source as explicit internal override, content injector, VCR injector, root.
- Pass a literal initial direction, propagate the same source into the portal injector, and make
  distinct live updates plus repositioning handle-owned.
- Keep the plan row Partial until the first published component proves browser, hydration, and
  packaging integration. Private/unpacked source requires no Changeset.
