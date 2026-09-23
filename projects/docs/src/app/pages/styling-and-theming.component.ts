import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  DocsCodeBlockComponent,
  DocsMetaGridComponent,
  DocsPageHeaderComponent,
  DocsSectionComponent,
  type DocsMetaItem,
} from '../ui';

const supportedVersions: readonly DocsMetaItem[] = [
  { label: 'Tailwind CSS', value: '>=4.1.0 <5.0.0', mono: true },
  { label: 'daisyUI', value: '>=5.7.16 <6.0.0', mono: true },
];

const stylesheetSetup = `@import 'tailwindcss';

@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}`;

const themeScope = `<html data-theme="dark">
  <section data-theme="light">Light preview</section>
</html>`;

@Component({
  selector: 'docs-styling-and-theming-page',
  imports: [
    DocsCodeBlockComponent,
    DocsMetaGridComponent,
    DocsPageHeaderComponent,
    DocsSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Guide"
        heading="Styling and theming"
        description="Zordon UI uses daisyUI as its visual source of truth. Applications compile Tailwind CSS and choose their own daisyUI themes, prefixes, and customization surface."
      />

      <docs-section
        id="supported-versions"
        heading="Supported versions"
        description="Both packages are peer dependencies; the consuming application owns the generated CSS."
      >
        <docs-meta-grid [items]="supportedVersions" />
      </docs-section>

      <docs-section
        id="application-setup"
        heading="Application setup"
        description="Load Tailwind and configure the daisyUI themes your application supports."
      >
        <docs-code-block label="src/styles.css" language="css" [code]="stylesheetSetup" />
      </docs-section>

      <docs-section
        id="themes"
        heading="Themes and scopes"
        description="Apply a configured theme globally on html or locally on any nested scope. Zordon components inherit the consumer-owned semantic tokens."
      >
        <docs-code-block label="Nested theme scope" language="html" [code]="themeScope" />
      </docs-section>
    </article>
  `,
})
export class StylingAndThemingPageComponent {
  protected readonly supportedVersions = supportedVersions;
  protected readonly stylesheetSetup = stylesheetSetup;
  protected readonly themeScope = themeScope;
}
