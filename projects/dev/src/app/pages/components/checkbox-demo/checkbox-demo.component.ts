import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dev-checkbox-demo',
    standalone: true,
    imports: [],
    template: `<p>checkbox-demo works!</p>`,
    styleUrl: './checkbox-demo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxDemoComponent {}
