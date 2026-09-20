# Drawer accessibility review

LYT-02 · 2026-09-20 · Automated evidence complete; manual sign-off pending.

Modal Drawer uses a named dialog with aria-modal, CDK focus trapping, inert/aria-hidden
background, shared scroll locking and opener restoration. Inline panels are named complementary
landmarks. Projected main content and navigation retain the owner's semantic structure. Navbar
Toggle provides controlled expanded/controls state against the Drawer panel ID.

Automated evidence covers native pointer focus, rejected Escape, top-only nested Escape and
opener restoration, backdrop and successful route closing, preserved parent scroll lock,
background cleanup, responsive transitions, logical RTL placement, touch swipe direction and
duplicate-click suppression. Unit tests cover disabled close policies, cancellation, short and
vertical drags, pointer identity, pen/RTL, invalid dimensions, listener/Router teardown and
template lifetime. Production SSR proves open inline content, responsive desktop fallback,
correct select state, modal hydration and return to inline mode without hydration errors.
Chromium axe scans run for modal and inline layouts.

Manual gates remain:

- NVDA/JAWS/VoiceOver: dialog naming, isolated background, nested announcements and returned focus.
- Keyboard-only and high zoom: long content, focus visibility, inline/main navigation and mode changes.
- Physical iOS/Android touch: native scrolling, handle gestures, pointer cancellation and safe-area insets.
- Forced-color painting and custom themes: border/focus distinction, contrast and nested theme boundaries.
- Consumer flows where the original focus target disappears, or a parent closes with child state retained.

Firefox/WebKit, alternate Angular lanes, delayed event replay and incremental hydration remain
unverified. Automated evidence is not manual WCAG sign-off; overall catalog maturity remains
0/68 Done. Navbar's concrete Drawer pairing is now covered; its manual review remains open.
