import { ChangeDetectionStrategy, Component, inject, signal, input } from '@angular/core';
import { CodeSnippetService } from '../../services';

@Component({
    selector: 'dev-code-snippet',
    templateUrl: './code-snippet.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSnippetComponent {
    readonly code = input<string>('');
    readonly language = input<string>('html');

    private codeSnippetService = inject(CodeSnippetService);
    isCopied = signal(false);

    copyCode(): void {
        this.codeSnippetService.copyToClipboard(this.code()).then(success => {
            if (success) {
                this.isCopied.set(true);
                setTimeout(() => this.isCopied.set(false), 2000);
            }
        });
    }
}
