import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdDropdownItem,
  ZdDropdownMenu,
  ZdDropdownPanel,
  ZdDropdownTrigger,
} from '@pranxy/zordon-ui/dropdown';
import { ZdMegamenu, ZdMegamenuBar, ZdMegamenuPanel } from '@pranxy/zordon-ui/megamenu';

import {
  commandBarCode,
  componentGroups,
  fullWidthCode,
  learnGroups,
  megamenuAccessibilityNotes,
  megamenuCustomizationCode,
  megamenuDeclarations,
  megamenuFacts,
  megamenuImportCode,
  megamenuInputs,
  megamenuKeyboard,
  megamenuPlaygroundControls,
  megamenuPlaygroundSnippet,
  megamenuStylesCode,
  megamenuTypesCode,
  siteNavigationCode,
} from '../content/megamenu.content';
import {
  DocsApiTableComponent,
  DocsCalloutComponent,
  DocsCodeBlockComponent,
  DocsExampleComponent,
  DocsFeatureGridComponent,
  DocsMetaGridComponent,
  DocsPageHeaderComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

type PanelColumns = 1 | 2 | 3 | 4;
type PanelWidth = 'anchored' | 'full';

/**
 * Loads the daisyUI classes Megamenu emits, and the rules for panel content that renders in the
 * CDK overlay container, only while this page is in use.
 */
@Component({
  selector: 'docs-megamenu-daisy-styles',
  template: '',
  styleUrls: ['./styles/menu-base.daisy.css', './styles/megamenu.css'],
  encapsulation: ViewEncapsulation.None,
})
class MegamenuDaisyStylesComponent {}

@Component({
  selector: 'docs-megamenu-page',
  imports: [
    DocsApiTableComponent,
    DocsCalloutComponent,
    DocsCodeBlockComponent,
    DocsExampleComponent,
    DocsFeatureGridComponent,
    DocsMetaGridComponent,
    DocsPageHeaderComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsSectionComponent,
    MegamenuDaisyStylesComponent,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    ZdButton,
    ZdDropdownItem,
    ZdDropdownMenu,
    ZdDropdownPanel,
    ZdDropdownTrigger,
    ZdMegamenu,
    ZdMegamenuBar,
    ZdMegamenuPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-megamenu-daisy-styles />
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Navigation"
        heading="Megamenu"
        maturity="preview"
        description="A wide navigation panel opened from a native button. zdMegamenu composes the Dropdown runtime with a responsive multi-column surface, and an optional Angular Aria command bar covers application menus."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Preview.</strong> Automated verification is complete; manual assistive-technology
        review is pending. Panels render after hydration, so they are not a no-JavaScript fallback.
      </docs-callout>

      <docs-section
        id="install"
        heading="Install and import"
        description="The root and panel come from Megamenu; the trigger and panel template are Dropdown's, re-exported from this entry too."
      >
        <docs-code-block
          label="Import"
          language="ts"
          copyLabel="Copy import code"
          [code]="importCode"
        />
        <docs-code-block label="src/styles.css" language="css" [code]="stylesCode" />
      </docs-section>

      <docs-section
        id="playground"
        heading="Playground"
        description="Open the panel, then change its columns and width. Every link goes to a real page; following one closes the panel."
      >
        <docs-playground label="Megamenu" [controls]="controls" [snippet]="snippet">
          <ng-template docsPlaygroundPreview let-values>
            <div zdMegamenu [trigger]="trigger(values)">
              <button zdButton zdDropdownTrigger>Components ▾</button>
              <ng-template zdDropdownPanel>
                <zd-megamenu-panel
                  role="region"
                  aria-label="Components"
                  [columns]="columns(values)"
                  [width]="width(values)"
                >
                  <ng-container
                    [ngTemplateOutlet]="groupsTemplate"
                    [ngTemplateOutletContext]="{ $implicit: components }"
                  />
                </zd-megamenu-panel>
              </ng-template>
            </div>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="site-navigation"
          level="3"
          heading="Site navigation"
          description="A megamenu inside a nav landmark, between ordinary links. The panel keeps native links and headings in tab order; routerLinkActive marks the current page."
        >
          <docs-example label="site-nav.html" [code]="siteNavigationCode">
            <nav class="site-nav" aria-label="Example site">
              <a routerLink="/">Home</a>
              <div zdMegamenu>
                <button zdButton zdDropdownTrigger variant="ghost" size="sm">Components ▾</button>
                <ng-template zdDropdownPanel>
                  <zd-megamenu-panel role="region" aria-label="Components" [columns]="2">
                    <ng-container
                      [ngTemplateOutlet]="groupsTemplate"
                      [ngTemplateOutletContext]="{ $implicit: components }"
                    />
                  </zd-megamenu-panel>
                </ng-template>
              </div>
              <a routerLink="/resources">Resources</a>
            </nav>
          </docs-example>
        </docs-section>

        <docs-section
          id="full-width"
          level="3"
          heading="Full width on hover"
          description='width="full" spans the viewport minus 32px. Hover opens after a short grace period; click and keyboard still work.'
        >
          <docs-example label="learn.html" [code]="fullWidthCode">
            <div zdMegamenu trigger="hover">
              <button zdButton zdDropdownTrigger variant="outline">Learn ▾</button>
              <ng-template zdDropdownPanel>
                <zd-megamenu-panel role="region" aria-label="Learn" width="full" [columns]="4">
                  <ng-container
                    [ngTemplateOutlet]="groupsTemplate"
                    [ngTemplateOutletContext]="{ $implicit: learn }"
                  />
                </zd-megamenu-panel>
              </ng-template>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="command-bar"
          level="3"
          heading="Command bar"
          description="For application commands, not site navigation. Arrow keys move across the bar; Down opens a command's menu."
        >
          <docs-example label="editor-commands.html" [code]="commandBarCode">
            <div class="docs-stack">
              <zd-megamenu-bar class="command-bar" aria-label="Editor commands">
                @for (command of commands; track command.value) {
                  <div zdMegamenu mode="menu" (selected)="lastCommand.set($any($event))">
                    <button zdDropdownTrigger zdDropdownItem [value]="command.value">
                      {{ command.label }}
                    </button>
                    <ng-template zdDropdownPanel>
                      <zd-dropdown-menu [attr.aria-label]="command.label">
                        @for (action of command.actions; track action.value) {
                          <button type="button" zdDropdownItem [value]="action.value">
                            {{ action.label }}
                          </button>
                        }
                      </zd-dropdown-menu>
                    </ng-template>
                  </div>
                }
              </zd-megamenu-bar>
              <span class="status" role="status">Last command: {{ lastCommand() }}</span>
            </div>
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="The root composes Dropdown through host directives, so the complete Dropdown API applies. See the Dropdown page for inherited inputs, outputs and close reasons."
      >
        <docs-section id="declarations" level="3" heading="Declarations">
          <docs-api-table
            caption="Megamenu declarations"
            [columns]="declarations.columns"
            [rows]="declarations.rows"
          />
        </docs-section>
        <docs-section id="inputs" level="3" heading="Inputs">
          <docs-api-table
            caption="Megamenu inputs"
            [columns]="inputs.columns"
            [rows]="inputs.rows"
          />
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui/megamenu" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="Navigation panels are disclosures, not menus. Only the command bar uses menu semantics."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
        <docs-api-table caption="Keyboard" [columns]="keyboard.columns" [rows]="keyboard.rows" />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="The panel supplies the grid, surface, scrolling and a forced-colours border. Headings, links, images and their focus styles are yours; style them globally because the panel renders in the overlay container."
      >
        <docs-code-block label="styles.css" language="css" [code]="customizationCode" />
      </docs-section>

      <docs-section
        id="ssr"
        heading="SSR"
        description="The server renders closed triggers and the surrounding links. Panels are created after hydration, even when open is initially true."
      />
    </article>

    <ng-template #groupsTemplate let-groups>
      @for (group of groups; track group.heading) {
        <section class="docs-megamenu-group">
          <h2>{{ group.heading }}</h2>
          @for (link of group.links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive
              ariaCurrentWhenActive="page"
              [routerLinkActiveOptions]="exactMatch"
            >
              {{ link.label }}
            </a>
          }
        </section>
      }
    </ng-template>
  `,
  styles: `
    .site-nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--docs-space-4);
      font-size: var(--docs-text-sm);
    }

    .command-bar {
      padding: var(--docs-space-1);
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }

    .status {
      color: var(--docs-muted-text);
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }
  `,
})
export class MegamenuPageComponent {
  protected readonly facts = megamenuFacts;
  protected readonly importCode = megamenuImportCode;
  protected readonly stylesCode = megamenuStylesCode;
  protected readonly controls = megamenuPlaygroundControls;
  protected readonly snippet = megamenuPlaygroundSnippet;
  protected readonly components = componentGroups;
  protected readonly learn = learnGroups;
  protected readonly siteNavigationCode = siteNavigationCode;
  protected readonly fullWidthCode = fullWidthCode;
  protected readonly commandBarCode = commandBarCode;
  protected readonly declarations = megamenuDeclarations;
  protected readonly inputs = megamenuInputs;
  protected readonly typesCode = megamenuTypesCode;
  protected readonly accessibilityNotes = megamenuAccessibilityNotes;
  protected readonly keyboard = megamenuKeyboard;
  protected readonly customizationCode = megamenuCustomizationCode;

  protected readonly commands = [
    {
      value: 'file',
      label: 'File',
      actions: [
        { value: 'new', label: 'New document' },
        { value: 'open', label: 'Open…' },
        { value: 'export', label: 'Export' },
      ],
    },
    {
      value: 'edit',
      label: 'Edit',
      actions: [
        { value: 'undo', label: 'Undo' },
        { value: 'redo', label: 'Redo' },
      ],
    },
    {
      value: 'view',
      label: 'View',
      actions: [
        { value: 'zoom-in', label: 'Zoom in' },
        { value: 'zoom-out', label: 'Zoom out' },
      ],
    },
  ] as const;

  protected readonly lastCommand = signal('none');
  protected readonly exactMatch = { exact: true };

  protected columns(values: PlaygroundValues): PanelColumns {
    return Number(values['columns']) as PanelColumns;
  }

  protected width(values: PlaygroundValues): PanelWidth {
    return values['width'] as PanelWidth;
  }

  protected trigger(values: PlaygroundValues): 'click' | 'hover' {
    return values['trigger'] as 'click' | 'hover';
  }
}
