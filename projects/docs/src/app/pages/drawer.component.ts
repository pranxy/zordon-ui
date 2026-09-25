import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdDrawer,
  ZdDrawerPanel,
  type ZdDrawerMode,
  type ZdDrawerReason,
  type ZdDrawerSide,
} from '@pranxy/zordon-ui/drawer';

import {
  drawerPlaygroundControls,
  drawerPlaygroundSnippet,
  drawerReference,
  guardFiles,
} from '../content/drawer.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

@Component({
  selector: 'docs-drawer-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdButton,
    ZdDrawer,
    ZdDrawerPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Drawer"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="frame">
            <div class="bar">
              <button
                zdButton
                type="button"
                size="sm"
                [attr.aria-controls]="drawer.panelId"
                [attr.aria-expanded]="open()"
                (click)="open.set(!open())"
              >
                Navigation
              </button>
              <span class="docs-status">Mode in use: {{ drawer.effectiveMode() }}</span>
            </div>
            <zd-drawer
              #drawer
              label="Project navigation"
              [mode]="modeOf(values)"
              [side]="sideOf(values)"
              [width]="220"
              [open]="open()"
              (openChange)="open.set($event)"
            >
              <ng-template zdDrawerPanel let-close>
                <nav class="links" aria-label="Project sections">
                  <a href="#overview">Overview</a>
                  <a href="#issues">Issues</a>
                  <a href="#settings">Settings</a>
                </nav>
                <button zdButton type="button" size="sm" (click)="close()">Close</button>
              </ng-template>
              <div class="main">
                <p>Main content. Press Navigation to open the panel.</p>
              </div>
            </zd-drawer>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="guarded"
        level="3"
        heading="Guarded close"
        description="Closing is a request. With unsaved changes this editor ignores it, so the drawer stays open and says why."
      >
        <docs-example label="editor" [files]="guardFiles">
          <div class="docs-cluster">
            <button zdButton type="button" (click)="editorOpen.set(true)">Edit profile</button>
            <p class="docs-status" role="status">Last request: {{ reason() ?? 'none' }}</p>
          </div>
          <zd-drawer
            label="Edit profile"
            side="end"
            [width]="300"
            [open]="editorOpen()"
            (closeRequest)="reason.set($event)"
            (openChange)="requestClose()"
          >
            <ng-template zdDrawerPanel let-close>
              <div class="editor">
                <h2 class="editor-title">Edit profile</h2>
                <label class="docs-field">
                  Name
                  <input class="field" [value]="name()" (input)="edit($event)" />
                </label>
                @if (blocked()) {
                  <p role="status" class="warning">You have unsaved changes.</p>
                  <button zdButton type="button" size="sm" (click)="discard()">
                    Discard changes
                  </button>
                }
                <div class="docs-cluster">
                  <button zdButton type="button" size="sm" color="primary" (click)="save()">
                    Save
                  </button>
                  <button zdButton type="button" size="sm" (click)="close()">Close</button>
                </div>
              </div>
            </ng-template>
          </zd-drawer>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .frame {
      display: grid;
      inline-size: 100%;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
    }

    .bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--docs-space-3);
      padding: var(--docs-space-2) var(--docs-space-3);
      border-block-end: 1px solid var(--docs-border);
    }

    .main {
      min-block-size: 10rem;
      padding: var(--docs-space-4);
    }

    .main p {
      margin: 0;
    }

    .links {
      display: grid;
      gap: var(--docs-space-2);
      margin-block-end: var(--docs-space-3);
    }

    .editor {
      display: grid;
      gap: var(--docs-space-3);
    }

    .editor-title {
      margin: 0;
      font-size: var(--docs-text-h4);
    }

    .field {
      font: inherit;
      padding: var(--docs-space-1) var(--docs-space-2);
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-sm);
      background: transparent;
      color: inherit;
    }

    .warning {
      margin: 0;
      font-weight: var(--docs-weight-semibold);
    }
  `,
})
export class DrawerPageComponent {
  protected readonly reference = drawerReference;
  protected readonly controls = drawerPlaygroundControls;
  protected readonly snippet = drawerPlaygroundSnippet;
  protected readonly guardFiles = guardFiles;

  protected readonly open = signal(false);
  protected readonly editorOpen = signal(false);
  protected readonly name = signal('Ada Lovelace');
  protected readonly dirty = signal(false);
  protected readonly blocked = signal(false);
  protected readonly reason = signal<ZdDrawerReason | null>(null);

  protected modeOf(values: PlaygroundValues): ZdDrawerMode {
    return values['mode'] as ZdDrawerMode;
  }

  protected sideOf(values: PlaygroundValues): ZdDrawerSide {
    return values['side'] as ZdDrawerSide;
  }

  protected edit(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
    this.dirty.set(true);
  }

  protected requestClose(): void {
    if (this.dirty()) {
      this.blocked.set(true);
      return;
    }
    this.editorOpen.set(false);
  }

  protected save(): void {
    this.dirty.set(false);
    this.blocked.set(false);
    this.editorOpen.set(false);
  }

  protected discard(): void {
    this.name.set('Ada Lovelace');
    this.save();
  }
}
