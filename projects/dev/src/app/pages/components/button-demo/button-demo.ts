import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';

@Component({
    selector: 'dev-button-demo',
    standalone: true,
    imports: [ZdButton],
    templateUrl: 'button-demo.html',
    styleUrl: './button-demo.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ButtonDemo {}
