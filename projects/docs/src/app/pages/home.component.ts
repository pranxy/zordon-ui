import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdButton } from '@pranxy/zordon-ui/button';

import { catalogueEntries } from '../content/component-catalogue';
import {
  DocsExampleComponent,
  DocsFeatureGridComponent,
  DocsHeroComponent,
  DocsLinkCardsComponent,
  DocsSectionComponent,
  type DocsFeature,
  type DocsLinkCard,
} from '../ui';

const principles: readonly DocsFeature[] = [
  {
    title: 'Native-first components',
    body: 'Angular behaviour and typed APIs without replacing correct platform semantics.',
  },
  {
    title: 'Documented foundations',
    body: 'Shared contracts keep component APIs consistent and customization predictable.',
  },
  {
    title: 'Consumer-owned themes',
    body: 'Applications keep control of Tailwind CSS, daisyUI themes, and style overrides.',
  },
];

const startingPoints: readonly DocsLinkCard[] = [
  {
    eyebrow: 'Get started',
    title: 'Installation',
    description: 'From a fresh workspace to a themed button in five steps.',
    path: '/docs/getting-started',
  },
  {
    eyebrow: 'Catalogue',
    title: 'Components',
    description: 'Every v1 component with its maturity.',
    path: '/components',
  },
  {
    eyebrow: 'Component',
    title: 'Button reference',
    description: 'Playground, examples, API, and accessibility notes.',
    path: '/components/button',
  },
  {
    eyebrow: 'Guide',
    title: 'Styling and theming',
    description: 'Themes, scopes, and class prefixes.',
    path: '/guides/styling-and-theming',
  },
];

@Component({
  selector: 'docs-home',
  imports: [
    DocsExampleComponent,
    DocsFeatureGridComponent,
    DocsHeroComponent,
    DocsLinkCardsComponent,
    DocsSectionComponent,
    RouterLink,
    ZdButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose home" aria-labelledby="page-title">
      <docs-hero
        eyebrow="Angular + daisyUI"
        heading="Zordon UI"
        description="A customizable Angular component library that keeps daisyUI's styling system in your hands."
      >
        <a
          docsHeroActions
          zdButton
          color="primary"
          href="/docs/getting-started"
          routerLink="/docs/getting-started"
          >Get started</a
        >
        <a docsHeroActions zdButton variant="outline" href="/components" routerLink="/components"
          >Browse components</a
        >
      </docs-hero>

      <docs-section
        id="preview"
        eyebrow="Representative preview"
        heading="Native semantics, daisyUI presentation"
        description="The planned Button directive styles this server-rendered native action element."
      >
        <docs-example label="app.html" [code]="previewCode">
          <button zdButton type="button" color="primary">Save changes</button>
        </docs-example>
        <p class="docs-lead">
          <strong>Coverage status:</strong> {{ total }} components are planned for v1. Button is
          Planned while its remaining release evidence is completed, and the
          <a routerLink="/components">catalogue</a> shows every component's maturity explicitly.
        </p>
      </docs-section>

      <docs-section id="principles" heading="Principles">
        <docs-feature-grid [items]="principles" [columns]="3" [numbered]="true" />
      </docs-section>

      <docs-section id="start" heading="Where to start">
        <docs-link-cards [cards]="startingPoints" />
      </docs-section>
    </article>
  `,
  styles: `
    .home {
      max-inline-size: 64rem;
    }
  `,
})
export class DocsHomeComponent {
  protected readonly total = catalogueEntries.length;
  protected readonly principles = principles;
  protected readonly startingPoints = startingPoints;
  protected readonly previewCode = '<button zdButton color="primary">Save changes</button>';
}
