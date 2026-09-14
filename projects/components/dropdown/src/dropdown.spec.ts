import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import {
  ZdDropdown,
  ZdDropdownPanel,
  ZdDropdownTrigger,
  type ZdDropdownSide,
  type ZdDropdownAlign,
} from './dropdown';
import { ZdDropdownItem, ZdDropdownMenu } from './dropdown-menu';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ɵZdOverlayCoordinator } from '@pranxy/zordon-ui/internal-overlay';

@Component({
  imports: [ZdDropdown, ZdDropdownPanel, ZdDropdownTrigger, ZdDropdownItem, ZdDropdownMenu],
  template: `
    <button id="before">Before</button>
    @if (present()) {
      <div
        zdDropdown
        #root="zdDropdown"
        [open]="open()"
        [disabled]="disabled()"
        [mode]="mode()"
        [trigger]="trigger()"
        [side]="side()"
        [align]="align()"
        [gap]="gap()"
        [autoFlip]="flip()"
        [hoverDelay]="delay()"
        [closeOnSelection]="selectionClose()"
        [restoreFocus]="restore()"
        [closeOnEscape]="escapeClose()"
        [closeOnOutside]="outsideClose()"
        [closeOnFocus]="focusClose()"
        [initialFocus]="initial()"
        panelClass="custom-panel"
        (openChange)="requests.push($event)"
        (closed)="reasons.push($event)"
        (selected)="values.push($event)"
      >
        @if (triggerPresent()) {
          <button zdDropdownTrigger id="trigger">Actions</button>
        }
        <ng-template zdDropdownPanel>
          @if (mode() === 'menu') {
            <zd-dropdown-menu aria-label="Actions">
              <button zdDropdownItem value="first" [searchTerm]="search()">{{ label() }}</button>
              <button zdDropdownItem value="blocked" [disabled]="true" (click)="clicked.set(true)">
                Blocked
              </button>
              <div zdDropdown mode="menu" side="end" #child="zdDropdown">
                <button
                  zdDropdownTrigger
                  zdDropdownItem
                  value="more"
                  [disabled]="submenuDisabled()"
                >
                  More
                </button>
                <ng-template zdDropdownPanel
                  ><zd-dropdown-menu aria-label="Child"
                    ><button zdDropdownItem value="child">Child</button></zd-dropdown-menu
                  ></ng-template
                >
              </div>
            </zd-dropdown-menu>
          } @else {
            <label>Name<input name="name" /></label
            ><button id="save" (click)="root.close('selection')">Save</button>
          }
        </ng-template>
      </div>
    }
    <button id="after">After</button>
  `,
})
class Host {
  readonly root = viewChild.required<ZdDropdown>('root');
  readonly open = signal<boolean | undefined>(undefined);
  readonly disabled = signal(false);
  readonly present = signal(true);
  readonly triggerPresent = signal(true);
  readonly submenuDisabled = signal(false);
  readonly mode = signal<'menu' | 'content'>('menu');
  readonly trigger = signal<'click' | 'hover' | 'focus' | 'manual'>('click');
  readonly side = signal<ZdDropdownSide>('bottom');
  readonly align = signal<ZdDropdownAlign>('start');
  readonly gap = signal(4);
  readonly flip = signal(true);
  readonly delay = signal(0);
  readonly selectionClose = signal(true);
  readonly restore = signal(true);
  readonly escapeClose = signal(true);
  readonly outsideClose = signal(true);
  readonly focusClose = signal(true);
  readonly initial = signal<'first' | 'none'>('none');
  readonly search = signal<string | undefined>(undefined);
  readonly label = signal('First');
  readonly clicked = signal(false);
  readonly requests: boolean[] = [];
  readonly reasons: string[] = [];
  readonly values: unknown[] = [];
}

@Component({
  imports: [ZdDropdown, ZdDropdownPanel],
  template: '<div zdDropdown><ng-template zdDropdownPanel /><ng-template zdDropdownPanel /></div>',
})
class DuplicatePanels {}

describe('Dropdown', () => {
  it('rejects ambiguous panel ownership', () => {
    expect(() => TestBed.createComponent(DuplicatePanels).detectChanges()).toThrow(
      /exactly one panel/,
    );
  });
  beforeEach(() => {
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

  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    const element: HTMLElement = fixture.nativeElement;
    const trigger = element.querySelector<HTMLButtonElement>('#trigger')!;
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    return { fixture, host, element, trigger, overlay, root: host.root() };
  }

  it('supports hover grace periods, focus retention and timer cancellation on destruction', async () => {
    const { fixture, host, trigger, overlay, root } = await setup();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    expect(root.expanded()).toBe(false);
    host.trigger.set('hover');
    host.delay.set(-1);
    await fixture.whenStable();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await vi.waitFor(() => expect(root.expanded()).toBe(true));
    const pane = overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    pane.dispatchEvent(new MouseEvent('mouseenter'));
    trigger.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: pane }));
    expect(root.expanded()).toBe(true);
    const first = pane.querySelector<HTMLButtonElement>('button')!;
    first.focus();
    pane.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(root.expanded()).toBe(true);
    first.blur();
    await fixture.whenStable();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await vi.waitFor(() => expect(root.expanded()).toBe(true));
    pane.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    root.leave(new MouseEvent('mouseleave', { relatedTarget: document.body }));
    await vi.waitFor(() => expect(root.expanded()).toBe(false));
    host.delay.set(Number.NaN);
    await fixture.whenStable();
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.destroy();
    expect(overlay.querySelectorAll('.cdk-overlay-pane')).toHaveLength(0);
  });

  it('restores natural Tab destinations for menus and content edges without trapping content', async () => {
    const { fixture, host, trigger, overlay, root, element } = await setup();
    trigger.click();
    await fixture.whenStable();
    let pane = overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    pane.querySelector<HTMLButtonElement>('button')!.focus();
    pane.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(document.activeElement).toBe(element.querySelector('#after'));
    trigger.click();
    await fixture.whenStable();
    pane = overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    pane.querySelector<HTMLButtonElement>('button')!.focus();
    pane.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(document.activeElement).toBe(element.querySelector('#before'));
    host.mode.set('content');
    root.show();
    await fixture.whenStable();
    pane = overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    pane.querySelector('input')!.focus();
    const internalTab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    pane.dispatchEvent(internalTab);
    expect(internalTab.defaultPrevented).toBe(false);
    pane.querySelector<HTMLButtonElement>('button')!.focus();
    pane.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
    root.show();
    await fixture.whenStable();
    pane = overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    pane.querySelector('input')!.focus();
    pane.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
  });

  it('honors outside/Escape vetoes and ignores modified navigation while retaining the pane', async () => {
    const { fixture, host, trigger, overlay, root } = await setup();
    host.escapeClose.set(false);
    host.outsideClose.set(false);
    host.focusClose.set(false);
    await fixture.whenStable();
    root.key(new KeyboardEvent('keydown', { key: 'ArrowDown', ctrlKey: true }));
    root.key(new KeyboardEvent('keydown', { key: 'x' }));
    expect(root.expanded()).toBe(false);
    trigger.click();
    await fixture.whenStable();
    const pane = overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    pane.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    document.body.click();
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    pane.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', ctrlKey: true, bubbles: true, cancelable: true }),
    );
    expect(root.expanded()).toBe(true);
    host.outsideClose.set(true);
    await fixture.whenStable();
    document.body.click();
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
    host.disabled.set(true);
    await fixture.whenStable();
    root.activate(new MouseEvent('click'));
    root.key(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(root.expanded()).toBe(false);
    host.disabled.set(false);
    host.trigger.set('manual');
    await fixture.whenStable();
    root.key(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(root.expanded()).toBe(false);
  });

  it('handles optional origins, empty/declined attachments, removed triggers and disabled submenus', async () => {
    const { fixture, host, trigger, root, overlay } = await setup();
    const coordinator = TestBed.inject(ɵZdOverlayCoordinator);
    const open = vi.spyOn(coordinator, 'open').mockReturnValueOnce(null);
    root.show();
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
    root.close();
    await fixture.whenStable();
    trigger.click();
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    host.submenuDisabled.set(true);
    await fixture.whenStable();
    const more = overlay.querySelector<HTMLButtonElement>('[value="more"]')!;
    more.click();
    more.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(overlay.querySelectorAll('.cdk-overlay-pane')).toHaveLength(1);
    root.unregisterTrigger(document.createElement('button'));
    expect(root.expanded()).toBe(true);
    host.triggerPresent.set(false);
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
    host.triggerPresent.set(true);
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    open.mockRestore();
  });

  it('uses logical collapse keys, Space activation and Tab from nested panels in RTL', async () => {
    const { fixture, trigger, overlay, root } = await setup();
    TestBed.inject(Directionality).valueSignal.set('rtl');
    trigger.click();
    await fixture.whenStable();
    let more = overlay.querySelector<HTMLButtonElement>('[value="more"]')!;
    more.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await fixture.whenStable();
    let child = overlay.querySelector<HTMLButtonElement>('[value="child"]')!;
    child.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(overlay.querySelectorAll('.cdk-overlay-pane')).toHaveLength(1);
    more = overlay.querySelector<HTMLButtonElement>('[value="more"]')!;
    more.dispatchEvent(new MouseEvent('mouseenter'));
    more.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: more.parentElement }));
    more.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    child = overlay.querySelector<HTMLButtonElement>('[value="child"]')!;
    child.focus();
    child.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
  });

  it('opens lazy content once, preserves classes and resets ownership on close/destruction', async () => {
    const { fixture, host, trigger, overlay, root } = await setup();
    expect(root.expanded()).toBe(false);
    trigger.click();
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    expect(overlay.querySelectorAll('.cdk-overlay-pane')).toHaveLength(1);
    expect(overlay.querySelector('.custom-panel')).not.toBeNull();
    expect(overlay.querySelector('zd-dropdown-menu')?.classList.contains('dui-menu')).toBe(true);
    root.show();
    await fixture.whenStable();
    expect(host.requests).toEqual([true]);
    trigger.click();
    await fixture.whenStable();
    expect(host.reasons).toEqual(['trigger']);
    root.close();
    await fixture.whenStable();
    root.show();
    await fixture.whenStable();
    host.present.set(false);
    await fixture.whenStable();
    expect(overlay.querySelectorAll('.cdk-overlay-pane')).toHaveLength(0);
    expect(host.reasons).toEqual(['trigger']);
  });

  it('honors controlled open and rejected close requests without getting stuck closing', async () => {
    const { fixture, host, trigger, root, overlay } = await setup();
    host.open.set(false);
    await fixture.whenStable();
    trigger.click();
    await fixture.whenStable();
    expect(host.requests).toEqual([true]);
    expect(root.expanded()).toBe(false);
    host.open.set(true);
    await fixture.whenStable();
    const pane = overlay.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    pane.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    pane.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    expect(host.requests).toEqual([true, false, false]);
    host.open.set(false);
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
    host.open.set(true);
    host.disabled.set(true);
    await fixture.whenStable();
    expect(trigger.disabled).toBe(true);
    root.show();
    expect(root.expanded()).toBe(false);
    host.disabled.set(false);
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    host.disabled.set(true);
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
  });

  it('keeps soft-disabled actions discoverable and suppresses native disabled activation', async () => {
    const { fixture, host, trigger, overlay } = await setup();
    trigger.click();
    await fixture.whenStable();
    const items = overlay.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    expect(items[1].getAttribute('aria-disabled')).toBe('true');
    items[1].click();
    await fixture.whenStable();
    expect(host.clicked()).toBe(false);
    expect(host.values).toEqual([]);
    host.selectionClose.set(false);
    await fixture.whenStable();
    items[0].click();
    await fixture.whenStable();
    expect(host.values).toEqual(['first']);
    expect(host.root().expanded()).toBe(true);
    host.label.set('Renamed');
    host.search.set('custom');
    await fixture.whenStable();
    expect(items[0].textContent).toBe('Renamed');
    host.search.set(undefined);
    await fixture.whenStable();
    host.selectionClose.set(true);
    host.restore.set(false);
    await fixture.whenStable();
    items[0].click();
    await fixture.whenStable();
    expect(host.root().expanded()).toBe(false);
  });

  it('supports manual and focus triggers, native focus boundaries and explicit navigation close', async () => {
    const { fixture, host, trigger, element, overlay, root } = await setup();
    host.trigger.set('manual');
    await fixture.whenStable();
    trigger.click();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
    host.mode.set('content');
    host.initial.set('first');
    root.show();
    await fixture.whenStable();
    expect(overlay.querySelector('input')).not.toBeNull();
    root.close('navigation');
    await fixture.whenStable();
    expect(host.reasons).toEqual(['navigation']);
    host.trigger.set('focus');
    await fixture.whenStable();
    trigger.dispatchEvent(new FocusEvent('focus'));
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    trigger.dispatchEvent(
      new FocusEvent('focusout', { relatedTarget: overlay.querySelector('input') }),
    );
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    host.focusClose.set(false);
    await fixture.whenStable();
    root.blur(new FocusEvent('focusout', { relatedTarget: element.querySelector('#after') }));
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    host.focusClose.set(true);
    await fixture.whenStable();
    root.blur(new FocusEvent('focusout', { relatedTarget: element.querySelector('#after') }));
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
  });

  it.each(['top', 'bottom', 'start', 'end'] as const)(
    'opens with %s logical positioning in both directions',
    async side => {
      const { fixture, host, root, overlay } = await setup();
      host.side.set(side);
      host.align.set('center');
      host.gap.set(-1);
      host.flip.set(false);
      root.show();
      await fixture.whenStable();
      expect(overlay.querySelector('.cdk-overlay-pane')).not.toBeNull();
      const existingPane = overlay.querySelector('.cdk-overlay-pane');
      TestBed.inject(Directionality).valueSignal.set('rtl');
      host.align.set('end');
      await fixture.whenStable();
      expect(overlay.querySelector('.cdk-overlay-pane')).toBe(existingPane);
      root.close();
      await fixture.whenStable();
      TestBed.inject(Directionality).valueSignal.set('rtl');
      host.align.set('end');
      host.gap.set(Number.NaN);
      host.flip.set(true);
      root.show();
      await fixture.whenStable();
      root.close();
      await fixture.whenStable();
      host.align.set('start');
      host.gap.set(10);
      root.show();
      await fixture.whenStable();
      expect(root.expanded()).toBe(true);
    },
  );

  it('nests panels with one stack and closes child-first on Escape and parent destruction', async () => {
    const { fixture, trigger, overlay, root, host } = await setup();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true }));
    await fixture.whenStable();
    const more = overlay.querySelector<HTMLButtonElement>('[value="more"]')!;
    more.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(overlay.querySelectorAll('.cdk-overlay-pane')).toHaveLength(2);
    const child = overlay.querySelector<HTMLButtonElement>('[value="child"]')!;
    child.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(overlay.querySelectorAll('.cdk-overlay-pane')).toHaveLength(1);
    more.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    overlay.querySelector<HTMLButtonElement>('[value="child"]')!.click();
    await fixture.whenStable();
    expect(host.values).toEqual(['child']);
    expect(root.expanded()).toBe(false);
    trigger.click();
    await fixture.whenStable();
    overlay.querySelector<HTMLButtonElement>('[value="more"]')!.click();
    await fixture.whenStable();
    fixture.destroy();
    expect(overlay.querySelectorAll('.cdk-overlay-pane')).toHaveLength(0);
  });
});
