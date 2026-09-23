import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Copies text to the clipboard. Rendered only after hydration because copying needs JavaScript;
 * the server HTML keeps the code itself selectable.
 */
@Component({
  selector: 'docs-copy-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enhanced()) {
      <button type="button" [attr.aria-label]="label()" (click)="copy()">
        {{ copied() ? 'Copied' : 'Copy' }}
      </button>
      @if (copied()) {
        <span class="docs-visually-hidden" role="status">Copied to clipboard.</span>
      }
    }
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    button {
      min-block-size: 1.75rem;
      padding-inline: 0.625rem;
      border: 1px solid var(--docs-code-line);
      border-radius: var(--docs-radius-xs);
      background: transparent;
      color: var(--docs-code-fg);
      font-family: var(--docs-font-mono);
      font-size: 0.6875rem;
      font-weight: var(--docs-weight-semibold);
      cursor: pointer;
      transition: background var(--docs-duration) var(--docs-ease);
    }

    button:hover {
      background: var(--docs-code-line);
    }
  `,
})
export class DocsCopyButtonComponent {
  private readonly document = inject(DOCUMENT);
  private timer: ReturnType<typeof setTimeout> | undefined;

  /** Text written to the clipboard. */
  readonly text = input.required<string>();
  /** Accessible name, e.g. "Copy import code". */
  readonly label = input('Copy code');

  protected readonly enhanced = signal(false);
  protected readonly copied = signal(false);

  constructor() {
    afterNextRender(() => this.enhanced.set(true));
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected async copy(): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    if (!clipboard) return;
    try {
      await clipboard.writeText(this.text());
    } catch {
      return;
    }
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), 1400);
  }
}
