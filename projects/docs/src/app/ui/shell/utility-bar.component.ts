import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ZdKbd } from '@pranxy/zordon-ui/kbd';

import { DocsThemeToggleComponent } from './theme-toggle.component';

/** Thin top row: version note, repository link, search trigger, theme switch. */
@Component({
  selector: 'docs-utility-bar',
  imports: [DocsThemeToggleComponent, ZdKbd],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="note">{{ note() }}</p>
    <div class="actions">
      <a class="docs-utility-action github" [href]="repositoryUrl()">GitHub</a>
      <button
        type="button"
        class="docs-utility-action"
        aria-keyshortcuts="/"
        (click)="searchRequested.emit($event.currentTarget)"
      >
        Search documentation
        <kbd zdKbd size="xs" aria-hidden="true">/</kbd>
      </button>
      <docs-theme-toggle />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-block-size: 2.5rem;
      border-block-end: 1px solid var(--docs-border);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-xs);
    }

    .note {
      margin: 0;
      letter-spacing: 0.01em;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    kbd {
      font-family: var(--docs-font-mono);
    }

    @media (max-width: 48rem) {
      :host {
        justify-content: flex-end;
      }

      .note {
        display: none;
      }
    }

    @media (max-width: 30rem) {
      .github {
        display: none;
      }
    }
  `,
})
export class DocsUtilityBarComponent {
  readonly note = input('Angular 21 · daisyUI 5');
  readonly repositoryUrl = input('https://github.com/pranxy/zordon-ui');
  /** Emits the trigger element so focus can return to it when search closes. */
  readonly searchRequested = output<EventTarget | null>();
}
