import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdButton, type ZdButtonVariant, type ZdColor } from '@pranxy/zordon-ui/button';

import { DocsCodeExampleComponent } from './shared/code-example.component';
import { DocsPageHeaderComponent } from './shared/page-header.component';

interface ButtonApiItem {
  readonly defaultValue: string;
  readonly input: string;
  readonly meaning: string;
  readonly type: string;
}

const importCode = `import { ZdButton } from '@pranxy/zordon-ui/button';`;
const basicExample = `<button zdButton color="primary">Save changes</button>`;

const buttonApi: readonly ButtonApiItem[] = [
  {
    input: 'color',
    type: 'ZdColor | undefined',
    defaultValue: 'undefined',
    meaning: 'Adds one supported daisyUI semantic color.',
  },
  {
    input: 'variant',
    type: 'ZdButtonVariant | undefined',
    defaultValue: 'undefined',
    meaning: 'Adds outline, dash, soft, ghost, or link appearance.',
  },
  {
    input: 'size',
    type: 'ZdSize | undefined',
    defaultValue: 'undefined',
    meaning: 'Adds one size from xs through xl.',
  },
  {
    input: 'layout',
    type: 'ZdButtonLayout | undefined',
    defaultValue: 'undefined',
    meaning: 'Adds one exclusive wide, block, square, or circle layout.',
  },
  {
    input: 'active',
    type: 'boolean',
    defaultValue: 'false',
    meaning: 'Applies visual active presentation without creating toggle semantics.',
  },
  {
    input: 'pressed',
    type: 'boolean | null | undefined',
    defaultValue: 'undefined',
    meaning: 'Reflects controlled aria-pressed state for a real toggle.',
  },
  {
    input: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    meaning: 'Applies pending presentation and guards accepted activation.',
  },
  {
    input: 'zdDisabled',
    type: 'boolean',
    defaultValue: 'false',
    meaning: 'Guards activation for linked anchor hosts and reflects aria-disabled.',
  },
];

@Component({
  selector: 'docs-button-page',
  imports: [DocsCodeExampleComponent, DocsPageHeaderComponent, RouterLink, ZdButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-page" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Component reference"
        heading="Button"
        description="Button applies documented daisyUI appearance and controlled state to an existing native action element. It preserves native button, link, input, form, and event semantics."
        maturity="planned"
        sourceUrl="https://github.com/pranxy/zordon-ui/blob/master/docs/components/button.md"
      />

      <aside class="docs-callout">
        <strong>Planned maturity.</strong> The entry point is implemented, but its remaining
        browser, assistive-technology, visual, and public API gates are not yet complete. Treat this
        page as an implementation contract, not a Stable release claim.
      </aside>

      <section class="docs-page-section" aria-labelledby="install">
        <h2 id="install">Install and import</h2>
        <p>Import the standalone native-host directive from its component entry point.</p>
        <docs-code-example
          label="TypeScript import"
          copyLabel="Copy import code"
          [code]="importCode"
        />
        <docs-code-example label="Basic use" [code]="basicExample" />
      </section>

      <section class="docs-page-section" aria-labelledby="example">
        <h2 id="example">Live example</h2>
        <p>The server renders the native button and its deterministic daisyUI classes.</p>
        <div class="docs-callout">
          <button zdButton [color]="color()" [variant]="variant()">Save changes</button>
        </div>
        <div class="docs-hydration-slot">
          @if (enhanced()) {
            <div class="docs-form-row" aria-label="Button playground">
              <label class="docs-field">
                Button color
                <select [value]="color() ?? ''" (change)="updateColor($event)">
                  <option value="">Default</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </label>
              <label class="docs-field">
                Button variant
                <select [value]="variant() ?? ''" (change)="updateVariant($event)">
                  <option value="">Default</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                </select>
              </label>
              <button class="docs-secondary-action" type="button" (click)="resetPlayground()">
                Reset playground
              </button>
            </div>
          } @else {
            <div class="docs-control-placeholder" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
          }
        </div>
      </section>

      <section class="docs-page-section" aria-labelledby="api">
        <h2 id="api">API</h2>
        <div class="docs-table-wrap">
          <table class="docs-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Default</th>
                <th>Contract</th>
              </tr>
            </thead>
            <tbody>
              @for (item of api; track item.input) {
                <tr>
                  <th scope="row">
                    <code>{{ item.input }}</code>
                  </th>
                  <td>
                    <code>{{ item.type }}</code>
                  </td>
                  <td>
                    <code>{{ item.defaultValue }}</code>
                  </td>
                  <td>{{ item.meaning }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="docs-page-section" aria-labelledby="variants">
        <h2 id="variants">Variants</h2>
        <p>
          Color, variant, size, and layout are independent typed inputs. Omitting one preserves the
          ordinary daisyUI Button appearance or an application-level default.
        </p>
      </section>

      <section class="docs-page-section" aria-labelledby="accessibility">
        <h2 id="accessibility">Accessibility</h2>
        <p>
          Use a native <code>button</code>, linked <code>a</code>, or supported button-like
          <code>input</code>. Consumers provide the accessible name. Icon-only buttons require an
          explicit label, and visual <code>active</code> state never substitutes for
          <code>aria-pressed</code>.
        </p>
      </section>

      <section class="docs-page-section" aria-labelledby="customization">
        <h2 id="customization">Customization</h2>
        <p>
          Zordon UI adds complete daisyUI class tokens without replacing consumer classes, styles,
          CSS variables, or nested <code>data-theme</code> scopes. Prefixes are immutable build-time
          configuration.
        </p>
      </section>

      <section class="docs-page-section" aria-labelledby="ssr">
        <h2 id="ssr">SSR</h2>
        <p>
          Button renders deterministic native markup with no generated IDs or browser-only initial
          state. Hydration attaches the activation guard without changing the server-owned class or
          ARIA contract.
        </p>
      </section>

      <section class="docs-page-section" aria-labelledby="related">
        <h2 id="related">Related</h2>
        <ul class="docs-link-list">
          <li><a routerLink="/foundations/typed-vocabularies">Typed foundation vocabularies</a></li>
          <li><a routerLink="/guides/styling-and-theming">Styling and theming</a></li>
          <li><a routerLink="/components">Component catalogue</a></li>
        </ul>
      </section>
    </article>
  `,
})
export class ButtonPageComponent {
  protected readonly importCode = importCode;
  protected readonly basicExample = basicExample;
  protected readonly api = buttonApi;
  protected readonly enhanced = signal(false);
  protected readonly color = signal<ZdColor | undefined>(undefined);
  protected readonly variant = signal<ZdButtonVariant | undefined>(undefined);

  constructor() {
    afterNextRender(() => this.enhanced.set(true));
  }

  protected updateColor(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.color.set(value === '' ? undefined : (value as ZdColor));
  }

  protected updateVariant(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.variant.set(value === '' ? undefined : (value as ZdButtonVariant));
  }

  protected resetPlayground(): void {
    this.color.set(undefined);
    this.variant.set(undefined);
  }
}
