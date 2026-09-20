# Pagination accessibility review

Status: automated checks verified; manual review
pending. Baseline: Angular 21.2.19, CDK/Aria 21.2.14, daisyUI 5.7.16, Chromium.

| Area             | Automated evidence                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Native semantics | Named navigation; real Router anchors or native buttons; current-page marker; decorative ellipses |
| Keyboard         | Tab order, Enter/Space, preserved Next focus after accepted updates, disabled boundaries          |
| Controlled state | Rejected requests do not alter current page; rejected select change is visibly restored           |
| Query navigation | URL state, parameter/fragment preservation, native new tab, Back/Forward                          |
| Boundaries       | Empty results, first/last, unknown total, hasNext, safe numeric limits                            |
| Announcements    | Atomic polite status for accepted pages, loading and empty results; busy navigation               |
| Responsive       | Five sizes, 360px containment, RTL and forced-color focus                                         |
| SSR              | Current query state and no-JavaScript link navigation; hydrated buttons and select                |
| Axe              | Controlled, Router, loading/empty, mobile RTL and hydrated fixtures                               |

Pending: NVDA/JAWS/VoiceOver reading order/current-page and live-region announcements, physical touch,
high-contrast painting, custom-theme contrast, large localized page numbers/labels, 200%/400% zoom and
reflow, focus during application-specific async loading/errors. Firefox/WebKit, Angular 21.0/22,
delayed event replay and incremental hydration remain unverified. Native no-JavaScript page-size
selection is not implemented; consumers needing it must supply a server form.

Applications own data fetching and cancellation, result-region announcements and focus after data or
route changes. Query request outputs are not guard acceptance notifications. This review does not
mark the component Done.
