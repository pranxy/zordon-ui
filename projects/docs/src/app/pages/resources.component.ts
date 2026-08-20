import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsPageHeaderComponent } from './shared/page-header.component';

@Component({
  selector: 'docs-resources-page',
  imports: [DocsPageHeaderComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-page" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Project"
        heading="Resources"
        description="Follow the Zordon UI repository, project plans, contribution guidance, and the upstream Angular and daisyUI documentation that define supported boundaries."
      />

      <section class="docs-page-section" aria-labelledby="project">
        <h2 id="project">Project</h2>
        <ul class="docs-card-grid">
          <li class="docs-card">
            <h3><a href="https://github.com/pranxy/zordon-ui">GitHub repository</a></h3>
            <p>Source, issues, pull requests, releases, and contribution history.</p>
          </li>
          <li class="docs-card">
            <h3><a routerLink="/components">Component catalogue</a></h3>
            <p>Published maturity and reference contracts for each documented component.</p>
          </li>
          <li class="docs-card">
            <h3><a routerLink="/docs/getting-started">Getting started</a></h3>
            <p>Installation, styling configuration, and the shortest route to a first component.</p>
          </li>
          <li class="docs-card">
            <h3>
              <a href="https://github.com/pranxy/zordon-ui/tree/master/docs/plans"
                >Roadmap and status</a
              >
            </h3>
            <p>
              Tracked implementation plans and evidence for work that is complete or still pending.
            </p>
          </li>
          <li class="docs-card">
            <h3>
              <a
                href="https://github.com/pranxy/zordon-ui/blob/master/projects/components/CHANGELOG.md"
                >Changelog and releases</a
              >
            </h3>
            <p>Published package changes, with repository releases for versioned artifacts.</p>
          </li>
          <li class="docs-card">
            <h3>
              <a href="https://github.com/pranxy/zordon-ui/blob/master/CONTRIBUTING.md"
                >Contributing</a
              >
            </h3>
            <p>Workspace setup, validation expectations, and the project contribution workflow.</p>
          </li>
        </ul>
      </section>

      <section class="docs-page-section" aria-labelledby="upstream">
        <h2 id="upstream">Upstream documentation</h2>
        <ul class="docs-link-list">
          <li><a href="https://angular.dev/">Angular documentation</a></li>
          <li><a href="https://daisyui.com/">daisyUI documentation</a></li>
          <li><a href="https://tailwindcss.com/docs">Tailwind CSS documentation</a></li>
        </ul>
      </section>
    </article>
  `,
})
export class ResourcesPageComponent {}
