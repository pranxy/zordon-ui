# ADR 0011: Scoped Theme Controller preferences

- Status: Accepted
- Date: 2026-09-18

## Decision

Publish `@pranxy/zordon-ui/theme-controller` with an explicitly applied boundary, per-boundary
injectable state and native checkbox/toggle, radio, select and button directives. Keep `ZdTheme`
unchanged as the minimal attribute foundation. Native controls supply keyboard semantics, so
Angular Aria and CDK are not needed for this component.

Theme registries are consumer-configured exact strings and validate choices without compiling or
inspecting CSS. System is a reserved preference resolved to configured light/dark theme names.
Host scope is the default; a document-root target is explicit and requires one owner. Nested scopes
are independent. Controls use Angular DI scope and never search ancestor DOM for mutable state.

Use one `data-theme` owner per boundary. Do not attach daisyUI's CSS-only `theme-controller` class:
its page-wide checked-input selectors can escape a nested scope. Compose ordinary daisyUI visual
classes via existing directives instead. Custom roots and portal forwarding remain governed by
the existing theme/overlay foundations.

Storage is optional and best effort. Browser initialization occurs after render/hydration; server
output uses deterministic configuration with a light fallback for system. Subscribe to real
cross-tab storage changes without echo writes and release media/storage listeners with the scope.
Restore a previous document attribute on destruction only when the current value remains owned.

## Consequences

Applications own compiled themes, labels, native radio names and document placement. Options are
captured once. Controls own checked/selected state and must not compete with Angular Forms or other
theme bindings. Read-only state and explicit setters expose changes with source metadata.

Native options serialize selected attributes for meaningful server HTML. A stored/system theme
can change after hydration, so no no-flash guarantee is made. Cookie/preboot initialization,
incremental hydration, delayed event replay, cross-engine and physical assistive-technology review
remain separate validation lanes. No dependency or budget changes are required.
