import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import {
  ZdModal,
  ZdModalService,
  type ZdModalContext,
  type ZdModalOptions,
  type ZdModalBackend,
  type ZdModalPlacement,
  type ZdModalSize,
} from '@pranxy/zordon-ui/modal';
import {
  ZdDropdown,
  ZdDropdownTrigger,
  ZdDropdownPanel,
  ZdDropdownMenu,
  ZdDropdownItem,
} from '@pranxy/zordon-ui/dropdown';

@Component({
  selector: 'docs-modal-daisy-styles',
  template: '',
  styleUrl: './modal-fixture.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ModalDaisyStyles {}

@Component({
  selector: 'docs-modal-test-fixture',
  imports: [
    Dir,
    ModalDaisyStyles,
    ZdModal,
    ZdDropdown,
    ZdDropdownTrigger,
    ZdDropdownPanel,
    ZdDropdownMenu,
    ZdDropdownItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      width: min(54rem, calc(100vw - 3rem));
    }
    section {
      padding: 1rem;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    button,
    input {
      padding: 0.5rem;
      border: 1px solid currentColor;
      border-radius: 0.4rem;
    }
    label {
      display: block;
      margin-block: 1rem;
    }
    .spacer {
      height: 140vh;
    }
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-block-end: 0.5rem;
    }
    input {
      display: block;
      box-sizing: border-box;
      inline-size: 100%;
      margin-block-start: 0.5rem;
    }
    .editor-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    form {
      margin-block-start: 0.75rem;
    }
  `,
  template: `
    <section data-testid="modal-fixture" [dir]="rtl() ? 'rtl' : 'ltr'">
      <docs-modal-daisy-styles />
      <h1>Modal</h1>
      <div class="controls">
        <button type="button" (click)="openService('native')">Open native</button>
        <button type="button" (click)="openService('overlay')">Open overlay</button>
        <button type="button" (click)="declarative.set(true)">Open declarative</button>
        <button type="button" (click)="confirmation()">Async confirm</button>
        <button type="button" (click)="queue()">Queue dialogs</button>
        <button type="button" (click)="guard.set(!guard())">Toggle guard</button>
        <button type="button" (click)="size.set('full')">Fullscreen</button>
        <button type="button" (click)="size.set('sm')">Small</button>
        <button type="button" (click)="placement.set('start')">Start placement</button>
        <button type="button" (click)="placement.set('bottom')">Bottom placement</button>
        <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
      </div>
      <p role="status">{{ result() }}</p>
      <p>Confirm attempts: {{ attempts() }}</p>
      <ng-template #content let-modal>
        <h2>Editor</h2>
        <p>Changes stay here until you close the editor.</p>
        <label>Title <input value="Draft" /></label>
        <div class="editor-actions">
          <button type="button" (click)="modal.close('saved')">Save</button>
          <button type="button" (click)="modal.close()">Close editor</button>
          <button type="button" (click)="nested()">Open nested</button>
          <button type="button" (click)="rtl.set(!rtl())">Flip direction</button>
          @if (backend() === 'overlay') {
            <span zdDropdown>
              <button type="button" zdDropdownTrigger>More actions</button>
              <ng-template zdDropdownPanel
                ><zd-dropdown-menu aria-label="Editor actions"
                  ><button zdDropdownItem value="copy" type="button">
                    Copy draft
                  </button></zd-dropdown-menu
                ></ng-template
              >
            </span>
          }
        </div>
        <form method="dialog"><button type="submit">Native submit</button></form>
      </ng-template>
      @if (present()) {
        <ng-template
          zdModal
          [open]="declarative()"
          [options]="declarativeOptions"
          (openChange)="request.set($event)"
          (closed)="result.set($event.reason)"
          let-modal
        >
          <h2>Controlled editor</h2>
          <button type="button" (click)="modal.close()">Request close</button>
          <button type="button" (click)="declarative.set(false)">Accept close</button>
          <button type="button" (click)="present.set(false)">Destroy owner</button>
          <p>Requested: {{ request() }}</p>
        </ng-template>
      }
      <div class="spacer" aria-hidden="true"></div>
    </section>
  `,
})
export class ModalTestFixtureComponent {
  private readonly service = inject(ZdModalService);
  private readonly container = viewChild.required('content', { read: ViewContainerRef });
  private readonly content = viewChild.required<TemplateRef<ZdModalContext<string>>>('content');
  protected readonly result = signal('Ready');
  protected readonly declarative = signal(false);
  protected readonly present = signal(true);
  protected readonly request = signal(true);
  protected readonly backend = signal<ZdModalBackend>('native');
  protected readonly size = signal<ZdModalSize>('md');
  protected readonly placement = signal<ZdModalPlacement>('center');
  protected readonly guard = signal(false);
  protected readonly attempts = signal(0);
  protected readonly rtl = signal(false);
  protected readonly declarativeOptions: ZdModalOptions = { label: 'Controlled editor' };
  protected openService(backend: ZdModalBackend): void {
    this.backend.set(backend);
    const ref = this.service.open(
      this.content(),
      {
        label: 'Editor',
        backend,
        size: this.size(),
        placement: this.placement(),
        beforeClose: () => !this.guard(),
      },
      this.container(),
    );
    void ref.result.then(result => this.result.set(result.reason + ':' + (result.value ?? 'none')));
  }
  protected nested(): void {
    void this.service.confirm(
      { label: 'Nested confirmation', message: 'Keep editing?', backend: this.backend() },
      this.container(),
    );
  }
  protected confirmation(): void {
    void this.service
      .confirm(
        {
          label: 'Publish draft',
          message: 'Publish the current draft?',
          action: async () => {
            this.attempts.update(value => value + 1);
            await new Promise(resolve => setTimeout(resolve, 100));
            if (this.attempts() === 1) throw new Error('Try again');
          },
        },
        this.container(),
      )
      .then(value => this.result.set(value ? 'confirmed' : 'cancelled'));
  }
  protected queue(): void {
    void this.service.enqueue(null, { label: 'First queued', message: 'First' }, this.container());
    void this.service
      .enqueue(null, { label: 'Second queued', message: 'Second' }, this.container())
      .then(result => this.result.set(result.reason));
  }
}
