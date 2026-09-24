import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZdCheckbox } from '@pranxy/zordon-ui/checkbox';

import {
  checkboxColorsCode,
  checkboxPlaygroundControls,
  checkboxPlaygroundSnippet,
  checkboxReference,
  checkboxSizesCode,
  formsFiles,
  mixedStateFiles,
  toppings,
} from '../content/checkbox.content';
import {
  colorOf,
  controlSizes,
  flagOf,
  sizeOf,
  themeColors,
} from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Checkbox emits, only while this page is in use. */
@Component({
  selector: 'docs-checkbox-daisy-styles',
  template: '',
  styleUrl: './styles/checkbox.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class CheckboxDaisyStylesComponent {}

@Component({
  selector: 'docs-checkbox-page',
  imports: [
    CheckboxDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ReactiveFormsModule,
    ZdCheckbox,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-checkbox-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Checkbox"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <label class="docs-choice">
            <input
              type="checkbox"
              zdCheckbox
              checked
              [color]="colorOf(values)"
              [size]="sizeOf(values)"
              [disabled]="flagOf(values, 'disabled')"
            />
            Email me product updates
          </label>
        </ng-template>
      </docs-playground>

      <docs-section
        id="colors"
        level="3"
        heading="Colors"
        description="Theme roles, not hex values. Omit color for the neutral base style."
      >
        <docs-example label="colors.html" [code]="colorsCode">
          @for (color of colors; track color) {
            <input type="checkbox" zdCheckbox checked [color]="color" [attr.aria-label]="color" />
          }
        </docs-example>
      </docs-section>

      <docs-section id="sizes" level="3" heading="Sizes">
        <docs-example label="sizes.html" [code]="sizesCode">
          @for (size of sizes; track size) {
            <input type="checkbox" zdCheckbox checked [size]="size" [attr.aria-label]="size" />
          }
        </docs-example>
      </docs-section>

      <docs-section
        id="indeterminate"
        level="3"
        heading="Mixed state"
        description="indeterminate is a DOM property, not an attribute, so bind it. The browser announces the parent as mixed until every option matches."
      >
        <docs-example label="toppings" [files]="mixedStateFiles">
          <fieldset class="docs-stack">
            <legend class="docs-visually-hidden">Toppings</legend>
            <label class="docs-choice">
              <input
                type="checkbox"
                zdCheckbox
                [checked]="all()"
                [indeterminate]="some()"
                (change)="toggleAll()"
              />
              All toppings
            </label>
            @for (topping of toppings; track topping) {
              <label class="docs-choice nested">
                <input
                  type="checkbox"
                  zdCheckbox
                  size="sm"
                  [checked]="chosen().has(topping)"
                  (change)="toggle(topping)"
                />
                {{ topping }}
              </label>
            }
          </fieldset>
        </docs-example>
      </docs-section>

      <docs-section
        id="forms"
        level="3"
        heading="Reactive Forms"
        description="Angular's own checkbox accessor does the binding; the directive adds no value model or validator."
      >
        <docs-example label="terms" [files]="formsFiles">
          <div class="docs-stack">
            <label class="docs-choice">
              <input
                type="checkbox"
                zdCheckbox
                color="primary"
                aria-describedby="terms-help"
                [formControl]="terms"
              />
              I accept the terms
            </label>
            <p id="terms-help" class="docs-status">
              Required to continue. {{ termsValid() ? 'Valid' : 'Not accepted yet.' }}
            </p>
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

    .nested {
      padding-inline-start: 1.5rem;
    }
  `,
})
export class CheckboxPageComponent {
  protected readonly reference = checkboxReference;
  protected readonly controls = checkboxPlaygroundControls;
  protected readonly snippet = checkboxPlaygroundSnippet;
  protected readonly colors = themeColors;
  protected readonly sizes = controlSizes;
  protected readonly colorsCode = checkboxColorsCode;
  protected readonly sizesCode = checkboxSizesCode;
  protected readonly mixedStateFiles = mixedStateFiles;
  protected readonly formsFiles = formsFiles;
  protected readonly toppings = toppings;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly flagOf = flagOf;

  protected readonly chosen = signal<ReadonlySet<string>>(new Set(['Basil']));
  protected readonly all = computed(() => this.chosen().size === toppings.length);
  protected readonly some = computed(() => this.chosen().size > 0 && !this.all());

  protected readonly terms = new FormControl(false, {
    nonNullable: true,
    validators: Validators.requiredTrue,
  });
  private readonly termsStatus = toSignal(this.terms.statusChanges, {
    initialValue: this.terms.status,
  });
  protected readonly termsValid = computed(() => this.termsStatus() === 'VALID');

  protected toggleAll(): void {
    this.chosen.set(new Set(this.all() ? [] : toppings));
  }

  protected toggle(topping: string): void {
    const next = new Set(this.chosen());
    if (next.has(topping)) next.delete(topping);
    else next.add(topping);
    this.chosen.set(next);
  }
}
