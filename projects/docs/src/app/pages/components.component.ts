import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsPageHeaderComponent } from './shared/page-header.component';

interface ComponentSummary {
  readonly category: 'Actions';
  readonly description: string;
  readonly maturity: 'planned';
  readonly name: string;
  readonly path: string;
}

const componentSummaries: readonly ComponentSummary[] = [
  {
    category: 'Actions',
    name: 'Button',
    path: '/components/button',
    maturity: 'planned',
    description:
      'Applies daisyUI Button appearance and controlled state to native action elements.',
  },
];

@Component({
  selector: 'docs-components-page',
  imports: [DocsPageHeaderComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-page" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Catalogue"
        heading="Components"
        description="Browse the Zordon UI component catalogue by category and maturity. Planned components are documented honestly and are not presented as supported APIs."
      />

      <section class="docs-page-section" aria-labelledby="component-catalogue">
        <h2 id="component-catalogue">Component catalogue</h2>
        <div class="docs-hydration-slot docs-filter-slot">
          @if (enhanced()) {
            <label class="docs-field">
              Filter components
              <input type="search" [value]="query()" (input)="updateQuery($event)" />
            </label>
          } @else {
            <div class="docs-control-placeholder" aria-hidden="true"><span></span></div>
          }
        </div>
        @for (group of visibleGroups(); track group.category) {
          <section class="docs-page-section" [attr.aria-labelledby]="group.category + '-category'">
            <h3 [id]="group.category + '-category'">{{ group.category }}</h3>
            <ul class="docs-card-grid">
              @for (component of group.components; track component.path) {
                <li class="docs-card">
                  <span class="docs-maturity">{{ component.maturity }}</span>
                  <h4>
                    <a [routerLink]="component.path">{{ component.name }}</a>
                  </h4>
                  <p>{{ component.description }}</p>
                </li>
              }
            </ul>
          </section>
        } @empty {
          <p>No components match that filter.</p>
        }
      </section>
    </article>
  `,
})
export class ComponentsPageComponent {
  protected readonly enhanced = signal(false);
  protected readonly query = signal('');
  protected readonly visibleGroups = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    const components = componentSummaries.filter(component =>
      `${component.name} ${component.description} ${component.maturity} ${component.category}`
        .toLocaleLowerCase()
        .includes(query),
    );
    return components.length === 0 ? [] : [{ category: 'Actions' as const, components }];
  });

  constructor() {
    afterNextRender(() => this.enhanced.set(true));
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
