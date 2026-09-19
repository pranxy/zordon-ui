import { Component, PLATFORM_ID, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdToastOutlet, ZdToastService, type ZdToastContext } from './toast';
@Component({
  imports: [ZdToastOutlet],
  template: `<ng-template #custom let-item
      ><strong>{{ item.message }}</strong></ng-template
    ><zd-toast-outlet [limit]="2" />`,
})
class Host {
  readonly custom = viewChild.required<TemplateRef<ZdToastContext>>('custom');
}
describe('Toast', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.querySelectorAll('[data-toast-test]').forEach(element => element.remove());
  });
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return {
      fixture,
      service: TestBed.inject(ZdToastService),
      host: fixture.nativeElement as HTMLElement,
    };
  }
  it('validates options, applies defaults, deduplicates and bounds pending state', () => {
    const service = TestBed.inject(ZdToastService);
    for (const options of [
      { message: '' },
      { message: 'x', key: '' },
      { message: 'x', dismissLabel: '' },
      { message: 'x', action: { label: '', errorMessage: 'Failed', run: () => {} } },
      { message: 'x', action: { label: 'Run', errorMessage: '', run: () => {} } },
    ])
      expect(() => service.show(options)).toThrow(RangeError);
    for (const duration of [-1, NaN, Infinity, 2147483648])
      expect(() => service.show({ message: 'x', duration })).toThrow(RangeError);
    const id = service.show({ message: 'Saved', key: 'save' });
    expect(service.items()[0]).toMatchObject({
      duration: 5000,
      position: 'bottom-end',
      priority: 'polite',
      dismissLabel: 'Dismiss notification',
      pending: false,
    });
    expect(service.show({ message: 'Duplicate', key: 'save' })).toBe(id);
    const second = service.show({ message: 'Other', key: 'other' });
    expect(() => service.update(second, { message: 'Conflict', key: 'save' })).toThrow(RangeError);
    expect(service.update(id, { message: 'Updated', key: 'save', duration: 0 })).toBe(true);
    expect(service.items()[0].revision).toBe(1);
    expect(service.update('missing', { message: 'x' })).toBe(false);
    expect(service.dismiss('missing')).toBe(false);
    for (let index = 2; index < 100; index++) service.show({ message: `Message ${index}` });
    expect(() => service.show({ message: 'Overflow' })).toThrow(RangeError);
    expect(service.show({ message: 'Duplicate at capacity', key: 'save' })).toBe(id);
    service.clear();
    expect(service.items()).toEqual([]);
  });
  it('queues by visible limit, promotes messages, projects templates and owns one announcement path', () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const { fixture, service, host } = setup();
    const one = service.show({ message: 'One', duration: 0, position: 'top-start' });
    const two = service.show({
      message: 'Two',
      duration: 0,
      priority: 'assertive',
      position: 'top-start',
      template: fixture.componentInstance.custom(),
    });
    service.show({ message: 'Three', duration: 0, priority: 'off' });
    fixture.detectChanges();
    fixture.detectChanges();
    expect(host.querySelectorAll('zd-alert')).toHaveLength(2);
    expect(host.querySelector('.zd-toast-stack')?.classList.contains('tw:d-toast-top')).toBe(true);
    expect(host.querySelector('strong')?.textContent).toBe('Two');
    expect(host.querySelector('[role="status"]')?.textContent).toContain('One');
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Two');
    expect(host.querySelector('zd-alert')?.hasAttribute('role')).toBe(false);
    service.update(one, { message: 'Changed', duration: 0 });
    fixture.detectChanges();
    fixture.detectChanges();
    expect(host.querySelector('[role="status"]')?.textContent).toContain('Changed');
    service.dismiss(two);
    fixture.detectChanges();
    fixture.detectChanges();
    expect(host.textContent).toContain('Three');
    expect(host.querySelector('[role="status"]')?.textContent).toBe('');
    service.clear();
    fixture.detectChanges();
    fixture.detectChanges();
    expect(host.querySelectorAll('zd-alert')).toHaveLength(0);
    expect(host.querySelector('[role="alert"]')?.textContent).toBe('');
    expect(() => TestBed.createComponent(ZdToastOutlet)).toThrow(/one Toast outlet/);
    fixture.destroy();
    expect(service.items()).toEqual([]);
  });
  it('does not announce initial/server content and validates visible limits', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const service = TestBed.inject(ZdToastService);
    const id = service.show({ message: 'Server message', duration: 10 });
    const fixture = TestBed.createComponent(ZdToastOutlet);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toBe('');
    expect(fixture.nativeElement.textContent).toContain('Server message');
    for (const limit of [0, 21, 1.5, NaN])
      expect(() => fixture.componentRef.setInput('limit', limit)).toThrow(RangeError);
    service.dismiss(id);
    fixture.detectChanges();
    fixture.destroy();
    TestBed.resetTestingModule();
    const browserService = TestBed.inject(ZdToastService);
    browserService.show({ message: 'Initial message', duration: 0 });
    const browser = TestBed.createComponent(ZdToastOutlet);
    browser.detectChanges();
    browser.detectChanges();
    expect(browser.nativeElement.querySelector('[role="status"]').textContent).toBe('');
  });
  it('runs actions once, handles failure and ignores settlement after dismissal or replacement', async () => {
    const service = TestBed.inject(ZdToastService);
    expect(await service.act('missing')).toBe(false);
    const plain = service.show({ message: 'Plain' });
    expect(await service.act(plain)).toBe(false);
    let finish!: () => void;
    const action = {
      label: 'Undo',
      errorMessage: 'Undo failed',
      run: vi.fn(() => new Promise<void>(resolve => (finish = resolve))),
    };
    const id = service.show({ message: 'Deleted', action });
    expect(service.items().find(item => item.id === id)?.duration).toBe(0);
    const pending = service.act(id);
    expect(await service.act(id)).toBe(false);
    finish();
    expect(await pending).toBe(true);
    expect(action.run).toHaveBeenCalledOnce();
    const failing = service.show({
      message: 'Try',
      action: {
        label: 'Retry',
        errorMessage: 'Failed',
        run: () => {
          throw new Error('failure');
        },
      },
    });
    expect(await service.act(failing)).toBe(false);
    expect(service.items().find(item => item.id === failing)).toMatchObject({
      message: 'Failed',
      pending: false,
      priority: 'assertive',
      duration: 0,
    });
    const stale = service.show({ message: 'Stale', action });
    const staleWork = service.act(stale);
    service.update(stale, { message: 'Replacement', duration: 0 });
    finish();
    await staleWork;
    expect(service.items().find(item => item.id === stale)?.message).toBe('Replacement');
    let reject!: () => void;
    const dismissed = service.show({
      message: 'Dismissed',
      action: {
        label: 'Run',
        errorMessage: 'Failed',
        run: () => new Promise<void>((_, fail) => (reject = () => fail('failure'))),
      },
    });
    const dismissedWork = service.act(dismissed);
    service.dismiss(dismissed);
    reject();
    expect(await dismissedWork).toBe(false);
  });
  it('wires action and close controls while pending actions suspend the timer', async () => {
    const { fixture, service, host } = setup();
    let finish!: () => void;
    service.show({
      message: 'Actionable',
      duration: 1000,
      action: {
        label: 'Run',
        errorMessage: 'Failed',
        run: () => new Promise<void>(resolve => (finish = resolve)),
      },
    });
    fixture.detectChanges();
    const button = host.querySelector('.zd-toast-action') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-busy')).toBe('true');
    finish();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(service.items()).toEqual([]);
    service.show({ message: 'Closable', duration: 0 });
    fixture.detectChanges();
    (host.querySelector('.zd-alert-close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(service.items()).toEqual([]);
  });
  it('tracks task success/error and never resurrects dismissed or manually updated work', async () => {
    const service = TestBed.inject(ZdToastService);
    const flow = {
      loading: { message: 'Working', key: 'shared' },
      success: (value: number) => ({ message: `Done ${value}` }),
      error: () => ({ message: 'Failed', duration: 0 }),
    };
    expect(await service.track(Promise.resolve(42), flow)).toBe(42);
    expect(service.items()[0].message).toBe('Done 42');
    await expect(service.track(Promise.reject('failure'), flow)).rejects.toBe('failure');
    expect(service.items()[1].message).toBe('Failed');
    let finish!: (value: number) => void;
    const dismissed = service.track(new Promise<number>(resolve => (finish = resolve)), flow);
    service.dismiss(service.items()[2].id);
    finish(1);
    await dismissed;
    expect(service.items()).toHaveLength(2);
    let reject!: (error: unknown) => void;
    const replaced = service.track(new Promise<number>((_, fail) => (reject = fail)), flow);
    service.update(service.items()[2].id, { message: 'Manual', duration: 0 });
    reject('failure');
    await expect(replaced).rejects.toBe('failure');
    expect(service.items()[2].message).toBe('Manual');
  });
  it('restores focus only when a dismissed toast owns it, with an outlet fallback', () => {
    const { fixture, service, host } = setup();
    document.body.append(host);
    const trigger = document.createElement('button');
    trigger.setAttribute('data-toast-test', '');
    document.body.append(trigger);
    trigger.focus();
    const id = service.show({ message: 'Focus', duration: 0 });
    fixture.detectChanges();
    (document.getElementById(id)!.querySelector('button') as HTMLElement).focus();
    service.dismiss(id);
    expect(document.activeElement).toBe(trigger);
    fixture.detectChanges();
    trigger.focus();
    const fallback = service.show({ message: 'Fallback', duration: 0 });
    fixture.detectChanges();
    trigger.remove();
    (document.getElementById(fallback)!.querySelector('button') as HTMLElement).focus();
    service.dismiss(fallback);
    expect(document.activeElement).toBe(host.querySelector('zd-toast-outlet'));
    fixture.destroy();
    host.remove();
  });
});
