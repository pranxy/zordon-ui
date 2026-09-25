import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdRadio } from '@pranxy/zordon-ui/radio';
import { ZdSelect } from '@pranxy/zordon-ui/select';
import {
  ZdThemeButton,
  ZdThemeController,
  ZdThemeRadio,
  ZdThemeSelect,
  ZdThemeToggle,
  type ZdThemeChange,
  type ZdThemeControllerOptions,
} from '@pranxy/zordon-ui/theme-controller';
import { ZdToggle } from '@pranxy/zordon-ui/toggle';

import {
  nestedCode,
  persistedFiles,
  themeControllerPlaygroundControls,
  themeControllerPlaygroundSnippet,
  themeControllerReference,
} from '../content/theme-controller.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Reuses the Toggle and Select page stylesheets for the styled controls. */
@Component({
  selector: 'docs-theme-controller-daisy-styles',
  template: '',
  styleUrls: ['./styles/toggle.daisy.css', './styles/select.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class ThemeControllerDaisyStylesComponent {}

@Component({
  selector: 'docs-theme-controller-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ThemeControllerDaisyStylesComponent,
    ZdButton,
    ZdRadio,
    ZdSelect,
    ZdThemeButton,
    ZdThemeController,
    ZdThemeRadio,
    ZdThemeSelect,
    ZdThemeToggle,
    ZdToggle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-theme-controller-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Theme Controller"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <section
            class="scope"
            aria-label="Playground theme scope"
            [zdThemeController]="lightFirst"
            #playground="zdThemeController"
          >
            @switch (values['control']) {
              @case ('toggle') {
                <label class="docs-choice">
                  <input type="checkbox" zdToggle zdThemeToggle="dark" />
                  Dark theme
                </label>
              }
              @case ('select') {
                <label class="docs-field">
                  Theme
                  <select zdSelect zdThemeSelect>
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
              }
              @case ('buttons') {
                <div class="docs-cluster" role="group" aria-label="Theme">
                  <button zdButton type="button" size="sm" zdThemeButton="light">Light</button>
                  <button zdButton type="button" size="sm" zdThemeButton="dark">Dark</button>
                  <button zdButton type="button" size="sm" zdThemeButton="system">System</button>
                </div>
              }
              @default {
                <fieldset class="group">
                  <legend>Appearance</legend>
                  <label class="docs-choice">
                    <input type="radio" zdRadio name="playground-theme" zdThemeRadio="light" />
                    Light
                  </label>
                  <label class="docs-choice">
                    <input type="radio" zdRadio name="playground-theme" zdThemeRadio="dark" />
                    Dark
                  </label>
                  <label class="docs-choice">
                    <input type="radio" zdRadio name="playground-theme" zdThemeRadio="system" />
                    System
                  </label>
                </fieldset>
              }
            }
            <p class="state">Using {{ playground.state.resolvedTheme() }}</p>
          </section>
        </ng-template>
      </docs-playground>

      <docs-section
        id="persistence"
        level="3"
        heading="Remembered preference"
        description="With a storageKey the choice survives reloads and syncs across tabs. themeChange reports each change and where it came from."
      >
        <docs-example label="appearance" [files]="persistedFiles">
          <section
            class="scope"
            aria-label="Remembered theme scope"
            [zdThemeController]="remembered"
            #appearance="zdThemeController"
            (themeChange)="last.set($event)"
          >
            <div class="docs-cluster">
              <label class="docs-choice">
                <input type="checkbox" zdToggle color="primary" zdThemeToggle="dark" />
                Dark theme
              </label>
              <button zdButton type="button" size="sm" zdThemeButton="system">Follow system</button>
            </div>
            <p class="state">
              {{ appearance.state.theme() }} → {{ appearance.state.resolvedTheme() }}
              @if (last(); as change) {
                (last change: {{ change.source }})
              }
            </p>
          </section>
        </docs-example>
      </docs-section>

      <docs-section
        id="nested"
        level="3"
        heading="Nested scopes"
        description="Each scope has its own state and themes only its own element; the inner one starts dark and ignores the outer switch."
      >
        <docs-example label="nested.html" [code]="nestedCode">
          <section class="scope" aria-label="Outer theme scope" [zdThemeController]="lightFirst">
            <label class="docs-choice">
              <input type="checkbox" zdToggle zdThemeToggle="dark" />
              Dark outer
            </label>
            <aside class="scope" aria-label="Inner theme scope" [zdThemeController]="darkFirst">
              <label class="docs-choice">
                <input type="checkbox" zdToggle zdThemeToggle="dark" />
                Dark inner
              </label>
            </aside>
          </section>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .scope {
      display: grid;
      gap: var(--docs-space-3);
      min-inline-size: min(18rem, 100%);
      padding: var(--docs-space-4);
      border: 1px solid var(--color-base-300);
      border-radius: var(--docs-radius-md);
      background: var(--color-base-100);
      color: var(--color-base-content);
    }

    .group {
      display: grid;
      gap: var(--docs-space-2);
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-block-end: var(--docs-space-2);
      font-weight: var(--docs-weight-semibold);
    }

    .state {
      margin: 0;
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }
  `,
})
export class ThemeControllerPageComponent {
  protected readonly reference = themeControllerReference;
  protected readonly controls = themeControllerPlaygroundControls;
  protected readonly snippet = themeControllerPlaygroundSnippet;
  protected readonly persistedFiles = persistedFiles;
  protected readonly nestedCode = nestedCode;

  protected readonly lightFirst: ZdThemeControllerOptions = { initial: 'light' };
  protected readonly darkFirst: ZdThemeControllerOptions = { initial: 'dark' };
  protected readonly remembered: ZdThemeControllerOptions = {
    initial: 'system',
    storageKey: 'docs.theme-controller.example',
  };
  protected readonly last = signal<ZdThemeChange | null>(null);
}
