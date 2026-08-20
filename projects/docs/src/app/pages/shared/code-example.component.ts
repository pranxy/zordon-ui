import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'docs-code-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="docs-code-example">
      <figcaption>{{ label() }}</figcaption>
      <pre tabindex="0" [attr.aria-label]="label() + ' code'"><code>{{ code() }}</code></pre>
      @if (enhanced()) {
        <button type="button" (click)="copyCode()">
          {{ copied() ? 'Copied' : copyLabel() }}
        </button>
        @if (copied()) {
          <span class="docs-visually-hidden" role="status">Copied to clipboard.</span>
        }
      }
    </figure>
  `,
})
export class DocsCodeExampleComponent {
  private readonly document = inject(DOCUMENT);

  readonly code = input.required<string>();
  readonly label = input.required<string>();
  readonly copyLabel = input('Copy code');

  protected readonly enhanced = signal(false);
  protected readonly copied = signal(false);

  constructor() {
    afterNextRender(() => this.enhanced.set(true));
  }

  protected async copyCode(): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    if (!clipboard) return;
    await clipboard.writeText(this.code());
    this.copied.set(true);
  }
}
