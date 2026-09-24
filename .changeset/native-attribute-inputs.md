---
'@pranxy/zordon-ui': minor
---

Stop inputs from reusing native HTML attribute names, which took those attributes over.

- Alert, Badge, Card, File Input, Filter, Text Input and Textarea: the `style` input is now
  `variant`, and the `Zd*Style` types are now `Zd*Variant`. A plain `style` attribute is inline CSS
  again. Migrate `style="soft"` or `[style]="'soft'"` to `variant="soft"`; an unmigrated
  `style="soft"` still compiles but no longer adds a class.
- Select and Text Input: `size` is now `zdSize`, so the native `size` attribute (visible rows,
  width in characters) works again.
- Select: the boolean `ghost` input is now `variant="ghost"`, matching the other controls.
- The shared `ZdStyle` vocabulary type is now `ZdVariant`.
