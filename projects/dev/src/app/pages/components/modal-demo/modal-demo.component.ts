import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ZdModal, ZdModalActions } from '@pranxy/zordon-ui/modal';

@Component({
    selector: 'dev-modal-demo',
    imports: [],
    templateUrl: './modal-demo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModalDemoComponent {
    private dialogService = inject(ZdModal);

    openBasicDialog() {
        this.dialogService.open(CdkDialogStylingExampleDialog, {
            data: {
                title: 'Basic Dialog',
            },
        });
    }

    // openConfirmDialog() {
    //     const dialogRef = this.dialogService.open(DialogContainerComponent, {
    //         data: {
    //             title: 'Confirm Action',
    //             showCloseButton: false,
    //         },
    //     });

    //     const element = dialogRef.componentInstance;
    //     element.componentInstance.template = `
    //   <div class="flex items-center text-warning">
    //     <p class="font-medium">Are you sure you want to delete this item?</p>
    //   </div>
    //   <p class="mt-4">This action cannot be undone.</p>
    //   <div dialog-actions>
    //     <button class="btn btn-ghost" (click)="dialogRef.close(false)">Cancel</button>
    //     <button class="btn btn-warning" (click)="dialogRef.close(true)">Delete</button>
    //   </div>
    // `;
    // }

    // openCustomDialog() {
    //     const dialogRef = this.dialogService.open(DialogContainerComponent, {
    //         data: {
    //             title: 'Custom Dialog',
    //             showCloseButton: true,
    //         },
    //         width: '800px',
    //         panelClass: ['modal', 'modal-box', 'bg-base-200'],
    //     });

    //     const element = dialogRef.componentInstance;
    //     element.componentInstance.template = `
    //   <div class="prose max-w-none">
    //     <p>This is a custom dialog with different styling and content.</p>
    //     <ul>
    //       <li>Custom width</li>
    //       <li>Custom background color</li>
    //       <li>Custom actions</li>
    //     </ul>
    //   </div>
    //   <div dialog-actions>
    //     <button class="btn btn-primary" (click)="dialogRef.close()">Got it!</button>
    //   </div>
    // `;
    // }
}

@Component({
    selector: 'cdk-dialog-styling-example-dialog',
    imports: [ZdModalActions],
    template: `
        bla

        <zd-modal-action>
            <button class="btn">ola</button>
        </zd-modal-action>
    `,
})
export class CdkDialogStylingExampleDialog {}
