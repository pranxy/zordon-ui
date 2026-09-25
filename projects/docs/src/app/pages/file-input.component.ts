import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdFileInput } from '@pranxy/zordon-ui/file-input';

import {
  fileInputColorsCode,
  fileInputPlaygroundControls,
  fileInputPlaygroundSnippet,
  fileInputReference,
  fileInputSizesCode,
  selectionFiles,
} from '../content/file-input.content';
import {
  colorOf,
  controlSizes,
  flagOf,
  sizeOf,
  themeColors,
  variantOf,
} from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes File Input emits, only while this page is in use. */
@Component({
  selector: 'docs-file-input-daisy-styles',
  template: '',
  styleUrl: './styles/file-input.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class FileInputDaisyStylesComponent {}

@Component({
  selector: 'docs-file-input-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    FileInputDaisyStylesComponent,
    ZdFileInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-file-input-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="File Input"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <label class="docs-field">
            Profile photo
            <input
              type="file"
              zdFileInput
              accept="image/*"
              [color]="colorOf(values)"
              [size]="sizeOf(values)"
              [variant]="variantOf(values)"
              [disabled]="flagOf(values, 'disabled')"
            />
          </label>
        </ng-template>
      </docs-playground>

      <docs-section
        id="selection"
        level="3"
        heading="Reading the selection"
        description="Listen to the native change event and read files; the directive adds no value model."
      >
        <docs-example label="attachments" [files]="selectionFiles">
          <div class="docs-field">
            <label for="attachments">Attachments</label>
            <input
              id="attachments"
              type="file"
              zdFileInput
              multiple
              accept=".pdf,image/*"
              aria-describedby="attachments-help"
              (change)="choose($event)"
            />
            <p id="attachments-help">PDF or images, up to 5 files.</p>
            <p class="docs-status" role="status">{{ chosen().join(', ') || 'No files chosen' }}</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="colors"
        level="3"
        heading="Colors"
        description="Theme roles for the border and button. Omit color for the base style."
      >
        <docs-example label="colors.html" [code]="colorsCode">
          <div class="grid">
            @for (color of colors; track color) {
              <input type="file" zdFileInput [color]="color" [attr.aria-label]="color" />
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section id="sizes" level="3" heading="Sizes">
        <docs-example label="sizes.html" [code]="sizesCode">
          <div class="docs-stack sizes">
            @for (size of sizes; track size) {
              <input type="file" zdFileInput [size]="size" [attr.aria-label]="size" />
            }
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .sizes {
      inline-size: min(100%, 26rem);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: var(--docs-space-3);
      inline-size: 100%;
    }
  `,
})
export class FileInputPageComponent {
  protected readonly reference = fileInputReference;
  protected readonly controls = fileInputPlaygroundControls;
  protected readonly snippet = fileInputPlaygroundSnippet;
  protected readonly selectionFiles = selectionFiles;
  protected readonly colors = themeColors;
  protected readonly sizes = controlSizes;
  protected readonly colorsCode = fileInputColorsCode;
  protected readonly sizesCode = fileInputSizesCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly variantOf = variantOf;
  protected readonly flagOf = flagOf;

  protected readonly chosen = signal<string[]>([]);

  protected choose(event: Event): void {
    const files = (event.target as HTMLInputElement).files ?? [];
    this.chosen.set(Array.from(files, file => file.name));
  }
}
