import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdModal, type ZdModalOptions } from '@pranxy/zordon-ui/modal';

export interface DocsSearchEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly path: string;
}

/**
 * Modal quick-find over the static page catalogue, rendered by Zordon's own Modal: it traps focus,
 * closes on Escape or the backdrop, and returns focus to whatever opened it.
 */
@Component({
  selector: 'docs-search-dialog',
  imports: [RouterLink, ZdModal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template
      zdModal
      [open]="isOpen()"
      [options]="options"
      (openChange)="isOpen.set($event)"
      (closed)="query.set('')"
    >
      <div class="search">
        <div class="heading">
          <p class="docs-eyebrow docs-eyebrow--accent">Quick find</p>
          <h2>Search documentation</h2>
        </div>
        <div class="field">
          <label for="docs-search">Search documentation</label>
          <input
            id="docs-search"
            type="search"
            autocomplete="off"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
          />
        </div>
        <nav aria-label="Search results">
          @for (entry of results(); track entry.id) {
            <a [routerLink]="entry.path" (click)="isOpen.set(false)">
              <strong>{{ entry.label }}</strong>
              <span>{{ entry.description }}</span>
            </a>
          } @empty {
            <p class="docs-muted">No documentation pages match that search.</p>
          }
        </nav>
        <!-- Last in the DOM so the search field gets first focus; placed top-right by the grid. -->
        <button
          type="button"
          class="secondary close"
          aria-label="Close search"
          (click)="isOpen.set(false)"
        >
          Close
        </button>
      </div>
    </ng-template>
  `,
  styles: `
    .search {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0 1rem;
    }

    .heading,
    .field,
    nav {
      grid-column: 1 / -1;
    }

    .heading {
      grid-column: 1;
      grid-row: 1;
      margin-block-end: 1rem;
    }

    .close {
      grid-column: 2;
      grid-row: 1;
      align-self: start;
    }

    h2 {
      margin: 0.25rem 0 0;
      font-size: var(--docs-text-h3);
    }

    label {
      display: block;
      margin-block-end: 0.5rem;
      font-size: var(--docs-text-sm);
      font-weight: var(--docs-weight-semibold);
    }

    input {
      box-sizing: border-box;
      inline-size: 100%;
      min-block-size: 3rem;
      margin-block-end: 1rem;
      padding-inline: 0.875rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
      color: var(--docs-text);
    }

    .secondary {
      min-block-size: 2.5rem;
      padding-inline: 0.75rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-subtle);
      color: var(--docs-text);
      cursor: pointer;
    }

    nav {
      display: grid;
      gap: 0.5rem;
    }

    a {
      display: grid;
      gap: 0.25rem;
      padding: 0.875rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
    }

    a:hover {
      border-color: var(--docs-accent);
      background: var(--docs-subtle);
    }

    a span {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }
  `,
})
export class DocsSearchDialogComponent {
  readonly entries = input.required<readonly DocsSearchEntry[]>();

  protected readonly options: ZdModalOptions = { label: 'Search documentation', size: 'lg' };
  protected readonly isOpen = signal(false);
  protected readonly query = signal('');
  protected readonly results = computed(() => {
    const needle = this.query().trim().toLocaleLowerCase();
    return this.entries().filter(
      entry =>
        needle === '' ||
        entry.label.toLocaleLowerCase().includes(needle) ||
        entry.description.toLocaleLowerCase().includes(needle),
    );
  });

  /** The invoker gets focus back from Modal, which remembers the element focused on opening. */
  open(invoker: EventTarget | null): void {
    if (invoker instanceof HTMLElement) invoker.focus();
    this.query.set('');
    this.isOpen.set(true);
  }
}
