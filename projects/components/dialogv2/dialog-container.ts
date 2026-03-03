import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    EnvironmentInjector,
    HostListener,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef,
    inject,
    signal,
} from '@angular/core';
import { DialogRef } from './dialog-ref';

@Component({
    selector: 'app-dialog-container',
    standalone: true,
    template: `
        <div
            class="modal modal-open"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-body"
        >
            <div
                #modalBox
                class="modal-box relative transition-all duration-300 ease-out scale-95 opacity-0 animate-fadeIn"
            >
                <ng-template #vc></ng-template>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContainerComponent implements OnInit {
    childComponentType = signal<Type<any> | undefined>(undefined);

    @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;
    @ViewChild('modalBox', { static: true, read: ElementRef }) modalBox!: ElementRef;

    private readonly injector = inject(EnvironmentInjector);
    private readonly focusTrapFactory = inject(FocusTrapFactory);
    private readonly dialogRef = inject(DialogRef);
    private readonly destroyRef = inject(DestroyRef);

    private focusTrap!: FocusTrap;

    ngOnInit(): void {
        const type = this.childComponentType();
        if (type) {
            this.vc.createComponent(type, {
                environmentInjector: this.injector,
            });
        } else {
            throw new Error('Dialog childComponentType not provided.');
        }

        this.focusTrap = this.focusTrapFactory.create(this.modalBox.nativeElement);
        this.focusTrap.focusInitialElement();

        // Kick off fade/scale with Tailwind by adding a class:
        requestAnimationFrame(() => {
            this.modalBox.nativeElement.classList.remove('scale-95', 'opacity-0');
            this.modalBox.nativeElement.classList.add('scale-100', 'opacity-100');
        });
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        this.dialogRef.close();
    }
}
