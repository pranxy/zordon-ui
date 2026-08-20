import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsCodeExampleComponent } from './shared/code-example.component';
import { DocsPageHeaderComponent } from './shared/page-header.component';

const vocabularyExample = `import type { ZdColor, ZdOrientation, ZdSize } from '@pranxy/zordon-ui';

const color: ZdColor = 'primary';
const size: ZdSize = 'lg';
const orientation: ZdOrientation = 'horizontal';`;

const vocabularies = [
  ['ZdColor', 'neutral · primary · secondary · accent · info · success · warning · error'],
  ['ZdSize', 'xs · sm · md · lg · xl'],
  ['ZdStyle', 'outline · dash · soft · ghost · border'],
  ['ZdShape', 'square · circle'],
  ['ZdOrientation', 'horizontal · vertical'],
  ['ZdDensity', 'compact · comfortable · spacious'],
] as const;

@Component({
  selector: 'docs-typed-vocabularies-page',
  imports: [DocsCodeExampleComponent, DocsPageHeaderComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-page" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Foundation"
        heading="Typed foundation vocabularies"
        description="Zordon UI exposes a small set of shared type-only vocabularies. They keep component APIs consistent without adding runtime code or restricting consumer CSS customization."
        sourceUrl="https://github.com/pranxy/zordon-ui/blob/master/docs/foundations/typed-vocabularies.md"
      />

      <docs-code-example label="Type-only imports" [code]="example" />

      <section class="docs-page-section" aria-labelledby="public-types">
        <h2 id="public-types">Public types</h2>
        <div class="docs-table-wrap">
          <table class="docs-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              @for (vocabulary of vocabularyRows; track vocabulary[0]) {
                <tr>
                  <th scope="row">
                    <code>{{ vocabulary[0] }}</code>
                  </th>
                  <td>{{ vocabulary[1] }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          Shared does not mean universally accepted. Each component narrows a common type to the
          modifiers supported by its daisyUI implementation.
        </p>
      </section>

      <section class="docs-page-section" aria-labelledby="customization-boundary">
        <h2 id="customization-boundary">Customization boundary</h2>
        <p>
          These unions describe library-owned inputs, not the complete styling surface. Consumers
          still add ordinary classes, styles, data attributes, and CSS variables. Do not widen a
          vocabulary with <code>| string</code>; use the documented customization surface instead.
        </p>
        <a routerLink="/guides/styling-and-theming">Continue to styling and theming</a>
      </section>
    </article>
  `,
})
export class TypedVocabulariesPageComponent {
  protected readonly example = vocabularyExample;
  protected readonly vocabularyRows = vocabularies;
}
