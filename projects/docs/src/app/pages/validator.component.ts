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
import { ZdValidator, ZdValidatorHint } from '@pranxy/zordon-ui/validator';

import { flagOf } from '../content/form-controls.content';
import {
  constraintsCode,
  formsFiles,
  hintFor,
  patternCode,
  validatorPlaygroundControls,
  validatorPlaygroundSnippet,
  validatorReference,
} from '../content/validator.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Validator and the inputs emit, only while this page is in use. */
@Component({
  selector: 'docs-validator-daisy-styles',
  template: '',
  styleUrls: ['./styles/text-input.daisy.css', './styles/validator.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class ValidatorDaisyStylesComponent {}

@Component({
  selector: 'docs-validator-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ReactiveFormsModule,
    ValidatorDaisyStylesComponent,
    ZdTextInput,
    ZdValidator,
    ZdValidatorHint,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-validator-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Validator"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="docs-field">
            <label for="field">Your answer</label>
            <input
              id="field"
              zdTextInput
              zdValidator
              aria-describedby="field-hint"
              min="1"
              max="10"
              [type]="typeOf(values)"
              [required]="flagOf(values, 'required')"
            />
            <p id="field-hint" zdValidatorHint>{{ hintFor[typeOf(values)] }}</p>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="constraints"
        level="3"
        heading="Native constraints"
        description="type and required are enough: the browser decides validity, and the hint appears once the field has been edited and left."
      >
        <docs-example label="work-email.html" [code]="constraintsCode">
          <div class="docs-field">
            <label for="work-email">Work email</label>
            <input
              id="work-email"
              type="email"
              required
              zdTextInput
              zdValidator
              autocomplete="email"
              aria-describedby="work-email-hint"
            />
            <p id="work-email-hint" zdValidatorHint>Enter an email address like ada@example.com.</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="pattern"
        level="3"
        heading="Pattern and hint"
        description="pattern, minlength and maxlength add rules; the hint says them in words."
      >
        <docs-example label="username.html" [code]="patternCode">
          <div class="docs-field">
            <label for="handle">Username</label>
            <input
              id="handle"
              zdTextInput
              zdValidator
              required
              pattern="[A-Za-z][A-Za-z0-9\\-]*"
              minlength="3"
              maxlength="30"
              autocomplete="username"
              aria-describedby="handle-hint"
            />
            <p id="handle-hint" zdValidatorHint>
              3 to 30 characters: letters, digits or dashes, starting with a letter.
            </p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="forms"
        level="3"
        heading="Angular Forms"
        description="Angular validators don't touch native validity, so bind aria-invalid from the control. daisyUI styles that the same way."
      >
        <docs-example label="invite" [files]="formsFiles">
          <div class="docs-field">
            <label for="invite">Invite code</label>
            <input
              id="invite"
              zdTextInput
              zdValidator
              aria-describedby="invite-hint"
              [formControl]="invite"
              [attr.aria-invalid]="showError()"
              (blur)="touched.set(true)"
            />
            <p id="invite-hint" zdValidatorHint>Invite codes are 8 letters or digits.</p>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
})
export class ValidatorPageComponent {
  protected readonly reference = validatorReference;
  protected readonly controls = validatorPlaygroundControls;
  protected readonly snippet = validatorPlaygroundSnippet;
  protected readonly hintFor = hintFor;
  protected readonly constraintsCode = constraintsCode;
  protected readonly patternCode = patternCode;
  protected readonly formsFiles = formsFiles;
  protected readonly flagOf = flagOf;

  protected readonly invite = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^[A-Z0-9]{8}$/i)],
  });
  protected readonly touched = signal(false);
  private readonly status = toSignal(this.invite.statusChanges, {
    initialValue: this.invite.status,
  });
  protected readonly showError = computed(() => this.touched() && this.status() === 'INVALID');

  protected typeOf(values: PlaygroundValues): string {
    return values['type'] as string;
  }
}
