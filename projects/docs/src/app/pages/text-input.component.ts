import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZdTextInput } from '@pranxy/zordon-ui/text-input';

import {
  colorOf,
  controlSizes,
  flagOf,
  sizeOf,
  styleOf,
  themeColors,
} from '../content/form-controls.content';
import {
  inputTypes,
  textInputColorsCode,
  textInputPlaygroundControls,
  textInputPlaygroundSnippet,
  textInputReference,
  textInputSizesCode,
  typesCode,
  validationFiles,
} from '../content/text-input.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Text Input emits, only while this page is in use. */
@Component({
  selector: 'docs-text-input-daisy-styles',
  template: '',
  styleUrl: './styles/text-input.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class TextInputDaisyStylesComponent {}

@Component({
  selector: 'docs-text-input-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ReactiveFormsModule,
    TextInputDaisyStylesComponent,
    ZdTextInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-text-input-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Text Input"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <label class="docs-field">
            Full name
            <input
              zdTextInput
              autocomplete="name"
              [color]="colorOf(values)"
              [size]="sizeOf(values)"
              [style]="styleOf(values)"
              [disabled]="flagOf(values, 'disabled')"
            />
          </label>
        </ng-template>
      </docs-playground>

      <docs-section
        id="validation"
        level="3"
        heading="Validation"
        description="Reactive Forms validates; the page decides when to show the error, and says it in text as well as color."
      >
        <docs-example label="email" [files]="validationFiles">
          <label class="docs-field">
            Work email
            <input
              type="email"
              zdTextInput
              autocomplete="email"
              aria-describedby="email-help"
              [formControl]="email"
              [color]="showError() ? 'error' : undefined"
              [attr.aria-invalid]="showError()"
              (blur)="touched.set(true)"
            />
            <small id="email-help">
              {{
                showError()
                  ? 'Enter an email address like ada@example.com.'
                  : 'We only use it to sign you in.'
              }}
            </small>
          </label>
        </docs-example>
      </docs-section>

      <docs-section
        id="types"
        level="3"
        heading="Input types"
        description="Any text-like type works: the browser supplies the keyboard, spinner or picker."
      >
        <docs-example label="types.html" [code]="typesCode">
          <div class="grid">
            @for (field of inputTypes; track field.type) {
              <label class="docs-field">
                {{ field.label }}
                <input zdTextInput [type]="field.type" [attr.autocomplete]="field.autocomplete" />
              </label>
            }
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
              <input zdTextInput [color]="color" [attr.aria-label]="color" [placeholder]="color" />
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="sizes"
        level="3"
        heading="Sizes"
        description="Heights match Button, Select and the other controls of the same size."
      >
        <docs-example label="sizes.html" [code]="sizesCode">
          <div class="docs-stack">
            @for (size of sizes; track size) {
              <input zdTextInput [size]="size" [attr.aria-label]="size" [placeholder]="size" />
            }
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
      gap: var(--docs-space-3);
      inline-size: 100%;
    }
  `,
})
export class TextInputPageComponent {
  protected readonly reference = textInputReference;
  protected readonly controls = textInputPlaygroundControls;
  protected readonly snippet = textInputPlaygroundSnippet;
  protected readonly validationFiles = validationFiles;
  protected readonly inputTypes = inputTypes;
  protected readonly typesCode = typesCode;
  protected readonly colors = themeColors;
  protected readonly sizes = controlSizes;
  protected readonly colorsCode = textInputColorsCode;
  protected readonly sizesCode = textInputSizesCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly styleOf = styleOf;
  protected readonly flagOf = flagOf;

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly touched = signal(false);
  private readonly status = toSignal(this.email.statusChanges, {
    initialValue: this.email.status,
  });
  protected readonly showError = computed(() => this.touched() && this.status() === 'INVALID');
}
