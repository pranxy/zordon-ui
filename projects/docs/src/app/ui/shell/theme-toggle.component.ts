import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

import { readPreference, writePreference } from '../services/preferences';

type DocsTheme = 'dark' | 'light';
const THEME_KEY = 'zordon-docs-theme';

/**
 * Light/dark switch. The server always renders the light theme (index.html sets it); a saved
 * choice is applied after hydration so server and client markup match.
 */
@Component({
  selector: 'docs-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="docs-utility-action"
      [attr.aria-label]="theme() === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
      [attr.aria-pressed]="theme() === 'dark'"
      (click)="toggle()"
    >
      {{ label() }}
    </button>
  `,
})
export class DocsThemeToggleComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly theme = signal<DocsTheme>('light');
  protected readonly label = computed(
    () => (this.theme() === 'light' ? 'Dark' : 'Light') + ' theme',
  );

  constructor() {
    afterNextRender(() => {
      const saved = readPreference(this.document, THEME_KEY);
      if (saved === 'dark' || saved === 'light') this.apply(saved, false);
    });
  }

  protected toggle(): void {
    this.apply(this.theme() === 'light' ? 'dark' : 'light', true);
  }

  private apply(theme: DocsTheme, persist: boolean): void {
    this.theme.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
    if (persist) writePreference(this.document, THEME_KEY, theme);
  }
}
