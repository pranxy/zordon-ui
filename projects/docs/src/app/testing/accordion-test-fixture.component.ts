import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  ZdAccordion,
  ZdAccordionContent,
  ZdAccordionHeading,
  ZdAccordionItem,
  ZdAccordionPanel,
  ZdAccordionTrigger,
} from '@pranxy/zordon-ui/accordion';
import { ZdCollapse, ZdCollapseTitle, ZdCollapseContent } from '@pranxy/zordon-ui/collapse';
const parts = [
  ZdAccordion,
  ZdAccordionContent,
  ZdAccordionHeading,
  ZdAccordionItem,
  ZdAccordionPanel,
  ZdAccordionTrigger,
];
@Component({
  selector: 'docs-accordion-daisy-styles',
  template: '',
  styleUrl: './accordion-daisy-fixture.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AccordionDaisyStyles {}
@Component({
  selector: 'docs-accordion-indicator-styles',
  template: '',
  styleUrl: './accordion-indicators-fixture.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AccordionIndicatorStyles {}
/** The component boundary keeps nested triggers out of the outer Aria content query. */
@Component({
  selector: 'docs-nested-accordion',
  imports: [ZdAccordion, ZdAccordionHeading, ZdAccordionItem, ZdAccordionPanel, ZdAccordionTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div zdAccordion [multiExpandable]="false" aria-label="Nested options">
    <zd-accordion-item indicator="plus"
      ><h3 zdAccordionHeading>
        <button zdAccordionTrigger id="nested-trigger" [panel]="nested.aria">Nested option</button>
      </h3>
      <zd-accordion-panel #nested="zdAccordionPanel" id="nested-panel"
        ><p>Nested content</p></zd-accordion-panel
      ></zd-accordion-item
    >
  </div>`,
})
class NestedAccordion {}
@Component({
  selector: 'docs-accordion-test-fixture',
  imports: [
    ...parts,
    AccordionDaisyStyles,
    AccordionIndicatorStyles,
    NestedAccordion,
    ZdCollapse,
    ZdCollapseTitle,
    ZdCollapseContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './accordion-fixture.css',
  template: `<docs-accordion-daisy-styles /><docs-accordion-indicator-styles />
    <main data-testid="accordion-fixture" [dir]="direction()">
      <h1>Accordion</h1>
      <p>Account settings and native disclosure alternatives.</p>
      <div class="controls">
        <button type="button" (click)="multi.set(!multi())">Toggle multiple</button>
        <button type="button" (click)="preserve.set(!preserve())">Toggle preservation</button>
        <button type="button" (click)="group.expandAll()">Expand all</button>
        <button type="button" (click)="group.collapseAll()">Collapse all</button>
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
        <button type="button" (click)="disabled.set(!disabled())">Toggle group disabled</button>
        <a href="#billing" (click)="billing.expand()">Open billing link</a>
      </div>
      <section
        zdAccordion
        #group="zdAccordion"
        [multiExpandable]="multi()"
        [disabled]="disabled()"
        [softDisabled]="false"
        wrap
        aria-label="Account settings"
      >
        <zd-accordion-item>
          <h2 zdAccordionHeading>
            <button
              zdAccordionTrigger
              id="profile-trigger"
              [panel]="profilePanel.aria"
              [(expanded)]="profile"
            >
              Profile
            </button>
          </h2>
          <zd-accordion-panel #profilePanel="zdAccordionPanel" id="profile-panel"
            ><p>Manage your public profile.</p>
            <label>Profile name<input aria-label="Profile name" value="Morgan" /></label
            ><docs-nested-accordion
          /></zd-accordion-panel>
        </zd-accordion-item>
        <zd-accordion-item indicator="plus">
          <h2 zdAccordionHeading>
            <button
              zdAccordionTrigger
              #billing="zdAccordionTrigger"
              id="billing-trigger"
              [panel]="billingPanel.aria"
            >
              Billing
            </button>
          </h2>
          <zd-accordion-panel
            #billingPanel="zdAccordionPanel"
            id="billing"
            [preserveContent]="preserve()"
            ><ng-template zdAccordionContent
              ><p>Review payment preferences.</p>
              <label>Invoice note<input aria-label="Invoice note" /></label></ng-template
          ></zd-accordion-panel>
        </zd-accordion-item>
        <zd-accordion-item indicator="none"
          ><h2 zdAccordionHeading>
            <button zdAccordionTrigger id="locked-trigger" [panel]="locked.aria" disabled>
              Locked settings
            </button>
          </h2>
          <zd-accordion-panel #locked="zdAccordionPanel" id="locked-panel"
            >Unavailable</zd-accordion-panel
          ></zd-accordion-item
        >
        <zd-accordion-item indicator="custom"
          ><h2 zdAccordionHeading>
            <button
              zdAccordionTrigger
              #custom="zdAccordionTrigger"
              id="custom-trigger"
              [panel]="customPanel.aria"
            >
              More information
              <span class="custom" aria-hidden="true">{{ custom.expanded() ? '−' : '+' }}</span>
            </button>
          </h2>
          <zd-accordion-panel #customPanel="zdAccordionPanel" id="custom-panel"
            ><p>Custom indicator content.</p></zd-accordion-panel
          ></zd-accordion-item
        >
      </section>
      <h2>Native details</h2>
      <section aria-label="Native details">
        <details zdCollapse name="native-account" indicator="arrow" open>
          <summary zdCollapseTitle>Native first</summary>
          <div zdCollapseContent>First details body.</div>
        </details>
        <details zdCollapse name="native-account" indicator="plus">
          <summary zdCollapseTitle>Native second</summary>
          <div zdCollapseContent>Second details body.</div>
        </details>
      </section>
      <h2>Native radio selection</h2>
      <section aria-label="Native radio selection">
        <div zdCollapse class="native-radio">
          <input type="radio" name="native-choice" aria-label="Radio first" checked />
          <div zdCollapseTitle>Radio first</div>
          <div zdCollapseContent>First radio body.</div>
        </div>
        <div zdCollapse class="native-radio">
          <input type="radio" name="native-choice" aria-label="Radio second" />
          <div zdCollapseTitle>Radio second</div>
          <div zdCollapseContent>Second radio body.</div>
        </div>
      </section>
    </main>`,
})
export class AccordionTestFixtureComponent {
  readonly multi = signal(false);
  readonly preserve = signal(false);
  readonly disabled = signal(false);
  readonly profile = signal(true);
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly billing = viewChild.required<ZdAccordionTrigger>('billing');
  private readonly document = inject(DOCUMENT);
  constructor() {
    afterNextRender(() => {
      if (this.document.location.hash === '#billing') this.billing().expand();
    });
  }
}
