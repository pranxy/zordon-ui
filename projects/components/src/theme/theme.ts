import { Directive, input } from '@angular/core';

function themeAttribute(value: string | null | undefined): string | null {
  return value === undefined || value === null || value === '' ? null : value;
}

/** Establishes a daisyUI `data-theme` boundary on any native or component host. */
@Directive({
  selector: '[zdTheme]',
  host: {
    '[attr.data-theme]': 'theme()',
  },
})
export class ZdTheme {
  /** Exact name of a theme compiled by the consuming application; empty values inherit. */
  readonly theme = input<string | null, string | null | undefined>(null, {
    alias: 'zdTheme',
    transform: themeAttribute,
  });
}
