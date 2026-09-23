import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { highlight, type CodeLanguage } from './highlight';

/** Highlighted, scrollable `<pre><code>` body. Used inside `docs-code-frame`. */
@Component({
  selector: 'docs-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<pre
    tabindex="0"
    [attr.aria-label]="label()"
  ><code>@for (token of tokens(); track $index) {<span [class]="token.kind ? 'tk-' + token.kind : null">{{ token.text }}</span>}</code></pre>`,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }

    pre {
      margin: 0;
      padding: 1rem 1.125rem;
      overflow-x: auto;
      color: var(--docs-code-fg);
      font-family: var(--docs-font-mono);
      font-size: var(--docs-text-xs);
      line-height: 1.7;
      white-space: pre;
    }

    pre:focus-visible {
      outline-offset: -3px;
    }

    .tk-kw {
      color: var(--docs-token-kw);
    }
    .tk-str {
      color: var(--docs-token-str);
    }
    .tk-com {
      color: var(--docs-token-com);
      font-style: italic;
    }
    .tk-tag {
      color: var(--docs-token-tag);
    }
    .tk-attr {
      color: var(--docs-token-attr);
    }
    .tk-fn {
      color: var(--docs-token-fn);
    }
    .tk-num {
      color: var(--docs-token-num);
    }
  `,
})
export class DocsCodeComponent {
  readonly code = input.required<string>();
  readonly language = input<CodeLanguage>('text');
  /** Accessible name for the scrollable region, e.g. "app.config.ts code". */
  readonly label = input.required<string>();

  protected readonly tokens = computed(() => highlight(this.code(), this.language()));
}
