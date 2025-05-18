import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'zd-modal-action',
    host: {
        class: 'modal-action gap-x-1',
    },
    template: `<ng-content />`,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZdModalActions {}
