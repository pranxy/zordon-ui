import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DocsCodeBlockComponent } from './code-block.component';
import { DocsCodeTabsComponent, type DocsCodeFile } from './code-tabs.component';
import type { CodeLanguage } from './highlight';

/**
 * A live preview (projected content) attached to the code that produces it.
 * Pass `code` + `label` for one snippet, or `files` for tabbed snippets.
 */
@Component({
  selector: 'docs-example',
  imports: [DocsCodeBlockComponent, DocsCodeTabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dotted]': "surface() === 'dotted'" },
  template: `
    <div class="preview">
      <ng-content />
    </div>
    @if (files(); as tabbed) {
      <docs-code-tabs [files]="tabbed" [label]="label() + ' files'" />
    } @else if (code(); as snippet) {
      <docs-code-block [code]="snippet" [language]="language()" [label]="label()" />
    }
  `,
  styles: `
    :host {
      --docs-code-frame-border: 0;
      --docs-code-frame-radius: 0;
      display: block;
      min-inline-size: 0;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-code-bg);
    }

    .preview {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-block-size: 7rem;
      padding: 1.5rem;
      background: var(--docs-surface-raised);
      color: var(--docs-text);
    }

    :host(.dotted) .preview {
      background:
        radial-gradient(circle, var(--docs-border) 1px, transparent 1.5px) 0 0 / 1rem 1rem,
        var(--docs-surface-raised);
    }
  `,
})
export class DocsExampleComponent {
  readonly code = input<string>();
  readonly files = input<readonly DocsCodeFile[]>();
  readonly language = input<CodeLanguage>('html');
  /** Filename shown in the code header, e.g. "colors.html". */
  readonly label = input.required<string>();
  readonly surface = input<'plain' | 'dotted'>('plain');
}
