import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdRange } from '@pranxy/zordon-ui/range';

import {
  colorOf,
  controlSizes,
  flagOf,
  sizeOf,
  themeColors,
} from '../content/form-controls.content';
import {
  rangeColorsCode,
  rangePlaygroundControls,
  rangePlaygroundSnippet,
  rangeReference,
  rangeSizesCode,
  tickValues,
  ticksCode,
  valueFiles,
  verticalFiles,
} from '../content/range.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Range emits, only while this page is in use. */
@Component({
  selector: 'docs-range-daisy-styles',
  template: '',
  styleUrl: './styles/range.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class RangeDaisyStylesComponent {}

@Component({
  selector: 'docs-range-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    RangeDaisyStylesComponent,
    ReactiveFormsModule,
    ZdRange,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-range-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Range"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="docs-field">
            <label for="brightness">Brightness</label>
            <span [class.vertical-track]="flagOf(values, 'vertical')">
              <input
                id="brightness"
                type="range"
                zdRange
                min="0"
                max="100"
                value="60"
                [color]="colorOf(values)"
                [size]="sizeOf(values)"
                [vertical]="flagOf(values, 'vertical')"
                [disabled]="flagOf(values, 'disabled')"
              />
            </span>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="value"
        level="3"
        heading="Showing the value"
        description="The browser does not display the number. Show it as text, and give screen readers a friendlier value with aria-valuetext."
      >
        <docs-example label="volume" [files]="valueFiles">
          <div class="docs-field">
            <label for="volume">Volume</label>
            <div class="docs-cluster">
              <input
                id="volume"
                type="range"
                zdRange
                color="primary"
                min="0"
                max="100"
                [formControl]="volume"
                [attr.aria-valuetext]="volumeValue() + ' percent'"
              />
              <output for="volume" class="docs-status">{{ volumeValue() }}%</output>
            </div>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="ticks"
        level="3"
        heading="Steps and ticks"
        description="step limits the values; a datalist suggests them, and labels under the track show them."
      >
        <docs-example label="quality.html" [code]="ticksCode">
          <div class="docs-field">
            <label for="quality">Quality</label>
            <input
              id="quality"
              type="range"
              zdRange
              min="0"
              max="100"
              step="25"
              value="50"
              list="quality-ticks"
            />
            <datalist id="quality-ticks">
              @for (tick of ticks; track tick) {
                <option [value]="tick"></option>
              }
            </datalist>
            <div class="ticks" aria-hidden="true">
              @for (tick of ticks; track tick) {
                <span>{{ tick }}</span>
              }
            </div>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="colors"
        level="3"
        heading="Colors"
        description="Theme roles for the fill and thumb. Omit color for the base style."
      >
        <docs-example label="colors.html" [code]="colorsCode">
          <div class="docs-stack wide">
            @for (color of colors; track color) {
              <input type="range" zdRange value="60" [color]="color" [attr.aria-label]="color" />
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section id="sizes" level="3" heading="Sizes">
        <docs-example label="sizes.html" [code]="sizesCode">
          <div class="docs-stack wide">
            @for (size of sizes; track size) {
              <input type="range" zdRange value="60" [size]="size" [attr.aria-label]="size" />
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="vertical"
        level="3"
        heading="Vertical"
        description="vertical turns the track with writing-mode; the maximum is at the top. daisyUI measures the fill against a size container, so wrap the input in one with a height."
      >
        <docs-example label="level" [files]="verticalFiles">
          <div class="docs-cluster">
            @for (color of verticalColors; track color) {
              <span class="vertical-track">
                <input
                  type="range"
                  zdRange
                  vertical
                  value="40"
                  [color]="color"
                  [attr.aria-label]="color + ' level'"
                />
              </span>
            }
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .wide {
      inline-size: min(100%, 20rem);
    }

    .ticks {
      display: flex;
      justify-content: space-between;
      padding-inline: 0.4rem;
      color: var(--docs-muted-text);
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
      font-weight: normal;
    }

    /* daisyUI sizes the vertical fill in container query units (cqh), so the track needs a
       size container with a height. */
    .vertical-track {
      display: block;
      container-type: size;
      block-size: 10rem;
      inline-size: 2rem;
    }
  `,
})
export class RangePageComponent {
  protected readonly reference = rangeReference;
  protected readonly controls = rangePlaygroundControls;
  protected readonly snippet = rangePlaygroundSnippet;
  protected readonly valueFiles = valueFiles;
  protected readonly ticks = tickValues;
  protected readonly ticksCode = ticksCode;
  protected readonly verticalFiles = verticalFiles;
  protected readonly colors = themeColors;
  protected readonly verticalColors = ['primary', 'secondary', 'accent'] as const;
  protected readonly sizes = controlSizes;
  protected readonly colorsCode = rangeColorsCode;
  protected readonly sizesCode = rangeSizesCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly flagOf = flagOf;

  protected readonly volume = new FormControl(40, { nonNullable: true });
  protected readonly volumeValue = toSignal(this.volume.valueChanges, {
    initialValue: this.volume.value,
  });
}
