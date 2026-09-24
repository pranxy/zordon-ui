import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import {
  ZdMenu,
  ZdMenuTree,
  type ZdMenuOrientation,
  type ZdMenuSize,
} from '@pranxy/zordon-ui/menu';

import {
  decoratedItems,
  decorationsCode,
  horizontalCode,
  menuAccessibilityNotes,
  menuFacts,
  menuImportCode,
  menuInputs,
  menuPlaygroundControls,
  menuPlaygroundSnippet,
  menuSourceCode,
  menuTypesCode,
  navigationFiles,
  projectFiles,
  siteDestinations,
  topLevelDestinations,
  treeFiles,
  treeInputs,
  treeKeyboard,
} from '../content/menu.content';
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

/** Loads the daisyUI classes Menu emits, only while this page is in use. */
@Component({
  selector: 'docs-menu-daisy-styles',
  template: '',
  styleUrls: ['./styles/menu-base.daisy.css', './styles/menu.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class MenuDaisyStylesComponent {}

@Component({
  selector: 'docs-menu-page',
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
    MenuDaisyStylesComponent,
    ZdMenu,
    ZdMenuTree,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-menu-daisy-styles />
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Navigation"
        heading="Menu"
        maturity="preview"
        description="Two components on one daisyUI menu. zd-menu renders native navigation links with controlled inline groups; zd-menu-tree is a selectable Angular Aria tree for hierarchies that are chosen rather than visited."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Preview.</strong> Usable for evaluation; feedback may still change the API before it
        is marked Stable. Manual assistive-technology review is pending.
      </docs-callout>

      <docs-section
        id="install"
        heading="Install and import"
        description="Import the component you use, and register the modifier classes with Tailwind so they are compiled."
      >
        <docs-code-block
          label="Import"
          language="ts"
          copyLabel="Copy import code"
          [code]="importCode"
        />
        <docs-code-block label="src/styles.css" language="css" [code]="sourceCode" />
      </docs-section>

      <docs-section
        id="playground"
        heading="Playground"
        description="Every link goes to a real page on this site. Open the Components group, then change size and orientation."
      >
        <docs-playground label="Menu" [controls]="controls" [snippet]="snippet">
          <ng-template docsPlaygroundPreview let-values>
            <zd-menu
              class="panel"
              label="Documentation"
              [items]="destinations"
              [size]="size(values)"
              [orientation]="orientation(values)"
              [(expandedIds)]="playgroundExpanded"
            />
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="navigation"
          level="3"
          heading="Site navigation"
          description="Titles, separators, a disabled entry and a group. The group is a button with aria-expanded; its open state is a two-way model."
        >
          <docs-example label="nav" [files]="navigationFiles">
            <zd-menu
              class="panel"
              label="Example navigation"
              [items]="destinations"
              [(expandedIds)]="navigationExpanded"
            />
          </docs-example>
        </docs-section>

        <docs-section
          id="horizontal"
          level="3"
          heading="Horizontal"
          description="The same links laid out in a wrapping row, for a section bar."
        >
          <docs-example label="sections.html" [code]="horizontalCode">
            <zd-menu
              class="panel"
              label="Sections"
              orientation="horizontal"
              size="sm"
              [items]="topLevel"
            />
          </docs-example>
        </docs-section>

        <docs-section
          id="tree"
          level="3"
          heading="Selectable tree"
          description="zd-menu-tree has no links. Focus it, then use the arrow keys to move, Right and Left to open and close, and Enter to select."
        >
          <docs-example label="files" [files]="treeFiles">
            <div class="docs-stack">
              <zd-menu-tree
                class="panel"
                label="Project files"
                [items]="files"
                [(selectedIds)]="selected"
                [(expandedIds)]="treeExpanded"
              />
              <span class="status" role="status"
                >Selected: {{ selected().join(', ') || 'none' }}</span
              >
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="decorations"
          level="3"
          heading="Badges and shortcuts"
          description="Decorations are hidden from assistive technology. badgeLabel adds their meaning to the accessible name; shortcuts are display-only."
        >
          <docs-example label="decorations.ts" [code]="decorationsCode">
            <zd-menu class="panel" label="Mailbox" [items]="decorated" [activeId]="null" />
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="Two standalone components. Items are validated: IDs and labels must be unique and nonempty, and each navigation leaf needs exactly one destination."
      >
        <docs-section id="menu-inputs" level="3" heading="zd-menu">
          <docs-api-table
            caption="zd-menu inputs"
            [columns]="menuInputs.columns"
            [rows]="menuInputs.rows"
          />
        </docs-section>
        <docs-section id="tree-inputs" level="3" heading="zd-menu-tree">
          <docs-api-table
            caption="zd-menu-tree inputs"
            [columns]="treeInputs.columns"
            [rows]="treeInputs.rows"
          />
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui/menu" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="Navigation menus are lists of links, not ARIA menus. Only the tree uses composite keyboard navigation."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
        <docs-api-table
          caption="Tree keyboard"
          [columns]="treeKeyboard.columns"
          [rows]="treeKeyboard.rows"
        />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="The component owns list layout, group disclosure and separators. Width, background and borders belong on the host; daisyUI's menu classes carry spacing and active colours."
      />

      <docs-section
        id="ssr"
        heading="SSR"
        description="The server renders the links, group buttons and their expanded state. Group IDs come from the library's SSR-stable ID generator, so hydration matches."
      />
    </article>
  `,
  styles: `
    .panel {
      inline-size: min(100%, 18rem);
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }

    zd-menu[orientation='horizontal'].panel,
    .panel:has([data-orientation='horizontal']) {
      inline-size: auto;
    }

    .status {
      color: var(--docs-muted-text);
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }
  `,
})
export class MenuPageComponent {
  protected readonly facts = menuFacts;
  protected readonly importCode = menuImportCode;
  protected readonly sourceCode = menuSourceCode;
  protected readonly controls = menuPlaygroundControls;
  protected readonly snippet = menuPlaygroundSnippet;
  protected readonly destinations = siteDestinations;
  protected readonly topLevel = topLevelDestinations;
  protected readonly files = projectFiles;
  protected readonly decorated = decoratedItems;
  protected readonly navigationFiles = navigationFiles;
  protected readonly horizontalCode = horizontalCode;
  protected readonly treeFiles = treeFiles;
  protected readonly decorationsCode = decorationsCode;
  protected readonly menuInputs = menuInputs;
  protected readonly treeInputs = treeInputs;
  protected readonly typesCode = menuTypesCode;
  protected readonly accessibilityNotes = menuAccessibilityNotes;
  protected readonly treeKeyboard = treeKeyboard;

  protected readonly playgroundExpanded = signal<readonly string[]>([]);
  protected readonly navigationExpanded = signal<readonly string[]>(['components']);
  protected readonly treeExpanded = signal<readonly string[]>(['src']);
  protected readonly selected = signal<string[]>([]);

  protected size(values: PlaygroundValues): ZdMenuSize {
    return values['size'] as ZdMenuSize;
  }

  protected orientation(values: PlaygroundValues): ZdMenuOrientation {
    return values['orientation'] as ZdMenuOrientation;
  }
}
