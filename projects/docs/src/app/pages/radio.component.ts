import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdRadio } from '@pranxy/zordon-ui/radio';

import {
  colorOf,
  controlSizes,
  flagOf,
  sizeOf,
  themeColors,
} from '../content/form-controls.content';
import {
  deliveryOptions,
  groupFiles,
  plans,
  radioColorsCode,
  radioPlaygroundControls,
  radioPlaygroundSnippet,
  radioReference,
  radioSizesCode,
} from '../content/radio.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Radio emits, only while this page is in use. */
@Component({
  selector: 'docs-radio-daisy-styles',
  template: '',
  styleUrl: './styles/radio.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class RadioDaisyStylesComponent {}

@Component({
  selector: 'docs-radio-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    RadioDaisyStylesComponent,
    ReactiveFormsModule,
    ZdRadio,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-radio-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Radio"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <fieldset class="docs-stack">
            <legend>Delivery</legend>
            @for (option of deliveryOptions; track option) {
              <label class="docs-choice">
                <input
                  type="radio"
                  zdRadio
                  name="playground-delivery"
                  [value]="option"
                  [checked]="option === 'standard'"
                  [color]="colorOf(values)"
                  [size]="sizeOf(values)"
                  [disabled]="flagOf(values, 'disabled')"
                />
                {{ option === 'standard' ? 'Standard' : 'Express' }}
              </label>
            }
          </fieldset>
        </ng-template>
      </docs-playground>

      <docs-section
        id="group"
        level="3"
        heading="Radio group"
        description="A fieldset names the group; Angular's radio accessor binds the shared value."
      >
        <docs-example label="plan" [files]="groupFiles">
          <div class="docs-stack">
            <fieldset class="docs-stack">
              <legend>Plan</legend>
              @for (option of plans; track option.value) {
                <label class="docs-choice">
                  <input
                    type="radio"
                    zdRadio
                    color="primary"
                    name="plan"
                    [value]="option.value"
                    [formControl]="plan"
                  />
                  {{ option.label }}
                </label>
              }
            </fieldset>
            <p class="docs-status" role="status">Plan: {{ planValue() }}</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="colors"
        level="3"
        heading="Colors"
        description="Theme roles, not hex values. Omit color for the neutral base style."
      >
        <docs-example label="colors.html" [code]="colorsCode">
          @for (color of colors; track color) {
            <input
              type="radio"
              zdRadio
              checked
              [name]="'color-' + color"
              [color]="color"
              [attr.aria-label]="color"
            />
          }
        </docs-example>
      </docs-section>

      <docs-section id="sizes" level="3" heading="Sizes">
        <docs-example label="sizes.html" [code]="sizesCode">
          @for (size of sizes; track size) {
            <input
              type="radio"
              zdRadio
              checked
              [name]="'size-' + size"
              [size]="size"
              [attr.aria-label]="size"
            />
          }
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
  `,
})
export class RadioPageComponent {
  protected readonly reference = radioReference;
  protected readonly controls = radioPlaygroundControls;
  protected readonly snippet = radioPlaygroundSnippet;
  protected readonly deliveryOptions = deliveryOptions;
  protected readonly plans = plans;
  protected readonly groupFiles = groupFiles;
  protected readonly colors = themeColors;
  protected readonly sizes = controlSizes;
  protected readonly colorsCode = radioColorsCode;
  protected readonly sizesCode = radioSizesCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly flagOf = flagOf;

  protected readonly plan = new FormControl('pro', { nonNullable: true });
  protected readonly planValue = toSignal(this.plan.valueChanges, {
    initialValue: this.plan.value,
  });
}
