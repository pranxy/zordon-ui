import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import {
  catalogueEntries,
  categorySlug,
  componentCategories,
  entriesInCategory,
  type ComponentCategory,
} from '../../content/component-catalogue';
import { filterCatalogue } from '../../content/component-summaries';
import { DocsChipGroupComponent, type DocsChipOption } from '../reference/chip-group.component';
import { DocsComponentCardComponent } from './component-card.component';

/**
 * Filterable component catalogue. The category lives in the URL (`?category=data-input`) so
 * filtered views are linkable and server-rendered; the text query is local to the viewer.
 */
@Component({
  selector: 'docs-catalogue',
  imports: [DocsChipGroupComponent, DocsComponentCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters">
      <docs-chip-group
        class="chips"
        label="Category"
        [hideLegend]="true"
        selectedStyle="accent"
        [options]="categoryOptions"
        [value]="category()"
        (valueChange)="selectCategory($event)"
      />
      <label class="select">
        <span class="docs-eyebrow">Category</span>
        <select [value]="category()" (change)="selectCategory($any($event.target).value)">
          @for (option of categoryOptions; track option.value) {
            <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
          }
        </select>
      </label>
      <label class="search">
        <span class="docs-visually-hidden">Filter components</span>
        <input
          type="search"
          placeholder="Filter by name, description, or maturity"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
      </label>
    </div>

    <p class="docs-visually-hidden" role="status">{{ visibleCount() }} components shown</p>

    @for (group of groups(); track group.category) {
      <section class="group" [attr.aria-labelledby]="'cat-' + slug(group.category)">
        <div class="group-heading">
          <h3 [id]="'cat-' + slug(group.category)">{{ group.category }}</h3>
          <span class="count">{{ group.entries.length }} of {{ group.total }}</span>
        </div>
        <ul>
          @for (entry of group.entries; track entry.id) {
            <li><docs-component-card [entry]="entry" /></li>
          }
        </ul>
      </section>
    } @empty {
      <p class="empty">No components match that filter.</p>
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 2rem;
    }

    .filters {
      display: grid;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }

    .select {
      display: none;
      gap: 0.35rem;
    }

    select,
    input {
      inline-size: 100%;
      min-block-size: 2.5rem;
      padding-inline: 0.75rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
      color: var(--docs-text);
    }

    .group {
      display: grid;
      gap: 1rem;
    }

    .group-heading {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      padding-block-end: 0.5rem;
      border-block-end: 1px solid var(--docs-border);
    }

    h3 {
      margin: 0;
      font-size: var(--docs-text-h3);
      font-weight: var(--docs-weight-heading);
      letter-spacing: -0.01em;
    }

    .count {
      color: var(--docs-muted-text);
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }

    ul {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
      gap: 1rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: grid;
    }

    .empty {
      margin: 0;
      padding: 2rem;
      border: 1px dashed var(--docs-border-strong);
      border-radius: var(--docs-radius-lg);
      color: var(--docs-muted-text);
      text-align: center;
    }

    @media (max-width: 48rem) {
      .chips {
        display: none;
      }

      .select {
        display: grid;
      }
    }
  `,
})
export class DocsCatalogueComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly categoryOptions: readonly DocsChipOption[] = [
    { value: 'all', label: 'All', count: catalogueEntries.length },
    ...componentCategories.map(category => ({
      value: categorySlug(category),
      label: category,
      count: entriesInCategory(category).length,
    })),
  ];

  protected readonly category = toSignal(
    this.route.queryParamMap.pipe(map(params => normalizeCategory(params.get('category')))),
    { initialValue: normalizeCategory(this.route.snapshot.queryParamMap.get('category')) },
  );
  protected readonly query = signal('');
  protected readonly groups = computed(() =>
    filterCatalogue(this.query(), categoryFromSlug(this.category()) ?? 'all'),
  );
  protected readonly visibleCount = computed(() =>
    this.groups().reduce((total, group) => total + group.entries.length, 0),
  );

  protected slug(category: ComponentCategory): string {
    return categorySlug(category);
  }

  protected selectCategory(value: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: value === 'all' ? null : value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

function categoryFromSlug(slug: string): ComponentCategory | undefined {
  return componentCategories.find(category => categorySlug(category) === slug);
}

function normalizeCategory(value: string | null): string {
  return value && categoryFromSlug(value) ? value : 'all';
}
