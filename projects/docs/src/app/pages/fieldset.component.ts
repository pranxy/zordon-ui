import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdCheckbox } from '@pranxy/zordon-ui/checkbox';
import { ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend } from '@pranxy/zordon-ui/fieldset';
import { ZdSelect } from '@pranxy/zordon-ui/select';
import { ZdTextInput } from '@pranxy/zordon-ui/text-input';

import {
  disabledFiles,
  fieldsetPlaygroundControls,
  fieldsetPlaygroundSnippet,
  fieldsetReference,
  groupingCode,
  nestedCode,
} from '../content/fieldset.content';
import { flagOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes the examples' controls emit, only while this page is in use. */
@Component({
  selector: 'docs-fieldset-daisy-styles',
  template: '',
  styleUrls: [
    './styles/text-input.daisy.css',
    './styles/select.daisy.css',
    './styles/checkbox.daisy.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
class FieldsetDaisyStylesComponent {}

@Component({
  selector: 'docs-fieldset-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    FieldsetDaisyStylesComponent,
    ZdCheckbox,
    ZdFieldset,
    ZdFieldsetLabel,
    ZdFieldsetLegend,
    ZdSelect,
    ZdTextInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-fieldset-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Fieldset"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <fieldset zdFieldset class="group" [disabled]="flagOf(values, 'disabled')">
            <legend zdFieldsetLegend>Shipping address</legend>
            <label zdFieldsetLabel for="street">Street</label>
            <input id="street" zdTextInput autocomplete="street-address" />
            <label zdFieldsetLabel for="postcode">Postcode</label>
            <input id="postcode" zdTextInput autocomplete="postal-code" />
          </fieldset>
        </ng-template>
      </docs-playground>

      <docs-section
        id="grouping"
        level="3"
        heading="Grouping fields"
        description="The legend names the group; each label still points at its own control, and help text is connected from the input."
      >
        <docs-example label="account.html" [code]="groupingCode">
          <fieldset zdFieldset class="group">
            <legend zdFieldsetLegend>Account</legend>
            <label zdFieldsetLabel for="username">Username</label>
            <input
              id="username"
              zdTextInput
              autocomplete="username"
              aria-describedby="username-help"
            />
            <p id="username-help" class="docs-status">3 to 16 letters or digits.</p>
          </fieldset>
        </docs-example>
      </docs-section>

      <docs-section
        id="disabled"
        level="3"
        heading="Disabling a group"
        description="One native disabled attribute turns off every control in the fieldset, including the select."
      >
        <docs-example label="billing" [files]="disabledFiles">
          <div class="docs-stack">
            <label class="docs-choice">
              <input
                type="checkbox"
                zdCheckbox
                [checked]="sameAsShipping()"
                (change)="sameAsShipping.set(!sameAsShipping())"
              />
              Same as shipping address
            </label>
            <fieldset zdFieldset class="group" [disabled]="sameAsShipping()">
              <legend zdFieldsetLegend>Billing address</legend>
              <label zdFieldsetLabel for="billing-street">Street</label>
              <input id="billing-street" zdTextInput autocomplete="billing street-address" />
              <label zdFieldsetLabel for="billing-country">Country</label>
              <select id="billing-country" zdSelect autocomplete="billing country">
                <option>Portugal</option>
                <option>Belgium</option>
                <option>Spain</option>
              </select>
            </fieldset>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="nested"
        level="3"
        heading="Nested groups"
        description="Groups inside groups stay native: each inner legend names its own options."
      >
        <docs-example label="notifications.html" [code]="nestedCode">
          <fieldset zdFieldset class="group">
            <legend zdFieldsetLegend>Notifications</legend>
            <fieldset zdFieldset>
              <legend zdFieldsetLegend>Email</legend>
              <label class="docs-choice">
                <input type="checkbox" zdCheckbox checked /> Product updates
              </label>
              <label class="docs-choice"><input type="checkbox" zdCheckbox /> Newsletter</label>
            </fieldset>
            <fieldset zdFieldset>
              <legend zdFieldsetLegend>Phone</legend>
              <label class="docs-choice">
                <input type="checkbox" zdCheckbox /> Security alerts by SMS
              </label>
            </fieldset>
          </fieldset>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .group {
      inline-size: min(100%, 20rem);
      padding: var(--docs-space-4);
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }
  `,
})
export class FieldsetPageComponent {
  protected readonly reference = fieldsetReference;
  protected readonly controls = fieldsetPlaygroundControls;
  protected readonly snippet = fieldsetPlaygroundSnippet;
  protected readonly groupingCode = groupingCode;
  protected readonly disabledFiles = disabledFiles;
  protected readonly nestedCode = nestedCode;
  protected readonly flagOf = flagOf;

  protected readonly sameAsShipping = signal(true);
}
