import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { FormGroupDirective } from '@angular/forms';
import { ZdIdGenerator, ZdTheme } from '@pranxy/zordon-ui';

@Component({
  selector: 'ssr-example-root',
  imports: [ReactiveFormsModule, ZdTheme],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'ssr-example',
  },
  template: `
    <main>
      <p class="eyebrow">Compatibility fixture</p>
      <h1>Zordon UI SSR and hydration example</h1>
      <p data-testid="server-content">
        This content is rendered on the server before the browser application starts.
      </p>

      <section [attr.aria-labelledby]="interactionHeadingId">
        <h2 data-testid="interaction-heading" [id]="interactionHeadingId">Hydrated interaction</h2>
        <p data-testid="counter-description" [id]="counterDescriptionId">
          The initial value is identical on the server and client. The button becomes interactive
          after hydration.
        </p>
        <label [attr.for]="renderStateId">Initial render state</label>
        <input
          [attr.aria-describedby]="counterDescriptionId"
          data-testid="render-state"
          readonly
          value="Server and client agree"
          [id]="renderStateId"
        />
        <form #validationFormDirective="ngForm" [formGroup]="validationForm">
          <p id="ssr-consumer-description">Consumer-provided account guidance.</p>
          <label [attr.for]="validationControlId">Account code</label>
          <input
            [attr.aria-describedby]="validationDescriptionIds"
            [attr.aria-errormessage]="
              validationErrorVisible(validationFormDirective.submitted) ? validationErrorId : null
            "
            [attr.aria-invalid]="
              validationErrorVisible(validationFormDirective.submitted) ? 'true' : null
            "
            data-testid="validation-control"
            formControlName="accountCode"
            [id]="validationControlId"
            required
          />
          <p data-testid="validation-hint" [id]="validationHintId">
            Use the account code shown on your invoice.
          </p>
          <p
            [attr.hidden]="validationErrorVisible(validationFormDirective.submitted) ? null : ''"
            data-testid="validation-error"
            [id]="validationErrorId"
            role="alert"
          >
            {{
              validationErrorVisible(validationFormDirective.submitted)
                ? 'Enter an account code.'
                : ''
            }}
          </p>
          <button data-testid="submit-validation" type="submit">Validate account code</button>
          <button
            data-testid="reset-validation"
            type="button"
            (click)="resetValidation(validationFormDirective)"
          >
            Reset account field
          </button>
          <button data-testid="toggle-validation-disabled" type="button" (click)="toggleDisabled()">
            {{ validationControl.disabled ? 'Enable account field' : 'Disable account field' }}
          </button>
        </form>
        <button
          [attr.aria-describedby]="counterDescriptionId"
          data-testid="increment"
          type="button"
          (click)="increment()"
        >
          Increment hydrated counter
        </button>
        <output aria-atomic="true" data-testid="counter" role="status">
          Hydrated count: {{ count() }}
        </output>
      </section>

      <p data-testid="hydration-state">
        Hydration status: {{ hydrationReady() ? 'ready' : 'server-rendered' }}
      </p>

      <div hidden data-testid="server-theme-scope" [zdTheme]="serverTheme()">
        <span data-testid="server-nested-theme" zdTheme="light"></span>
        <button data-testid="clear-server-theme" type="button" (click)="serverTheme.set(null)">
          Clear server theme
        </button>
      </div>
    </main>
  `,
  styles: `
    :host {
      display: block;
      padding: 2rem;
    }

    main {
      max-width: 44rem;
      margin: 0 auto;
    }

    .eyebrow {
      margin-block-end: 0.25rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin-block: 0 1rem;
    }

    section {
      display: grid;
      gap: 1rem;
      margin-block: 2rem;
      padding: 1.5rem;
      border: 1px solid currentColor;
      border-radius: 0.75rem;
    }

    section > * {
      margin: 0;
    }

    button {
      width: fit-content;
      padding: 0.75rem 1rem;
      border: 2px solid currentColor;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    button:focus-visible {
      outline: 3px solid Highlight;
      outline-offset: 3px;
    }

    output {
      font-weight: 700;
    }
  `,
})
export class SsrExampleAppComponent {
  private readonly ids = inject(ZdIdGenerator);

  protected readonly interactionHeadingId = this.ids.next('ssr-example-heading');
  protected readonly counterDescriptionId = this.ids.next('ssr-example-description');
  protected readonly renderStateId = this.ids.next('ssr-example-state');
  protected readonly validationControlId = this.ids.next('ssr-example-validation-control');
  protected readonly validationHintId = this.ids.next('ssr-example-validation-hint');
  protected readonly validationErrorId = this.ids.next('ssr-example-validation-error');
  protected readonly validationDescriptionIds = `ssr-consumer-description ${this.validationHintId}`;
  protected readonly count = signal(0);
  protected readonly validationControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  protected readonly validationForm = new FormGroup({
    accountCode: this.validationControl,
  });
  protected readonly hydrationReady = signal(false);
  protected readonly serverTheme = signal<string | null>('dark');

  constructor() {
    afterNextRender(() => this.hydrationReady.set(true));
  }

  protected increment(): void {
    this.count.update(value => value + 1);
  }

  protected validationErrorVisible(submitted: boolean): boolean {
    return (
      this.validationControl.invalid &&
      !this.validationControl.pending &&
      (this.validationControl.touched || submitted)
    );
  }

  protected resetValidation(formDirective: FormGroupDirective): void {
    formDirective.resetForm({ accountCode: '' });
  }

  protected toggleDisabled(): void {
    if (this.validationControl.disabled) {
      this.validationControl.enable();
    } else {
      this.validationControl.disable();
    }
  }
}
