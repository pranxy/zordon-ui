import { CdkMonitorFocus, CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { type Direction, Dir, Directionality } from '@angular/cdk/bidi';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewContainerRef,
  viewChild,
} from '@angular/core';
import { ZdTheme } from '@pranxy/zordon-ui';
import { ZdAura } from '@pranxy/zordon-ui/aura';
import { ZdAvatar, ZdAvatarGroup } from '@pranxy/zordon-ui/avatar';
import { ZdBadge } from '@pranxy/zordon-ui/badge';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdCard, ZdCardActions, ZdCardBody, ZdCardTitle } from '@pranxy/zordon-ui/card';
import { ZdCarousel, ZdCarouselItem } from '@pranxy/zordon-ui/carousel';
import { ZdCollapse, ZdCollapseContent, ZdCollapseTitle } from '@pranxy/zordon-ui/collapse';
import {
  ZdChat,
  ZdChatBubble,
  ZdChatFooter,
  ZdChatHeader,
  ZdChatImage,
} from '@pranxy/zordon-ui/chat-bubble';
import { ZdDivider } from '@pranxy/zordon-ui/divider';
import { ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend } from '@pranxy/zordon-ui/fieldset';
import { ZdKbd } from '@pranxy/zordon-ui/kbd';
import { ZdFloatingLabel, ZdLabel } from '@pranxy/zordon-ui/label';
import { ZdLink } from '@pranxy/zordon-ui/link';
import { ZdStatus } from '@pranxy/zordon-ui/status';

import { ZdOverlayCoordinator } from '../../../../components/src/internal/overlay/overlay-coordinator';
import type { ZdOverlayHandle } from '../../../../components/src/internal/overlay/overlay-contracts';
import { AsyncActionProbeComponent } from './async-action-probe.component';

@Component({
  selector: 'app-theme-host-fixture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `Theme host fixture`,
})
class ThemeHostFixtureComponent {}

@Component({
  host: {
    'data-testid': 'positioned-overlay-panel',
    'class': 'block h-20 w-32 rounded-box border bg-base-100 p-3 shadow',
  },
  template: `Positioned overlay
    <output data-testid="positioned-overlay-direction">{{ directionality.valueSignal() }}</output>`,
})
class PositionedOverlayPanelComponent {
  protected readonly directionality = inject(Directionality);
}

@Component({
  host: {
    'data-testid': 'scroll-lock-panel',
    'class':
      'fixed right-4 top-20 h-64 w-64 overflow-auto rounded-box border bg-base-100 p-4 shadow',
  },
  template: `<div class="h-[120vh]">Blocking overlay with an independently scrollable panel</div>`,
})
class ScrollLockPanelComponent {}

@Component({
  selector: 'app-browser-test-fixture',
  imports: [
    AsyncActionProbeComponent,
    CdkConnectedOverlay,
    CdkMonitorFocus,
    CdkOverlayOrigin,
    CdkTrapFocus,
    Dir,
    RouterLink,
    RouterLinkActive,
    ThemeHostFixtureComponent,
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
    ZdChat,
    ZdChatBubble,
    ZdChatFooter,
    ZdChatHeader,
    ZdChatImage,
    ZdDivider,
    ZdFieldset,
    ZdFieldsetLabel,
    ZdFieldsetLegend,
    ZdKbd,
    ZdFloatingLabel,
    ZdLabel,
    ZdLink,
    ZdStatus,
    ZdTheme,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'browser-test-fixture',
  },
  styles: `
    .zd-motion-probe {
      transform: none;
      transition: none;
    }

    .zd-motion-probe[data-active='true'] {
      background-color: var(--color-accent);
      color: var(--color-accent-content);
    }

    @media (prefers-reduced-motion: no-preference) {
      .zd-motion-probe {
        transition:
          transform 200ms ease-out,
          background-color 200ms ease-out;
      }

      .zd-motion-probe[data-active='true'] {
        transform: translateX(1rem);
      }
    }
  `,
  template: `
    <article class="grid max-w-2xl gap-8">
      <header>
        <h1 class="text-3xl font-bold">Browser integration fixture</h1>
        <p>Stable native controls for browser-test infrastructure.</p>
      </header>

      <section aria-labelledby="focus-heading" class="grid gap-3">
        <h2 id="focus-heading" class="text-xl font-semibold">Keyboard focus</h2>
        <div class="flex gap-2">
          <button class="btn" data-testid="focus-first" type="button">First focus target</button>
          <button class="btn" data-testid="focus-second" type="button">Second focus target</button>
        </div>
      </section>

      <section aria-labelledby="button-heading" class="grid gap-3" data-testid="button-contract">
        <h2 id="button-heading" class="text-xl font-semibold">Native Button behavior</h2>
        <div class="flex flex-wrap gap-2">
          <button
            zdButton
            color="primary"
            data-testid="button-pressed"
            type="button"
            [pressed]="buttonPressed()"
            (click)="buttonPressed.update(pressed => !pressed)"
          >
            Toggle saved state
          </button>
          <button
            zdButton
            color="accent"
            data-testid="button-loading"
            type="button"
            [loading]="buttonLoading()"
            (click)="buttonLoadingClicks.update(clicks => clicks + 1)"
          >
            {{ buttonLoading() ? 'Saving changes' : 'Save changes' }}
          </button>
          <button
            class="btn w-fit"
            data-testid="button-toggle-loading"
            type="button"
            (click)="buttonLoading.update(loading => !loading)"
          >
            Toggle Button loading
          </button>
          <a
            zdButton
            href="#button-link-target"
            data-testid="button-disabled-link"
            [zdDisabled]="buttonLinkDisabled()"
            (click)="buttonLinkClicks.update(clicks => clicks + 1)"
          >
            Unavailable settings
          </a>
          <button
            class="btn w-fit"
            data-testid="button-toggle-link"
            type="button"
            (click)="buttonLinkDisabled.update(disabled => !disabled)"
          >
            Toggle link availability
          </button>
        </div>
        <form data-testid="button-form" (submit)="submitButtonForm($event)">
          <label for="button-native-value">Native Button value</label>
          <input
            id="button-native-value"
            data-testid="button-native-value"
            name="button-value"
            value="hydrated"
          />
          <button zdButton color="success" data-testid="button-submit" type="submit">
            Submit native form
          </button>
          <input zdButton data-testid="button-reset" type="reset" value="Reset native form" />
        </form>
        <output data-testid="button-loading-clicks"
          >Loading clicks: {{ buttonLoadingClicks() }}</output
        >
        <output data-testid="button-link-clicks">Link clicks: {{ buttonLinkClicks() }}</output>
        <output data-testid="button-submit-count">Button submits: {{ buttonSubmits() }}</output>
        <span id="button-link-target" tabindex="-1">Settings target</span>
      </section>

      <section aria-labelledby="link-heading" class="grid gap-3" data-testid="link-contract">
        <h2 id="link-heading" class="text-xl font-semibold">Native Link behavior</h2>
        <a zdLink data-testid="link-native" hover href="#link-target"> Read native link details </a>
        <a
          zdLink
          data-testid="link-router"
          routerLink="/__zordon-tests__/browser"
          routerLinkActive="is-current"
          ariaCurrentWhenActive="page"
        >
          Current fixture route
        </a>
        <a
          zdLink
          data-testid="link-disabled"
          href="#link-target"
          [zdDisabled]="linkDisabled()"
          (click)="linkClicks.update(clicks => clicks + 1)"
        >
          Unavailable link details
        </a>
        <button class="btn w-fit" data-testid="link-toggle" type="button" (click)="toggleLink()">
          Toggle Link availability
        </button>
        <a
          zdLink
          data-testid="link-external"
          href="https://example.com/release-notes"
          rel="noopener noreferrer"
          target="_blank"
        >
          Release notes (opens in a new window)
        </a>
        <output data-testid="link-clicks">Link clicks: {{ linkClicks() }}</output>
        <span id="link-target" tabindex="-1">Link target</span>
      </section>

      <section aria-labelledby="divider-heading" class="grid gap-3" data-testid="divider-contract">
        <h2 id="divider-heading" class="text-xl font-semibold">Native Divider behavior</h2>
        <div class="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <p>Shipping</p>
          <div
            zdDivider
            color="primary"
            orientation="horizontal"
            placement="end"
            data-testid="divider-labeled"
          >
            OR
          </div>
          <p>Pickup</p>
        </div>
        <hr zdDivider color="neutral" data-testid="divider-hr" />
        <div zdDivider aria-hidden="true" data-testid="divider-decorative"></div>
      </section>

      <section aria-labelledby="label-heading" class="grid gap-3" data-testid="label-contract">
        <h2 id="label-heading" class="text-xl font-semibold">Native Label behavior</h2>
        <label zdLabel for="label-email" data-testid="label-explicit">Email address</label>
        <input class="input" id="label-email" type="email" />
        <label zdLabel data-testid="label-implicit"
          >Accept updates <input class="checkbox" type="checkbox"
        /></label>
        <label zdFloatingLabel data-testid="label-floating"
          ><span>Full name</span><input class="input" placeholder="Full name"
        /></label>
      </section>

      <section
        aria-labelledby="fieldset-heading"
        class="grid gap-3"
        data-testid="fieldset-contract"
      >
        <h2 id="fieldset-heading" class="text-xl font-semibold">Native Fieldset behavior</h2>
        <fieldset zdFieldset disabled data-testid="fieldset-native">
          <legend zdFieldsetLegend>Delivery method</legend>
          <label zdFieldsetLabel for="fieldset-method">Email</label>
          <input class="input" id="fieldset-method" type="email" />
        </fieldset>
      </section>

      <section aria-labelledby="avatar-heading" class="grid gap-3" data-testid="avatar-contract">
        <h2 id="avatar-heading" class="text-xl font-semibold">Native Avatar behavior</h2>
        <div zdAvatarGroup class="avatar-group" data-testid="avatar-group">
          <div zdAvatar presence="online" data-testid="avatar-online">
            <div class="w-16 rounded-full">
              <img
                alt="Avery Chen"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23818cf8'/%3E%3Ccircle cx='32' cy='25' r='14' fill='%23fde68a'/%3E%3Cpath d='M8 64c4-18 16-27 24-27s20 9 24 27' fill='%23312e81'/%3E%3C/svg%3E"
              />
            </div>
          </div>
          <div zdAvatar placeholder presence="offline" data-testid="avatar-placeholder">
            <div class="w-16 rounded-full bg-neutral text-neutral-content"><span>AC</span></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="badge-heading" class="grid gap-3" data-testid="badge-contract">
        <h2 id="badge-heading" class="text-xl font-semibold">Native Badge behavior</h2>
        <span
          zdBadge
          color="success"
          size="xl"
          [style]="'soft'"
          class="text-base-content"
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
        <span
          zdBadge
          color="error"
          size="sm"
          [style]="'dash'"
          class="text-base-content"
          data-testid="badge-dash"
        >
          <svg aria-hidden="true" class="size-[1em]" viewBox="0 0 16 16">
            <path d="M8 1 1 15h14L8 1Z" />
          </svg>
          Attention
        </span>
        <p class="flex items-center gap-2">
          <span zdBadge color="error" size="xs" aria-hidden="true" data-testid="badge-dot"></span>
          <span>Payment failed</span>
          <span zdBadge color="neutral" [style]="'ghost'" data-testid="badge-ghost">Retrying</span>
        </p>
      </section>

      <section aria-labelledby="card-heading" class="grid gap-3" data-testid="card-contract">
        <h2 id="card-heading" class="text-xl font-semibold">Native Card behavior</h2>
        <article
          zdCard
          size="xl"
          [style]="'border'"
          class="max-w-md bg-base-100 shadow-sm"
          data-testid="card-article"
        >
          <figure>
            <img
              alt="Purple geometric launch illustration"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 240'%3E%3Crect width='640' height='240' fill='%234f46e5'/%3E%3Cpath d='M0 190 160 70l96 82 128-112 256 150v50H0Z' fill='%23818cf8'/%3E%3Ccircle cx='510' cy='65' r='34' fill='%23fde68a'/%3E%3C/svg%3E"
            />
          </figure>
          <div zdCardBody>
            <h3 zdCardTitle>Launch report</h3>
            <p>Every system is ready for the next window.</p>
            <div zdCardActions class="justify-end">
              <button class="btn btn-primary" type="button">View report</button>
            </div>
          </div>
        </article>
        <label
          zdCard
          size="xs"
          [style]="'dash'"
          side
          class="max-w-md bg-base-100"
          data-testid="card-selectable"
        >
          <input class="radio radio-primary" name="fixture-plan" type="radio" value="standard" />
          <figure>
            <img
              alt="Blue chart illustration"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'%3E%3Crect width='160' height='120' fill='%230891b2'/%3E%3Cpath d='M20 96V70h24v26zm38 0V42h24v54zm38 0V24h24v72z' fill='%23cffafe'/%3E%3C/svg%3E"
            />
          </figure>
          <div zdCardBody>
            <h3 zdCardTitle>Standard plan</h3>
            <p>Consumer-owned radio selection.</p>
          </div>
        </label>
        <article
          zdCard
          imageFull
          class="max-w-md bg-base-100 shadow-sm"
          data-testid="card-image-full"
        >
          <figure>
            <img
              alt="Night forest landscape"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 240'%3E%3Crect width='640' height='240' fill='%231e293b'/%3E%3Cpath d='M0 210 130 80l85 130L330 52l125 158 90-100 95 100v30H0Z' fill='%23166534'/%3E%3Ccircle cx='500' cy='56' r='30' fill='%23bae6fd'/%3E%3C/svg%3E"
            />
          </figure>
          <div zdCardBody>
            <h3 zdCardTitle>Trail conditions</h3>
            <p>Open with light morning fog.</p>
          </div>
        </article>
      </section>

      <section
        aria-labelledby="carousel-heading"
        class="grid gap-3"
        data-testid="carousel-contract"
      >
        <h2 id="carousel-heading" class="text-xl font-semibold">Native Carousel behavior</h2>
        <ol
          zdCarousel
          align="center"
          aria-label="Featured articles"
          class="w-80 rounded-box bg-base-200 p-2"
          data-testid="carousel-horizontal"
          tabindex="0"
        >
          <li zdCarouselItem class="w-64 rounded-box border bg-base-100 p-4 text-base-content">
            Architecture report
          </li>
          <li zdCarouselItem class="w-64 rounded-box border bg-base-100 p-4 text-base-content">
            Release notes
          </li>
        </ol>
        <ol
          zdCarousel
          align="end"
          orientation="vertical"
          aria-label="Deployment checklist"
          class="h-44 w-80 rounded-box bg-base-200 p-2"
          data-testid="carousel-vertical"
          tabindex="0"
        >
          <li zdCarouselItem class="h-20 rounded-box border bg-base-100 p-4 text-base-content">
            Validate the deployment
          </li>
          <li zdCarouselItem class="h-20 rounded-box border bg-base-100 p-4 text-base-content">
            Notify the team
          </li>
        </ol>
      </section>

      <section
        aria-labelledby="collapse-heading"
        class="grid gap-3"
        data-testid="collapse-contract"
      >
        <h2 id="collapse-heading" class="text-xl font-semibold">Native Collapse behavior</h2>
        <details
          zdCollapse
          indicator="arrow"
          class="rounded-box border bg-base-100"
          data-testid="collapse-details"
        >
          <summary zdCollapseTitle>Release notes</summary>
          <div zdCollapseContent>Native details owns the disclosure state.</div>
        </details>
        <div
          zdCollapse
          indicator="plus"
          forcedState="close"
          class="rounded-box border bg-base-100"
          data-testid="collapse-checkbox"
        >
          <input id="fixture-collapse-toggle" type="checkbox" />
          <label zdCollapseTitle for="fixture-collapse-toggle">Optional updates</label>
          <div zdCollapseContent>Consumer checkbox owns the disclosure state.</div>
        </div>
      </section>

      <section aria-labelledby="kbd-heading" class="grid gap-3" data-testid="kbd-contract">
        <h2 id="kbd-heading" class="text-xl font-semibold">Native Kbd behavior</h2>
        <p>Press <kbd zdKbd size="xs" data-testid="kbd-inline">F</kbd> to search.</p>
        <p aria-label="Control plus Shift plus Delete" data-testid="kbd-combination">
          <kbd zdKbd aria-hidden="true">Ctrl</kbd> +
          <kbd zdKbd size="xl" aria-hidden="true" data-testid="kbd-xl">Shift</kbd> +
          <kbd zdKbd aria-hidden="true">Del</kbd>
        </p>
      </section>
      <section aria-labelledby="status-heading" class="grid gap-3" data-testid="status-contract">
        <h2 id="status-heading" class="text-xl font-semibold">Native Status behavior</h2>
        <p class="flex items-center gap-2">
          <span zdStatus color="success" size="xl" aria-label="Service online" data-testid="status-online"></span>
          Service online
        </p>
      </section>

      <section aria-labelledby="chat-heading" class="grid gap-3" data-testid="chat-contract">
        <h2 id="chat-heading" class="text-xl font-semibold">Native Chat Bubble behavior</h2>
        <ol aria-label="Fixture conversation" class="grid gap-2">
          <li zdChat placement="start" data-testid="chat-start">
            <div zdChatImage zdAvatar>
              <div class="w-10 rounded-full">
                <img
                  alt="Ava Chen"
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23818cf8'/%3E%3Ccircle cx='20' cy='15' r='9' fill='%23fde68a'/%3E%3C/svg%3E"
                />
              </div>
            </div>
            <div zdChatHeader>Ava Chen <time datetime="2026-09-01T10:45">10:45</time></div>
            <div zdChatBubble color="primary" class="text-white">
              The deployment is ready for review.
            </div>
            <div zdChatFooter>Delivered</div>
          </li>
          <li zdChat placement="end" data-testid="chat-end">
            <div zdChatBubble color="success">Great, I’ll review it now.</div>
            <div zdChatFooter><time datetime="2026-09-01T10:46">10:46</time> · Seen</div>
          </li>
          <li zdChat placement="end" data-testid="chat-error">
            <div zdChatBubble color="error">The attachment could not be delivered.</div>
            <div zdChatFooter>Not delivered — retry available</div>
          </li>
        </ol>
      </section>

      <section aria-labelledby="aura-heading" class="grid gap-3" data-testid="aura-contract">
        <h2 id="aura-heading" class="text-xl font-semibold">Native Aura behavior</h2>
        <div zdAura class="text-primary" size="lg" variant="rainbow" data-testid="aura-rainbow">
          <button class="btn btn-primary" type="button">Start free trial</button>
        </div>
        <div zdAura class="text-secondary" size="xs" variant="glow" data-testid="aura-glow">
          <div class="rounded-box bg-base-100 p-4">Decorative static glow under reduced motion</div>
        </div>
      </section>

      <section aria-labelledby="overlay-heading" class="grid gap-3">
        <h2 id="overlay-heading" class="text-xl font-semibold">Overlay behavior</h2>
        <button #dialogTrigger class="btn btn-primary w-fit" type="button" (click)="openDialog()">
          Open test dialog
        </button>

        <dialog
          #dialog
          class="modal"
          aria-labelledby="test-dialog-title"
          (cancel)="handleDialogCancel($event)"
          (close)="restoreDialogFocus()"
        >
          <div class="modal-box">
            <h2 id="test-dialog-title" class="text-xl font-semibold">Test dialog</h2>
            <p>Used to verify Escape handling and focus restoration.</p>
            <div class="modal-action">
              <button
                class="btn"
                data-testid="block-dialog-cancel"
                type="button"
                (click)="blockNextDialogCancel.set(true)"
              >
                Block next Escape
              </button>
              <button autofocus class="btn" type="button" (click)="closeDialog()">
                Close test dialog
              </button>
            </div>
          </div>
        </dialog>
      </section>

      <section aria-labelledby="dismissal-heading" class="grid gap-3">
        <h2 id="dismissal-heading" class="text-xl font-semibold">Dismissal dispatch</h2>
        <div class="flex gap-2">
          <button
            cdkOverlayOrigin
            #dismissalOrigin="cdkOverlayOrigin"
            class="btn btn-accent"
            type="button"
            (click)="dismissalOpen.set(true)"
          >
            Open dismissal fixture
          </button>
          <button class="btn" type="button" (click)="outsideActions.update(count => count + 1)">
            Outside action
          </button>
        </div>
        <output data-testid="outside-action-count">{{ outsideActions() }}</output>
        <output data-testid="outside-dismissal-count">{{ outsideDismissals() }}</output>

        <ng-template
          cdkConnectedOverlay
          [cdkConnectedOverlayDisableClose]="true"
          [cdkConnectedOverlayOpen]="dismissalOpen()"
          [cdkConnectedOverlayOrigin]="dismissalOrigin"
          (overlayKeydown)="handleOverlayKeydown($event)"
          (overlayOutsideClick)="handleOverlayOutside()"
        >
          <div class="rounded-box border bg-base-100 p-4 shadow" data-testid="dismissal-overlay">
            <button class="btn" data-testid="dismissal-inside" type="button">Inside action</button>
            <input
              class="input"
              data-testid="dismissal-veto"
              value="Inner widget owns Escape"
              (keydown.escape)="$event.preventDefault()"
            />
          </div>
        </ng-template>
      </section>

      <section
        #positionedDir="dir"
        data-theme="cupcake"
        aria-labelledby="positioning-heading"
        class="grid gap-3"
        [dir]="positionedDirection()"
      >
        <h2 id="positioning-heading" class="text-xl font-semibold">Private overlay foundation</h2>
        <button
          #positionedOrigin
          class="btn btn-info fixed bottom-1 left-8 z-10"
          data-testid="positioned-overlay-origin"
          type="button"
          (click)="openPositionedOverlay()"
        >
          Open positioned overlay
        </button>
        <output data-testid="positioned-close-reason">{{ positionedCloseReason() }}</output>
        <button
          #positionedDirectionToggle
          class="btn w-fit"
          data-testid="toggle-positioned-direction"
          type="button"
          (click)="togglePositionedDirection()"
        >
          Toggle positioned direction
        </button>
      </section>

      <section aria-labelledby="scroll-lock-heading" class="grid gap-3">
        <h2 id="scroll-lock-heading" class="text-xl font-semibold">Body scroll lock</h2>
        <div class="flex gap-2">
          <button
            class="btn"
            data-testid="open-scroll-lock-first"
            type="button"
            (click)="openScrollLock()"
          >
            Open first blocker
          </button>
          <button
            class="btn"
            data-testid="open-scroll-lock-second"
            type="button"
            (click)="openScrollLock()"
          >
            Open second blocker
          </button>
          <button
            class="btn"
            data-testid="close-scroll-lock-first"
            type="button"
            (click)="closeScrollLock(0)"
          >
            Close first blocker
          </button>
          <button
            class="btn"
            data-testid="close-scroll-lock-last"
            type="button"
            (click)="closeLastScrollLock()"
          >
            Close last blocker
          </button>
        </div>
        <div class="fixed right-2 top-2" data-testid="scroll-lock-fixed-reference">Fixed</div>
        <div class="mx-auto w-48" data-testid="scroll-lock-centered-reference">Centered</div>
      </section>

      <section aria-labelledby="focus-trap-heading" class="grid gap-3">
        <h2 id="focus-trap-heading" class="text-xl font-semibold">CDK focus management</h2>
        <button
          #focusTrapTrigger
          class="btn btn-secondary w-fit"
          type="button"
          (click)="openFocusRegion()"
        >
          Open focus region
        </button>

        @if (focusTrapOpen()) {
          <div
            cdkTrapFocus
            cdkTrapFocusAutoCapture
            class="flex gap-2 rounded-box border p-4"
            data-testid="focus-trap-region"
          >
            <button class="btn" data-testid="focus-trap-first" type="button">First action</button>
            <button
              cdkFocusInitial
              cdkMonitorElementFocus
              class="btn"
              data-testid="focus-trap-initial"
              type="button"
            >
              Preferred action
            </button>
            <button
              class="btn"
              data-testid="focus-trap-add"
              type="button"
              (click)="extraFocusTarget.set(true)"
            >
              Add dynamic action
            </button>
            @if (extraFocusTarget()) {
              <button
                class="btn"
                data-testid="focus-trap-dynamic"
                type="button"
                [disabled]="extraFocusDisabled()"
              >
                Dynamic action
              </button>
            }
            <button
              class="btn"
              data-testid="focus-trap-disable"
              type="button"
              (click)="extraFocusDisabled.set(true)"
            >
              Disable dynamic action
            </button>
            <button
              class="btn"
              data-testid="focus-trap-close"
              type="button"
              (click)="focusTrapOpen.set(false)"
            >
              Close focus region
            </button>
          </div>
        }
      </section>

      <section aria-labelledby="form-heading" class="grid gap-3">
        <h2 id="form-heading" class="text-xl font-semibold">Form behavior</h2>
        <form class="grid gap-3" (submit)="submitForm($event)">
          <label class="label" for="browser-test-name">Test name</label>
          <input class="input" id="browser-test-name" name="name" required type="text" />
          <button class="btn btn-primary w-fit" type="submit">Submit test form</button>
        </form>
        <output data-testid="submitted-name">{{ submittedName() }}</output>
      </section>

      <div data-testid="async-action-contract">
        <button
          data-testid="remove-async-action-probe"
          type="button"
          (click)="asyncProbeVisible.set(false)"
        >
          Remove async action probe
        </button>
        <button
          data-testid="restore-async-action-probe"
          type="button"
          (click)="asyncProbeVisible.set(true)"
        >
          Restore async action probe
        </button>
        <output data-testid="async-action-cleanup-aborts"
          >Cleanup aborts: {{ asyncCleanupAborts() }}</output
        >
        @if (asyncProbeVisible()) {
          <app-async-action-probe (cleanup)="asyncCleanupAborts.set($event)" />
        }
      </div>

      <section aria-labelledby="motion-heading" class="grid gap-3" data-testid="motion-contract">
        <h2 id="motion-heading" class="text-xl font-semibold">Reduced motion</h2>
        <button
          class="w-fit rounded border px-3 py-2"
          type="button"
          [attr.aria-pressed]="motionProbeActive()"
          (click)="motionProbeActive.update(active => !active)"
        >
          Toggle motion probe
        </button>
        <div
          class="zd-motion-probe rounded-box border p-4"
          data-testid="motion-probe"
          [attr.data-active]="motionProbeActive()"
        >
          Motion is {{ motionProbeActive() ? 'active' : 'inactive' }}
        </div>
      </section>

      <section hidden data-testid="theme-contract" zdTheme="corporate">
        <div data-testid="nested-theme" [zdTheme]="nestedTheme()"></div>
        <app-theme-host-fixture data-testid="component-theme" zdTheme="zordon-visual" />
        <button data-testid="clear-nested-theme" type="button" (click)="nestedTheme.set(null)">
          Clear nested theme
        </button>
      </section>

      <div hidden>
        <div data-testid="system-theme" [zdTheme]="systemTheme()"></div>
        <button data-testid="set-system-light" type="button" (click)="systemTheme.set('light')">
          Set system scope to light
        </button>
        <button data-testid="clear-system-theme" type="button" (click)="systemTheme.set(null)">
          Clear system scope
        </button>
      </div>
    </article>
  `,
})
export default class BrowserTestFixtureComponent implements OnDestroy {
  private readonly overlayCoordinator = inject(ZdOverlayCoordinator);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly dialogTrigger =
    viewChild.required<ElementRef<HTMLButtonElement>>('dialogTrigger');
  private readonly positionedOrigin =
    viewChild.required<ElementRef<HTMLButtonElement>>('positionedOrigin');
  private readonly positionedDir = viewChild.required<Dir>('positionedDir');
  private readonly positionedDirectionToggle = viewChild.required<ElementRef<HTMLButtonElement>>(
    'positionedDirectionToggle',
  );
  private positionedOverlay: ZdOverlayHandle | null = null;
  private readonly scrollLocks: ZdOverlayHandle[] = [];

  protected readonly submittedName = signal('');
  protected readonly blockNextDialogCancel = signal(false);
  protected readonly dismissalOpen = signal(false);
  protected readonly outsideActions = signal(0);
  protected readonly outsideDismissals = signal(0);
  protected readonly positionedCloseReason = signal('');
  protected readonly positionedDirection = signal<Direction>('ltr');
  protected readonly focusTrapOpen = signal(false);
  protected readonly extraFocusTarget = signal(false);
  protected readonly extraFocusDisabled = signal(false);
  protected readonly nestedTheme = signal<string | null>('cupcake');
  protected readonly systemTheme = signal<string | null>(null);
  protected readonly motionProbeActive = signal(false);
  protected readonly asyncProbeVisible = signal(true);
  protected readonly asyncCleanupAborts = signal(0);
  protected readonly buttonPressed = signal(false);
  protected readonly buttonLoading = signal(false);
  protected readonly buttonLoadingClicks = signal(0);
  protected readonly buttonLinkDisabled = signal(true);
  protected readonly buttonLinkClicks = signal(0);
  protected readonly buttonSubmits = signal(0);
  protected readonly linkDisabled = signal(true);
  protected readonly linkClicks = signal(0);

  protected openDialog(): void {
    this.blockNextDialogCancel.set(false);
    this.dialog().nativeElement.showModal();
  }

  protected handleDialogCancel(event: Event): void {
    if (this.blockNextDialogCancel()) {
      event.preventDefault();
      this.blockNextDialogCancel.set(false);
    }
  }

  protected handleOverlayKeydown(event: KeyboardEvent): void {
    if (
      event.key !== 'Escape' ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.defaultPrevented ||
      event.isComposing ||
      event.repeat
    ) {
      return;
    }

    event.preventDefault();
    this.dismissalOpen.set(false);
  }

  protected handleOverlayOutside(): void {
    this.outsideDismissals.update(count => count + 1);
    this.dismissalOpen.set(false);
  }

  protected openPositionedOverlay(): void {
    this.positionedOverlay?.destroy();
    this.positionedCloseReason.set('');
    const origin = this.positionedOrigin().nativeElement;
    let handle: ZdOverlayHandle | null = null;
    handle = this.overlayCoordinator.open({
      content: {
        component: PositionedOverlayPanelComponent,
        kind: 'component',
        viewContainerRef: this.viewContainerRef,
      },
      hasBackdrop: true,
      directionality: this.positionedDir(),
      onCloseRequest: reason => {
        this.positionedCloseReason.set(reason);
        handle?.finalizeClose();
        if (this.positionedOverlay === handle) this.positionedOverlay = null;
      },
      origin,
      safeElements: [this.positionedDirectionToggle().nativeElement],
      placement: {
        kind: 'connected',
        origin,
        positions: [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            panelClass: 'zd-test-below',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            panelClass: 'zd-test-above',
          },
        ],
        viewportMargin: 8,
      },
    });
    this.positionedOverlay = handle;
  }

  protected togglePositionedDirection(): void {
    this.positionedDirection.update(direction => (direction === 'ltr' ? 'rtl' : 'ltr'));
  }

  protected openScrollLock(): void {
    const handle = this.overlayCoordinator.open({
      content: {
        component: ScrollLockPanelComponent,
        kind: 'component',
        viewContainerRef: this.viewContainerRef,
      },
      onCloseRequest: () => {},
      placement: { kind: 'global' },
      scrollPolicy: 'block',
    });
    if (handle) this.scrollLocks.push(handle);
  }

  protected closeScrollLock(index: number): void {
    const [handle] = this.scrollLocks.splice(index, 1);
    handle?.finalizeClose();
  }

  protected closeLastScrollLock(): void {
    this.closeScrollLock(this.scrollLocks.length - 1);
  }

  protected openFocusRegion(): void {
    this.extraFocusTarget.set(false);
    this.extraFocusDisabled.set(false);
    this.focusTrapOpen.set(true);
  }

  protected closeDialog(): void {
    this.dialog().nativeElement.close();
  }

  protected restoreDialogFocus(): void {
    this.dialogTrigger().nativeElement.focus();
  }

  protected submitForm(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    this.submittedName.set(String(new FormData(form).get('name') ?? ''));
  }

  protected submitButtonForm(event: SubmitEvent): void {
    event.preventDefault();
    this.buttonSubmits.update(submits => submits + 1);
  }

  protected toggleLink(): void {
    this.linkDisabled.update(disabled => !disabled);
  }

  ngOnDestroy(): void {
    this.positionedOverlay?.destroy();
    for (const handle of this.scrollLocks.splice(0)) handle.destroy();
  }
}
