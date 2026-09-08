# Rating accessibility review

| Required review                                                                   | Status    | Evidence to record                             |
| --------------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
| Native radio group labels, selection, keyboard, and clear option                  | Automated | Unit, Chromium, and axe tests                  |
| Forced colors, 200% zoom, 400% reflow, long labels, RTL, and screen-reader output | Pending   | Manual browser and assistive-technology review |

Use a `fieldset` and `legend` for a rating group. Give each radio an accessible name; the hidden clear radio needs a name too.
