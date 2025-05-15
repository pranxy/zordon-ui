import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'zd-radio',
    imports: [],
    template: `<p>radio works!</p>`,
    styleUrl: './radio.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent {}
