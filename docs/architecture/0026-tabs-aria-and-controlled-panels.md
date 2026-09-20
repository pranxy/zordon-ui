# ADR 0026: Tabs Aria interaction and controlled panel ownership

Status: Accepted · 2026-09-20 · NAV-09

Tabs must combine Angular Aria navigation with application-owned selection, editable panel
lifetimes and server-rendered initial content. Aria 21.2.14 updates its selection model and
deferred content after rendering; directly forwarding that optimistic model would make
rejected selection and meaningful no-JavaScript initial panels unreliable.

`ZdTabs` composes public `Tabs`, `TabList`, `Tab` and `TabPanel`. Aria owns keyboard navigation,
disabled skipping, orientation, roles and relationships. The wrapper observes the selected
public tab signal after Aria's handlers on the same tablist element (keyboard events do not
bubble past Aria), restores accepted state through public APIs, and emits a selection request.
Input changes synchronize Aria after rendering. No private patterns are accessed or copied.

Accepted state drives SSR selection, tabindex, panel visibility, inertness and template creation.
Internal host directives compose Aria and give these attributes precedence over its initial
host values. Accepted selection remains authoritative after hydration; Aria supplies roving
focus and relationships. Zordon owns template lifecycle
using NgTemplateOutlet, with lazy and preservation inputs. It does not use Aria TabContent,
whose post-render creation cannot provide initial server content.

Close and reorder are typed proposals. Named native controls remain outside the tablist, avoiding
nested interactive descendants in tabs. Accepted sequence changes restore focus to a surviving
tab. Trigger identity includes position to refresh Aria's cached registered order after moving;
panel identity remains the stable item ID so editing state survives. No drag runtime is added.

Optional Router query mode derives accepted state from ActivatedRoute and navigates using
merged queries/preserved fragments. It represents in-page panels; independent route destinations
remain native links. Native scrolling handles overflow. Packaged logical CSS supplies three
variants, sizes, vertical layout, focus and reduced-motion/forced-color rules.

This requires SSR/hydration, controlled rejection, manual/automatic keyboard, reordered-keyboard,
panel-identity, Router-history and axe evidence. Manual assistive technology, theme contrast,
physical touch and zoom review remain release gates. Angular/CDK/Aria dependency policy and
existing coverage/package/build budgets remain unchanged.
