import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dev-examples',
    imports: [],
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExamplesComponent {}
