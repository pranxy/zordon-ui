import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdButton } from '@pranxy/zordon-ui/button';

@Component({
  selector: 'docs-home',
  imports: [RouterLink, ZdButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="page-title">
      <p class="eyebrow">Angular + daisyUI</p>
      <h1 id="page-title">Zordon UI</h1>
      <p class="summary">
        A customizable Angular component library that keeps daisyUI's styling system in your hands.
      </p>
      <div class="actions">
        <a class="action" routerLink="/docs/getting-started">Get started</a>
        <a routerLink="/components">Browse components</a>
      </div>
      <section class="preview" aria-labelledby="preview-title">
        <div>
          <p class="eyebrow">Representative preview</p>
          <h2 id="preview-title">Native semantics, daisyUI presentation</h2>
          <p>The planned Button directive styles this server-rendered native action element.</p>
        </div>
        <button zdButton color="primary">Save changes</button>
      </section>
      <p class="status">
        <strong>Coverage status:</strong> Button is Planned while its remaining release evidence is
        completed. Catalogue pages show maturity explicitly.
      </p>
      <ul class="docs-card-grid">
        <li class="docs-card">
          <h2><a routerLink="/components/button">Native-first components</a></h2>
          <p>Angular behavior and typed APIs without replacing correct platform semantics.</p>
        </li>
        <li class="docs-card">
          <h2><a routerLink="/foundations/typed-vocabularies">Documented foundations</a></h2>
          <p>Shared contracts keep component APIs consistent and customization predictable.</p>
        </li>
        <li class="docs-card">
          <h2><a routerLink="/guides/styling-and-theming">Consumer-owned themes</a></h2>
          <p>Applications retain control of Tailwind CSS, daisyUI themes, and style overrides.</p>
        </li>
      </ul>
    </section>
  `,
  styles: `
    section {
      display: grid;
      gap: 2rem;
      max-inline-size: 64rem;
    }

    p,
    h1 {
      margin: 0;
    }

    .eyebrow {
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(3rem, 10vw, 6rem);
      line-height: 0.95;
    }

    .summary {
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      line-height: 1.5;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }

    .actions a {
      font-weight: 700;
    }

    .action {
      inline-size: fit-content;
      padding: 0.75rem 1rem;
      border: 2px solid currentColor;
      border-radius: 0.5rem;
      font-weight: 700;
      text-decoration: none;
    }

    h2 {
      font-size: 1.2rem;
    }

    .preview {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border: 1px solid var(--docs-border);
      border-radius: 0.75rem;
      background: var(--docs-surface-raised);
    }

    .preview > div {
      display: grid;
      gap: 0.5rem;
      max-inline-size: 34rem;
    }

    .status {
      color: var(--docs-muted-text);
    }
  `,
})
export class DocsHomeComponent {}
