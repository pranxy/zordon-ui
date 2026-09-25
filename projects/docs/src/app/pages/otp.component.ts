import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZdOtp } from '@pranxy/zordon-ui/otp';

import {
  alphanumericCode,
  completedFiles,
  formsFiles,
  otpPlaygroundControls,
  otpPlaygroundSnippet,
  otpReference,
} from '../content/otp.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's input class, which the OTP cells use, only while this page is in use. */
@Component({
  selector: 'docs-otp-daisy-styles',
  template: '',
  styleUrl: './styles/text-input.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class OtpDaisyStylesComponent {}

@Component({
  selector: 'docs-otp-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    OtpDaisyStylesComponent,
    ReactiveFormsModule,
    ZdOtp,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-otp-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="OTP"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          @for (length of [lengthOf(values)]; track length) {
            <zd-otp ariaLabel="Verification code" [length]="length" />
          }
        </ng-template>
      </docs-playground>

      <docs-section
        id="forms"
        level="3"
        heading="Reactive Forms"
        description="The control's value is one string. Validate its length like any other text."
      >
        <docs-example label="verify" [files]="formsFiles">
          <div class="docs-stack">
            <p id="code-help" class="docs-status">We sent a 6-digit code to ada@example.com.</p>
            <zd-otp
              ariaLabel="Verification code"
              aria-describedby="code-help"
              [formControl]="code"
            />
            <p class="docs-status" role="status">
              Value: "{{ codeValue() }}" · {{ codeValid() ? 'complete' : 'incomplete' }}
            </p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="alphanumeric"
        level="3"
        heading="Letters and digits"
        description="Widen pattern and switch inputMode to text; characters outside the pattern are dropped."
      >
        <docs-example label="voucher.html" [code]="alphanumericCode">
          <zd-otp length="5" pattern="[A-Za-z0-9]" inputMode="text" ariaLabel="Voucher code" />
        </docs-example>
      </docs-section>

      <docs-section
        id="completed"
        level="3"
        heading="Completion"
        description="completed fires once every cell holds an allowed character, which is a good moment to verify."
      >
        <docs-example label="pin" [files]="completedFiles">
          <div class="docs-stack">
            <zd-otp length="4" ariaLabel="Card PIN" (completed)="check($event)" />
            <p class="docs-status" role="status">{{ message() }}</p>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
})
export class OtpPageComponent {
  protected readonly reference = otpReference;
  protected readonly controls = otpPlaygroundControls;
  protected readonly snippet = otpPlaygroundSnippet;
  protected readonly formsFiles = formsFiles;
  protected readonly alphanumericCode = alphanumericCode;
  protected readonly completedFiles = completedFiles;

  protected readonly code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });
  protected readonly codeValue = toSignal(this.code.valueChanges, {
    initialValue: this.code.value,
  });
  private readonly codeStatus = toSignal(this.code.statusChanges, {
    initialValue: this.code.status,
  });
  protected readonly codeValid = computed(() => this.codeStatus() === 'VALID');
  protected readonly message = signal('Enter all four digits.');

  protected lengthOf(values: PlaygroundValues): number {
    return Number(values['length']);
  }

  protected check(pin: string): void {
    this.message.set(`Checking ${pin.length} digits…`);
  }
}
