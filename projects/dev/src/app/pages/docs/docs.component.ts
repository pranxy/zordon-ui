import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dev-docs',
    imports: [RouterLink],
    templateUrl: './docs.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocsComponent {}
