import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdButton } from '@pranxy/zordon-ui/button';

import {
  catalogueEntries,
  componentCategories,
  maturityCounts,
} from '../content/component-catalogue';
import {
  DocsCalloutComponent,
  DocsCatalogueComponent,
  DocsFeatureGridComponent,
  DocsHeroComponent,
  DocsMetaGridComponent,
  DocsSectionComponent,
  type DocsFeature,
  type DocsMetaItem,
} from '../ui';

const counts = maturityCounts();

const heroStats: readonly DocsMetaItem[] = [
  { label: 'Components', value: String(catalogueEntries.length), suffix: 'in v1' },
  { label: 'Categories', value: String(componentCategories.length) },
  { label: 'Preview', value: String(counts.preview) },
  { label: 'Stable', value: String(counts.stable) },
  { label: 'Angular', value: '21' },
];

const commitments: readonly DocsFeature[] = [
  {
    title: 'Native-first components',
    body: 'Angular behaviour and typed APIs without replacing correct platform semantics.',
  },
  {
    title: 'Documented foundations',
    body: 'Shared typed contracts keep component APIs consistent and customization predictable.',
  },
  {
    title: 'Consumer-owned themes',
    body: 'Applications keep control of Tailwind CSS, daisyUI themes, and style overrides.',
  },
];

@Component({
  selector: 'docs-components-page',
  imports: [
    DocsCalloutComponent,
    DocsCatalogueComponent,
    DocsFeatureGridComponent,
    DocsHeroComponent,
    DocsMetaGridComponent,
    DocsSectionComponent,
    RouterLink,
    ZdButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-hero
        eyebrow="Catalogue · Angular + daisyUI"
        [heading]="total + ' components. One system.'"
        description="Angular-native state, forms, and accessibility layered onto daisyUI styling. Browse the component catalogue by category and maturity; planned components are listed honestly, never presented as supported APIs."
      >
        <a
          docsHeroActions
          zdButton
          color="primary"
          href="/docs/getting-started"
          routerLink="/docs/getting-started"
          >Get started</a
        >
        <a docsHeroActions zdButton variant="outline" href="#component-catalogue">
          Browse components
        </a>
        <span docsHeroActions class="docs-muted progress">
          {{ counts.stable }} of {{ total }} stable · v1 in progress
        </span>
        <docs-meta-grid docsHeroMeta variant="stats" [items]="heroStats" />
      </docs-hero>

      <docs-section
        id="why-native"
        eyebrow="Why native"
        heading="Three commitments the API is built on"
      >
        <docs-feature-grid [items]="commitments" [columns]="3" [numbered]="true" />
      </docs-section>

      <docs-section
        id="component-catalogue"
        eyebrow="Catalogue"
        heading="Component catalogue"
        description="All {{
          total
        }} components planned for v1. Maturity is stated on every card and is never dressed up."
      >
        <docs-catalogue />
        <docs-callout variant="note">
          <strong>planned</strong> has no usable public API yet. <strong>preview</strong> is usable
          for evaluation, but feedback may still change the API. <strong>stable</strong> carries the
          repository's compatibility commitment. See the
          <a routerLink="/resources">project resources</a> for the maturity policy.
        </docs-callout>
      </docs-section>
    </article>
  `,
  styles: `
    .progress {
      font-size: var(--docs-text-sm);
    }
  `,
})
export class ComponentsPageComponent {
  protected readonly counts = counts;
  protected readonly total = catalogueEntries.length;
  protected readonly heroStats = heroStats;
  protected readonly commitments = commitments;
}
