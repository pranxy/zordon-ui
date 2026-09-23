import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';

import {
  appConfig,
  firstComponent,
  installCommands,
  nextSteps,
  postcssConfig,
  requirements,
  serveCommand,
  stylesheet,
  troubleshooting,
} from '../content/getting-started.content';
import {
  DocsCalloutComponent,
  DocsCodeBlockComponent,
  DocsCodeTabsComponent,
  DocsFaqComponent,
  DocsLinkCardsComponent,
  DocsMetaGridComponent,
  DocsPageHeaderComponent,
  DocsSectionComponent,
  DocsStepComponent,
  DocsStepsComponent,
} from '../ui';

@Component({
  selector: 'docs-getting-started',
  imports: [
    DocsCalloutComponent,
    DocsCodeBlockComponent,
    DocsCodeTabsComponent,
    DocsFaqComponent,
    DocsLinkCardsComponent,
    DocsMetaGridComponent,
    DocsPageHeaderComponent,
    DocsSectionComponent,
    DocsStepComponent,
    DocsStepsComponent,
    ZdButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Get started"
        heading="Get started with Zordon UI"
        description="Install Zordon UI in an Angular application configured with Tailwind CSS 4 and daisyUI 5: five steps from a fresh workspace to a themed, accessible button. Zordon adds behaviour; Tailwind and daisyUI stay yours to configure."
      >
        <docs-meta-grid id="requirements" [items]="requirements" />
      </docs-page-header>

      <docs-section
        id="manual-setup"
        heading="Manual setup"
        description="Start from a workspace created with ng new my-app --style=css."
      >
        <docs-steps>
          <docs-step
            id="step-install"
            heading="Install packages"
            description="Tailwind CSS and daisyUI are peer dependencies, so the versions in your lockfile are the ones that ship."
          >
            <docs-code-tabs
              label="Package manager"
              persistKey="zordon-docs-package-manager"
              [files]="installCommands"
            />
          </docs-step>
          <docs-step
            id="step-postcss"
            heading="Register the PostCSS plugin"
            description="Angular's build picks this file up automatically at the workspace root. No angular.json changes are needed."
          >
            <docs-code-block label=".postcssrc.json" language="json" [code]="postcssConfig" />
          </docs-step>
          <docs-step
            id="step-styles"
            heading="Load Tailwind and daisyUI"
            description="Replace the contents of your global stylesheet. Only the themes listed here are compiled."
          >
            <docs-code-block label="src/styles.css" language="css" [code]="stylesheet" />
          </docs-step>
          <docs-step
            id="step-provide"
            heading="Configure the application"
            description="Register the immutable library configuration once. The defaults match the stylesheet above."
          >
            <docs-code-block label="src/app/app.config.ts" language="ts" [code]="appConfig" />
          </docs-step>
          <docs-step
            id="step-first"
            heading="Use your first component"
            description="Import each directive where it is used. There is no module to register."
          >
            <docs-code-block label="src/app/app.ts" language="ts" [code]="firstComponent" />
            <docs-callout variant="result" label="Result">
              <button zdButton color="primary" type="button">Save</button>
              <span class="docs-muted">Theme-aware, keyboard-ready, no extra CSS.</span>
            </docs-callout>
          </docs-step>
        </docs-steps>
      </docs-section>

      <docs-section id="run" heading="Run it">
        <docs-code-block label="Terminal" language="bash" [code]="serveCommand" />
      </docs-section>

      <docs-section id="troubleshooting" heading="Troubleshooting">
        <docs-faq [items]="troubleshooting" />
      </docs-section>

      <docs-section id="next-steps" heading="Next steps">
        <docs-link-cards [cards]="nextSteps" />
      </docs-section>
    </article>
  `,
})
export class GettingStartedComponent {
  protected readonly requirements = requirements;
  protected readonly installCommands = installCommands;
  protected readonly postcssConfig = postcssConfig;
  protected readonly stylesheet = stylesheet;
  protected readonly appConfig = appConfig;
  protected readonly firstComponent = firstComponent;
  protected readonly serveCommand = serveCommand;
  protected readonly troubleshooting = troubleshooting;
  protected readonly nextSteps = nextSteps;
}
