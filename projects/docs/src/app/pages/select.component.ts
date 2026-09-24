import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdSelect } from '@pranxy/zordon-ui/select';

import {
  colorOf,
  controlSizes,
  flagOf,
  sizeOf,
  themeColors,
} from '../content/form-controls.content';
import {
  channels,
  formsFiles,
  multipleCode,
  regions,
  selectColorsCode,
  selectPlaygroundControls,
  selectPlaygroundSnippet,
  selectReference,
  selectSizesCode,
} from '../content/select.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Select emits, only while this page is in use. */
@Component({
  selector: 'docs-select-daisy-styles',
  template: '',
  styleUrls: ['./styles/select.daisy.css', './styles/select-modifiers.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class SelectDaisyStylesComponent {}

@Component({
  selector: 'docs-select-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ReactiveFormsModule,
    SelectDaisyStylesComponent,
    ZdSelect,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-select-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Select"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <label class="docs-field">
            Environment
            <select
              zdSelect
              [color]="colorOf(values)"
              [size]="sizeOf(values)"
              [ghost]="flagOf(values, 'ghost')"
              [disabled]="flagOf(values, 'disabled')"
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </label>
        </ng-template>
      </docs-playground>

      <docs-section
        id="forms"
        level="3"
        heading="Groups and Forms"
        description="optgroup labels and disabled options are native; Angular's select accessor binds the value."
      >
        <docs-example label="region" [files]="formsFiles">
          <div class="docs-stack">
            <label class="docs-field">
              Region
              <select zdSelect [formControl]="region">
                @for (group of regions; track group.label) {
                  <optgroup [label]="group.label">
                    @for (option of group.options; track option.value) {
                      <option
                        [value]="option.value"
                        [disabled]="'disabled' in option && option.disabled"
                      >
                        {{ option.label }}
                      </option>
                    }
                  </optgroup>
                }
              </select>
            </label>
            <p class="docs-status" role="status">Region: {{ regionValue() }}</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="multiple"
        level="3"
        heading="Multiple selection"
        description="A native multiple select is a list box. Angular's select-multiple accessor binds an array."
      >
        <docs-example label="channels.html" [code]="multipleCode">
          <div class="docs-stack">
            <label class="docs-field">
              Channels
              <select zdSelect multiple class="channels" [formControl]="chosenChannels">
                @for (channel of channels; track channel) {
                  <option [value]="channel">{{ channel }}</option>
                }
              </select>
            </label>
            <p class="docs-status" role="status">
              Channels: {{ channelsValue().join(', ') || 'none' }}
            </p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="colors"
        level="3"
        heading="Colors"
        description="Theme roles for the border. Omit color for the base style."
      >
        <docs-example label="colors.html" [code]="colorsCode">
          <div class="grid">
            @for (color of colors; track color) {
              <select zdSelect [color]="color" [attr.aria-label]="color">
                <option>{{ color }}</option>
              </select>
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="sizes"
        level="3"
        heading="Sizes"
        description="Heights match Button, Text Input and the other controls of the same size."
      >
        <docs-example label="sizes.html" [code]="sizesCode">
          <div class="docs-stack">
            @for (size of sizes; track size) {
              <select zdSelect [size]="size" [attr.aria-label]="size">
                <option>{{ size }}</option>
              </select>
            }
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: var(--docs-space-3);
      inline-size: 100%;
    }

    .channels {
      block-size: 6.5rem;
    }
  `,
})
export class SelectPageComponent {
  protected readonly reference = selectReference;
  protected readonly controls = selectPlaygroundControls;
  protected readonly snippet = selectPlaygroundSnippet;
  protected readonly regions = regions;
  protected readonly formsFiles = formsFiles;
  protected readonly channels = channels;
  protected readonly multipleCode = multipleCode;
  protected readonly colors = themeColors;
  protected readonly sizes = controlSizes;
  protected readonly colorsCode = selectColorsCode;
  protected readonly sizesCode = selectSizesCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly flagOf = flagOf;

  protected readonly region = new FormControl('eu-west', { nonNullable: true });
  protected readonly regionValue = toSignal(this.region.valueChanges, {
    initialValue: this.region.value,
  });
  protected readonly chosenChannels = new FormControl<string[]>(['Email'], { nonNullable: true });
  protected readonly channelsValue = toSignal(this.chosenChannels.valueChanges, {
    initialValue: this.chosenChannels.value,
  });
}
