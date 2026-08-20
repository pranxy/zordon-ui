import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsCodeExampleComponent } from './shared/code-example.component';
import { DocsPageHeaderComponent } from './shared/page-header.component';

const stylesheetSetup = `@import 'tailwindcss';

@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}`;

const themeScope = `<html data-theme="dark">
  <section data-theme="light">Light preview</section>
</html>`;

@Component({
  selector: 'docs-styling-and-theming-page',
  imports: [DocsCodeExampleComponent, DocsPageHeaderComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-page" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Guide"
        heading="Styling and theming"
        description="Zordon UI uses daisyUI as its visual source of truth. Applications compile Tailwind CSS and choose their own daisyUI themes, prefixes, and customization surface."
        sourceUrl="https://github.com/pranxy/zordon-ui/blob/master/docs/guides/styling-and-theming.md"
      />

      <section class="docs-page-section" aria-labelledby="supported-versions">
        <h2 id="supported-versions">Supported versions</h2>
        <ul>
          <li>Tailwind CSS <code>&gt;=4.1.0 &lt;5.0.0</code></li>
          <li>daisyUI <code>&gt;=5.7.16 &lt;6.0.0</code></li>
        </ul>
        <p>
          Both packages are peer dependencies; the consuming application owns the generated CSS.
        </p>
      </section>

      <section class="docs-page-section" aria-labelledby="application-setup">
        <h2 id="application-setup">Application setup</h2>
        <p>Load Tailwind and configure the daisyUI themes your application supports.</p>
        <docs-code-example label="Global stylesheet" [code]="stylesheetSetup" />
      </section>

      <section class="docs-page-section" aria-labelledby="themes">
        <h2 id="themes">Themes and scopes</h2>
        <p>
          Apply a configured theme globally on <code>html</code> or locally on any nested scope.
          Zordon components inherit the consumer-owned semantic tokens.
        </p>
        <docs-code-example label="Nested theme scope" [code]="themeScope" />
        <a routerLink="/foundations/typed-vocabularies">Review the typed vocabulary contract</a>
      </section>
    </article>
  `,
})
export class StylingAndThemingPageComponent {
  protected readonly stylesheetSetup = stylesheetSetup;
  protected readonly themeScope = themeScope;
}
