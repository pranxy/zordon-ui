import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dev-radio-demo',
    imports: [],
    template: `<p>radio-demo works!</p>`,
    styleUrl: './radio-demo.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RadioDemoComponent {}
