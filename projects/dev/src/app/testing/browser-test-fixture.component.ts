import { CdkMonitorFocus, CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { ZdTheme } from '@pranxy/zordon-ui';

@Component({
  selector: 'app-theme-host-fixture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `Theme host fixture`,
})
class ThemeHostFixtureComponent {}

@Component({
  selector: 'app-browser-test-fixture',
  imports: [
    CdkConnectedOverlay,
    CdkMonitorFocus,
    CdkOverlayOrigin,
    CdkTrapFocus,
    ThemeHostFixtureComponent,
    ZdTheme,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'browser-test-fixture',
  },
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
              <button class="btn" type="button" (click)="blockNextDialogCancel.set(true)">
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
export default class BrowserTestFixtureComponent {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly dialogTrigger =
    viewChild.required<ElementRef<HTMLButtonElement>>('dialogTrigger');

  protected readonly submittedName = signal('');
  protected readonly blockNextDialogCancel = signal(false);
  protected readonly dismissalOpen = signal(false);
  protected readonly outsideActions = signal(0);
  protected readonly outsideDismissals = signal(0);
  protected readonly focusTrapOpen = signal(false);
  protected readonly extraFocusTarget = signal(false);
  protected readonly extraFocusDisabled = signal(false);
  protected readonly nestedTheme = signal<string | null>('cupcake');
  protected readonly systemTheme = signal<string | null>(null);

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
}
