import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsBrandComponent } from './brand.component';

@Component({
  selector: 'docs-footer',
  imports: [DocsBrandComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <div class="identity">
        <docs-brand size="sm" />
        <p>Accessible Angular components, styled by daisyUI.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a routerLink="/components">Components</a>
        <a routerLink="/docs/getting-started">Get started</a>
        <a href="https://github.com/pranxy/zordon-ui">Source</a>
      </nav>
    </footer>
  `,
  styles: `
    :host {
      display: block;
      padding-inline: var(--docs-gutter);
      border-block-start: 1px solid var(--docs-border);
    }

    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      inline-size: min(100%, var(--docs-container));
      margin-inline: auto;
      padding-block: 2rem;
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }

    .identity {
      display: grid;
      gap: 0.5rem;
    }

    p {
      margin: 0;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    @media (max-width: 48rem) {
      footer {
        display: grid;
        justify-items: start;
      }
    }
  `,
})
export class DocsFooterComponent {}
