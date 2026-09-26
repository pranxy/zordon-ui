---
'@pranxy/zordon-ui': patch
---

Fixes found while writing the documentation site:

- Alert: soft, outline and dash alerts use the base text colour, keeping the status colour in the
  tint and border, because daisyUI's status-coloured text falls below 4.5:1 on light themes. The
  host now carries `data-zd-alert-variant`.
- Calendar: the popup dialog is centred again under Tailwind's preflight (`margin: auto`).
- Divider: on an `hr` host, the element's own border is removed, so the line isn't doubled.
- OTP: the cells use the configured daisyUI class prefix instead of a hard-coded `input` class.
