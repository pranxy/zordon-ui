import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Splits `text` on backticks: odd segments are code. */
export function inlineCodeSegments(text: string): readonly { code: boolean; text: string }[] {
  return text
    .split('`')
    .map((segment, index) => ({ code: index % 2 === 1, text: segment }))
    .filter(segment => segment.text !== '');
}

/** Renders short content strings where `backticks` mark inline code. */
@Component({
  selector: 'docs-inline-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (segment of segments(); track $index) {
    @if (segment.code) {
      <code class="docs-code-inline">{{ segment.text }}</code>
    } @else {
      <ng-container>{{ segment.text }}</ng-container>
    }
  }`,
})
export class DocsInlineCodeComponent {
  readonly text = input.required<string>();
  protected readonly segments = computed(() => inlineCodeSegments(this.text()));
}
