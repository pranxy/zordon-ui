import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdDock,
  type ZdDockIconContext,
  type ZdDockItem,
  type ZdDockLabels,
  type ZdDockSize,
} from '@pranxy/zordon-ui/dock';

import {
  activeIdCode,
  destinationsFiles,
  dockPlaygroundControls,
  dockPlaygroundSnippet,
  dockReference,
} from '../content/dock.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

type Icon = TemplateRef<ZdDockIconContext>;

/** Loads the daisyUI classes Dock emits, only while this page is in use. */
@Component({
  selector: 'docs-dock-daisy-styles',
  template: '',
  styleUrl: './styles/dock.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class DockDaisyStylesComponent {}

@Component({
  selector: 'docs-dock-page',
  imports: [
    DockDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdButton,
    ZdDock,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-dock-daisy-styles />
    <ng-template #home><span class="glyph" aria-hidden="true">⌂</span></ng-template>
    <ng-template #inbox><span class="glyph" aria-hidden="true">✉</span></ng-template>
    <ng-template #chart><span class="glyph" aria-hidden="true">▤</span></ng-template>
    <ng-template #gear><span class="glyph" aria-hidden="true">⚙</span></ng-template>

    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Dock"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="frame">
            <zd-dock
              label="App destinations"
              position="static"
              [items]="destinations(home, inbox, chart, gear)"
              [size]="sizeOf(values)"
              [labels]="labelsOf(values)"
            />
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="destinations"
        level="3"
        heading="Destinations and badges"
        description="Router links mark the current page (this one, Dock). The badge’s meaning is added to the link name, and the disabled item can’t be focused."
      >
        <docs-example label="dock" [files]="destinationsFiles">
          <div class="frame">
            <zd-dock
              label="Example destinations"
              position="static"
              [items]="destinations(home, inbox, chart, gear)"
            />
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="active-id"
        level="3"
        heading="Choosing the current item"
        description="activeId overrides Router matching: here the buttons pick the current section."
      >
        <docs-example label="sections.html" [code]="activeIdCode">
          <div class="docs-stack frame">
            <div class="docs-cluster" role="group" aria-label="Current section">
              @for (item of sections(chart); track item.id) {
                <button
                  zdButton
                  type="button"
                  size="sm"
                  [variant]="section() === item.id ? undefined : 'outline'"
                  [attr.aria-pressed]="section() === item.id"
                  (click)="section.set(item.id)"
                >
                  {{ item.label }}
                </button>
              }
            </div>
            <zd-dock
              label="Report sections"
              position="static"
              size="sm"
              [items]="sections(chart)"
              [activeId]="section()"
            />
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .frame {
      inline-size: min(26rem, 100%);
    }

    .glyph {
      font-size: 1.25rem;
      line-height: 1;
    }
  `,
})
export class DockPageComponent {
  protected readonly reference = dockReference;
  protected readonly controls = dockPlaygroundControls;
  protected readonly snippet = dockPlaygroundSnippet;
  protected readonly destinationsFiles = destinationsFiles;
  protected readonly activeIdCode = activeIdCode;
  protected readonly section = signal('summary');

  private destinationItems: readonly ZdDockItem[] | undefined;
  private sectionItems: readonly ZdDockItem[] | undefined;

  /** Built once from the icon templates, so the array identity stays stable. */
  protected destinations(home: Icon, inbox: Icon, chart: Icon, gear: Icon): readonly ZdDockItem[] {
    return (this.destinationItems ??= [
      { id: 'home', label: 'Home', routerLink: '/', icon: home },
      {
        id: 'inbox',
        label: 'Inbox',
        routerLink: '/components',
        icon: inbox,
        badge: 3,
        badgeLabel: '3 unread messages',
      },
      { id: 'dock', label: 'Dock', routerLink: '/components/dock', icon: chart },
      { id: 'settings', label: 'Settings unavailable', disabled: true, icon: gear },
    ]);
  }

  protected sections(chart: Icon): readonly ZdDockItem[] {
    return (this.sectionItems ??= [
      { id: 'summary', label: 'Summary', routerLink: '/components/dock', icon: chart },
      { id: 'revenue', label: 'Revenue', routerLink: '/components/dock', icon: chart },
      { id: 'costs', label: 'Costs', routerLink: '/components/dock', icon: chart },
    ]);
  }

  protected sizeOf(values: PlaygroundValues): ZdDockSize {
    return values['size'] as ZdDockSize;
  }

  protected labelsOf(values: PlaygroundValues): ZdDockLabels {
    return values['labels'] as ZdDockLabels;
  }
}
