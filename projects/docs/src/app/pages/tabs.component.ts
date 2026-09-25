import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ZdTabContent,
  ZdTabs,
  type ZdSize,
  type ZdTabClose,
  type ZdTabItem,
  type ZdTabsActivation,
  type ZdTabsVariant,
} from '@pranxy/zordon-ui/tabs';

import {
  closeFiles,
  tabsPlaygroundControls,
  tabsPlaygroundSnippet,
  tabsReference,
  templateFiles,
} from '../content/tabs.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

const openFiles: readonly ZdTabItem[] = [
  { id: 'readme', label: 'README.md', content: '# Project', closable: true },
  { id: 'app', label: 'app.ts', content: 'export class App {}', closable: true },
  {
    id: 'styles',
    label: 'styles.css',
    content: ':root { color-scheme: light dark; }',
    closable: true,
  },
];

/** Tabs packages its own styles, so this page loads no daisyUI stylesheet. */
@Component({
  selector: 'docs-tabs-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdTabContent,
    ZdTabs,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Tabs"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <zd-tabs
            class="wide"
            label="Project"
            [items]="projectTabs"
            [activeId]="projectTab()"
            [variant]="variantOf(values)"
            [size]="sizeOf(values)"
            [activation]="activationOf(values)"
            (activeIdChange)="projectTab.set($event)"
          />
        </ng-template>
      </docs-playground>

      <docs-section
        id="templates"
        level="3"
        heading="Panel templates"
        description="One template renders every panel, with the item as context. preserveContent keeps each visited panel, so typed notes survive switching."
      >
        <docs-example label="editors" [files]="templateFiles">
          <zd-tabs
            class="wide"
            label="Editors"
            preserveContent
            [items]="editorTabs"
            [(activeId)]="editorTab"
          >
            <ng-template zdTabContent let-item>
              <label class="docs-field">
                {{ item.label }} notes
                <textarea class="notes" rows="3"></textarea>
              </label>
            </ng-template>
          </zd-tabs>
        </docs-example>
      </docs-section>

      <docs-section
        id="close-reorder"
        level="3"
        heading="Close and reorder"
        description="The selected tab gets named close and move buttons; Delete also asks to close. Nothing changes until you update items."
      >
        <docs-example label="workspace" [files]="closeFiles">
          <div class="docs-stack wide">
            <zd-tabs
              label="Open files"
              reorderable
              [items]="files()"
              [activeId]="fileTab()"
              (activeIdChange)="fileTab.set($event)"
              (closeRequest)="close($event)"
              (reorder)="files.set($event.items)"
            />
            @if (!files().length) {
              <button type="button" class="reset" (click)="reopen()">Reopen files</button>
            }
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .wide {
      inline-size: 100%;
    }

    .notes {
      font: inherit;
      padding: 0.375rem 0.5rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-sm);
      background: transparent;
      color: inherit;
    }

    .reset {
      justify-self: start;
      font: inherit;
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-sm);
      background: var(--docs-surface);
      color: inherit;
      cursor: pointer;
    }
  `,
})
export class TabsPageComponent {
  protected readonly reference = tabsReference;
  protected readonly controls = tabsPlaygroundControls;
  protected readonly snippet = tabsPlaygroundSnippet;
  protected readonly templateFiles = templateFiles;
  protected readonly closeFiles = closeFiles;

  protected readonly projectTabs: readonly ZdTabItem[] = [
    { id: 'overview', label: 'Overview', content: 'Milestones, owners and the next release date.' },
    { id: 'activity', label: 'Activity', content: '12 commits and 3 reviews this week.' },
    { id: 'settings', label: 'Settings', content: 'Visibility, members and integrations.' },
    { id: 'admin', label: 'Administration', disabled: true },
  ];
  protected readonly projectTab = signal<string | null>('overview');

  protected readonly editorTabs: readonly ZdTabItem[] = [
    { id: 'draft', label: 'Draft' },
    { id: 'review', label: 'Review' },
  ];
  protected readonly editorTab = signal<string | null>('draft');

  protected readonly files = signal<readonly ZdTabItem[]>(openFiles);
  protected readonly fileTab = signal<string | null>('app');

  protected close(event: ZdTabClose): void {
    this.files.update(files => files.filter(file => file.id !== event.id));
    if (this.fileTab() === event.id) this.fileTab.set(event.nextId);
  }

  protected reopen(): void {
    this.files.set(openFiles);
    this.fileTab.set('readme');
  }

  protected variantOf(values: PlaygroundValues): ZdTabsVariant {
    return values['variant'] as ZdTabsVariant;
  }

  protected sizeOf(values: PlaygroundValues): ZdSize {
    return values['size'] as ZdSize;
  }

  protected activationOf(values: PlaygroundValues): ZdTabsActivation {
    return values['activation'] as ZdTabsActivation;
  }
}
