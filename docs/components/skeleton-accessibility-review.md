# Skeleton accessibility review

Status: Automated checks complete; human review pending. FDB-05 is not Done.

Artwork is aria-hidden and inert; it has no accessible role/name, focus stop or live region.
`ZdSkeletonRegion` binds aria-busy on the consumer's actual region and preserves its semantics,
content and actions. The example owns a separate status message outside the busy region and
controls when loaded content appears. Busy state does not disable controls or manage focus.

Automated evidence covers decorative semantics, active visibility, busy transitions, retained
consumer-control focus, full fixture axe, three motion modes, duration changes, reduced motion,
forced-color outlines, narrow RTL layouts, no-JavaScript busy state and hydration.

Pending human gates:

- NVDA/JAWS/VoiceOver: busy-region behavior, content arrival and application announcements.
- Windows high contrast outlines, all supported themes and perception of placeholder states.
- Reduced-motion comfort, pulse/shimmer timing, 200%/400% zoom, RTL and physical devices.
- Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration compatibility.

Do not announce every placeholder or leave a region busy after completion/error. Keep meaningful
status outside busy regions and provide application-specific error/retry content. Automated axe
and screenshots do not certify assistive-technology speech or every theme.
