# Body scroll lock research

- **Question:** What is the smallest SSR-safe, nested, layout-stable body scroll-lock foundation
  for Zordon overlays without exposing CDK or taking ownership of consumer page styles?
- **Target:** `DAISYUI_ANGULAR_BUILD_PLAN.md` Phase 2 body scroll lock and scrollbar-gutter row.
- **Installed context:** Angular 21.2.19, Angular CDK 21.2.14, daisyUI 5.7.16.
- **Evidence bar:** accepted ADRs, installed CDK source/types, current browser standards, focused
  unit/integration tests, real-browser layout/scroll behavior, SSR and package evidence.

## Questions

1. Can CDK `BlockScrollStrategy` safely coordinate nested Zordon overlays and native dialogs?
2. Which document element and styles/classes should Zordon own and restore?
3. How should classic-scrollbar gutter width and overlay scrollbars be handled without layout shift?
4. What is the mobile/iOS, touch, overscroll, zoom, and visual-viewport boundary?
5. How should lock ownership compose with the private overlay handle and closing lifecycle?
6. What can be completed now versus requiring the first modal/drawer and packaged entry points?

## Sources and findings

- CDK 21.2.14 snapshots viewport scroll and root inline `left`/`top`, applies negative offsets,
  and adds `cdk-global-scrollblock`. Its injected CSS fixes the root with `overflow-y: scroll`,
  preserving classic-scrollbar space.
- Independent CDK block strategies do not compose: a second refuses to enable while the first owns
  the class, so disposing the first can unlock underneath the second. Zordon needs one underlying
  CDK owner with ref-counted, idempotent per-overlay leases held through visible closing.
- Consumer CSS owns `scrollbar-gutter`. Optional `html { scrollbar-gutter: stable; }` reserves a
  classic gutter but has no effect for overlay scrollbars. `both-edges` is a consumer design choice.
  Zordon must not calculate physical right padding, which fails for RTL/left scrollbars and existing
  compensation. CDK's `overflow-y: scroll` remains the lock-time fallback.
- Do not add global touch prevention or `touch-action: none`; modal content and pinch zoom must
  continue working. `overscroll-behavior` can contain a component's own scrolling region.
- Visual viewport, on-screen keyboard, custom scroll roots, cross-document frames, and multiple
  Angular apps are nonclaims. Physical iOS/Android and first-component hydration remain gates.
- Like the overlay stack, separately bundled secondary entries can duplicate the manager identity.
  Completion requires the same two-entry shared-identity decision; no hidden singleton is allowed.

## Primary references

- https://material.angular.dev/cdk/overlay/api
- https://www.w3.org/TR/css-overflow-3/#scrollbar-gutter-property
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-gutter
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior
- https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- https://angular.dev/reference/versions
- Installed source: `node_modules/@angular/cdk/fesm2022/_overlay-module-chunk.mjs`
