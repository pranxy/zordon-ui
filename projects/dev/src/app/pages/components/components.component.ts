import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'dev-components',
    standalone: true,
    imports: [RouterOutlet],
    template: ` <router-outlet /> `,
    styleUrl: './components.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComponentsComponent {}
