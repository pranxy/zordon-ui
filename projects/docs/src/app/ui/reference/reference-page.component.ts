import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { DocsMaturity } from '../../site-catalog';
import { DocsCodeBlockComponent } from '../code/code-block.component';
import type { CodeLanguage } from '../code/highlight';
import { DocsCalloutComponent } from '../page/callout.component';
import { DocsFeatureGridComponent, type DocsFeature } from '../page/feature-grid.component';
import { DocsMetaGridComponent, type DocsMetaItem } from '../page/meta-grid.component';
import { DocsPageHeaderComponent } from '../page/page-header.component';
import { DocsSectionComponent } from '../page/section.component';
import {
  DocsApiTableComponent,
  type DocsTableColumn,
  type DocsTableRow,
} from './api-table.component';

export interface DocsReferenceTable {
  /** Anchor of the level-3 API sub-section that holds the table. */
  readonly id: string;
  readonly heading: string;
  readonly caption: string;
  readonly columns: readonly DocsTableColumn[];
  readonly rows: readonly DocsTableRow[];
}

export interface DocsReferenceCode {
  readonly label: string;
  readonly language: CodeLanguage;
  readonly code: string;
}

/** Everything on a component reference page except its playground and examples. */
export interface DocsReference {
  readonly eyebrow: string;
  readonly heading: string;
  readonly maturity: DocsMaturity;
  readonly description: string;
  readonly facts: readonly DocsMetaItem[];
  /** Follows the bold maturity label in the notice under the header. */
  readonly notice: string;
  readonly install: {
    readonly description: string;
    readonly importCode: string;
    /** Global stylesheet additions, usually the classes to register with Tailwind. */
    readonly stylesCode?: string;
  };
  readonly playgroundDescription: string;
  readonly api: {
    readonly description: string;
    readonly tables: readonly DocsReferenceTable[];
    readonly typesLabel: string;
    readonly typesCode: string;
  };
  readonly accessibility: {
    readonly description: string;
    readonly features: readonly DocsFeature[];
    readonly keyboard?: Omit<DocsReferenceTable, 'id' | 'heading'>;
  };
  readonly customization: {
    readonly description: string;
    readonly code?: DocsReferenceCode;
  };
  readonly ssr: string;
}

const maturityLabels: Record<DocsMaturity, string> = {
  planned: 'Planned maturity.',
  experimental: 'Experimental.',
  preview: 'Preview.',
  stable: 'Stable.',
};

/**
 * The standard component reference page: header, maturity notice, install, playground, examples,
 * API, accessibility, customization and SSR, in the order the page catalogue's outline expects
 * (see defineComponentPage in site-catalog.ts). Project the playground with
 * `docsReferencePlayground`; everything else projected becomes the examples, usually level-3
 * `docs-section`s whose ids match the page's table of contents.
 */
@Component({
  selector: 'docs-reference-page',
  imports: [
    DocsApiTableComponent,
    DocsCalloutComponent,
    DocsCodeBlockComponent,
    DocsFeatureGridComponent,
    DocsMetaGridComponent,
    DocsPageHeaderComponent,
    DocsSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let page = reference();
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        [eyebrow]="page.eyebrow"
        [heading]="page.heading"
        [maturity]="page.maturity"
        [description]="page.description"
      >
        <docs-meta-grid [items]="page.facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>{{ maturityLabel() }}</strong> {{ page.notice }}
      </docs-callout>

      <docs-section
        id="install"
        heading="Install and import"
        [description]="page.install.description"
      >
        <docs-code-block
          label="Import"
          language="ts"
          copyLabel="Copy import code"
          [code]="page.install.importCode"
        />
        @if (page.install.stylesCode; as stylesCode) {
          <docs-code-block label="src/styles.css" language="css" [code]="stylesCode" />
        }
      </docs-section>

      <docs-section id="playground" heading="Playground" [description]="page.playgroundDescription">
        <ng-content select="[docsReferencePlayground]" />
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <ng-content />
      </docs-section>

      <docs-section id="api" heading="API" [description]="page.api.description">
        @for (table of page.api.tables; track table.id) {
          <docs-section level="3" [id]="table.id" [heading]="table.heading">
            <docs-api-table
              [caption]="table.caption"
              [columns]="table.columns"
              [rows]="table.rows"
            />
          </docs-section>
        }
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block
            [label]="page.api.typesLabel"
            language="ts"
            [code]="page.api.typesCode"
          />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        [description]="page.accessibility.description"
      >
        <docs-feature-grid [items]="page.accessibility.features" />
        @if (page.accessibility.keyboard; as keyboard) {
          <docs-api-table
            [caption]="keyboard.caption"
            [columns]="keyboard.columns"
            [rows]="keyboard.rows"
          />
        }
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        [description]="page.customization.description"
      >
        @if (page.customization.code; as sample) {
          <docs-code-block
            [label]="sample.label"
            [language]="sample.language"
            [code]="sample.code"
          />
        }
      </docs-section>

      <docs-section id="ssr" heading="SSR" [description]="page.ssr" />
    </article>
  `,
})
export class DocsReferencePageComponent {
  readonly reference = input.required<DocsReference>();

  protected readonly maturityLabel = computed(() => maturityLabels[this.reference().maturity]);
}
