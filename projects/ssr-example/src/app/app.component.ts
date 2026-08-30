import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { FormGroupDirective } from '@angular/forms';
import { ZdIdGenerator, ZdTheme } from '@pranxy/zordon-ui';
import { ZdAvatar, ZdAvatarGroup } from '@pranxy/zordon-ui/avatar';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdDivider } from '@pranxy/zordon-ui/divider';
import { ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend } from '@pranxy/zordon-ui/fieldset';
import { ZdFloatingLabel, ZdLabel } from '@pranxy/zordon-ui/label';
import { ZdLink } from '@pranxy/zordon-ui/link';

@Component({
  selector: 'ssr-example-root',
  imports: [
    ReactiveFormsModule,
    ZdAvatar,
    ZdAvatarGroup,
    ZdButton,
    ZdDivider,
    ZdFieldset,
    ZdFieldsetLabel,
    ZdFieldsetLegend,
    ZdFloatingLabel,
    ZdLabel,
    ZdLink,
    ZdTheme,
  ],
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

        <section aria-labelledby="button-heading">
          <h2 id="button-heading">Hydrated native Button</h2>
          <button
            zdButton
            color="primary"
            data-testid="button-pressed"
            type="button"
            [pressed]="buttonPressed()"
            (click)="buttonPressed.update(pressed => !pressed)"
          >
            Toggle hydrated saved state
          </button>
          <button
            zdButton
            color="accent"
            data-testid="button-loading"
            type="button"
            [loading]="buttonLoading()"
            (click)="buttonLoadingClicks.update(clicks => clicks + 1)"
          >
            {{ buttonLoading() ? 'Saving hydrated changes' : 'Save hydrated changes' }}
          </button>
          <button
            data-testid="button-toggle-loading"
            type="button"
            (click)="buttonLoading.update(loading => !loading)"
          >
            Toggle hydrated Button loading
          </button>
          <a
            zdButton
            href="#hydrated-button-target"
            data-testid="button-disabled-link"
            [zdDisabled]="buttonLinkDisabled()"
            (click)="buttonLinkClicks.update(clicks => clicks + 1)"
          >
            Unavailable hydrated settings
          </a>
          <form data-testid="button-form" (submit)="submitButtonForm($event)">
            <input name="button-value" type="hidden" value="hydrated" />
            <button zdButton color="success" data-testid="button-submit" type="submit">
              Submit hydrated native form
            </button>
          </form>
          <output data-testid="button-loading-clicks"
            >Loading clicks: {{ buttonLoadingClicks() }}</output
          >
          <output data-testid="button-link-clicks">Link clicks: {{ buttonLinkClicks() }}</output>
          <output data-testid="button-submit-count">Button submits: {{ buttonSubmits() }}</output>
          <span id="hydrated-button-target" tabindex="-1">Hydrated settings target</span>
        </section>

        <section aria-labelledby="link-heading">
          <h2 id="link-heading">Hydrated native Link</h2>
          <a zdLink data-testid="link-native" hover href="#hydrated-link-target">
            Read hydrated account details
          </a>
          <a
            zdLink
            data-testid="link-disabled"
            href="#hydrated-link-target"
            [zdDisabled]="linkDisabled()"
            (click)="linkClicks.update(clicks => clicks + 1)"
          >
            Unavailable hydrated account details
          </a>
          <button data-testid="link-toggle" type="button" (click)="toggleLink()">
            Toggle hydrated Link availability
          </button>
          <output data-testid="link-clicks">Link clicks: {{ linkClicks() }}</output>
          <span id="hydrated-link-target" tabindex="-1">Hydrated account details</span>
        </section>

        <section aria-labelledby="divider-heading" data-testid="divider-contract">
          <h2 id="divider-heading">Hydrated native Divider</h2>
          <div class="flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <p>Invoice delivery</p>
            <div
              zdDivider
              color="primary"
              orientation="horizontal"
              placement="end"
              data-testid="divider-labeled"
            >
              OR
            </div>
            <p>Account portal</p>
          </div>
          <hr zdDivider color="neutral" data-testid="divider-hr" />
          <div zdDivider aria-hidden="true" data-testid="divider-decorative"></div>
        </section>

        <section aria-labelledby="label-heading" data-testid="label-contract">
          <h2 id="label-heading">Hydrated native Label</h2>
          <label zdLabel for="hydrated-label-email" data-testid="label-explicit"
            >Email address</label
          >
          <input id="hydrated-label-email" type="email" />
          <label zdLabel data-testid="label-implicit"
            >Accept updates <input type="checkbox"
          /></label>
          <label zdFloatingLabel data-testid="label-floating"
            ><span>Full name</span><input placeholder="Full name"
          /></label>
        </section>

        <section aria-labelledby="fieldset-heading" data-testid="fieldset-contract">
          <h2 id="fieldset-heading">Hydrated native Fieldset</h2>
          <fieldset zdFieldset disabled data-testid="fieldset-native">
            <legend zdFieldsetLegend>Delivery method</legend>
            <label zdFieldsetLabel for="hydrated-fieldset-email">Email</label
            ><input id="hydrated-fieldset-email" type="email" />
          </fieldset>
        </section>

        <section aria-labelledby="avatar-heading" data-testid="avatar-contract">
          <h2 id="avatar-heading">Hydrated native Avatar</h2>
          <div zdAvatarGroup data-testid="avatar-group">
            <div zdAvatar presence="online" data-testid="avatar-online">
              <div>
                <img
                  alt="Avery Chen"
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23818cf8'/%3E%3Ccircle cx='32' cy='25' r='14' fill='%23fde68a'/%3E%3Cpath d='M8 64c4-18 16-27 24-27s20 9 24 27' fill='%23312e81'/%3E%3C/svg%3E"
                />
              </div>
            </div>
            <div zdAvatar placeholder presence="offline" data-testid="avatar-placeholder">
              <div><span>AC</span></div>
            </div>
          </div>
        </section>

        <div
          data-testid="async-action-region"
          [attr.aria-busy]="actionPending() ? 'true' : 'false'"
        >
          <button
            data-testid="async-action-start"
            type="button"
            [attr.aria-describedby]="asyncActionStatusId"
            [attr.aria-disabled]="actionPending() ? 'true' : null"
            (click)="startAsyncAction()"
          >
            Save hydrated settings
          </button>
          <button data-testid="async-action-complete" type="button" (click)="completeAsyncAction()">
            Complete hydrated save
          </button>
          <output
            aria-atomic="true"
            data-testid="async-action-status"
            [id]="asyncActionStatusId"
            role="status"
          >
            {{ actionStatus() }}
          </output>
          <output data-testid="async-action-starts">Accepted actions: {{ actionStarts() }}</output>
        </div>
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
  protected readonly asyncActionStatusId = this.ids.next('ssr-example-async-action-status');
  protected readonly validationDescriptionIds = `ssr-consumer-description ${this.validationHintId}`;
  protected readonly count = signal(0);
  protected readonly actionPending = signal(false);
  protected readonly actionStarts = signal(0);
  protected readonly actionStatus = signal('Action idle');
  protected readonly validationControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  protected readonly validationForm = new FormGroup({
    accountCode: this.validationControl,
  });
  protected readonly hydrationReady = signal(false);
  protected readonly serverTheme = signal<string | null>('dark');
  protected readonly buttonPressed = signal(false);
  protected readonly buttonLoading = signal(false);
  protected readonly buttonLoadingClicks = signal(0);
  protected readonly buttonLinkDisabled = signal(true);
  protected readonly buttonLinkClicks = signal(0);
  protected readonly buttonSubmits = signal(0);
  protected readonly linkDisabled = signal(true);
  protected readonly linkClicks = signal(0);
  private actionCompletion: (() => void) | null = null;

  constructor() {
    afterNextRender(() => this.hydrationReady.set(true));
  }

  protected increment(): void {
    this.count.update(value => value + 1);
  }

  protected startAsyncAction(): void {
    if (this.actionPending()) return;
    this.actionPending.set(true);
    this.actionStarts.update(count => count + 1);
    this.actionStatus.set('Saving hydrated settings');
    const promise = new Promise<void>(resolve => {
      this.actionCompletion = resolve;
    });
    void promise.then(() => {
      this.actionStatus.set('Hydrated settings saved');
      this.actionPending.set(false);
      this.actionCompletion = null;
    });
  }

  protected completeAsyncAction(): void {
    this.actionCompletion?.();
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

  protected submitButtonForm(event: SubmitEvent): void {
    event.preventDefault();
    this.buttonSubmits.update(submits => submits + 1);
  }

  protected toggleLink(): void {
    this.linkDisabled.update(disabled => !disabled);
  }
}
