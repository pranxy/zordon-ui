# Phase 6 Drawer progress

**Row:** LYT-02 Drawer

**Status:** Automated delivery verified; manual accessibility pending.

**Updated:** 2026-09-20

**Commit:** `feat(drawer): add responsive controlled navigation with shared modal behavior`

Drawer composes public Modal for browser overlays and uses native persistent/push layouts.
The milestone includes logical sides, controlled close reasons, lazy panel templates, viewport
widths and safe areas, responsive switching, Router close, dedicated touch/pen swipe closing,
nesting, focus and scroll ownership. Navbar's real Drawer pairing is exercised. ADR 0027 records
composition and the shared Modal pointer-focus, aria-modal and system-color fallback corrections.
The Dock fixture now enables visibility selection after hydration, preventing a native select
change from racing its Angular listener during the full browser suite.
Megamenu's visual scenario also waits for fixture hydration before opening its panel.

Verified evidence:

- Library unit suite: 378 tests across 85 files; all 82 implementation files have 100% statements,
  branches, functions and lines, with no new exclusions.
- Full Chromium browser suite: 197 tests. Full visual suite: 76 tests, including inspected
  light desktop and dark RTL mobile Drawer baselines. After the Megamenu readiness adjustment,
  its four browser tests and focused SSR test also pass.
- Production SSR/hydration: 28 tests, including no-JavaScript inline content, responsive transfer,
  modal accessibility and restored focus. Docs unit suite: 9 tests across 3 files.
- Full API reports, library/browser type checks and library/docs/SSR/browser lint pass.
- Library, docs and SSR production builds pass. Docs initial bundle is 405.70 kB and SSR is
  324.30 kB; existing warning thresholds are reported, with hard limits unchanged.
- Tooling: 82 tests. Package budgets: all 68 entry points pass; Drawer is 18.72 KiB raw and
  3.93 KiB gzip, below 40/12 KiB limits.
- Package publication dry-run completed successfully with 210 files; nothing was published.

Touched-file formatting and whitespace checks pass. Verification logs are in ignored
`tmp/drawer-*` files; reproducible checks are committed as source tests and tooling contracts.
Automated delivery is **65/68**.

Manual AT, physical touch/safe areas, custom contrast, forced colors, high zoom, Firefox/WebKit,
other Angular lanes, delayed replay and incremental hydration remain pending. Dependencies,
budgets and coverage thresholds remain unchanged; overall maturity is still 0/68 Done.

The next work is Phase 8 hardening/compatibility and the remaining manual release gates.
Product-deferred mockups are not reopened. No staging, commit or publish is performed here.
