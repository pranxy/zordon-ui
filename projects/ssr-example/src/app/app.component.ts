import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { FormGroupDirective } from '@angular/forms';
import { ZdIdGenerator, ZdTheme } from '@pranxy/zordon-ui';
import { ZdAura } from '@pranxy/zordon-ui/aura';
import { ZdAvatar, ZdAvatarGroup } from '@pranxy/zordon-ui/avatar';
import { ZdBadge } from '@pranxy/zordon-ui/badge';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdCard, ZdCardActions, ZdCardBody, ZdCardTitle } from '@pranxy/zordon-ui/card';
import { ZdCarousel, ZdCarouselItem } from '@pranxy/zordon-ui/carousel';
import { ZdCollapse, ZdCollapseContent, ZdCollapseTitle } from '@pranxy/zordon-ui/collapse';
import { ZdCountdown } from '@pranxy/zordon-ui/countdown';
import { ZdDiff, ZdDiffItem1, ZdDiffItem2, ZdDiffResizer } from '@pranxy/zordon-ui/diff';
import {
  ZdChat,
  ZdChatBubble,
  ZdChatFooter,
  ZdChatHeader,
  ZdChatImage,
} from '@pranxy/zordon-ui/chat-bubble';
import { ZdDivider } from '@pranxy/zordon-ui/divider';
import { ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend } from '@pranxy/zordon-ui/fieldset';
import { ZdHover3d } from '@pranxy/zordon-ui/hover-3d';
import { ZdHoverGallery } from '@pranxy/zordon-ui/hover-gallery';
import { ZdList, ZdListColGrow, ZdListColWrap, ZdListRow } from '@pranxy/zordon-ui/list';
import { ZdTable } from '@pranxy/zordon-ui/table';
import { ZdKbd } from '@pranxy/zordon-ui/kbd';
import { ZdFloatingLabel, ZdLabel } from '@pranxy/zordon-ui/label';
import { ZdLink } from '@pranxy/zordon-ui/link';
import { ZdStatus } from '@pranxy/zordon-ui/status';

@Component({
  selector: 'ssr-example-root',
  imports: [
    ReactiveFormsModule,
    ZdAura,
    ZdAvatar,
    ZdAvatarGroup,
    ZdBadge,
    ZdButton,
    ZdCard,
    ZdCardActions,
    ZdCardBody,
    ZdCardTitle,
    ZdCarousel,
    ZdCarouselItem,
    ZdCollapse,
    ZdCollapseContent,
    ZdCollapseTitle,
    ZdCountdown,
    ZdDiff,
    ZdDiffItem1,
    ZdDiffItem2,
    ZdDiffResizer,
    ZdChat,
    ZdChatBubble,
    ZdChatFooter,
    ZdChatHeader,
    ZdChatImage,
    ZdDivider,
    ZdFieldset,
    ZdFieldsetLabel,
    ZdFieldsetLegend,
    ZdHover3d,
    ZdHoverGallery,
    ZdList,
    ZdListColGrow,
    ZdListColWrap,
    ZdListRow,
    ZdTable,
    ZdKbd,
    ZdFloatingLabel,
    ZdLabel,
    ZdLink,
    ZdStatus,
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

        <section aria-labelledby="hover-3d-heading" data-testid="hover-3d-contract">
          <h2 id="hover-3d-heading">Hydrated native Hover 3D</h2>
          <a zdHover3d data-testid="hover-3d-example" href="#hover-3d-target">
            <div>Product preview</div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
          </a>
          <span id="hover-3d-target">Hover 3D target</span>
        </section>
        <section aria-labelledby="hover-gallery-heading" data-testid="hover-gallery-contract">
          <h2 id="hover-gallery-heading">Hydrated native Hover Gallery</h2>
          <figure zdHoverGallery data-testid="hover-gallery-example">
            <img
              alt="Blue product angle"
              src="https://placehold.co/480x320/2563eb/ffffff?text=Blue"
            />
            <img
              alt="Purple product angle"
              src="https://placehold.co/480x320/7c3aed/ffffff?text=Purple"
            />
            <img
              alt="Green product angle"
              src="https://placehold.co/480x320/059669/ffffff?text=Green"
            />
          </figure>
        </section>
        <section aria-labelledby="list-heading" data-testid="list-contract">
          <h2 id="list-heading">Hydrated native List</h2>
          <ul zdList aria-label="Recently played tracks" data-testid="list-example">
            <li zdListRow data-testid="list-row-example">
              <span>01</span>
              <div zdListColGrow>Moonlit Drive</div>
              <p zdListColWrap>Saved for offline listening.</p>
              <button type="button" aria-label="Play Moonlit Drive">Play</button>
            </li>
          </ul>
        </section>
        <section aria-labelledby="table-heading" data-testid="table-contract">
          <h2 id="table-heading">Hydrated native Table</h2>
          <table zdTable size="sm" zebra pinRows data-testid="table-example">
            <caption>
              Monthly deployments
            </caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">September</th>
                <td>12</td>
              </tr>
            </tbody>
          </table>
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

        <section aria-labelledby="badge-heading" data-testid="badge-contract">
          <h2 id="badge-heading">Hydrated native Badge</h2>
          <span
            zdBadge
            color="success"
            size="xl"
            [style]="'soft'"
            role="status"
            data-testid="badge-status"
          >
            Deployment complete
          </span>
          <button
            zdBadge
            color="primary"
            size="xs"
            [style]="'outline'"
            type="button"
            disabled
            data-testid="badge-action"
          >
            Remove filter
          </button>
          <span zdBadge color="error" size="sm" [style]="'dash'" data-testid="badge-dash"
            >Attention</span
          >
          <span zdBadge color="error" size="xs" aria-hidden="true" data-testid="badge-dot"></span>
          <span zdBadge color="neutral" [style]="'ghost'" data-testid="badge-ghost">Retrying</span>
        </section>

        <section aria-labelledby="card-heading" data-testid="card-contract">
          <h2 id="card-heading">Hydrated native Card</h2>
          <article zdCard size="xl" [style]="'border'" data-testid="card-article">
            <figure>
              <img
                alt="Purple geometric launch illustration"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 2'%3E%3Crect width='4' height='2' fill='%234f46e5'/%3E%3C/svg%3E"
              />
            </figure>
            <div zdCardBody>
              <h3 zdCardTitle>Launch report</h3>
              <p>Every system is ready for the next window.</p>
              <div zdCardActions><button type="button">View report</button></div>
            </div>
          </article>
          <label zdCard size="xs" [style]="'dash'" side data-testid="card-selectable">
            <input name="ssr-plan" type="radio" value="standard" />
            <div zdCardBody>
              <h3 zdCardTitle>Standard plan</h3>
              <p>Consumer-owned radio selection.</p>
            </div>
          </label>
          <article zdCard imageFull data-testid="card-image-full">
            <figure>
              <img
                alt="Night forest landscape"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 2'%3E%3Crect width='4' height='2' fill='%23166534'/%3E%3C/svg%3E"
              />
            </figure>
            <div zdCardBody>
              <h3 zdCardTitle>Trail conditions</h3>
              <p>Open with light fog.</p>
            </div>
          </article>
        </section>
        <section aria-labelledby="carousel-heading" data-testid="carousel-contract">
          <h2 id="carousel-heading">Hydrated native Carousel</h2>
          <ol
            zdCarousel
            align="center"
            aria-label="Hydrated featured articles"
            data-testid="carousel-horizontal"
          >
            <li zdCarouselItem>Architecture report</li>
            <li zdCarouselItem>Release notes</li>
          </ol>
          <ol
            zdCarousel
            align="end"
            orientation="vertical"
            aria-label="Hydrated deployment checklist"
            data-testid="carousel-vertical"
          >
            <li zdCarouselItem>Validate the deployment</li>
            <li zdCarouselItem>Notify the team</li>
          </ol>
        </section>
        <section aria-labelledby="collapse-heading" data-testid="collapse-contract">
          <h2 id="collapse-heading">Hydrated native Collapse</h2>
          <details zdCollapse indicator="arrow" data-testid="collapse-details">
            <summary zdCollapseTitle>Hydrated release notes</summary>
            <div zdCollapseContent>Native details owns the disclosure state after hydration.</div>
          </details>
          <div zdCollapse indicator="plus" forcedState="close" data-testid="collapse-checkbox">
            <input id="ssr-collapse-toggle" type="checkbox" />
            <label zdCollapseTitle for="ssr-collapse-toggle">Hydrated optional updates</label>
            <div zdCollapseContent>Consumer checkbox owns the disclosure state.</div>
          </div>
        </section>
        <section aria-labelledby="kbd-heading" data-testid="kbd-contract">
          <h2 id="kbd-heading">Hydrated native Kbd</h2>
          <p>Press <kbd zdKbd size="xs" data-testid="kbd-inline">F</kbd> to search.</p>
          <p aria-label="Control plus Shift plus Delete" data-testid="kbd-combination">
            <kbd zdKbd aria-hidden="true">Ctrl</kbd> +
            <kbd zdKbd size="xl" aria-hidden="true" data-testid="kbd-xl">Shift</kbd> +
            <kbd zdKbd aria-hidden="true">Del</kbd>
          </p>
        </section>
        <section aria-labelledby="status-heading" data-testid="status-contract">
          <h2 id="status-heading">Hydrated native Status</h2>
          <p>
            <span
              zdStatus
              color="success"
              size="xl"
              role="img"
              aria-label="Service online"
              data-testid="status-online"
            ></span>
            Service online
          </p>
        </section>
        <section aria-labelledby="countdown-heading" data-testid="countdown-contract">
          <h2 id="countdown-heading">Hydrated native Countdown</h2>
          <span
            zdCountdown
            aria-label="59 seconds remaining"
            data-testid="countdown-remaining"
            role="img"
            ><span aria-hidden="true" style="--value: 59">59</span></span
          >
        </section>
        <section aria-labelledby="diff-heading" data-testid="diff-contract">
          <h2 id="diff-heading">Hydrated native Diff</h2>
          <figure zdDiff class="aspect-video" data-testid="diff-example" tabindex="0">
            <div zdDiffItem1 data-testid="diff-before" tabindex="0"><div>Before</div></div>
            <div zdDiffItem2 data-testid="diff-after"><div>After</div></div>
            <div zdDiffResizer data-testid="diff-resizer"></div>
          </figure>
        </section>
        <section aria-labelledby="chat-heading" data-testid="chat-contract">
          <h2 id="chat-heading">Hydrated native Chat Bubble</h2>
          <ol aria-label="Hydrated conversation">
            <li zdChat placement="start" data-testid="chat-start">
              <div zdChatImage>
                <img
                  alt="Ava Chen"
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23818cf8'/%3E%3C/svg%3E"
                />
              </div>
              <div zdChatHeader>Ava <time datetime="2026-09-01T10:45">10:45</time></div>
              <div zdChatBubble color="primary">The deployment is ready.</div>
              <div zdChatFooter>Delivered</div>
            </li>
            <li zdChat placement="end" data-testid="chat-end">
              <div zdChatBubble color="success">I’ll review it now.</div>
              <div zdChatFooter>Seen</div>
            </li>
          </ol>
        </section>

        <section aria-labelledby="aura-heading" data-testid="aura-contract">
          <h2 id="aura-heading">Hydrated native Aura</h2>
          <div zdAura size="lg" variant="rainbow" data-testid="aura-rainbow">
            <button type="button">Start free trial</button>
          </div>
          <div zdAura size="xs" variant="glow" data-testid="aura-glow">
            <div>Decorative static glow under reduced motion</div>
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
