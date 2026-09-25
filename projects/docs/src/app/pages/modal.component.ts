import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdModal,
  ZdModalService,
  type ZdModalOptions,
  type ZdModalPlacement,
  type ZdModalResult,
  type ZdModalSize,
} from '@pranxy/zordon-ui/modal';

import { flagOf } from '../content/form-controls.content';
import {
  confirmFiles,
  formFiles,
  guardFiles,
  modalPlaygroundControls,
  modalPlaygroundSnippet,
  modalReference,
} from '../content/modal.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's modal-box class, only while this page is in use. */
@Component({
  selector: 'docs-modal-daisy-styles',
  template: '',
  styleUrl: './styles/modal.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class ModalDaisyStylesComponent {}

@Component({
  selector: 'docs-modal-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ModalDaisyStylesComponent,
    ReactiveFormsModule,
    ZdButton,
    ZdModal,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-modal-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Modal"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <button zdButton type="button" color="primary" (click)="playgroundOpen.set(true)">
            Rename
          </button>
          <ng-template
            zdModal
            [open]="playgroundOpen()"
            [options]="playgroundOptions(values)"
            (openChange)="playgroundOpen.set($event)"
            let-modal
          >
            <h2 class="title">Rename file</h2>
            <p>This dialog uses the options chosen in the playground.</p>
            <div class="zd-modal-actions">
              <button zdButton type="button" color="primary" (click)="modal.close()">Done</button>
            </div>
          </ng-template>
        </ng-template>
      </docs-playground>

      <docs-section
        id="form"
        level="3"
        heading="Form with a result"
        description="The template gets the dialog ref as let-modal. Close with a value to return it; Cancel, Escape and the backdrop close without one."
      >
        <docs-example label="rename" [files]="formFiles">
          <div class="docs-cluster">
            <button zdButton type="button" (click)="editing.set(true)">Rename</button>
            <p class="docs-status" role="status">File: {{ fileName() }}</p>
          </div>
          <ng-template
            zdModal
            [open]="editing()"
            [options]="renameOptions"
            (openChange)="editing.set($event)"
            (closed)="renamed($event)"
            let-modal
          >
            <h2 class="title">Rename file</h2>
            <label class="docs-field">
              Name
              <input class="field" [formControl]="name" />
            </label>
            <div class="zd-modal-actions">
              <button zdButton type="button" variant="ghost" (click)="modal.close()">Cancel</button>
              <button zdButton type="button" color="primary" (click)="modal.close(name.value)">
                Save
              </button>
            </div>
          </ng-template>
        </docs-example>
      </docs-section>

      <docs-section
        id="confirm"
        level="3"
        heading="Confirmation"
        description="confirm() needs no template. Its action runs before the dialog closes; if it fails, the dialog stays open with an alert and the buttons can be pressed again."
      >
        <docs-example label="delete" [files]="confirmFiles">
          <div class="docs-cluster">
            <button zdButton type="button" (click)="deleteProject()">Delete project</button>
            <label class="docs-choice">
              <input type="checkbox" [checked]="failNext()" (change)="failNext.set(!failNext())" />
              Fail the first try
            </label>
            <p class="docs-status" role="status">{{ projectStatus() }}</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="guard"
        level="3"
        heading="Close guard"
        description="beforeClose sees every request. Here Escape, the backdrop and Cancel are refused while the notes have unsaved changes; Save always closes."
      >
        <docs-example label="notes" [files]="guardFiles">
          <button zdButton type="button" (click)="notesOpen.set(true)">Edit notes</button>
          <ng-template
            zdModal
            [open]="notesOpen()"
            [options]="notesOptions"
            (openChange)="notesOpen.set($event)"
            (closed)="notes.markAsPristine()"
            let-modal
          >
            <h2 class="title">Edit notes</h2>
            <label class="docs-field">
              Notes
              <textarea class="field" rows="3" [formControl]="notes"></textarea>
            </label>
            @if (notes.dirty) {
              <p class="hint">Unsaved changes: save them to close.</p>
            }
            <div class="zd-modal-actions">
              <button zdButton type="button" variant="ghost" (click)="modal.close()">Cancel</button>
              <button
                zdButton
                type="button"
                color="primary"
                (click)="modal.close(notes.value, 'submit')"
              >
                Save
              </button>
            </div>
          </ng-template>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .title {
      margin: 0 0 var(--docs-space-3);
      font-size: 1.125rem;
    }

    .field {
      font: inherit;
      padding: 0.375rem 0.5rem;
      border: 1px solid currentColor;
      border-radius: var(--docs-radius-sm);
      background: transparent;
      color: inherit;
    }

    .hint {
      margin: var(--docs-space-2) 0 0;
      font-size: var(--docs-text-sm);
    }

    .zd-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--docs-space-2);
      margin-block-start: var(--docs-space-4);
    }
  `,
})
export class ModalPageComponent {
  protected readonly reference = modalReference;
  protected readonly controls = modalPlaygroundControls;
  protected readonly snippet = modalPlaygroundSnippet;
  protected readonly formFiles = formFiles;
  protected readonly confirmFiles = confirmFiles;
  protected readonly guardFiles = guardFiles;

  private readonly modal = inject(ZdModalService);

  protected readonly playgroundOpen = signal(false);
  protected readonly editing = signal(false);
  protected readonly fileName = signal('report.pdf');
  protected readonly name = new FormControl('report.pdf', { nonNullable: true });
  protected readonly renameOptions: ZdModalOptions<string> = { label: 'Rename file' };

  protected readonly failNext = signal(true);
  protected readonly projectStatus = signal('Website redesign: 12 files');

  protected readonly notesOpen = signal(false);
  protected readonly notes = new FormControl('Call the printer on Monday.', { nonNullable: true });
  protected readonly notesOptions: ZdModalOptions<string> = {
    label: 'Edit notes',
    beforeClose: result => result.reason === 'submit' || !this.notes.dirty,
  };

  protected playgroundOptions(values: PlaygroundValues): ZdModalOptions {
    return {
      label: 'Rename file',
      size: values['size'] as ZdModalSize,
      placement: values['placement'] as ZdModalPlacement,
      closeOnBackdrop: flagOf(values, 'closeOnBackdrop'),
    };
  }

  protected renamed(result: ZdModalResult<string>): void {
    if (result.value) this.fileName.set(result.value);
  }

  protected async deleteProject(): Promise<void> {
    let attempts = 0;
    const confirmed = await this.modal.confirm({
      label: 'Delete project',
      message: 'Delete “Website redesign” and its 12 files?',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep it',
      errorMessage: 'The project could not be deleted. Try again.',
      action: async () => {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 400));
        if (this.failNext() && attempts === 1) throw new Error('Offline');
      },
    });
    this.projectStatus.set(confirmed ? 'Website redesign: deleted' : 'Website redesign: kept');
  }
}
