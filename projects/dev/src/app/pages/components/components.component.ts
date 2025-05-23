import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'dev-components',
    imports: [RouterOutlet],
    template: ` <router-outlet /> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComponentsComponent {}
