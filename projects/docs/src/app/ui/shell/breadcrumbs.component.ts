import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DocsBreadcrumb {
  readonly label: string;
  /** Omit for the current page. */
  readonly path?: string;
  readonly queryParams?: Readonly<Record<string, string>>;
}

@Component({
  selector: 'docs-breadcrumbs',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Breadcrumb">
      <ol>
        @for (item of items(); track $index; let last = $last) {
          <li>
            @if (last || !item.path) {
              <span [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>
            } @else {
              <a [routerLink]="item.path" [queryParams]="item.queryParams">{{ item.label }}</a>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    nav {
      padding-block: 1.25rem;
      border-block-end: 1px solid var(--docs-border);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }

    ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li + li::before {
      content: '/';
      margin-inline-end: 0.5rem;
      color: var(--docs-border-strong);
    }

    [aria-current='page'] {
      color: var(--docs-text);
    }
  `,
})
export class DocsBreadcrumbsComponent {
  readonly items = input.required<readonly DocsBreadcrumb[]>();
}
