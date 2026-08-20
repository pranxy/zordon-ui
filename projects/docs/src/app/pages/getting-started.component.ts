import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsCodeExampleComponent } from './shared/code-example.component';
import { DocsPageHeaderComponent } from './shared/page-header.component';

const installCommand = `npm install @pranxy/zordon-ui tailwindcss daisyui`;
const styleSetup = `@import 'tailwindcss';

@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}`;
const applicationSetup = `import { ApplicationConfig } from '@angular/core';
import { provideZordonUi } from '@pranxy/zordon-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideZordonUi()],
};`;
const firstComponent = `import { ZdButton } from '@pranxy/zordon-ui/button';

@Component({
  imports: [ZdButton],
  template: \`<button zdButton color="primary">Save changes</button>\`,
})
export class AccountActions {}`;

@Component({
  selector: 'docs-getting-started',
  imports: [DocsCodeExampleComponent, DocsPageHeaderComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-page" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Documentation"
        heading="Get started with Zordon UI"
        description="Install Zordon UI in an Angular application configured with Tailwind CSS 4 and daisyUI 5, then import components from their public entry points."
      />

      <section class="docs-page-section" aria-labelledby="prerequisites">
        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          <li>An Angular 21 application using standalone APIs.</li>
          <li>Tailwind CSS 4 and daisyUI 5 in the application build.</li>
          <li>A supported Node.js runtime for local tooling and SSR builds.</li>
        </ul>
      </section>

      <section class="docs-page-section" aria-labelledby="install">
        <h2 id="install">Install</h2>
        <p>
          Install the Angular library with the styling peer dependencies owned by your application.
        </p>
        <docs-code-example label="Package installation" [code]="installCommand" />
      </section>

      <section class="docs-page-section" aria-labelledby="configure">
        <h2 id="configure">Configure styling</h2>
        <p>Load Tailwind CSS and opt into the daisyUI themes your application supports.</p>
        <docs-code-example label="Global stylesheet" [code]="styleSetup" />
        <a routerLink="/guides/styling-and-theming">Read the full styling and theming guide</a>
      </section>

      <section class="docs-page-section" aria-labelledby="configure-application">
        <h2 id="configure-application">Configure the application</h2>
        <p>
          Register the immutable library configuration once. The default empty prefixes match the
          stylesheet above; pass explicit prefixes only when the build uses them.
        </p>
        <docs-code-example label="Application providers" [code]="applicationSetup" />
      </section>

      <section class="docs-page-section" aria-labelledby="first-component">
        <h2 id="first-component">Use your first component</h2>
        <p>Import Button from its public entry point and keep the native action element.</p>
        <docs-code-example label="Standalone Button example" [code]="firstComponent" />
      </section>

      <section class="docs-page-section" aria-labelledby="what-comes-next">
        <h2 id="what-comes-next">What comes next</h2>
        <p>
          Browse the component catalogue, check each component's maturity, and import only from its
          documented public entry point.
        </p>
        <a routerLink="/components">Browse components</a>
      </section>
    </article>
  `,
})
export class GettingStartedComponent {
  protected readonly installCommand = installCommand;
  protected readonly styleSetup = styleSetup;
  protected readonly applicationSetup = applicationSetup;
  protected readonly firstComponent = firstComponent;
}
