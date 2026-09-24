import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdDropdown,
  ZdDropdownItem,
  ZdDropdownMenu,
  ZdDropdownPanel,
  ZdDropdownTrigger,
  type ZdDropdownAlign,
  type ZdDropdownSide,
} from '@pranxy/zordon-ui/dropdown';

import {
  actionMenuCode,
  contentPanelCode,
  controlledFiles,
  dropdownAccessibilityNotes,
  dropdownDeclarations,
  dropdownFacts,
  dropdownImportCode,
  dropdownInputs,
  dropdownKeyboard,
  dropdownOutputs,
  dropdownOverlayCss,
  dropdownPlaygroundControls,
  dropdownPlaygroundSnippet,
  dropdownStylingCode,
  dropdownStylingUsage,
  dropdownTypesCode,
  nestedMenuCode,
  themeChoices,
} from '../content/dropdown.content';
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

type DropdownTrigger = 'click' | 'hover' | 'focus';

/** Loads the daisyUI classes Dropdown emits, only while this page is in use. */
@Component({
  selector: 'docs-dropdown-daisy-styles',
  template: '',
  styleUrl: './styles/menu-base.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class DropdownDaisyStylesComponent {}

@Component({
  selector: 'docs-dropdown-page',
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
    DropdownDaisyStylesComponent,
    TitleCasePipe,
    ZdButton,
    ZdDropdown,
    ZdDropdownItem,
    ZdDropdownMenu,
    ZdDropdownPanel,
    ZdDropdownTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-dropdown-daisy-styles />
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Actions"
        heading="Dropdown"
        maturity="preview"
        description="An anchored panel opened from a native button. Menu mode composes Angular Aria's menu for keyboard navigation and typeahead; content mode keeps forms and their tab order intact. Angular CDK handles positioning and collisions."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Preview.</strong> Automated verification is complete; manual assistive-technology
        and device review is pending, and Firefox, WebKit and Angular 22 are not yet verified.
      </docs-callout>

      <docs-section
        id="install"
        heading="Install and import"
        description="Add the declarations you use to the component's imports, and load CDK's structural overlay styles once in your global stylesheet."
      >
        <docs-code-block
          label="Import"
          language="ts"
          copyLabel="Copy import code"
          [code]="importCode"
        />
        <docs-code-block label="src/styles.css" language="css" [code]="overlayCss" />
      </docs-section>

      <docs-section
        id="playground"
        heading="Playground"
        description="Placement and trigger inputs, live. Open the menu to see the panel move."
      >
        <docs-playground label="Dropdown" [controls]="controls" [snippet]="playgroundSnippet">
          <ng-template docsPlaygroundPreview let-values>
            <div class="docs-stack preview">
              <div
                zdDropdown
                mode="menu"
                [side]="side(values)"
                [align]="align(values)"
                [trigger]="trigger(values)"
                [disabled]="values['disabled'] === true"
                (selected)="theme.set($any($event))"
              >
                <button zdButton zdDropdownTrigger>Theme ▾</button>
                <ng-template zdDropdownPanel>
                  <zd-dropdown-menu aria-label="Theme">
                    @for (choice of themeChoices; track choice) {
                      <button type="button" zdDropdownItem [value]="choice">
                        {{ choice | titlecase }}
                      </button>
                    }
                  </zd-dropdown-menu>
                </ng-template>
              </div>
              <span class="docs-muted status" role="status">Chosen: {{ theme() }}</span>
            </div>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="action-menu"
          level="3"
          heading="Action menu"
          description="Items emit their value through selected, and the menu closes. Disabled items stay discoverable by keyboard but cannot fire."
        >
          <docs-example label="actions.html" [code]="actionMenuCode">
            <div zdDropdown mode="menu" (selected)="lastAction.set($any($event))">
              <button zdButton zdDropdownTrigger>Actions ▾</button>
              <ng-template zdDropdownPanel>
                <zd-dropdown-menu aria-label="Document actions">
                  <button type="button" zdDropdownItem value="rename">Rename</button>
                  <button type="button" zdDropdownItem value="duplicate">Duplicate</button>
                  <button type="button" zdDropdownItem value="delete" [disabled]="true">
                    Delete
                  </button>
                </zd-dropdown-menu>
              </ng-template>
            </div>
            <span class="docs-muted status" role="status">Last action: {{ lastAction() }}</span>
          </docs-example>
        </docs-section>

        <docs-section
          id="nested-menus"
          level="3"
          heading="Nested menus"
          description="A root inside a menu becomes a submenu. The logical forward arrow opens it; selection anywhere closes the whole tree and reaches every ancestor's selected output."
        >
          <docs-example label="file-menu.html" [code]="nestedMenuCode">
            <div zdDropdown mode="menu" (selected)="lastExport.set($any($event))">
              <button zdButton zdDropdownTrigger>File ▾</button>
              <ng-template zdDropdownPanel>
                <zd-dropdown-menu aria-label="File">
                  <button type="button" zdDropdownItem value="save">Save</button>
                  <div zdDropdown mode="menu" side="end">
                    <button zdDropdownTrigger zdDropdownItem value="export">Export ▸</button>
                    <ng-template zdDropdownPanel>
                      <zd-dropdown-menu aria-label="Export formats">
                        <button type="button" zdDropdownItem value="pdf">PDF</button>
                        <button type="button" zdDropdownItem value="csv">CSV</button>
                      </zd-dropdown-menu>
                    </ng-template>
                  </div>
                </zd-dropdown-menu>
              </ng-template>
            </div>
            <span class="docs-muted status" role="status">Last choice: {{ lastExport() }}</span>
          </docs-example>
        </docs-section>

        <docs-section
          id="content-panel"
          level="3"
          heading="Content panel"
          description="The default content mode keeps native inputs, labels and tab order. The root adds no dialog role or focus trap; your panel owns its surface and semantics."
        >
          <docs-example label="preferences.html" [code]="contentPanelCode">
            <div zdDropdown #prefs="zdDropdown" initialFocus="first">
              <button zdButton zdDropdownTrigger>Preferences ▾</button>
              <ng-template zdDropdownPanel>
                <form
                  class="docs-popover docs-stack"
                  aria-label="Preferences"
                  (submit)="$event.preventDefault(); save(prefs, name.value)"
                >
                  <label class="field">
                    Display name
                    <input name="displayName" [value]="displayName()" #name />
                  </label>
                  <button zdButton color="primary" size="sm" type="submit">Save</button>
                </form>
              </ng-template>
            </div>
            <span class="docs-muted status" role="status">Saved name: {{ displayName() }}</span>
          </docs-example>
        </docs-section>

        <docs-section
          id="controlled"
          level="3"
          heading="Controlled state"
          description="Bind open to own the state. The root emits openChange and waits; if you ignore it, nothing changes."
        >
          <docs-example label="controlled" [files]="controlledFiles">
            <div
              zdDropdown
              mode="menu"
              [open]="controlledOpen()"
              (openChange)="controlledOpen.set($event)"
            >
              <button zdButton zdDropdownTrigger>Menu ▾</button>
              <ng-template zdDropdownPanel>
                <zd-dropdown-menu aria-label="Controlled menu">
                  <button type="button" zdDropdownItem value="one">First item</button>
                  <button type="button" zdDropdownItem value="two">Second item</button>
                </zd-dropdown-menu>
              </ng-template>
            </div>
            <button
              zdButton
              variant="outline"
              type="button"
              (click)="controlledOpen.set(!controlledOpen())"
            >
              Toggle from outside
            </button>
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="Five standalone declarations. Inputs are signal inputs; booleans accept bare attributes. No Aria or CDK objects appear in the public API."
      >
        <docs-section id="declarations" level="3" heading="Declarations">
          <docs-api-table
            caption="Dropdown declarations"
            [columns]="declarations.columns"
            [rows]="declarations.rows"
          />
        </docs-section>
        <docs-section id="inputs" level="3" heading="Root inputs">
          <docs-api-table
            caption="Dropdown root inputs"
            [columns]="inputs.columns"
            [rows]="inputs.rows"
          />
        </docs-section>
        <docs-section id="outputs" level="3" heading="Outputs and methods">
          <docs-api-table
            caption="Dropdown outputs and methods"
            [columns]="outputs.columns"
            [rows]="outputs.rows"
          />
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui/dropdown" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="Angular Aria owns menu navigation; Zordon adds disclosure, focus return and nesting."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
        <docs-api-table
          caption="Dropdown keyboard"
          [columns]="keyboard.columns"
          [rows]="keyboard.rows"
        />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="Menus use daisyUI's menu and ghost button classes plus theme tokens. The panel is rendered in the CDK overlay container, outside your component, so style the pane through panelClass and a global rule."
      >
        <docs-code-block label="styles.css" language="css" [code]="stylingCode" />
        <docs-code-block label="usage.html" language="html" [code]="stylingUsage" />
      </docs-section>

      <docs-section
        id="ssr"
        heading="SSR"
        description="The server renders closed native triggers and no overlay markup. Listeners and panels attach only in the browser, and expanded() is false on the server, so hydration never has to remove a panel."
      />
    </article>
  `,
  styles: `
    .preview {
      justify-items: center;
    }

    .status {
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }

    .field {
      display: grid;
      gap: 0.35rem;
      font-size: var(--docs-text-sm);
      font-weight: var(--docs-weight-semibold);
    }

    .field input {
      min-block-size: 2.25rem;
      padding-inline: 0.625rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
      color: var(--docs-text);
    }
  `,
})
export class DropdownPageComponent {
  protected readonly facts = dropdownFacts;
  protected readonly importCode = dropdownImportCode;
  protected readonly overlayCss = dropdownOverlayCss;
  protected readonly controls = dropdownPlaygroundControls;
  protected readonly playgroundSnippet = dropdownPlaygroundSnippet;
  protected readonly themeChoices = themeChoices;
  protected readonly actionMenuCode = actionMenuCode;
  protected readonly nestedMenuCode = nestedMenuCode;
  protected readonly contentPanelCode = contentPanelCode;
  protected readonly controlledFiles = controlledFiles;
  protected readonly declarations = dropdownDeclarations;
  protected readonly inputs = dropdownInputs;
  protected readonly outputs = dropdownOutputs;
  protected readonly typesCode = dropdownTypesCode;
  protected readonly accessibilityNotes = dropdownAccessibilityNotes;
  protected readonly keyboard = dropdownKeyboard;
  protected readonly stylingCode = dropdownStylingCode;
  protected readonly stylingUsage = dropdownStylingUsage;

  protected readonly theme = signal('none');
  protected readonly lastAction = signal('none');
  protected readonly lastExport = signal('none');
  protected readonly displayName = signal('Ada');
  protected readonly controlledOpen = signal(false);

  protected side(values: PlaygroundValues): ZdDropdownSide {
    return values['side'] as ZdDropdownSide;
  }

  protected align(values: PlaygroundValues): ZdDropdownAlign {
    return values['align'] as ZdDropdownAlign;
  }

  protected trigger(values: PlaygroundValues): DropdownTrigger {
    return values['trigger'] as DropdownTrigger;
  }

  protected save(dropdown: ZdDropdown, name: string): void {
    this.displayName.set(name.trim() || this.displayName());
    dropdown.close('selection');
  }
}
