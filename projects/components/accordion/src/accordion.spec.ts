import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import {
  ZdAccordion,
  ZdAccordionContent,
  ZdAccordionHeading,
  ZdAccordionItem,
  ZdAccordionPanel,
  ZdAccordionTrigger,
  type ZdAccordionIndicator,
} from './accordion';
const parts = [
  ZdAccordion,
  ZdAccordionContent,
  ZdAccordionHeading,
  ZdAccordionItem,
  ZdAccordionPanel,
  ZdAccordionTrigger,
];
@Component({
  imports: parts,
  template: `<section
    zdAccordion
    #group="zdAccordion"
    [multiExpandable]="multi()"
    [disabled]="disabled()"
    [softDisabled]="false"
  >
    <zd-accordion-item [indicator]="indicator()">
      <h2 zdAccordionHeading>
        <button
          zdAccordionTrigger
          #first="zdAccordionTrigger"
          id="first"
          [panel]="panel.aria"
          [(expanded)]="open"
        >
          First
        </button>
      </h2>
      <zd-accordion-panel #panel="zdAccordionPanel" id="first-panel" [preserveContent]="preserve()"
        ><ng-template zdAccordionContent><input aria-label="Draft" /></ng-template
      ></zd-accordion-panel>
    </zd-accordion-item>
    <zd-accordion-item indicator="none">
      <h2 zdAccordionHeading>
        <button zdAccordionTrigger #second="zdAccordionTrigger" id="second" [panel]="panel2.aria">
          Second
        </button>
      </h2>
      <zd-accordion-panel #panel2="zdAccordionPanel" id="second-panel"
        ><p>Eager body</p></zd-accordion-panel
      >
    </zd-accordion-item>
  </section>`,
})
class Host {
  readonly open = signal(false);
  readonly multi = signal(false);
  readonly disabled = signal(false);
  readonly preserve = signal(false);
  readonly indicator = signal<ZdAccordionIndicator>('arrow');
  readonly group = viewChild.required(ZdAccordion);
  readonly first = viewChild.required<ZdAccordionTrigger>('first');
  readonly second = viewChild.required<ZdAccordionTrigger>('second');
}
describe('Accordion', () => {
  afterEach(() => TestBed.resetTestingModule());
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return {
      fixture,
      host: fixture.componentInstance,
      element: fixture.nativeElement as HTMLElement,
    };
  }
  it('pairs native triggers with hidden inert labelled panels and projects eager content', async () => {
    const { fixture, host, element } = await setup();
    const button = element.querySelector('button')!;
    const panel = element.querySelector('zd-accordion-panel')!;
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-controls')).toBe('first-panel');
    expect(panel.getAttribute('aria-labelledby')).toBe('first');
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(element.querySelector('input')).toBeNull();
    expect(element.textContent).toContain('Eager body');
    host.first().expand();
    await fixture.whenStable();
    expect(host.open()).toBe(true);
    expect(host.first().expanded()).toBe(true);
    expect(panel.hasAttribute('hidden')).toBe(false);
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(element.querySelector('input')).not.toBeNull();
    host.first().collapse();
    await fixture.whenStable();
    expect(element.querySelector('input')).toBeNull();
    host.first().toggle();
    await fixture.whenStable();
    expect(host.open()).toBe(true);
  });
  it('coordinates single and multiple expansion and supports group commands and external state', async () => {
    const { fixture, host } = await setup();
    host.first().expand();
    await fixture.whenStable();
    host.second().expand();
    await fixture.whenStable();
    expect(host.open()).toBe(false);
    expect(host.second().expanded()).toBe(true);
    host.group().collapseAll();
    await fixture.whenStable();
    expect(host.second().expanded()).toBe(false);
    host.multi.set(true);
    await fixture.whenStable();
    host.group().expandAll();
    await fixture.whenStable();
    expect(host.open()).toBe(true);
    expect(host.second().expanded()).toBe(true);
    host.open.set(false);
    await fixture.whenStable();
    expect(host.first().expanded()).toBe(false);
    host.disabled.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
  it('preserves lazy views only after first opening and destroys them when preservation is removed', async () => {
    const { fixture, host, element } = await setup();
    host.preserve.set(true);
    await fixture.whenStable();
    expect(element.querySelector('input')).toBeNull();
    host.first().expand();
    await fixture.whenStable();
    const input = element.querySelector('input')!;
    input.value = 'Retained';
    host.first().collapse();
    await fixture.whenStable();
    expect(element.querySelector('input')).toBe(input);
    host.first().expand();
    await fixture.whenStable();
    expect(element.querySelector('input')!.value).toBe('Retained');
    host.first().collapse();
    await fixture.whenStable();
    host.preserve.set(false);
    await fixture.whenStable();
    expect(element.querySelector('input')).toBeNull();
  });
  it('applies prefix-aware anatomy and indicator classes without replacing consumer classes', async () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const { fixture, host, element } = await setup();
    expect(
      element.querySelector('zd-accordion-item')!.classList.contains('du-collapse-arrow'),
    ).toBe(true);
    for (const indicator of ['plus', 'custom', 'none'] as const) {
      host.indicator.set(indicator);
      await fixture.whenStable();
      expect(
        element.querySelector('zd-accordion-item')!.classList.contains('du-collapse-plus'),
      ).toBe(indicator === 'plus');
    }
    expect(element.querySelector('h2')!.classList.contains('du-collapse-title')).toBe(true);
    expect(
      element.querySelector('zd-accordion-panel')!.classList.contains('du-collapse-content'),
    ).toBe(true);
  });
  it('isolates panel input events from the group expansion and focus handlers', async () => {
    const { fixture, host, element } = await setup();
    host.first().expand();
    await fixture.whenStable();
    const input = element.querySelector('input')!;
    for (const type of ['keydown', 'pointerdown', 'focusin']) {
      const event =
        type === 'keydown'
          ? new KeyboardEvent(type, { bubbles: true, key: 'Enter' })
          : new Event(type, { bubbles: true });
      const observer = vi.fn();
      element.addEventListener(type, observer);
      input.dispatchEvent(event);
      expect(observer).not.toHaveBeenCalled();
      element.removeEventListener(type, observer);
    }
    expect(host.open()).toBe(true);
  });
  it('retains trigger and lazy-content queries when consumers customize presentation', async () => {
    TestBed.overrideComponent(ZdAccordionItem, { add: { host: { 'data-custom-item': 'true' } } });
    TestBed.overrideComponent(ZdAccordionPanel, { add: { host: { 'data-custom-panel': 'true' } } });
    const { fixture, host, element } = await setup();
    host.first().expand();
    await fixture.whenStable();
    expect(element.querySelector('zd-accordion-item')!.classList.contains('collapse-open')).toBe(
      true,
    );
    expect(element.querySelector('zd-accordion-panel input')).not.toBeNull();
  });
  it('supports synthetic native activation without duplicating pointer activation', async () => {
    const { fixture, host, element } = await setup();
    const button = element.querySelector('button')!;
    button.click();
    await fixture.whenStable();
    expect(host.open()).toBe(true);
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    await fixture.whenStable();
    expect(host.open()).toBe(true);
    const prevented = new MouseEvent('click', { bubbles: true, cancelable: true });
    prevented.preventDefault();
    button.dispatchEvent(prevented);
    await fixture.whenStable();
    expect(host.open()).toBe(true);
    button.click();
    await fixture.whenStable();
    expect(host.open()).toBe(false);
    host.disabled.set(true);
    await fixture.whenStable();
    button.click();
    expect(host.open()).toBe(false);
  });
});
