# ADR 0024: Pagination state and native navigation

Status: Accepted. Date: 2026-09-20.

Pagination composes the existing Button and Join directives in a named native navigation landmark.
Controlled mode uses buttons and emits requests without mutating accepted inputs. Query mode uses
real Angular Router links and takes accepted state from ActivatedRoute query parameters. It preserves
native modified-click/new-tab behavior, unrelated query parameters, fragments and browser history.
Angular Aria and a custom keyboard runtime are unnecessary for this pattern.

State is one-based positive safe integers for page/size, with null representing unknown total.
Known empty results have zero pages and normalized page one. Unknown totals rely on an explicit
hasNext signal and never invent a final page. The exported range helper enumerates a bounded
sibling window plus first/last boundaries, expands single gaps, and renders larger gaps as
noninteractive ellipses. Siblings are limited to zero through five.

Page-size requests reset to page one and provide one combined state output for atomic owner
updates. Query notifications do not cancel navigation; Router owns acceptance and guards. Invalid
URL values fall back to valid inputs, and out-of-range pages are clamped for rendering. No automatic
canonicalization or initialization redirect is performed. Owners remain responsible for data loading,
result focus, asynchronous error handling and consistency when totals change.

Native disabled buttons and unavailable anchors guard interaction. The current page remains a
focusable native control with aria-current. A separate polite atomic status reports accepted state
or loading. CSS wraps controls without hiding page destinations, mirrors boundary glyphs in RTL and
preserves forced-color focus/current cues. Projected widget/overlay semantics are not introduced.

Server-rendered query links work without JavaScript. Controlled actions and size changes require
hydration. The fixture reuses real daisyUI Button/Join CSS and omits redundant default-size and state
candidates because Pagination supplies current/disabled state styling. All budgets remain unchanged.
