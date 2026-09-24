import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdMask } from '@pranxy/zordon-ui/mask';
import { ZdRating, ZdRatingHidden } from '@pranxy/zordon-ui/rating';

import { controlSizes, flagOf, sizeOf } from '../content/form-controls.content';
import {
  halfCode,
  halfValues,
  ratingPlaygroundControls,
  ratingPlaygroundSnippet,
  ratingReference,
  ratingSizesCode,
  starLabel,
  starValues,
  starsFiles,
} from '../content/rating.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Rating and Mask emit, only while this page is in use. */
@Component({
  selector: 'docs-rating-daisy-styles',
  template: '',
  styleUrl: './styles/rating.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class RatingDaisyStylesComponent {}

@Component({
  selector: 'docs-rating-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    RatingDaisyStylesComponent,
    ReactiveFormsModule,
    ZdMask,
    ZdRating,
    ZdRatingHidden,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-rating-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Rating"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <fieldset [disabled]="flagOf(values, 'disabled')">
            <legend>Your rating</legend>
            <div zdRating class="stars" [size]="sizeOf(values)">
              <input
                type="radio"
                zdRatingHidden
                name="playground-rating"
                value="0"
                aria-label="No rating"
              />
              @for (value of stars; track value) {
                <input
                  type="radio"
                  zdMask
                  shape="star-2"
                  name="playground-rating"
                  [value]="value"
                  [checked]="value === 4"
                  [attr.aria-label]="starLabel(value)"
                />
              }
            </div>
          </fieldset>
        </ng-template>
      </docs-playground>

      <docs-section
        id="stars"
        level="3"
        heading="Star rating"
        description="Angular's radio accessor binds the value. The transparent first option clears it."
      >
        <docs-example label="review" [files]="starsFiles">
          <div class="docs-stack">
            <fieldset>
              <legend>How was your delivery?</legend>
              <div zdRating size="lg" class="stars">
                <input
                  type="radio"
                  zdRatingHidden
                  name="delivery"
                  aria-label="No rating"
                  [value]="0"
                  [formControl]="rating"
                />
                @for (value of stars; track value) {
                  <input
                    type="radio"
                    zdMask
                    shape="star-2"
                    name="delivery"
                    [value]="value"
                    [attr.aria-label]="starLabel(value)"
                    [formControl]="rating"
                  />
                }
              </div>
            </fieldset>
            <p class="docs-status" role="status">Rating: {{ ratingValue() }} of 5</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="half"
        level="3"
        heading="Half stars"
        description="half halves each input's width; alternate the two half masks so pairs form whole stars. A 3rem --size keeps each half at least 24px wide."
      >
        <docs-example label="score.html" [code]="halfCode">
          <fieldset>
            <legend>Score</legend>
            <div zdRating half class="stars large-half">
              <input type="radio" zdRatingHidden name="score" value="0" aria-label="No rating" />
              @for (value of halves; track value; let odd = $odd) {
                <input
                  type="radio"
                  zdMask
                  shape="star-2"
                  name="score"
                  [half]="odd ? 'half-2' : 'half-1'"
                  [value]="value"
                  [checked]="value === 3.5"
                  [attr.aria-label]="starLabel(value)"
                />
              }
            </div>
          </fieldset>
        </docs-example>
      </docs-section>

      <docs-section
        id="sizes"
        level="3"
        heading="Sizes"
        description="xs and sm stars are smaller than the 24px minimum target size, so use them for display only. These are disabled for that reason."
      >
        <docs-example label="sizes.html" [code]="sizesCode">
          <fieldset class="docs-stack" disabled>
            <legend class="docs-visually-hidden">Rating sizes, display only</legend>
            @for (size of sizes; track size) {
              <div zdRating class="stars" [size]="size">
                @for (value of stars; track value) {
                  <input
                    type="radio"
                    zdMask
                    shape="star-2"
                    [name]="'size-' + size"
                    [value]="value"
                    [checked]="value === 3"
                    [attr.aria-label]="size + ', ' + starLabel(value)"
                  />
                }
              </div>
            }
          </fieldset>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    fieldset {
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-block-end: var(--docs-space-2);
      font-size: var(--docs-text-sm);
      font-weight: var(--docs-weight-semibold);
    }

    .stars input:not(.rating-hidden) {
      background-color: var(--color-warning);
    }

    /* daisyUI's clear option is 0.5rem wide; 24px meets the minimum target size. */
    .stars .rating-hidden {
      inline-size: 1.5rem;
    }

    .large-half {
      --size: 3rem;
    }
  `,
})
export class RatingPageComponent {
  protected readonly reference = ratingReference;
  protected readonly controls = ratingPlaygroundControls;
  protected readonly snippet = ratingPlaygroundSnippet;
  protected readonly stars = starValues;
  protected readonly halves = halfValues;
  protected readonly starsFiles = starsFiles;
  protected readonly halfCode = halfCode;
  protected readonly sizes = controlSizes;
  protected readonly sizesCode = ratingSizesCode;
  protected readonly starLabel = starLabel;
  protected readonly sizeOf = sizeOf;
  protected readonly flagOf = flagOf;

  protected readonly rating = new FormControl(3, { nonNullable: true });
  protected readonly ratingValue = toSignal(this.rating.valueChanges, {
    initialValue: this.rating.value,
  });
}
