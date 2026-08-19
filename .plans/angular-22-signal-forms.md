# Angular 22 Signal Forms support plan

> **Status:** Blocked on the first published native and composite form-control APIs

## Outcome and boundaries

- **Problem and target:** Angular 22 makes `FormField`, `FormValueControl`, and
  `FormCheckboxControl` stable, while Zordon's v1 core must remain consumable by Angular 21 and use
  the stable CVA/Reactive Forms contract. Establish the Angular 22 support path without leaking
  Angular 22-only types into core or publishing an adapter that duplicates Angular's built-in
  compatibility.
- **In scope:** Angular 22 consumer compatibility for one native Zordon directive and one composite
  Zordon control; Signal Forms value/state/validation/accessibility behavior; SSR/hydration; an
  isolated Angular 22 CI lane; package and bundle verification; a decision on whether
  `@pranxy/zordon-ui/signal-forms` has any justified public API.
- **Out of scope:** Replacing v1 Reactive Forms/CVA support, raising the package-wide Angular floor
  to 22, implementing both CVA and `FormValueControl` on the same component, translating consumer
  validation messages, or publishing an empty secondary entry point.
- **Approach:** First prove Angular 22's direct `[formField]` paths. Native elements already bind
  directly, and Angular 22 supports CVA controls as a compatibility path. Publish a dedicated
  `signal-forms` entry only after a concrete component test exposes a capability gap **and** a
  focused API/package decision approves that ownership route. A gap alone does not authorize a new
  same-package export.

## Key files, evidence, and decisions

| File or source                                                                                  | Why it matters                                                                         | Decision or plan impact                                                           |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `docs/architecture/0001-platform-support.md`                                                    | Keeps the v1 build on Angular 21 with Angular 21–22 consumers                          | Angular 22 Signal Forms cannot enter the primary or component-core public surface |
| `docs/architecture/0005-forms.md`                                                               | Establishes CVA/Reactive Forms core and optional Signal Forms isolation                | Amend only after the Angular 22 compatibility gate proves the final route         |
| `docs/architecture/entry-points.md`                                                             | Reserves but does not create `./signal-forms`                                          | No empty export; a demonstrated gap still requires a focused API/package decision |
| `docs/foundations/form-control-behavior.md`                                                     | Defines value, touch, disabled, validation, error-ID, and SSR ownership                | Signal Forms must preserve the same observable component behavior                 |
| `bundle-size-budgets.json`                                                                      | Already reserves a 40 KiB raw / 12 KiB gzip ceiling                                    | Keep the override dormant unless the generated export exists                      |
| `.github/workflows/ci.yml`                                                                      | Currently tests only the installed Angular 21 line                                     | Add an isolated Angular 22 consumer lane before claiming support                  |
| [Angular custom Signal Forms controls](https://angular.dev/guide/forms/signals/custom-controls) | Defines native, `FormValueControl`, and checkbox-control contracts                     | Prefer the framework contract over a Zordon form-state adapter                    |
| [Angular `FormField` API](https://angular.dev/api/forms/signals/FormField)                      | Stable since v22 and explicitly supports native, Signal Forms, and legacy CVA controls | Direct binding is the first acceptance route                                      |
| [Angular Signal Forms migration](https://angular.dev/guide/forms/signals/migration)             | Warns against implementing CVA and Signal Forms control interfaces together            | Any signal-native alternative must be a distinct declaration, not dual ownership  |

- **Open gate:** The first native directive and first composite CVA do not yet exist. Their concrete
  value, focus, disabled, validation, serialization, and packaging contracts determine whether
  direct Angular 22 binding is sufficient. Do not implement or publish `./signal-forms` before this
  gate can be exercised.

## Tasks

#### SF22-01 — Create an isolated Angular 22 consumer lane

- **Change:**
  - Add a minimal Angular 22 compatibility application with its own pinned manifest/lock so the
    Angular 21 build workspace and lockfile remain authoritative.
  - Build and pack the Angular-21-built library, then install that exact tarball into the fixture;
    prohibit source aliases or workspace resolution to `projects/components`.
  - Add exact root commands: `prepare:angular-22:signal-forms`,
    `typecheck:angular-22:signal-forms`, `lint:angular-22:signal-forms`,
    `test:angular-22:signal-forms`, `test:angular-22:signal-forms:browser`, and
    `test:angular-22:signal-forms:ssr`.
  - Add a CI job that runs the compatibility commands on the supported Node line.
- **Starts at:** `.github/workflows/ci.yml`, `package.json`, planned
  `compat/angular-22-signal-forms/package.json`,
  `compat/angular-22-signal-forms/playwright.config.ts`, and
  `compat/angular-22-signal-forms/src/`.
- **Depends on:** None.
- **Tests:** planned `compat/angular-22-signal-forms/src/**/*.spec.ts` (Angular integration) protects
  package consumption, compiler compatibility, and Angular 22 runtime behavior rather than merely
  compiling repository source against the installed Angular 21 packages.
- **Verify:**
  - Run `npm run build:lib`; expect the Angular 21 partial-Ivy package build to pass.
  - Run `npm run prepare:angular-22:signal-forms`; expect one exact library tarball to be installed
    in the isolated fixture with no source/workspace link and no root-lockfile change.
  - Run `npm run typecheck:angular-22:signal-forms`, `npm run lint:angular-22:signal-forms`, and
    `npm run test:angular-22:signal-forms`; expect the pinned Angular 22 consumer checks to pass.
- **Risk/recovery:** A second lockfile is deliberate compatibility evidence. Keep the fixture
  minimal and regenerate it only during an approved Angular 22 patch update.

#### SF22-02 — Prove direct Signal Forms binding with real controls

- **Change:**
  - Bind the first native Zordon form directive to a Signal Forms field through Angular's native
    `[formField]` path without adding a Zordon accessor.
  - Bind the first composite Zordon CVA through Angular 22's documented CVA compatibility path.
  - Prove values, programmatic reset, touched/dirty, disabled/readonly, required constraints,
    pending/invalid errors, dynamic array recreation, focus, and destruction for both paths.
  - Verify the CVA path does not depend on a complete Reactive Forms `NgControl`; Angular 22 exposes
    only a limited compatibility object to Signal Forms bindings.
  - Verify status styling through Angular's opt-in `NG_STATUS_CLASSES` feature when the component
    specification needs legacy `ng-*` classes; do not recreate those classes in Zordon.
  - Record whether direct binding leaves any observable component capability unsupported.
- **Starts at:** the future native and composite component entry points,
  `docs/foundations/form-control-behavior.md`, and planned Angular 22 compatibility specs.
- **Depends on:** SF22-01 and the first published native directive plus composite CVA.
- **Tests:** planned Angular 22 fixture unit/browser suites protect consumer-observable field state,
  user interaction, callback ownership, reset, and cleanup. Add mutation-sensitive cases that fail
  if a component implements a second value owner or reports touch during internal focus moves.
- **Verify:**
  - Run `npm run test:angular-22:signal-forms`; expect native and composite scenarios to pass with
    direct `[formField]` binding and no `@pranxy/zordon-ui/signal-forms` import.
  - Run `npm run test:lib:coverage`; expect the Angular 21 CVA/native suites to remain at 100%.
- **Risk/recovery:** Angular documents CVA support as a compatibility path, not the preferred new
  custom-control API. Keep it only if behavior and bundle evidence meet the same component contract.

#### SF22-03 — Close the entry-point decision gate

- **Change:**
  - If SF22-02 is complete with no capability gap, document direct Angular 22 usage and remove the
    planned `signal-forms` entry-point reservation/budget override; do not publish redundant code.
  - If a material gap remains, stop and approve a focused API amendment describing the exact
    signal-native declaration or companion schema required for that component.
  - Decide package ownership before implementation: defer until the package-wide floor becomes 22,
    create a separately versioned optional package, or retain the same-package subpath only if its
    exact API is tested and supportable on both the Angular 21 experimental and Angular 22 stable
    declarations. npm cannot express an Angular floor for one export subpath.
  - Never implement both CVA and `FormValueControl`/`FormCheckboxControl` on one declaration, stack
    competing control directives, or wrap/re-export Angular's own Signal Forms compatibility APIs.
  - Keep schema-provided validation and messages consumer-owned; export a companion schema only for
    a concrete intrinsic component constraint.
- **Starts at:** `docs/architecture/0005-forms.md`, `docs/architecture/entry-points.md`,
  `bundle-size-budgets.json`; conditionally planned `projects/components/signal-forms/`.
- **Depends on:** SF22-02.
- **Tests:** the SF22-02 behavior matrix is the decision oracle. If an entry point is approved, add
  exact public type tests and generated-export/package tests that reject imports from core and reject
  dual CVA/Signal Forms ownership.
- **Verify:**
  - Run `npm run build:lib && npm run check:bundle-size`; expect either no `./signal-forms` export or
    one independently budgeted export with no reachability from `.` or component-core FESMs.
  - Run `npm run release:package-dry-run`; expect only intentional entry-point files and declarations.
- **Risk/recovery:** Do not solve a missing API with a generic state-sync service, effects, or a
  wrapper around every control. Re-plan from the smallest observed gap; no package route is
  pre-approved by this plan.

#### SF22-04 — Verify accessibility, SSR, and hydration

- **Change:**
  - Exercise Signal Forms error eligibility and deterministic hint/error relationships under the
    existing consumer-first IDREF contract.
  - Prove server value/state/IDs equal hydrated state, with no premature touched/submitted errors or
    duplicate replayed changes.
  - Verify disabled, readonly, pending, reset, dynamic rows, focus, and accessible error cleanup in a
    real browser; retain manual screen-reader checks for spoken errors.
  - Record NVDA with Chrome or Firefox and VoiceOver with Safari results for the exact error,
    pending, reset, and focus scenarios before claiming accessible support.
- **Starts at:** planned `compat/angular-22-signal-forms/e2e/signal-forms.spec.ts`,
  `compat/angular-22-signal-forms/e2e/ssr-hydration.spec.ts`,
  `compat/angular-22-signal-forms/playwright.config.ts`, and
  `docs/testing/manual-accessibility-reviews/angular-22-signal-forms.md`.
- **Depends on:** SF22-02 and, when applicable, SF22-03.
- **Tests:** Angular 22 SSR/Playwright scenarios protect deterministic rendering, event replay,
  accessible relationships, focus, and state cleanup. Axe remains structural evidence, not proof of
  spoken output.
- **Verify:**
  - Run `npm run test:angular-22:signal-forms:ssr`; expect the exact packed consumer's consecutive
    server responses to match, hydration to emit no errors, and one replayed/post-hydration
    interaction to update once.
  - Run `npm run test:angular-22:signal-forms:browser`; expect the exact packed consumer's complete
    state matrix and axe scan to pass.
  - Run `npm run typecheck:browser`, `npm run lint:browser`, `npm run test:browser`,
    `npm run lint:ssr`, and `npm run test:ssr`; expect the Angular 21 root browser/SSR regressions to
    remain green.
  - Inspect the recorded manual review; expect named browser/screen-reader versions, scenarios,
    observations, and no unresolved material failure.

#### SF22-05 — Publish and document the supported route

- **Change:**
  - Document imports, native versus composite examples, schema ownership, limitations, migration
    from Reactive Forms, and the exact Angular version/maturity boundary.
  - Keep the package-wide peer range `>=21 <23` for the direct-binding route. Do not publish an
    Angular-22-only subpath under that peer promise unless SF22-03 first approves a truthful package
    ownership/versioning model.
  - Apply API/SemVer review to either supported route. Add a Changeset for the new documented and
    tested Signal Forms support capability unless maintainers explicitly record that the change is
    only a correction to an already-promised capability.
  - Update the master plan only after the chosen route and evidence are complete.
- **Starts at:** `README.md`, `docs/guides/`, `docs/contributing/component-maturity.md`,
  `projects/components/package.json`, and `DAISYUI_ANGULAR_BUILD_PLAN.md`.
- **Depends on:** SF22-03–SF22-04.
- **Tests:** documentation examples compile inside the Angular 22 fixture; package API/budget/dry-run
  gates protect import accuracy and prevent Angular 22 Signal Forms code from reaching core.
- **Verify:**
  - Run `npm run format:check`, `npm run lint:lib`, `npm run test:lib:coverage`,
    `npm run test:lib:types`, `npm run build:lib`, `npm run check:bundle-size`,
    `npm run test:tooling`, `npm run release:package-dry-run`, and the Angular 22 compatibility suite;
    expect every gate to pass.
  - Inspect the packed manifest/FESMs/declarations; expect the documented route to match the actual
    exports and no Signal Forms imports in unrelated entry points.
- **Risk/recovery:** A new public entry point is a minor feature and requires a Changeset. Direct
  binding can still broaden the package's documented support promise, so no-Changeset treatment
  requires an explicit maintainer classification as a correction rather than an inferred exception.

## Final acceptance

- **Checks:** Angular 21 core tests remain green; the packed Angular 21 library is consumed and
  tested by an isolated Angular 22 app; native and composite Signal Forms behavior, SSR/hydration,
  browser/a11y, types, bundle, package, and documentation gates pass.
- **End state:** Angular 22 consumers have one documented, tested Signal Forms route. Core remains
  Angular 21-compatible. `./signal-forms` exists only if concrete evidence proves it adds behavior
  Angular's direct native/CVA paths cannot provide and a focused API/package decision approves that
  export and versioning model.
- **Deferrals or blockers:** Implementation is blocked until the first real native directive and
  composite CVA exist. If direct binding exposes a gap, package ownership must be decided before any
  Angular-22-only public API is authored. Angular 23, replacing the v1 CVA core, and broad component
  rollout remain separate compatibility decisions.
