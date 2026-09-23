import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DocsSearchEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly path: string;
}

/** Modal quick-find over the static page catalogue. Restores focus to the invoker on dismissal. */
@Component({
  selector: 'docs-search-dialog',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      aria-label="Search documentation"
      (cancel)="cancel($event)"
      (close)="query.set('')"
    >
      <div class="heading">
        <div>
          <p class="docs-eyebrow docs-eyebrow--accent">Quick find</p>
          <h2>Search documentation</h2>
        </div>
        <form method="dialog">
          <button type="submit" class="secondary" aria-label="Close search">Close</button>
        </form>
      </div>
      <label for="docs-search">Search documentation</label>
      <input
        id="docs-search"
        type="search"
        autocomplete="off"
        autofocus
        [value]="query()"
        (input)="query.set($any($event.target).value)"
        (keydown.escape)="cancel($event)"
      />
      <nav aria-label="Search results">
        @for (entry of results(); track entry.id) {
          <a [routerLink]="entry.path" (click)="close()">
            <strong>{{ entry.label }}</strong>
            <span>{{ entry.description }}</span>
          </a>
        } @empty {
          <p class="docs-muted">No documentation pages match that search.</p>
        }
      </nav>
    </dialog>
  `,
  styles: `
    dialog {
      inline-size: min(calc(100% - 2rem), 42rem);
      max-block-size: min(42rem, calc(100dvh - 2rem));
      padding: 1.25rem;
      border: 1px solid var(--docs-border);
      border-radius: 1rem;
      background: var(--docs-surface);
      color: var(--docs-text);
      box-shadow: var(--docs-shadow);
    }

    dialog::backdrop {
      background: var(--docs-backdrop);
    }

    .heading {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
      margin-block-end: 1rem;
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

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private invoker: HTMLElement | null = null;

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

  open(invoker: EventTarget | null): void {
    this.query.set('');
    this.invoker = invoker instanceof HTMLElement ? invoker : null;
    const dialog = this.dialog().nativeElement;
    if (!dialog.open) dialog.showModal();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected cancel(event: Event): void {
    event.preventDefault();
    this.close();
    this.invoker?.focus();
  }
}
