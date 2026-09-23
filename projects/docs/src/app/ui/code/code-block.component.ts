import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DocsCodeComponent } from './code.component';
import { DocsCopyButtonComponent } from './copy-button.component';
import type { CodeLanguage } from './highlight';

/** Shared dark frame: a header row (label or tabs + actions) above a code body. */
@Component({
  selector: 'docs-code-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="header">
      <ng-content select="[docsCodeFrameStart]" />
      <ng-content select="[docsCodeFrameEnd]" />
    </div>
    <ng-content />
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
      overflow: hidden;
      /* A container such as docs-example can flatten the frame by setting these variables. */
      border: var(--docs-code-frame-border, 1px solid var(--docs-border));
      border-radius: var(--docs-code-frame-radius, var(--docs-radius-md));
      background: var(--docs-code-bg);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-block-size: 2.625rem;
      padding: 0.375rem 0.5rem 0.375rem 0.875rem;
      border-block-end: 1px solid var(--docs-code-line);
      color: var(--docs-code-muted);
      font-family: var(--docs-font-mono);
      font-size: 0.6875rem;
    }
  `,
})
export class DocsCodeFrameComponent {}

/** A single highlighted snippet with a filename label and a copy action. */
@Component({
  selector: 'docs-code-block',
  imports: [DocsCodeComponent, DocsCodeFrameComponent, DocsCopyButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-code-frame>
      <span docsCodeFrameStart>{{ label() }}</span>
      <docs-copy-button docsCodeFrameEnd [text]="code()" [label]="resolvedCopyLabel()" />
      <docs-code [code]="code()" [language]="language()" [label]="label() + ' code'" />
    </docs-code-frame>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
  `,
})
export class DocsCodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input<CodeLanguage>('text');
  /** Filename or short description shown in the header, e.g. "src/app/app.config.ts". */
  readonly label = input.required<string>();
  /** Accessible name for the copy button; defaults to "Copy <label>". */
  readonly copyLabel = input<string>();

  protected readonly resolvedCopyLabel = computed(
    () => this.copyLabel() ?? `Copy ${this.label()} code`,
  );
}
