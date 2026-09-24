import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdTextarea } from '@pranxy/zordon-ui/textarea';

import {
  colorOf,
  controlSizes,
  flagOf,
  sizeOf,
  styleOf,
  themeColors,
} from '../content/form-controls.content';
import {
  characterCountFiles,
  noteLimit,
  textareaColorsCode,
  textareaPlaygroundControls,
  textareaPlaygroundSnippet,
  textareaReference,
  textareaSizesCode,
} from '../content/textarea.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Textarea emits, only while this page is in use. */
@Component({
  selector: 'docs-textarea-daisy-styles',
  template: '',
  styleUrl: './styles/textarea.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class TextareaDaisyStylesComponent {}

@Component({
  selector: 'docs-textarea-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ReactiveFormsModule,
    TextareaDaisyStylesComponent,
    ZdTextarea,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-textarea-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Textarea"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <label class="docs-field">
            Release notes
            <textarea
              zdTextarea
              rows="3"
              [color]="colorOf(values)"
              [size]="sizeOf(values)"
              [style]="styleOf(values)"
              [disabled]="flagOf(values, 'disabled')"
            ></textarea>
          </label>
        </ng-template>
      </docs-playground>

      <docs-section
        id="character-count"
        level="3"
        heading="Character count"
        description="maxlength enforces the limit natively; the count is plain text connected with aria-describedby."
      >
        <docs-example label="summary" [files]="characterCountFiles">
          <label class="docs-field">
            Summary
            <textarea
              zdTextarea
              rows="3"
              aria-describedby="summary-count"
              [attr.maxlength]="limit"
              [formControl]="summary"
            ></textarea>
            <small id="summary-count">{{ summaryValue().length }} of {{ limit }} characters</small>
          </label>
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
              <textarea
                zdTextarea
                rows="2"
                [color]="color"
                [attr.aria-label]="color"
                [placeholder]="color"
              ></textarea>
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="sizes"
        level="3"
        heading="Sizes"
        description="Size sets the text size and padding."
      >
        <docs-example label="sizes.html" [code]="sizesCode">
          <div class="docs-stack">
            @for (size of sizes; track size) {
              <textarea
                zdTextarea
                rows="1"
                [size]="size"
                [attr.aria-label]="size"
                [placeholder]="size"
              ></textarea>
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
export class TextareaPageComponent {
  protected readonly reference = textareaReference;
  protected readonly controls = textareaPlaygroundControls;
  protected readonly snippet = textareaPlaygroundSnippet;
  protected readonly characterCountFiles = characterCountFiles;
  protected readonly limit = noteLimit;
  protected readonly colors = themeColors;
  protected readonly sizes = controlSizes;
  protected readonly colorsCode = textareaColorsCode;
  protected readonly sizesCode = textareaSizesCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly styleOf = styleOf;
  protected readonly flagOf = flagOf;

  protected readonly summary = new FormControl('', { nonNullable: true });
  protected readonly summaryValue = toSignal(this.summary.valueChanges, {
    initialValue: this.summary.value,
  });
}
