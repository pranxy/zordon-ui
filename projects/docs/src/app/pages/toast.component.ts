import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdToastOutlet,
  ZdToastService,
  type ZdToastContext,
  type ZdToastOptions,
  type ZdToastPosition,
} from '@pranxy/zordon-ui/toast';

import {
  actionFiles,
  templateFiles,
  toastPlaygroundControls,
  toastPlaygroundSnippet,
  toastReference,
  trackFiles,
} from '../content/toast.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes the Toast outlet and its alerts emit, only while this page is in use. */
@Component({
  selector: 'docs-toast-daisy-styles',
  template: '',
  styleUrl: './styles/toast.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class ToastDaisyStylesComponent {}

/**
 * The page provides its own service, so its messages are cleared when you leave and never mix with
 * any application-wide outlet.
 */
@Component({
  selector: 'docs-toast-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ToastDaisyStylesComponent,
    ZdButton,
    ZdToastOutlet,
  ],
  providers: [ZdToastService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-toast-daisy-styles />
    <zd-toast-outlet label="Example notifications" />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Toast"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <button zdButton type="button" color="primary" (click)="showDraft(values)">
            Save draft
          </button>
        </ng-template>
      </docs-playground>

      <docs-section
        id="actions"
        level="3"
        heading="Actions"
        description="An action keeps the toast until it is used or dismissed. While it runs, the button is busy and repeat presses are ignored."
      >
        <docs-example label="delete" [files]="actionFiles">
          <div class="docs-cluster">
            <button zdButton type="button" size="sm" variant="outline" (click)="deleteInvoice()">
              Delete invoice
            </button>
            <p class="docs-status" role="status">{{ invoice() }}</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="track"
        level="3"
        heading="Tracking work"
        description="track shows a persistent loading message for a promise, then replaces it with the success or error options."
      >
        <docs-example label="publish" [files]="trackFiles">
          <div class="docs-cluster">
            <button zdButton type="button" size="sm" color="primary" (click)="publish()">
              Publish
            </button>
            <label class="docs-choice">
              <input type="checkbox" [checked]="failNext()" (change)="failNext.set(!failNext())" />
              Fail next publish
            </label>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="custom-content"
        level="3"
        heading="Custom content"
        description="Pass a template for richer layout. The plain message is still what gets announced."
      >
        <docs-example label="invite" [files]="templateFiles">
          <button zdButton type="button" size="sm" (click)="invite()">Send invitations</button>
          <ng-template #inviteTemplate let-item>
            <span
              ><strong>{{ item.message }}</strong> · 3 people added to Design</span
            >
          </ng-template>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
})
export class ToastPageComponent {
  protected readonly reference = toastReference;
  protected readonly controls = toastPlaygroundControls;
  protected readonly snippet = toastPlaygroundSnippet;
  protected readonly actionFiles = actionFiles;
  protected readonly trackFiles = trackFiles;
  protected readonly templateFiles = templateFiles;

  private readonly toasts = inject(ZdToastService);
  private readonly inviteTemplate =
    viewChild.required<TemplateRef<ZdToastContext>>('inviteTemplate');

  protected readonly invoice = signal('Invoice INV-042');
  protected readonly failNext = signal(false);

  protected showDraft(values: PlaygroundValues): void {
    const color = values['color'];
    this.toasts.show({
      message: 'Draft saved',
      position: values['position'] as ZdToastPosition,
      ...(color === 'default' ? {} : { color: color as ZdToastOptions['color'] }),
    });
  }

  protected deleteInvoice(): void {
    this.invoice.set('Invoice deleted');
    this.toasts.show({
      message: 'Invoice deleted',
      key: 'invoice',
      action: {
        label: 'Undo',
        run: () => this.invoice.set('Invoice INV-042 restored'),
        errorMessage: 'Undo failed. Try again.',
      },
    });
  }

  protected async publish(): Promise<void> {
    const fail = this.failNext();
    const work = new Promise<void>((resolve, reject) =>
      setTimeout(() => (fail ? reject(new Error('Offline')) : resolve()), 1500),
    );
    await this.toasts
      .track(work, {
        loading: { message: 'Publishing' },
        success: () => ({ message: 'Published', color: 'success' }),
        error: () => ({ message: 'Publishing failed', color: 'error', duration: 0 }),
      })
      .catch(() => undefined);
  }

  protected invite(): void {
    this.toasts.show({
      message: 'Invitations sent',
      color: 'info',
      template: this.inviteTemplate(),
    });
  }
}
