import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdFilter, ZdFilterItem, ZdFilterReset } from '@pranxy/zordon-ui/filter';

import {
  filterPlaygroundControls,
  filterPlaygroundSnippet,
  filterReference,
  filterSizesCode,
  filterVariantOf,
  filterVariants,
  frameworks,
  singleChoiceFiles,
  statuses,
  variantsCode,
} from '../content/filter.content';
import { colorOf, controlSizes, sizeOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

@Component({
  selector: 'docs-filter-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ReactiveFormsModule,
    ZdFilter,
    ZdFilterItem,
    ZdFilterReset,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Filter"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <fieldset zdFilter>
            <legend class="docs-visually-hidden">Framework</legend>
            <input
              type="radio"
              zdFilterItem
              zdFilterReset
              name="playground-framework"
              aria-label="All frameworks"
              checked
            />
            @for (framework of frameworks; track framework) {
              <input
                type="radio"
                zdFilterItem
                name="playground-framework"
                [attr.aria-label]="framework"
                [color]="colorOf(values)"
                [size]="sizeOf(values)"
                [variant]="filterVariantOf(values)"
              />
            }
          </fieldset>
        </ng-template>
      </docs-playground>

      <docs-section
        id="single-choice"
        level="3"
        heading="Single choice with reset"
        description="Angular's radio accessor binds the value. The reset option is a real radio whose value means everything."
      >
        <docs-example label="status" [files]="singleChoiceFiles">
          <div class="docs-stack">
            <fieldset zdFilter>
              <legend class="docs-visually-hidden">Status</legend>
              <input
                type="radio"
                zdFilterItem
                zdFilterReset
                name="status"
                value="all"
                aria-label="All statuses"
                [formControl]="status"
              />
              @for (option of statuses; track option) {
                <input
                  type="radio"
                  zdFilterItem
                  color="primary"
                  name="status"
                  [value]="option"
                  [attr.aria-label]="option"
                  [formControl]="status"
                />
              }
            </fieldset>
            <p class="docs-status" role="status">Showing: {{ statusValue() }}</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="variants"
        level="3"
        heading="Variants"
        description="Button's treatments. Each row here is its own group."
      >
        <docs-example label="variants.html" [code]="variantsCode">
          <div class="docs-stack">
            @for (variant of variants; track variant) {
              <div zdFilter role="radiogroup" [attr.aria-label]="variant + ' example'">
                <input
                  type="radio"
                  zdFilterItem
                  zdFilterReset
                  [name]="'variant-' + variant"
                  aria-label="All"
                  checked
                />
                @for (framework of frameworks.slice(0, 2); track framework) {
                  <input
                    type="radio"
                    zdFilterItem
                    color="primary"
                    [variant]="variant"
                    [name]="'variant-' + variant"
                    [attr.aria-label]="framework + ' (' + variant + ')'"
                  />
                }
              </div>
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section id="sizes" level="3" heading="Sizes">
        <docs-example label="sizes.html" [code]="sizesCode">
          <div class="docs-stack">
            @for (size of sizes; track size) {
              <div zdFilter role="radiogroup" [attr.aria-label]="size + ' example'">
                @for (framework of frameworks.slice(0, 2); track framework) {
                  <input
                    type="radio"
                    zdFilterItem
                    [size]="size"
                    [name]="'size-' + size"
                    [attr.aria-label]="framework + ' (' + size + ')'"
                  />
                }
              </div>
            }
          </div>
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
  `,
})
export class FilterPageComponent {
  protected readonly reference = filterReference;
  protected readonly controls = filterPlaygroundControls;
  protected readonly snippet = filterPlaygroundSnippet;
  protected readonly frameworks = frameworks;
  protected readonly statuses = statuses;
  protected readonly singleChoiceFiles = singleChoiceFiles;
  protected readonly variants = filterVariants;
  protected readonly variantsCode = variantsCode;
  protected readonly sizes = controlSizes;
  protected readonly sizesCode = filterSizesCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly filterVariantOf = filterVariantOf;

  protected readonly status = new FormControl('all', { nonNullable: true });
  protected readonly statusValue = toSignal(this.status.valueChanges, {
    initialValue: this.status.value,
  });
}
