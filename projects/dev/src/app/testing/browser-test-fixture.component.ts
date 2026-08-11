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
  imports: [ThemeHostFixtureComponent, ZdTheme],
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
          (close)="restoreDialogFocus()"
        >
          <div class="modal-box">
            <h2 id="test-dialog-title" class="text-xl font-semibold">Test dialog</h2>
            <p>Used to verify Escape handling and focus restoration.</p>
            <div class="modal-action">
              <button autofocus class="btn" type="button" (click)="closeDialog()">
                Close test dialog
              </button>
            </div>
          </div>
        </dialog>
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
  protected readonly nestedTheme = signal<string | null>('cupcake');
  protected readonly systemTheme = signal<string | null>(null);

  protected openDialog(): void {
    this.dialog().nativeElement.showModal();
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
