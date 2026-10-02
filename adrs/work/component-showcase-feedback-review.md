# Component showcase plan review

Date: 2026-09-29. Scope: plan completeness, feasibility and meaningful validation against the user's 16 feedback areas. Independent reader inspected the plan, proposed ADR, relevant components/showcase code, installed Aria/Aura behavior, browser configurations, asset budget checker and representative tests. No implementation or test execution; external documentation was checked by the parent, not independently re-fetched.

## PR-01 — Non-root image delivery needed a concrete serving procedure

- Evidence: T6 originally named a base-href build and manual prefix inspection without a serving command. `projects/docs/src/server.ts` serves files at root; `playwright.docs.config.ts` starts that server. A base-href build alone does not prove prefix deployment works.
- Recommendation: launch a temporary Express server mounting the built directory at `/zordon-ui/`; open an actual component route, inspect prefixed requests and decoded images, stop the preview and restore the ordinary build.
- Parent disposition: **Accept**. T6 now contains an exact build/launch/check/cleanup procedure, distinguishing client prefix delivery from the separately tested SSR deployment. No permanent server abstraction is introduced.
- Closure: **Clear** after independent focused re-review. The reviewer confirmed actual prefix delivery, image response/decoding checks, cleanup and ordinary-build restoration; no material issue remains.

The reviewer otherwise found all feedback covered, browser-level layout/motion/dirty-form checks proportionate, and Status/Avatar choices grounded in existing APIs. Optional clarification about planned visual test titles was accepted: T12 now requires component names matching task filters and nonzero test discovery.

Parent verification: independently checked source-level Avatar defaults, FAB layout/hiding, Accordion hiding/content lifetime, Modal showcase guard, Aura classes/CSS, accepted ADRs, asset pipeline/configuration and named script availability. No runtime success is claimed.
