import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ZdToggle } from '@pranxy/zordon-ui/toggle';

import {
  colorOf,
  controlSizes,
  flagOf,
  sizeOf,
  themeColors,
} from '../content/form-controls.content';
import {
  settings,
  settingsFiles,
  toggleColorsCode,
  togglePlaygroundControls,
  togglePlaygroundSnippet,
  toggleReference,
  toggleSizesCode,
} from '../content/toggle.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Toggle emits, only while this page is in use. */
@Component({
  selector: 'docs-toggle-daisy-styles',
  template: '',
  styleUrl: './styles/toggle.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class ToggleDaisyStylesComponent {}

@Component({
  selector: 'docs-toggle-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ReactiveFormsModule,
    ToggleDaisyStylesComponent,
    ZdToggle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-toggle-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Toggle"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <label class="docs-choice">
            <input
              type="checkbox"
              zdToggle
              checked
              [color]="colorOf(values)"
              [size]="sizeOf(values)"
              [disabled]="flagOf(values, 'disabled')"
            />
            Email notifications
          </label>
        </ng-template>
      </docs-playground>

      <docs-section
        id="settings"
        level="3"
        heading="Settings list"
        description="Each toggle is a checkbox bound with formControlName; the group value is a plain object of booleans."
      >
        <docs-example label="settings" [files]="settingsFiles">
          <div class="docs-stack">
            <fieldset class="docs-stack" [formGroup]="form">
              <legend>Notifications</legend>
              @for (setting of settings; track setting.key) {
                <label class="docs-choice setting">
                  <input type="checkbox" zdToggle color="success" [formControlName]="setting.key" />
                  {{ setting.label }}
                </label>
              }
            </fieldset>
            <p class="docs-status" role="status">{{ summary() }}</p>
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
            <input type="checkbox" zdToggle checked [color]="color" [attr.aria-label]="color" />
          }
        </docs-example>
      </docs-section>

      <docs-section id="sizes" level="3" heading="Sizes">
        <docs-example label="sizes.html" [code]="sizesCode">
          @for (size of sizes; track size) {
            <input type="checkbox" zdToggle checked [size]="size" [attr.aria-label]="size" />
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

    .setting {
      justify-content: space-between;
      flex-direction: row-reverse;
      min-inline-size: 16rem;
    }
  `,
})
export class TogglePageComponent {
  protected readonly reference = toggleReference;
  protected readonly controls = togglePlaygroundControls;
  protected readonly snippet = togglePlaygroundSnippet;
  protected readonly settings = settings;
  protected readonly settingsFiles = settingsFiles;
  protected readonly colors = themeColors;
  protected readonly sizes = controlSizes;
  protected readonly colorsCode = toggleColorsCode;
  protected readonly sizesCode = toggleSizesCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly flagOf = flagOf;

  protected readonly form = new FormGroup({
    email: new FormControl(true, { nonNullable: true }),
    digest: new FormControl(false, { nonNullable: true }),
    beta: new FormControl(false, { nonNullable: true }),
  });
  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  protected readonly summary = computed(() => {
    const on = settings.filter(setting => this.value()[setting.key]).map(setting => setting.label);
    return `On: ${on.length ? on.join(', ') : 'nothing'}`;
  });
}
