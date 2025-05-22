import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeSnippetComponent } from '../code-snippet/code-snippet.component';

@Component({
    selector: 'app-component-card',
    imports: [CodeSnippetComponent],
    templateUrl: './component-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentCard {
    readonly title = input<string>('');

    readonly description = input<string>('');

    readonly codeSnippet = input<string>('');

    readonly language = input<string>('html');
}
