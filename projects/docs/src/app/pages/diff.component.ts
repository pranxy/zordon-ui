import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdDiff, ZdDiffItem1, ZdDiffItem2, ZdDiffResizer } from '@pranxy/zordon-ui/diff';

import { diffCode, diffReference, textCode } from '../content/diff.content';
import { DocsExampleComponent, DocsReferencePageComponent, DocsSectionComponent } from '../ui';

/** Loads the daisyUI classes Diff emits, only while this page is in use. */
@Component({
  selector: 'docs-diff-daisy-styles',
  template: '',
  styleUrl: './styles/diff.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class DiffDaisyStylesComponent {}

/** Diff has no inputs, so the playground is a live example with its code. */
@Component({
  selector: 'docs-diff-page',
  imports: [
    DiffDaisyStylesComponent,
    DocsExampleComponent,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdDiff,
    ZdDiffItem1,
    ZdDiffItem2,
    ZdDiffResizer,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-diff-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-example docsReferencePlayground label="comparison.html" [code]="diffCode">
        <figure zdDiff class="comparison" tabindex="0">
          <div zdDiffItem1 tabindex="0">
            <img
              src="images/showcase/lake-morning.webp"
              alt="Lake and mountains in cool morning light"
              width="768"
              height="512"
              loading="lazy"
            />
          </div>
          <div zdDiffItem2>
            <img
              src="images/showcase/lake-sunset.webp"
              alt="The same lake and mountains in warm sunset light"
              width="768"
              height="512"
              loading="lazy"
            />
          </div>
          <div zdDiffResizer></div>
        </figure>
        <p>Same lake, identical framing: cool morning light compared with warm sunset light.</p>
      </docs-example>

      <docs-section
        id="text"
        level="3"
        heading="Text comparison"
        description="Any content works, not only images. The caption states the difference for everyone."
      >
        <docs-example label="pricing.html" [code]="textCode">
          <figure class="captioned">
            <div zdDiff class="comparison short">
              <div zdDiffItem1><p class="copy old">Our plans start at $12 per seat.</p></div>
              <div zdDiffItem2><p class="copy new">Our plans start at $9 per seat.</p></div>
              <div zdDiffResizer></div>
            </div>
            <figcaption>Pricing copy, before and after the September change.</figcaption>
          </figure>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .comparison {
      aspect-ratio: 3 / 2;
      inline-size: min(28rem, 100%);
      margin: 0;
      border-radius: var(--docs-radius-md);
    }

    .comparison.short {
      aspect-ratio: 3 / 1;
    }

    .comparison img {
      object-fit: cover;
    }

    .captioned {
      display: grid;
      gap: var(--docs-space-2);
      margin: 0;
    }

    .copy {
      display: grid;
      place-items: center;
      margin: 0;
      padding: var(--docs-space-4);
      font-size: 1.125rem;
    }

    .old {
      background: var(--color-base-100);
      color: var(--color-base-content);
    }

    .new {
      background: var(--color-primary);
      color: var(--color-primary-content);
    }

    figcaption {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }
  `,
})
export class DiffPageComponent {
  protected readonly reference = diffReference;
  protected readonly diffCode = diffCode;
  protected readonly textCode = textCode;
}
