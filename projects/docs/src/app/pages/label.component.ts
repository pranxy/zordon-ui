import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdCheckbox } from '@pranxy/zordon-ui/checkbox';
import { ZdFloatingLabel, ZdLabel } from '@pranxy/zordon-ui/label';
import { ZdTextInput } from '@pranxy/zordon-ui/text-input';

import {
  associationCode,
  floatingCode,
  labelPlaygroundControls,
  labelPlaygroundSnippet,
  labelReference,
} from '../content/label.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes the examples' controls emit, only while this page is in use. */
@Component({
  selector: 'docs-label-daisy-styles',
  template: '',
  styleUrls: ['./styles/text-input.daisy.css', './styles/checkbox.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class LabelDaisyStylesComponent {}

@Component({
  selector: 'docs-label-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    LabelDaisyStylesComponent,
    ZdCheckbox,
    ZdFloatingLabel,
    ZdLabel,
    ZdTextInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-label-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Label"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          @if (values['directive'] === 'zdFloatingLabel') {
            <label zdFloatingLabel class="field">
              <span>City</span>
              <input zdTextInput placeholder="City" autocomplete="address-level2" />
            </label>
          } @else {
            <div class="docs-stack field">
              <label zdLabel for="city">City</label>
              <input id="city" zdTextInput autocomplete="address-level2" />
            </div>
          }
        </ng-template>
      </docs-playground>

      <docs-section
        id="association"
        level="3"
        heading="Associating a control"
        description="Point the label at an id with for, or wrap the control. Either way, clicking the text focuses or toggles the control."
      >
        <docs-example label="association.html" [code]="associationCode">
          <div class="docs-stack field">
            <label zdLabel for="company">Company</label>
            <input id="company" zdTextInput autocomplete="organization" />
            <label zdLabel>
              <input type="checkbox" zdCheckbox />
              Keep me signed in
            </label>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="floating"
        level="3"
        heading="Floating label"
        description="The text sits in the field until it has focus or a value. The control needs a placeholder for daisyUI's CSS to detect an empty field."
      >
        <docs-example label="floating.html" [code]="floatingCode">
          <div class="docs-stack field">
            <label zdFloatingLabel>
              <span>Email address</span>
              <input type="email" zdTextInput placeholder="Email address" autocomplete="email" />
            </label>
            <label zdFloatingLabel>
              <span>Promo code</span>
              <input zdTextInput zdSize="lg" placeholder="Promo code" />
            </label>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .field {
      inline-size: min(100%, 20rem);
    }
  `,
})
export class LabelPageComponent {
  protected readonly reference = labelReference;
  protected readonly controls = labelPlaygroundControls;
  protected readonly snippet = labelPlaygroundSnippet;
  protected readonly associationCode = associationCode;
  protected readonly floatingCode = floatingCode;
}
