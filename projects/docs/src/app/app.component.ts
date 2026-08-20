import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'docs-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <a aria-label="Zordon UI home" class="brand" routerLink="/">Zordon UI</a>
      <nav aria-label="Primary navigation">
        <a routerLink="/docs/getting-started" routerLinkActive="active">Get started</a>
      </nav>
    </header>
    <main id="main-content">
      <router-outlet />
    </main>
    <footer class="site-footer">
      <a href="https://github.com/pranxy/zordon-ui">View the project on GitHub</a>
    </footer>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-block-size: 100vh;
    }

    .site-header,
    .site-footer,
    main {
      padding-inline: clamp(1rem, 5vw, 4rem);
    }

    .site-header {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem 2rem;
      align-items: center;
      justify-content: space-between;
      padding-block: 1rem;
      border-block-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    }

    .brand {
      font-weight: 800;
      text-decoration: none;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .active {
      font-weight: 700;
    }

    main {
      inline-size: min(100%, 76rem);
      margin-inline: auto;
      padding-block: clamp(2rem, 6vw, 5rem);
    }

    .site-footer {
      padding-block: 1.5rem;
      border-block-start: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    }

    .skip-link {
      position: fixed;
      inset-block-start: 0.5rem;
      inset-inline-start: 0.5rem;
      z-index: 1;
      padding: 0.75rem 1rem;
      background: Canvas;
      color: CanvasText;
      transform: translateY(-150%);
    }

    .skip-link:focus {
      transform: translateY(0);
    }
  `,
})
export class DocsAppComponent {}
