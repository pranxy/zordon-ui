import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdTextRotate } from '@pranxy/zordon-ui/text-rotate';

import { rotateCode, sentenceCode, textRotateReference } from '../content/text-rotate.content';
import { DocsExampleComponent, DocsReferencePageComponent, DocsSectionComponent } from '../ui';

/** Loads daisyUI's text-rotate class, only while this page is in use. */
@Component({
  selector: 'docs-text-rotate-daisy-styles',
  template: '',
  styleUrl: './styles/text-rotate.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class TextRotateDaisyStylesComponent {}

/** Text Rotate has no inputs, so the playground is a live example with its code. */
@Component({
  selector: 'docs-text-rotate-page',
  imports: [
    DocsExampleComponent,
    DocsReferencePageComponent,
    DocsSectionComponent,
    TextRotateDaisyStylesComponent,
    ZdTextRotate,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-text-rotate-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-example docsReferencePlayground label="headline.html" [code]="rotateCode">
        <p class="headline">
          <span class="docs-visually-hidden">Design, build and ship.</span>
          <span aria-hidden="true">
            <span zdTextRotate>
              <span><span>Design</span><span>Build</span><span>Ship</span></span>
            </span>
          </span>
        </p>
      </docs-example>

      <docs-section
        id="sentence"
        level="3"
        heading="In a sentence"
        description="The rotating word sits inline. A shorter --duration makes this one cycle every six seconds."
      >
        <docs-example label="tagline.html" [code]="sentenceCode">
          <p class="tagline">
            <span class="docs-visually-hidden">Made for designers, developers and writers.</span>
            <span aria-hidden="true">
              Made for
              <span zdTextRotate class="fast">
                <span><span>designers</span><span>developers</span><span>writers</span></span>
              </span>
            </span>
          </p>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .headline {
      margin: 0;
      font-size: var(--docs-text-h1);
      font-weight: var(--docs-weight-black);
      color: var(--docs-accent);
    }

    .tagline {
      margin: 0;
      font-size: var(--docs-text-h3);
    }

    .fast {
      --duration: 6s;
      font-weight: var(--docs-weight-bold);
      color: var(--docs-accent);
    }
  `,
})
export class TextRotatePageComponent {
  protected readonly reference = textRotateReference;
  protected readonly rotateCode = rotateCode;
  protected readonly sentenceCode = sentenceCode;
}
