import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ZdIdGenerator } from '@pranxy/zordon-ui';

import { DocsCodeFrameComponent } from './code-block.component';
import { DocsCodeComponent } from './code.component';
import { DocsCopyButtonComponent } from './copy-button.component';
import type { CodeLanguage } from './highlight';
import { readPreference, writePreference } from '../services/preferences';

export interface DocsCodeFile {
  /** Tab label, e.g. "npm" or "save-button.ts". */
  readonly label: string;
  readonly code: string;
  readonly language: CodeLanguage;
}

/**
 * Several related snippets in one frame, switched with an ARIA tablist (arrow keys, Home, End).
 * The first file is visible in server HTML. With `persistKey`, the chosen tab is remembered per
 * viewer (for example the package manager) and restored after hydration.
 */
@Component({
  selector: 'docs-code-tabs',
  imports: [DocsCodeComponent, DocsCodeFrameComponent, DocsCopyButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-code-frame>
      <div docsCodeFrameStart role="tablist" [attr.aria-label]="label()">
        @for (file of files(); track file.label; let index = $index) {
          <button
            type="button"
            role="tab"
            [id]="baseId + '-tab-' + index"
            [attr.aria-selected]="index === selected()"
            [attr.aria-controls]="baseId + '-panel-' + index"
            [attr.tabindex]="index === selected() ? 0 : -1"
            (click)="select(index)"
            (keydown)="onKeydown($event, index)"
          >
            {{ file.label }}
          </button>
        }
      </div>
      <docs-copy-button
        docsCodeFrameEnd
        [text]="active().code"
        [label]="'Copy ' + active().label + ' code'"
      />
      @for (file of files(); track file.label; let index = $index) {
        <div
          role="tabpanel"
          [id]="baseId + '-panel-' + index"
          [attr.aria-labelledby]="baseId + '-tab-' + index"
          [hidden]="index !== selected()"
        >
          <docs-code [code]="file.code" [language]="file.language" [label]="file.label + ' code'" />
        </div>
      }
    </docs-code-frame>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }

    [role='tablist'] {
      display: flex;
      gap: 0.25rem;
      margin-block: -0.375rem;
      margin-inline-start: -0.5rem;
      overflow-x: auto;
    }

    [role='tab'] {
      min-block-size: 2.625rem;
      padding-inline: 0.625rem;
      border: 0;
      border-block-end: 2px solid transparent;
      background: transparent;
      color: var(--docs-code-muted);
      font-family: var(--docs-font-mono);
      font-size: 0.6875rem;
      cursor: pointer;
      white-space: nowrap;
    }

    [role='tab'][aria-selected='true'] {
      border-block-end-color: var(--docs-token-tag);
      color: var(--docs-code-fg);
      font-weight: var(--docs-weight-semibold);
    }

    [role='tab']:focus-visible {
      outline-offset: -3px;
    }
  `,
})
export class DocsCodeTabsComponent {
  private readonly document = inject(DOCUMENT);

  readonly files = input.required<readonly DocsCodeFile[]>();
  /** Accessible name for the tablist, e.g. "Package manager". */
  readonly label = input.required<string>();
  /** Storage key used to remember the selected tab label for this viewer. */
  readonly persistKey = input<string>();

  protected readonly baseId = inject(ZdIdGenerator).next('docs-code-tabs');
  protected readonly selected = signal(0);
  protected readonly active = computed(
    () =>
      this.files()[this.selected()] ?? this.files()[0] ?? { label: '', code: '', language: 'text' },
  );

  constructor() {
    afterNextRender(() => {
      const key = this.persistKey();
      if (!key) return;
      const saved = readPreference(this.document, key);
      const index = this.files().findIndex(file => file.label === saved);
      if (index > 0) this.selected.set(index);
    });
  }

  protected select(index: number): void {
    this.selected.set(index);
    const key = this.persistKey();
    const file = this.files()[index];
    if (key && file) writePreference(this.document, key, file.label);
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const count = this.files().length;
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % count
        : event.key === 'ArrowLeft'
          ? (index - 1 + count) % count
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? count - 1
              : undefined;
    if (next === undefined) return;
    event.preventDefault();
    this.select(next);
    this.document.getElementById(`${this.baseId}-tab-${next}`)?.focus();
  }
}
