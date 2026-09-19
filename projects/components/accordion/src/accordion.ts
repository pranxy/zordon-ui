import { AccordionGroup, AccordionTrigger, AccordionPanel } from '@angular/aria/accordion';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdAccordionIndicator = 'arrow' | 'plus' | 'custom' | 'none';

/** Grouped disclosure behavior is owned by Angular Aria. */
@Directive({
  selector: '[zdAccordion]',
  exportAs: 'zdAccordion',
  hostDirectives: [
    { directive: AccordionGroup, inputs: ['multiExpandable', 'disabled', 'softDisabled', 'wrap'] },
  ],
})
export class ZdAccordion {
  private readonly group = inject(AccordionGroup);
  expandAll(): void {
    this.group.expandAll();
  }
  collapseAll(): void {
    this.group.collapseAll();
  }
}

@Component({
  selector: 'zd-accordion-item',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.data-expanded]': 'trigger().expanded()',
    '[attr.data-indicator]': 'indicator()',
  },
  styles: `
    zd-accordion-item {
      display: grid;
    }
    zd-accordion-item > [zdAccordionHeading] {
      margin: 0;
      padding: 0;
      font: inherit;
    }
    zd-accordion-item > [zdAccordionHeading]::after {
      pointer-events: none;
    }
    zd-accordion-item[data-indicator='arrow'][data-expanded='true'] > [zdAccordionHeading]::after {
      transform: translateY(-50%) rotate(225deg);
    }
    @media (prefers-reduced-motion: reduce), (forced-colors: active) {
      zd-accordion-item,
      zd-accordion-item > [zdAccordionHeading]::after {
        transition: none !important;
      }
    }
  `,
  template: '<ng-content />',
})
export class ZdAccordionItem {
  readonly indicator = input<ZdAccordionIndicator>('arrow');
  private readonly names = inject(ZdClassNames);
  protected readonly trigger = contentChild.required(AccordionTrigger);
  protected readonly classes = computed(() =>
    [
      'collapse',
      this.trigger().expanded() ? 'collapse-open' : 'collapse-close',
      ...(['arrow', 'plus'].includes(this.indicator()) ? [`collapse-${this.indicator()}`] : []),
    ]
      .map(name => this.names.daisyUi(name))
      .join(' '),
  );
}

/** Apply to a native heading containing only its trigger button. */
@Directive({ selector: '[zdAccordionHeading]', host: { '[class]': 'classes' } })
export class ZdAccordionHeading {
  protected readonly classes = inject(ZdClassNames).daisyUi('collapse-title');
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- Preserve the native button host while projecting its label and composing Aria.
  selector: 'button[zdAccordionTrigger]',
  exportAs: 'zdAccordionTrigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: AccordionTrigger,
      inputs: ['panel', 'id', 'disabled', 'expanded'],
      outputs: ['expandedChange'],
    },
  ],
  host: { 'type': 'button', 'ngAccordionTrigger': '', '(click)': 'activate($event)' },
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 2.75rem;
      padding: 1rem;
      padding-inline-end: 3rem;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
      overflow-wrap: anywhere;
    }
    :host:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: -3px;
      border-radius: inherit;
    }
    :host[aria-disabled='true'] {
      cursor: default;
    }
  `,
  template: '<ng-content />',
})
export class ZdAccordionTrigger {
  private readonly trigger = inject(AccordionTrigger);
  readonly expanded = this.trigger.expanded.asReadonly();
  expand(): void {
    this.trigger.expand();
  }
  collapse(): void {
    this.trigger.collapse();
  }
  toggle(): void {
    this.trigger.toggle();
  }
  /** Native synthetic activation has no pointerdown; keyboard default clicks are prevented by Aria. */
  protected activate(event: MouseEvent): void {
    if (event.detail === 0 && !event.defaultPrevented) this.trigger.toggle();
  }
}

/** Optional lazy content with explicit preservation. */
@Directive({ selector: 'ng-template[zdAccordionContent]' })
export class ZdAccordionContent {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'zd-accordion-panel',
  exportAs: 'zdAccordionPanel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  hostDirectives: [{ directive: AccordionPanel, inputs: ['id'] }],
  host: {
    '[class]': 'classes',
    '[hidden]': '!visible()',
    '(keydown)': '$event.stopPropagation()',
    '(pointerdown)': '$event.stopPropagation()',
    '(focusin)': '$event.stopPropagation()',
  },
  styles: `
    :host[hidden] {
      display: none !important;
    }
    :host {
      overflow-wrap: anywhere;
    }
    @media (prefers-reduced-motion: reduce), (forced-colors: active) {
      :host {
        transition: none !important;
      }
    }
  `,
  template: `<ng-content />
    @if (content(); as content) {
      @if (visible() || (preserveContent() && rendered())) {
        <ng-container [ngTemplateOutlet]="content.template" />
      }
    }`,
})
export class ZdAccordionPanel {
  /** Pass this public Angular Aria reference to the paired trigger's panel input. */
  readonly aria = inject(AccordionPanel);
  readonly visible = this.aria.visible;
  readonly preserveContent = input(false, { transform: booleanAttribute });
  protected readonly content = contentChild(ZdAccordionContent);
  protected readonly rendered = signal(false);
  protected readonly classes = inject(ZdClassNames).daisyUi('collapse-content');
  constructor() {
    effect(() => {
      if (this.visible()) this.rendered.set(true);
    });
  }
}
