import { Component, signal, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Directionality } from '@angular/cdk/bidi';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ɵZdOverlayCoordinator } from '@pranxy/zordon-ui/internal-overlay';
import {
  ZdTooltip,
  type ZdTooltipAlign,
  type ZdTooltipColor,
  type ZdTooltipSide,
  type ZdTooltipTrigger,
} from './tooltip';

@Component({
  imports: [ZdTooltip],
  template: `
    <p id="existing">Existing description</p>
    <p id="replacement">New description</p>
    <button id="before">Before</button>
    @if (present()) {
      <button
        id="origin"
        [zdTooltip]="content()"
        #tip="zdTooltip"
        [tooltipOpen]="open()"
        [tooltipDisabled]="disabled()"
        [tooltipInteractive]="interactive()"
        tooltipLabel="Context help"
        [tooltipTrigger]="trigger()"
        [tooltipSide]="side()"
        [tooltipAlign]="align()"
        [tooltipColor]="color()"
        [tooltipAutoFlip]="flip()"
        [tooltipGap]="gap()"
        [tooltipArrow]="arrow()"
        [tooltipShowDelay]="showDelay()"
        [tooltipHideDelay]="hideDelay()"
        [tooltipTouch]="touch()"
        [tooltipLongPressDelay]="longPressDelay()"
        [tooltipTouchHideDelay]="touchHideDelay()"
        tooltipPanelClass="custom-pane"
        [attr.aria-describedby]="description()"
        (tooltipOpenChange)="requests.push($event)"
        (tooltipClosed)="reasons.push($event)"
        (click)="clicks.set(clicks() + 1)"
      >
        Help
      </button>
    }
    <button id="after">After</button>
    <ng-template #rich><strong>Rich description</strong></ng-template>
    <ng-template #form
      ><label>Topic<input id="topic" /></label><button id="save">Save</button></ng-template
    >
  `,
})
class Host {
  readonly tip = viewChild.required<ZdTooltip>('tip');
  readonly rich = viewChild.required<TemplateRef<object>>('rich');
  readonly form = viewChild.required<TemplateRef<object>>('form');
  readonly content = signal<string | TemplateRef<object>>('Helpful description');
  readonly open = signal<boolean | undefined>(undefined);
  readonly disabled = signal(false);
  readonly interactive = signal(false);
  readonly trigger = signal<ZdTooltipTrigger>('auto');
  readonly side = signal<ZdTooltipSide>('top');
  readonly align = signal<ZdTooltipAlign>('center');
  readonly color = signal<ZdTooltipColor>('neutral');
  readonly flip = signal(true);
  readonly gap = signal(8);
  readonly arrow = signal(true);
  readonly showDelay = signal(0);
  readonly hideDelay = signal(0);
  readonly touch = signal(true);
  readonly longPressDelay = signal(0);
  readonly touchHideDelay = signal(0);
  readonly description = signal<string | null>('existing');
  readonly present = signal(true);
  readonly clicks = signal(0);
  readonly requests: boolean[] = [];
  readonly reasons: string[] = [];
}

describe('ZdTooltip', () => {
  const resizes: (() => void)[] = [];
  const disconnect = vi.fn();
  beforeEach(() => {
    resizes.length = 0;
    disconnect.mockClear();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resizes.push(callback);
        }
        observe() {}
        disconnect() {
          disconnect();
        }
      },
    );
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'dui-' } })],
    });
    vi.spyOn(TestBed.inject(InteractivityChecker), 'isFocusable').mockImplementation(
      element => !element.hasAttribute('disabled'),
    );
    vi.spyOn(TestBed.inject(InteractivityChecker), 'isTabbable').mockImplementation(
      element => !element.hasAttribute('disabled') && element.tabIndex >= 0,
    );
  });
  afterEach(() => vi.unstubAllGlobals());
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    const element: HTMLElement = fixture.nativeElement;
    const origin = element.querySelector<HTMLButtonElement>('#origin')!;
    return {
      fixture,
      host,
      element,
      origin,
      tip: host.tip(),
      overlay: TestBed.inject(OverlayContainer).getContainerElement(),
    };
  }
  function pointer(element: HTMLElement, type: string, pointerType = 'mouse', x = 0, y = 0) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.assign(event, { pointerType, clientX: x, clientY: y });
    element.dispatchEvent(event);
    return event;
  }
  async function elapsed(fixture: Awaited<ReturnType<typeof setup>>['fixture']) {
    await new Promise(resolve => setTimeout(resolve, 5));
    await fixture.whenStable();
  }

  it('merges live descriptions, keeps focus on the trigger, escapes once and cleans up', async () => {
    const { fixture, host, origin, tip, overlay } = await setup();
    tip.focusContent();
    expect(tip.expanded()).toBe(false);
    origin.focus();
    await fixture.whenStable();
    expect(tip.expanded()).toBe(true);
    expect(document.activeElement).toBe(origin);
    expect(overlay.querySelector('[role="tooltip"]')!.textContent).toContain('Helpful description');
    expect(origin.getAttribute('aria-describedby')).toBe(`existing ${tip.id}`);
    expect(overlay.querySelector('.custom-pane')).not.toBeNull();
    host.description.set('replacement');
    host.content.set('Updated help');
    host.color.set('primary');
    await fixture.whenStable();
    expect(origin.getAttribute('aria-describedby')).toBe(`replacement ${tip.id}`);
    expect(overlay.querySelector('.dui-tooltip-primary')!.textContent).toContain('Updated help');
    const modified = new KeyboardEvent('keydown', { key: 'Escape', ctrlKey: true, bubbles: true });
    origin.dispatchEvent(modified);
    expect(tip.expanded()).toBe(true);
    origin.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(tip.expanded()).toBe(false);
    expect(host.reasons).toEqual(['escape']);
    expect(origin.getAttribute('aria-describedby')).toBe('replacement');
    expect(disconnect).toHaveBeenCalled();
    resizes[0]();
    tip.show();
    await fixture.whenStable();
    fixture.destroy();
    expect(overlay.querySelector('[role="tooltip"]')).toBeNull();
    expect(origin.getAttribute('aria-describedby')).toBe('replacement');
  });

  it('handles hover delay cancellation, reachable content and focus retention', async () => {
    const { fixture, host, origin, tip, overlay, element } = await setup();
    host.showDelay.set(50);
    await fixture.whenStable();
    pointer(origin, 'pointerenter');
    pointer(origin, 'pointerleave');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    host.showDelay.set(-1);
    await fixture.whenStable();
    pointer(origin, 'pointerenter');
    pointer(origin, 'pointerup');
    await elapsed(fixture);
    const pane = overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    pointer(origin, 'pointerleave');
    pointer(pane, 'pointerenter');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(true);
    pointer(pane, 'pointerleave');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    expect(host.reasons).toContain('hover');
    origin.focus();
    await fixture.whenStable();
    pointer(origin, 'pointerenter');
    pointer(origin, 'pointerleave');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(true);
    element.querySelector<HTMLButtonElement>('#after')!.focus();
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    host.trigger.set('hover');
    await fixture.whenStable();
    origin.focus();
    await fixture.whenStable();
    expect(tip.expanded()).toBe(false);
    pointer(origin, 'pointerenter');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(true);
    host.trigger.set('manual');
    await fixture.whenStable();
    tip.hide();
    await fixture.whenStable();
    pointer(origin, 'pointerenter');
    pointer(origin, 'pointerleave');
    origin.dispatchEvent(new FocusEvent('focusin'));
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    tip.show();
    await fixture.whenStable();
    pointer(overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!, 'pointerleave');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(true);
    host.present.set(false);
    await fixture.whenStable();
    expect(overlay.querySelector('.cdk-overlay-pane')).toBeNull();
  });

  it('distinguishes controlled requests, disabled/empty content and live placements', async () => {
    const { fixture, host, tip, origin, overlay } = await setup();
    const coordinator = TestBed.inject(ɵZdOverlayCoordinator);
    const open = vi.spyOn(coordinator, 'open');
    host.open.set(false);
    await fixture.whenStable();
    tip.show();
    await fixture.whenStable();
    expect(tip.expanded()).toBe(false);
    expect(host.requests).toEqual([true]);
    host.open.set(true);
    await fixture.whenStable();
    const config = open.mock.calls.at(-1)![0];
    expect(config.canClose!('selection')).toBe(false);
    config.onCloseRequest('programmatic');
    tip.hide('outside-pointer');
    await fixture.whenStable();
    expect(tip.expanded()).toBe(true);
    host.open.set(false);
    await fixture.whenStable();
    expect(tip.expanded()).toBe(false);
    host.disabled.set(true);
    host.interactive.set(true);
    await fixture.whenStable();
    tip.show();
    tip.focusContent();
    expect(tip.expanded()).toBe(false);
    host.disabled.set(false);
    host.open.set(true);
    await fixture.whenStable();
    host.content.set('   ');
    await fixture.whenStable();
    expect(tip.expanded()).toBe(false);
    host.content.set(host.rich());
    host.interactive.set(false);
    await fixture.whenStable();
    expect(overlay.textContent).toContain('Rich description');
    const update = vi.spyOn(coordinator, 'updatePlacement');
    for (const side of ['top', 'bottom', 'start', 'end'] as const)
      for (const align of ['start', 'center', 'end'] as const) {
        host.side.set(side);
        host.align.set(align);
        await fixture.whenStable();
        const placement = update.mock.calls.at(-1)![1];
        expect(placement.kind).toBe('connected');
        if (placement.kind === 'connected') expect(placement.positions).toHaveLength(2);
      }
    const direction = TestBed.inject(Directionality);
    vi.spyOn(direction, 'value', 'get').mockReturnValue('rtl');
    host.side.set('start');
    host.gap.set(Number.NaN);
    host.flip.set(false);
    host.arrow.set(false);
    await fixture.whenStable();
    resizes.at(-1)!();
    const placement = update.mock.calls.at(-1)![1];
    if (placement.kind === 'connected') {
      expect(placement.positions).toHaveLength(1);
      expect(placement.positions[0].offsetX).toBe(0);
    }
    expect(overlay.querySelector('.zd-tooltip-arrow')).toBeNull();
    config.onPositionChange!({
      originX: 'end',
      overlayX: 'start',
      originY: 'bottom',
      overlayY: 'bottom',
      panelClass: ['zd-tooltip-side-end'],
    });
    expect(overlay.querySelector('[data-zd-tooltip-side="end"]')).not.toBeNull();
    config.onPositionChange!({
      originX: 'center',
      overlayX: 'center',
      originY: 'bottom',
      overlayY: 'top',
      panelClass: ['zd-tooltip-side-bottom'],
    });
    expect(overlay.querySelector('[data-zd-tooltip-side="bottom"]')).not.toBeNull();
    config.onPositionChange!({
      originX: 'center',
      overlayX: 'center',
      originY: 'top',
      overlayY: 'bottom',
      panelClass: ['zd-tooltip-side-top'],
    });
    expect(overlay.querySelector('[data-zd-tooltip-side="top"]')).not.toBeNull();
    host.description.set(null);
    await fixture.whenStable();
    tip.hide();
    host.open.set(false);
    await fixture.whenStable();
    expect(origin.hasAttribute('aria-describedby')).toBe(false);
    const lastConfig = open.mock.calls.at(-1)![0];
    lastConfig.onPositionChange!({
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
      panelClass: 'zd-tooltip-side-start',
    });
    open.mockReturnValueOnce(null);
    host.open.set(true);
    await fixture.whenStable();
    expect(tip.expanded()).toBe(false);
  });

  it('uses an interactive dialog with explicit focus entry, Tab exit, restoration and owned ARIA cleanup', async () => {
    const { fixture, host, origin, tip, overlay, element } = await setup();
    origin.setAttribute('aria-haspopup', 'menu');
    origin.setAttribute('aria-controls', 'original-controls');
    host.interactive.set(true);
    host.content.set(host.form());
    await fixture.whenStable();
    expect(origin.getAttribute('aria-haspopup')).toBe('dialog');
    origin.focus();
    await fixture.whenStable();
    expect(origin.getAttribute('aria-expanded')).toBe('true');
    expect(origin.getAttribute('aria-controls')).toBe(tip.id);
    expect(origin.getAttribute('aria-describedby')).toBe('existing');
    origin.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', ctrlKey: true, bubbles: true }));
    expect(document.activeElement).toBe(origin);
    origin.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    const topic = overlay.querySelector<HTMLInputElement>('#topic')!;
    const save = overlay.querySelector<HTMLButtonElement>('#save')!;
    expect(document.activeElement).toBe(topic);
    expect(overlay.querySelector('[role="dialog"]')!.getAttribute('aria-label')).toBe(
      'Context help',
    );
    topic.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', ctrlKey: true, bubbles: true }));
    topic.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(tip.expanded()).toBe(true);
    save.focus();
    save.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(document.activeElement).toBe(element.querySelector('#after'));
    expect(tip.expanded()).toBe(false);
    tip.focusContent();
    await fixture.whenStable();
    expect(document.activeElement!.id).toBe('topic');
    overlay.querySelector('#topic')!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    await fixture.whenStable();
    expect(document.activeElement).toBe(origin);
    tip.focusContent();
    await fixture.whenStable();
    overlay
      .querySelector('#topic')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
    await fixture.whenStable();
    expect(document.activeElement).toBe(origin);
    expect(tip.expanded()).toBe(false);
    origin.click();
    await fixture.whenStable();
    expect(document.activeElement!.id).toBe('topic');
    origin.setAttribute('aria-haspopup', 'listbox');
    await fixture.whenStable();
    host.interactive.set(false);
    host.content.set('Plain');
    await fixture.whenStable();
    expect(origin.getAttribute('aria-haspopup')).toBe('listbox');
    expect(origin.getAttribute('aria-controls')).toBe('original-controls');
    host.interactive.set(true);
    host.content.set('No focusable children');
    await fixture.whenStable();
    tip.focusContent();
    expect(document.activeElement).toBe(overlay.querySelector('[role="dialog"]'));
    tip.hide();
    await fixture.whenStable();
    tip.focusContent();
    await fixture.whenStable();
    expect(document.activeElement).toBe(overlay.querySelector('[role="dialog"]'));
    origin.setAttribute('aria-controls', 'consumer-new');
    fixture.destroy();
    expect(origin.getAttribute('aria-controls')).toBe('consumer-new');
  });

  it('handles touch long-press, movement cancellation, click suppression and expiry', async () => {
    const { fixture, host, tip, origin } = await setup();
    pointer(origin, 'pointerenter', 'touch');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    host.longPressDelay.set(50);
    await fixture.whenStable();
    pointer(origin, 'pointerdown', 'touch');
    origin.dispatchEvent(new FocusEvent('focusin'));
    pointer(origin, 'pointerup', 'touch');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    pointer(origin, 'pointerdown', 'touch', 5, 5);
    pointer(origin, 'pointermove', 'touch', 20, 5);
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    host.longPressDelay.set(0);
    host.touchHideDelay.set(100);
    await fixture.whenStable();
    pointer(origin, 'pointerdown', 'touch');
    pointer(origin, 'pointermove', 'touch', 1, 1);
    await elapsed(fixture);
    expect(tip.expanded()).toBe(true);
    const context = new MouseEvent('contextmenu', { cancelable: true });
    origin.dispatchEvent(context);
    expect(context.defaultPrevented).toBe(true);
    pointer(origin, 'pointerup', 'touch');
    const click = new MouseEvent('click', { cancelable: true });
    origin.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(host.clicks()).toBe(0);
    origin.dispatchEvent(new MouseEvent('contextmenu', { cancelable: true }));
    tip.hide();
    await fixture.whenStable();
    host.touchHideDelay.set(0);
    await fixture.whenStable();
    pointer(origin, 'pointerdown', 'touch');
    await elapsed(fixture);
    pointer(origin, 'pointerup', 'touch');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    pointer(origin, 'pointerdown', 'touch');
    await elapsed(fixture);
    pointer(origin, 'pointercancel', 'touch');
    await fixture.whenStable();
    expect(tip.expanded()).toBe(false);
    pointer(origin, 'pointermove', 'mouse');
    host.touch.set(false);
    await fixture.whenStable();
    pointer(origin, 'pointerdown', 'touch');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    pointer(origin, 'pointerdown', 'mouse');
    origin.click();
    expect(host.clicks()).toBe(1);
    host.touch.set(true);
    host.trigger.set('manual');
    await fixture.whenStable();
    pointer(origin, 'pointerdown', 'touch');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
  });

  it('uses the documented fallback delay for a non-finite duration', async () => {
    const { fixture, host, origin, tip } = await setup();
    host.showDelay.set(Number.NaN);
    await fixture.whenStable();
    pointer(origin, 'pointerenter');
    await elapsed(fixture);
    expect(tip.expanded()).toBe(false);
    await new Promise(resolve => setTimeout(resolve, 520));
    await fixture.whenStable();
    expect(tip.expanded()).toBe(true);
  });
});
