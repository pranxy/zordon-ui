# Tabs accessibility review

NAV-09 · Updated 2026-09-20 · Automated implementation; manual sign-off pending.

The named tablist, tabs and panels compose Angular Aria. IDs connect controls and labels;
only the accepted panel is visible, inert is removed for active content, and disabled native
buttons cannot activate. Selected styling uses a border and font weight as well as theme colors.

Automated evidence in `e2e/tabs.spec.ts` and the SSR suite covers automatic Arrow activation,
manual focus/Enter separation, disabled skipping, rejected selection with unchanged content,
local RTL direction, native overflow, preserved/recreated input state, close/reorder focus,
keyboard order after reordering, query history, SSR relationships and axe scans. Unit coverage
also checks synthetic activation guards, empty/all-disabled collections, fallback IDs, deletion
neighbors, immutable order proposals, localization and invalid configuration. Visual baselines
cover box/border/lift, vertical orientation and long labels in light desktop/dark RTL mobile.

Manual checks still required:

- NVDA/JAWS/VoiceOver: names, selection vs focus after rejection, panel entry and mutation announcements.
- Keyboard-only: long/reordered lists, all-tabs-closed owner focus, manual activation and page scroll.
- Custom themes, Windows forced colors and low vision: selected border, focus, disabled distinction and contrast.
- 200%/400% zoom and long translations: vertical wrapping and horizontal scroll discoverability.
- Physical touch: native overflow gestures and close/reorder controls.

Applications must label each group, keep panel headings/forms meaningful, choose manual activation
for latent content, localize action callbacks and supply a focus destination when no tabs remain.
Firefox/WebKit, other Angular lanes, delayed replay and incremental hydration are unverified.
This evidence does not constitute manual WCAG sign-off; overall maturity remains 0/68 Done.
