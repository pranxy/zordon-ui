import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  DocsApiTableComponent,
  DocsCodeBlockComponent,
  DocsPageHeaderComponent,
  DocsSectionComponent,
  type DocsTableColumn,
  type DocsTableRow,
} from '../ui';

const vocabularyExample = `import type { ZdColor, ZdOrientation, ZdSize } from '@pranxy/zordon-ui';

const color: ZdColor = 'primary';
const size: ZdSize = 'lg';
const orientation: ZdOrientation = 'horizontal';`;

const columns: readonly DocsTableColumn[] = [
  { key: 'type', label: 'Type', kind: 'name' },
  { key: 'values', label: 'Values' },
];

const rows: readonly DocsTableRow[] = [
  {
    type: 'ZdColor',
    values: 'neutral · primary · secondary · accent · info · success · warning · error',
  },
  { type: 'ZdSize', values: 'xs · sm · md · lg · xl' },
  { type: 'ZdVariant', values: 'outline · dash · soft · ghost · border' },
  { type: 'ZdShape', values: 'square · circle' },
  { type: 'ZdOrientation', values: 'horizontal · vertical' },
  { type: 'ZdDensity', values: 'compact · comfortable · spacious' },
];

@Component({
  selector: 'docs-typed-vocabularies-page',
  imports: [
    DocsApiTableComponent,
    DocsCodeBlockComponent,
    DocsPageHeaderComponent,
    DocsSectionComponent,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Foundation"
        heading="Typed foundation vocabularies"
        description="Zordon UI exposes a small set of shared type-only vocabularies. They keep component APIs consistent without adding runtime code or restricting consumer CSS customization."
      />

      <docs-code-block label="Type-only imports" language="ts" [code]="example" />

      <docs-section
        id="public-types"
        heading="Public types"
        description="Shared does not mean universally accepted. Each component narrows a common type to the modifiers supported by its daisyUI implementation."
      >
        <docs-api-table caption="Shared vocabularies" [columns]="columns" [rows]="rows" />
      </docs-section>

      <docs-section id="customization-boundary" heading="Customization boundary">
        <p class="docs-lead">
          These unions describe library-owned inputs, not the complete styling surface. Consumers
          still add ordinary classes, styles, data attributes, and CSS variables. Do not widen a
          vocabulary with <code>| string</code>; use the documented customization surface instead.
          <a routerLink="/guides/styling-and-theming">Continue to styling and theming</a>.
        </p>
      </docs-section>
    </article>
  `,
})
export class TypedVocabulariesPageComponent {
  protected readonly example = vocabularyExample;
  protected readonly columns = columns;
  protected readonly rows = rows;
}
