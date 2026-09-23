import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ZdButton, type ZdButtonVariant, type ZdColor } from '@pranxy/zordon-ui/button';

import type { CatalogueEntry } from '../content/component-catalogue';
import type { DocsMaturity } from '../site-catalog';
import {
  DocsApiTableComponent,
  DocsCalloutComponent,
  DocsChipGroupComponent,
  DocsCodeBlockComponent,
  DocsCodeTabsComponent,
  DocsComponentCardComponent,
  DocsExampleComponent,
  DocsFaqComponent,
  DocsFeatureGridComponent,
  DocsHeroComponent,
  DocsLinkCardsComponent,
  DocsMaturityBadgeComponent,
  DocsMaturityDotComponent,
  DocsMaturityLegendComponent,
  DocsMetaGridComponent,
  DocsPageHeaderComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsSectionComponent,
  DocsStepComponent,
  DocsStepsComponent,
  type DocsChipOption,
  type DocsCodeFile,
  type DocsTableColumn,
  type DocsTableRow,
  type PlaygroundControl,
  type PlaygroundValues,
} from '../ui';
import { DocsBrandComponent } from '../ui/shell/brand.component';
import { DocsBreadcrumbsComponent } from '../ui/shell/breadcrumbs.component';
import { DocsPagerComponent } from '../ui/shell/pager.component';
import { DocsSideNavComponent, type DocsSideNavGroup } from '../ui/shell/side-nav.component';
import { DocsTocComponent, type DocsTocItem } from '../ui/shell/toc.component';

const maturities: readonly DocsMaturity[] = ['planned', 'experimental', 'preview', 'stable'];

const codeSamples: readonly DocsCodeFile[] = [
  {
    label: 'app.config.ts',
    language: 'ts',
    code: `import { provideZordonUi } from '@pranxy/zordon-ui';\n\n// Default prefixes\nexport const providers = [provideZordonUi()];`,
  },
  {
    label: 'app.html',
    language: 'html',
    code: `<!-- Native host -->\n<button zdButton color="primary">@if (saved()) { Saved } @else { Save }</button>`,
  },
  {
    label: 'styles.css',
    language: 'css',
    code: `@import 'tailwindcss';\n\n.toolbar [zdButton] {\n  --size: 2rem;\n}`,
  },
  { label: 'Terminal', language: 'bash', code: `npm install @pranxy/zordon-ui --save # peer deps` },
  {
    label: '.postcssrc.json',
    language: 'json',
    code: `{ "plugins": { "@tailwindcss/postcss": {} } }`,
  },
];

const tableColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Name', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'key', label: 'Key', kind: 'kbd' },
  { key: 'description', label: 'Description' },
];

const tableRows: readonly DocsTableRow[] = [
  { name: 'color', type: 'ZdColor', key: 'Enter', description: 'Prose with `inline code`.' },
  {
    name: 'zdDisabled',
    type: 'boolean',
    key: 'Tab',
    description: 'A row with a note under the name.',
    note: '`<a>` only',
  },
];

const chipOptions: readonly DocsChipOption[] = [
  { value: 'all', label: 'All', count: 68 },
  { value: 'primary', label: 'primary', swatch: 'var(--color-primary)' },
  { value: 'secondary', label: 'secondary', swatch: 'var(--color-secondary)' },
  { value: 'plain', label: 'plain' },
];

const playgroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'color',
    options: chipOptions.slice(1, 3),
    defaultValue: 'primary',
  },
  {
    kind: 'choice',
    key: 'variant',
    options: [
      { value: 'solid', label: 'solid' },
      { value: 'outline', label: 'outline' },
    ],
    defaultValue: 'solid',
    omit: ['solid'],
  },
  { kind: 'boolean', key: 'disabled', defaultValue: false },
];

const sideNavGroups: readonly DocsSideNavGroup[] = [
  {
    label: 'With maturity',
    items: maturities.map((maturity, index) => ({
      label: `Item ${index + 1}`,
      path: index === 0 ? '/__zordon-tests__/ui' : undefined,
      maturity,
    })),
  },
  {
    label: 'Compact with counts',
    compact: true,
    items: [
      { label: 'Data display', path: '/components', count: 19 },
      { label: 'Navigation', path: '/components', count: 9 },
    ],
  },
];

const tocItems: readonly DocsTocItem[] = [
  { id: 'gallery-shell', label: 'Shell' },
  { id: 'gallery-page', label: 'Page' },
  { id: 'gallery-callouts', label: 'Callouts', level: 2 },
  { id: 'gallery-code', label: 'Code' },
];

const cards: readonly CatalogueEntry[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'Actions',
    maturity: 'planned',
    path: '/components/button',
  },
  { id: 'dropdown', name: 'Dropdown', category: 'Actions', maturity: 'preview' },
  { id: 'window-mockup', name: 'Window Mockup', category: 'Mockups', maturity: 'planned' },
];

/**
 * Every documentation-site design-system component in every variant, for visual regression and
 * review. Not part of the public site: served under /__zordon-tests__/ and never indexed.
 */
@Component({
  selector: 'docs-ui-gallery',
  imports: [
    DocsApiTableComponent,
    DocsBrandComponent,
    DocsBreadcrumbsComponent,
    DocsCalloutComponent,
    DocsChipGroupComponent,
    DocsCodeBlockComponent,
    DocsCodeTabsComponent,
    DocsComponentCardComponent,
    DocsExampleComponent,
    DocsFaqComponent,
    DocsFeatureGridComponent,
    DocsHeroComponent,
    DocsLinkCardsComponent,
    DocsMaturityBadgeComponent,
    DocsMaturityDotComponent,
    DocsMaturityLegendComponent,
    DocsMetaGridComponent,
    DocsPageHeaderComponent,
    DocsPagerComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsSectionComponent,
    DocsSideNavComponent,
    DocsStepComponent,
    DocsStepsComponent,
    DocsTocComponent,
    ZdButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="docs-prose gallery" data-testid="ui-gallery">
      <docs-page-header
        eyebrow="Design system"
        heading="Documentation UI gallery"
        maturity="preview"
        description="Every docs-* component in every variant. Used for visual regression and design review."
      >
        <docs-meta-grid
          [items]="[
            { label: 'Facts', value: 'button[zdButton]', mono: true },
            { label: 'Link', value: 'source.ts', href: '#gallery-shell', mono: true },
            { label: 'Plain', value: 'Text value' },
          ]"
        />
      </docs-page-header>

      <docs-section id="gallery-shell" heading="Shell" description="Navigation building blocks.">
        <div class="docs-cluster">
          <docs-brand />
          <docs-brand size="sm" label="Zordon UI home (small)" />
        </div>
        <docs-breadcrumbs
          [items]="[
            { label: 'Home', path: '/' },
            { label: 'Components', path: '/components' },
            { label: 'Current page' },
          ]"
        />
        <div class="columns">
          <docs-side-nav
            label="Gallery side navigation"
            [groups]="sideNavGroups"
            [backLink]="{ label: 'All components', path: '/components' }"
          >
            <docs-maturity-legend />
          </docs-side-nav>
          <docs-toc
            [items]="tocItems"
            pagePath="/__zordon-tests__/ui"
            editUrl="https://github.com/pranxy/zordon-ui"
          />
        </div>
        <docs-pager
          [previous]="{ label: 'Previous page', path: '/' }"
          [next]="{ label: 'Next page', path: '/components' }"
        />
      </docs-section>

      <docs-section id="gallery-page" heading="Page scaffolding">
        <docs-hero
          eyebrow="Hero"
          heading="Display heading"
          description="Lead paragraph under the display heading, limited to the reading measure."
        >
          <button docsHeroActions zdButton type="button" color="primary">Primary action</button>
          <button docsHeroActions zdButton type="button" variant="outline">Secondary</button>
          <docs-meta-grid
            docsHeroMeta
            variant="stats"
            [items]="[
              { label: 'Components', value: '68', suffix: 'in v1' },
              { label: 'Preview', value: '8' },
              { label: 'Stable', value: '0' },
            ]"
          />
        </docs-hero>

        <docs-section
          id="gallery-callouts"
          level="3"
          heading="Callouts"
          description="Four variants."
        >
          <docs-callout variant="accent" heading="Accent"
            >Tinted panel for a fast path.</docs-callout
          >
          <docs-callout variant="note"
            ><strong>Note.</strong> Accent bar for policy text.</docs-callout
          >
          <docs-callout variant="empty">Dashed outline for "nothing here" statements.</docs-callout>
          <docs-callout variant="result" label="Result">
            <button zdButton type="button" color="primary">Save</button>
            <span class="docs-muted">Live outcome next to its caption.</span>
          </docs-callout>
        </docs-section>

        <docs-section id="gallery-grids" level="3" heading="Grids and cards">
          <docs-feature-grid
            [numbered]="true"
            [columns]="3"
            [items]="[
              { title: 'Numbered one', body: 'Three-column joined grid.' },
              { title: 'Numbered two', body: 'Index prefix in mono.' },
              { title: 'Numbered three', body: 'Collapses on mobile.' },
            ]"
          />
          <docs-feature-grid
            [items]="[
              { title: 'Two columns', body: 'Default layout.' },
              { title: 'No index', body: 'Plain statements.' },
            ]"
          />
          <docs-link-cards
            [cards]="[
              {
                eyebrow: 'Guide',
                title: 'Link card',
                description: 'Whole card is a link.',
                path: '/',
              },
              {
                eyebrow: 'Component',
                title: 'Another',
                description: 'Equal heights.',
                path: '/components',
              },
            ]"
          />
        </docs-section>

        <docs-section id="gallery-steps" level="3" heading="Steps and FAQ">
          <docs-steps>
            <docs-step id="gallery-step-one" heading="First step" description="Numbered marker.">
              <docs-code-block label="Terminal" language="bash" code="ng serve" />
            </docs-step>
            <docs-step id="gallery-step-two" heading="Last step" description="No rail after it." />
          </docs-steps>
          <docs-faq
            [items]="[
              { question: 'Closed question', answer: 'Hidden answer.' },
              { question: 'Another question', answer: 'Also hidden.' },
            ]"
          />
        </docs-section>
      </docs-section>

      <docs-section id="gallery-code" heading="Code">
        @for (sample of codeSamples; track sample.label) {
          <docs-code-block
            [label]="sample.label"
            [language]="sample.language"
            [code]="sample.code"
          />
        }
        <docs-code-tabs label="Gallery files" [files]="codeSamples.slice(0, 2)" />
        <docs-example label="plain.html" code='<button zdButton color="primary">Plain</button>'>
          <button zdButton type="button" color="primary">Plain surface</button>
        </docs-example>
        <docs-example label="dotted" surface="dotted" [files]="codeSamples.slice(0, 2)">
          <button zdButton type="button" variant="outline">Dotted surface, tabbed code</button>
        </docs-example>
      </docs-section>

      <docs-section id="gallery-reference" heading="Reference">
        <docs-api-table caption="Gallery table" [columns]="tableColumns" [rows]="tableRows" />
        <docs-chip-group label="Inverse chips" [options]="chipOptions" [(value)]="inverseChoice" />
        <docs-chip-group
          label="Accent chips"
          selectedStyle="accent"
          [options]="chipOptions"
          [(value)]="accentChoice"
        />
        <docs-playground
          label="Gallery"
          [controls]="playgroundControls"
          [snippet]="{ element: 'button', directive: 'zdButton', content: 'Preview' }"
        >
          <ng-template docsPlaygroundPreview let-values>
            <button
              zdButton
              type="button"
              [color]="color(values)"
              [variant]="variant(values)"
              [disabled]="values['disabled'] === true"
            >
              Preview
            </button>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="gallery-catalogue" heading="Catalogue">
        <div class="docs-cluster">
          @for (maturity of maturities; track maturity) {
            <docs-maturity-badge [maturity]="maturity" />
            <docs-maturity-dot [maturity]="maturity" />
          }
        </div>
        <ul class="cards">
          @for (card of cards; track card.id) {
            <li><docs-component-card [entry]="card" /></li>
          }
        </ul>
      </docs-section>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding-block: 2rem;
    }

    .gallery {
      max-inline-size: 60rem;
      margin-inline: auto;
      padding-inline: 1rem;
    }

    .columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
      gap: 2rem;
      align-items: start;
    }

    /* Show both navigation rails at every width inside the gallery. */
    .columns docs-side-nav,
    .columns docs-toc {
      display: block;
      position: static;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
      gap: 1rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .cards li {
      display: grid;
    }
  `,
})
export class UiGalleryComponent {
  protected readonly maturities = maturities;
  protected readonly codeSamples = codeSamples;
  protected readonly tableColumns = tableColumns;
  protected readonly tableRows = tableRows;
  protected readonly chipOptions = chipOptions;
  protected readonly playgroundControls = playgroundControls;
  protected readonly sideNavGroups = sideNavGroups;
  protected readonly tocItems = tocItems;
  protected readonly cards = cards;
  protected readonly inverseChoice = signal('primary');
  protected readonly accentChoice = signal('all');

  protected color(values: PlaygroundValues): ZdColor {
    return values['color'] as ZdColor;
  }

  protected variant(values: PlaygroundValues): ZdButtonVariant | undefined {
    return values['variant'] === 'solid' ? undefined : (values['variant'] as ZdButtonVariant);
  }
}
