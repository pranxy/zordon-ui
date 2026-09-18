import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZdFab, ZdFabAction, ZdFabActions, type ZdFabArrangement } from './fab';

@Component({
  imports: [ZdFab, ZdFabAction, ZdFabActions],
  template: `
    <button id="outside">Outside</button>
    <zd-fab
      label="Create"
      #fab
      inline
      [open]="open()"
      [disabled]="disabled()"
      [arrangement]="arrangement()"
      (openChange)="requests.push($event)"
      (mainAction)="mains = mains + 1"
    >
      <ng-template zdFabActions>
        <button id="action" zdFabAction><span>Action</span></button>
        <a id="keep" href="#kept" zdFabAction keepOpen>Keep</a>
        <button id="disabled" zdFabAction disabled>Disabled</button>
        <button id="soft" zdFabAction aria-disabled="true">Soft disabled</button>
        <button id="cancel" zdFabAction (click)="$event.preventDefault()">Cancel action</button>
        <button id="plain">Plain</button>
      </ng-template>
    </zd-fab>
  `,
})
class Host {
  readonly fab = viewChild.required<ZdFab>('fab');
  readonly open = signal<boolean | undefined>(undefined);
  readonly disabled = signal(false);
  readonly arrangement = signal<ZdFabArrangement>('vertical');
  requests: boolean[] = [];
  mains = 0;
}

describe('ZdFab', () => {
  it('owns disclosure state, native actions, Tab departure and Escape without changing cancellation', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const h = f.componentInstance,
      root = f.nativeElement as HTMLElement;
    const get = (s: string) => root.querySelector<HTMLElement>(s)!;
    const trigger = get('.zd-fab-trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    h.fab().hide();
    h.fab().show();
    await f.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    h.fab().show();
    for (const id of ['keep', 'disabled', 'soft', 'cancel', 'plain']) {
      get('#' + id).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(h.fab().expanded()).toBe(true);
    }
    get('#action').focus();
    get('#action span').click();
    await f.whenStable();
    expect(h.fab().expanded()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    trigger.click();
    await f.whenStable();
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    root
      .querySelector('zd-fab')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, isComposing: true }),
      );
    const cancelled = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    cancelled.preventDefault();
    get('#action').dispatchEvent(cancelled);
    expect(h.fab().expanded()).toBe(true);
    get('#action').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    get('#action').dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: trigger }),
    );
    get('#action').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await f.whenStable();
    expect(h.fab().expanded()).toBe(false);
    get('#action').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    h.fab().show();
    await f.whenStable();
    trigger.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(h.fab().expanded()).toBe(true);
    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await f.whenStable();
    expect(h.fab().expanded()).toBe(false);
    h.fab().show();
    await f.whenStable();
    get('#action').dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: get('#outside') }),
    );
    await f.whenStable();
    expect(h.fab().expanded()).toBe(false);
    f.destroy();
  });

  it('honors controlled rejection, external closing, disabled state, single mode and missing actions', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const h = f.componentInstance,
      root = f.nativeElement as HTMLElement;
    h.open.set(false);
    await f.whenStable();
    h.fab().show();
    await f.whenStable();
    expect(h.requests).toEqual([true]);
    expect(h.fab().expanded()).toBe(false);
    h.open.set(true);
    await f.whenStable();
    h.fab().hide();
    await f.whenStable();
    expect(h.fab().expanded()).toBe(true);
    root.querySelector<HTMLElement>('#action')!.focus();
    h.open.set(false);
    await f.whenStable();
    expect(document.activeElement).toBe(root.querySelector('.zd-fab-trigger'));
    h.disabled.set(true);
    await f.whenStable();
    h.fab().toggle();
    h.fab().show();
    expect(h.fab().expanded()).toBe(false);
    h.disabled.set(false);
    h.arrangement.set('single');
    await f.whenStable();
    h.fab().toggle();
    h.fab().show();
    expect(h.mains).toBe(1);
    expect(root.querySelector('.zd-fab-trigger')!.hasAttribute('aria-expanded')).toBe(false);
    f.destroy();
    const single = TestBed.createComponent(ZdFab);
    single.componentRef.setInput('label', 'Single');
    await single.whenStable();
    let main = 0;
    single.componentInstance.mainAction.subscribe(() => main++);
    single.nativeElement.querySelector('button').click();
    expect(main).toBe(1);
    expect(single.componentInstance.expanded()).toBe(false);
    single.componentInstance.show();
    single.componentInstance.toggle();
    single.destroy();
  });
  it('retains the action query when a consumer overrides the presentation template', async () => {
    TestBed.overrideComponent(ZdFab, { add: { host: { 'data-custom-presentation': 'true' } } });
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    f.componentInstance.fab().show();
    await f.whenStable();
    expect(f.nativeElement.querySelector('.zd-fab-actions').hidden).toBe(false);
    f.destroy();
  });
});
