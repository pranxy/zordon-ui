# Navbar accessibility review

Status: automated checks verified; manual review pending. Baseline: Angular 21.2.19,
CDK/Aria 21.2.14, daisyUI 5.7.16, Chromium. See the delivery tracker for final run evidence.

| Area             | Automated contract                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| Semantics        | Named native nav; projected anchors retain href/current-page semantics; no invented menu role             |
| Keyboard         | Native Tab order, Enter/Space toggle activation, disabled button, owner Escape/focus return               |
| Controlled state | Requests do not alter accepted state; aria-expanded/controls match owner binding                          |
| Responsive/RTL   | Desktop/mobile groups leave accessibility and focus trees when hidden; 360px layout and logical start/end |
| Router           | Current-page updates and owner panel closure after projected link activation                              |
| SSR              | Initially expanded mobile native links work without JavaScript; hydrated toggle/Router interaction        |
| Styling          | Forced-color focus and boundary; static/sticky/fixed position; transparent background                     |
| Axe              | Desktop, mobile, RTL, forced colors and hydrated mobile fixture                                           |

Pending: NVDA/JAWS/VoiceOver announcements, physical touch, high-contrast painting, custom themes and
transparent-background contrast, long translated links, focus recovery across breakpoint changes,
200%/400% zoom/reflow, mobile safe areas and application fixed-header offsets. Test composed Drawer
focus trap, scroll lock, Escape and backdrop behavior when LYT-02 is implemented. Firefox/WebKit,
Angular 21.0/22, delayed event replay and incremental hydration are not verified.

Consumers must name landmarks and buttons, maintain valid unique panel IDs, style focus on projected
controls, expose usable critical SSR navigation and manage focus when closing/hiding content. The
fixture's panel focus policy belongs to its owner; it is not Navbar runtime behavior. This review
does not mark the component Done.
