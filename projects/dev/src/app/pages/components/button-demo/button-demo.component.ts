import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';

@Component({
    selector: 'dev-button-demo',
    standalone: true,
    imports: [ZdButton],
    template: `<p>button-demo works!</p>`,
    styleUrl: './button-demo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ButtonDemoComponent {}
