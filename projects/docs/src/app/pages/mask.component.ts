import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdMask, type ZdMaskHalf, type ZdMaskShape } from '@pranxy/zordon-ui/mask';

import {
  halvesCode,
  maskPlaygroundControls,
  maskPlaygroundSnippet,
  maskReference,
} from '../content/mask.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Mask emits, only while this page is in use. */
@Component({
  selector: 'docs-mask-daisy-styles',
  template: '',
  styleUrl: './styles/mask.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class MaskDaisyStylesComponent {}

/** The pictures are CSS gradients standing in for your images. */
@Component({
  selector: 'docs-mask-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    MaskDaisyStylesComponent,
    ZdMask,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-mask-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Mask"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div
            zdMask
            class="picture"
            role="img"
            aria-label="A lake at dawn"
            [shape]="shapeOf(values)"
            [half]="halfOf(values)"
          ></div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="halves"
        level="3"
        heading="Half masks"
        description="Pairs of half stars draw a 3.5 rating. The shapes are hidden; the text says the score."
      >
        <docs-example label="rating.html" [code]="halvesCode">
          <p class="score">
            <span class="halves" aria-hidden="true">
              @for (half of halves; track $index) {
                <span
                  zdMask
                  shape="star-2"
                  class="star"
                  [half]="half.side"
                  [class.filled]="half.filled"
                ></span>
              }
            </span>
            <span>3.5 out of 5</span>
          </p>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .picture {
      inline-size: 10rem;
      block-size: 10rem;
      background:
        radial-gradient(circle at 70% 30%, var(--color-warning) 0 14%, transparent 15%),
        linear-gradient(160deg, var(--color-info), var(--color-primary));
    }

    .score {
      display: flex;
      align-items: center;
      gap: var(--docs-space-3);
      margin: 0;
    }

    .halves {
      display: inline-flex;
    }

    .star {
      inline-size: 1rem;
      block-size: 2rem;
      background: var(--docs-border-strong);
    }

    .star.filled {
      background: var(--color-warning);
    }
  `,
})
export class MaskPageComponent {
  protected readonly reference = maskReference;
  protected readonly controls = maskPlaygroundControls;
  protected readonly snippet = maskPlaygroundSnippet;
  protected readonly halvesCode = halvesCode;

  protected readonly halves: readonly { side: ZdMaskHalf; filled: boolean }[] = Array.from(
    { length: 10 },
    (_, index) => ({ side: index % 2 === 0 ? 'half-1' : 'half-2', filled: index < 7 }),
  );

  protected shapeOf(values: PlaygroundValues): ZdMaskShape {
    return values['shape'] as ZdMaskShape;
  }

  protected halfOf(values: PlaygroundValues): ZdMaskHalf | undefined {
    const value = values['half'];
    return value === 'none' ? undefined : (value as ZdMaskHalf);
  }
}
