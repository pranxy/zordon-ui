import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'zd-modal-container',
    imports: [],
    template: `<p>modal-container works!</p>`,
    styleUrl: './modal-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZdModalContainer {}
