import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CodeSnippetService {
    copyToClipboard(text: string): Promise<boolean> {
        if (!navigator.clipboard) {
            return this.fallbackCopyToClipboard(text);
        }
        return navigator.clipboard
            .writeText(text)
            .then(() => true)
            .catch(() => false);
    }

    private fallbackCopyToClipboard(text: string): Promise<boolean> {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '0';
            textArea.style.top = '0';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve(successful);
        } catch (err) {
            return Promise.resolve(false);
        }
    }
}
