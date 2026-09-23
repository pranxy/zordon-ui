import { Directive, input } from '@angular/core';

export type DocsNavLinkAppearance = 'primary' | 'menu' | 'side';

/**
 * Applies the shared navigation-link look (see `.docs-nav-link` in styles/primitives.css).
 * Current-page state comes from `routerLinkActive="active"` + `ariaCurrentWhenActive`.
 */
@Directive({
  selector: 'a[docsNavLink]',
  host: {
    'class': 'docs-nav-link',
    '[class.docs-nav-link--primary]': "appearance() === 'primary'",
    '[class.docs-nav-link--menu]': "appearance() === 'menu'",
    '[class.docs-nav-link--side]': "appearance() === 'side'",
  },
})
export class DocsNavLinkDirective {
  readonly appearance = input<DocsNavLinkAppearance, DocsNavLinkAppearance | ''>('side', {
    alias: 'docsNavLink',
    transform: value => value || 'side',
  });
}
