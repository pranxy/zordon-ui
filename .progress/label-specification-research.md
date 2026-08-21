# Label specification research

**Component:** INP-06 Label  
**Implementation pin:** daisyUI 5.7.16

| Source                                                                                      | Finding                                                                   | Decision                                                                  |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `node_modules/daisyui/components/label/object.js`                                           | Only `.label` and `.floating-label` exist.                                | Publish native Label and floating-label styling directives only.          |
| Same source                                                                                 | The classes style native labels and fields.                               | Preserve native controls and consumer layout; do not invent slots.        |
| [MDN `<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label) | Explicit `for`/`id` and implicit nesting associate one labelable control. | Restrict semantic hosts to native `<label>` and generate no relationship. |
| `docs/foundations/live-announcements-and-descriptions.md`                                   | Descriptions/errors require deliberate ownership.                         | Label does not own generic hint/error/ID behavior.                        |

## Inventory

| Candidate        | Public treatment                               |
| ---------------- | ---------------------------------------------- |
| `label`          | `label[zdLabel]` native-host directive         |
| `floating-label` | `label[zdFloatingLabel]` native-host directive |

No current Label colors, sizes, states, `label-text`, `label-text-alt`, or stable CSS variables
exist. No Angular Aria, forms accessor, validation, generated IDs, ARIA mutation, `hidden`,
required/optional, before/after, or breakpoint API is needed.
