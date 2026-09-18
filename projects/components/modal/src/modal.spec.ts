import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { ɵZdOverlayCoordinator } from '@pranxy/zordon-ui/internal-overlay';
import {
  ZdModal,
  ZdModalRef,
  ZdModalService,
  type ZdModalContext,
  type ZdModalOptions,
} from './modal';

@Component({
  imports: [ZdModal],
  template: `<button id="opener">Open</button
    ><ng-template #content let-modal
      ><input id="field" /><button id="finish" (click)="modal.close(7)">Finish</button>
      <form method="dialog"><button value="native">Submit</button></form></ng-template
    >
    @if (present()) {
      <ng-template
        zdModal
        [open]="open()"
        [options]="options()"
        (openChange)="requests.push($event)"
        (closed)="results.push($event)"
        let-modal
        ><button (click)="modal.close(9)">Close controlled</button></ng-template
      >
    }`,
})
class Host {
  readonly template = viewChild.required<TemplateRef<ZdModalContext<number>>>('content');
  readonly container = inject(ViewContainerRef);
  readonly present = signal(true);
  readonly open = signal(false);
  readonly options = signal<ZdModalOptions<number>>({ label: 'Controlled', backend: 'overlay' });
  requests: boolean[] = [];
  results: unknown[] = [];
}

describe('Modal request lifetime', () => {
  it('handles values, guards, duplicate requests, forced teardown and async races', async () => {
    const dispose = vi.fn();
    const ref = new ZdModalRef<number>({ label: 'Simple' }, dispose);
    expect(await ref.close(4)).toBe(true);
    expect(await ref.result).toEqual({ reason: 'close', value: 4 });
    expect(await ref.close()).toBe(false);
    expect(await ref.confirm()).toBe(false);
    ref.destroy();
    ref.accept({ reason: 'close' });
    expect(dispose).toHaveBeenCalledTimes(1);
    const veto = new ZdModalRef({ label: 'Veto', beforeClose: () => false }, vi.fn());
    expect(await veto.close()).toBe(false);
    veto.destroy();
    expect(await veto.result).toEqual({ reason: 'destroy' });
    const failure = new ZdModalRef(
      {
        label: 'Failure',
        beforeClose: () => {
          throw new Error('Guard');
        },
      },
      vi.fn(),
    );
    expect(await failure.close()).toBe(false);
    expect(failure.error()).toBeInstanceOf(Error);
    failure.destroy();
    let resolve!: (value: boolean) => void;
    const race = new ZdModalRef(
      { label: 'Race', beforeClose: () => new Promise<boolean>(r => (resolve = r)) },
      vi.fn(),
    );
    const closing = race.close();
    expect(race.pending()).toBe(true);
    expect(await race.close()).toBe(false);
    expect(await race.confirm()).toBe(false);
    race.destroy();
    resolve(true);
    expect(await closing).toBe(false);
    const accepted = new ZdModalRef<number>({ label: 'Accepted' }, vi.fn());
    accepted.accept({ reason: 'submit', value: 2 });
    expect((await accepted.result).value).toBe(2);
  });
  it('runs confirmation once, preserves failures for retry and ignores late completion after teardown', async () => {
    let resolve!: () => void;
    const action = vi.fn(() => new Promise<void>(r => (resolve = r)));
    const ref = new ZdModalRef({ label: 'Confirm', action }, vi.fn());
    const confirming = ref.confirm();
    expect(await ref.confirm()).toBe(false);
    expect(action).toHaveBeenCalledTimes(1);
    ref.destroy();
    resolve();
    expect(await confirming).toBe(false);
    const failed = new ZdModalRef(
      { label: 'Retry', action: () => Promise.reject(new Error('Failed')) },
      vi.fn(),
    );
    expect(await failed.confirm()).toBe(false);
    expect(failed.pending()).toBe(false);
    expect(failed.error()).toBeInstanceOf(Error);
    failed.destroy();
    const simple = new ZdModalRef({ label: 'Confirm' }, vi.fn());
    expect(await simple.confirm()).toBe(true);
    expect((await simple.result).reason).toBe('confirm');
  });
});

describe('Modal rendering', () => {
  beforeEach(() => {
    vi.spyOn(InteractivityChecker.prototype, 'isTabbable').mockImplementation(
      element => element.tagName === 'INPUT',
    );
    vi.spyOn(InteractivityChecker.prototype, 'isFocusable').mockReturnValue(true);
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = true;
      },
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLDialogElement.prototype as unknown as { showModal?: unknown }).showModal;
  });
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, host: fixture.componentInstance, service: TestBed.inject(ZdModalService) };
  }
  it('opens native dialogs, handles cancel/backdrop/submit, nesting and owner cleanup', async () => {
    const { fixture, host, service } = await setup();
    const opener = fixture.nativeElement.querySelector('#opener') as HTMLElement;
    opener.focus();
    const first = service.open(
      host.template(),
      { label: 'Native', backend: 'native', description: 'Editor' },
      host.container,
    );
    await fixture.whenStable();
    let dialog = document.querySelector('dialog')!;
    expect(dialog.open).toBe(true);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    const nested = service.open(null, {
      label: 'Nested',
      initialFocus: 'dialog',
      placement: 'top',
    });
    await fixture.whenStable();
    expect(document.querySelectorAll('dialog').length).toBe(2);
    await nested.close();
    await fixture.whenStable();
    expect(first.closed()).toBe(false);
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await fixture.whenStable();
    expect(first.closed()).toBe(true);
    expect(document.activeElement).toBe(opener);
    const locked = service.open(
      host.template(),
      { label: 'Locked', closeOnEscape: false, closeOnBackdrop: false },
      host.container,
    );
    await fixture.whenStable();
    dialog = document.querySelector('dialog')!;
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    dialog.dispatchEvent(new MouseEvent('pointerdown', { clientX: -1 }));
    dialog.dispatchEvent(new MouseEvent('click', { clientX: -1 }));
    expect(locked.closed()).toBe(false);
    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    for (const xy of [
      { clientX: 1 },
      { clientY: -1 },
      { clientY: 1 },
      { clientX: 0, clientY: 0 },
    ]) {
      dialog.dispatchEvent(new MouseEvent('pointerdown', xy));
      dialog.dispatchEvent(new MouseEvent('click', xy));
    }
    dialog.querySelector('input')!.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    dialog.dispatchEvent(new MouseEvent('click', { clientX: 0 }));
    const form = dialog.querySelector('form')!;
    form.setAttribute('method', 'post');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(locked.closed()).toBe(false);
    form.setAttribute('method', 'dialog');
    form.dispatchEvent(
      new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true,
        submitter: form.querySelector('button'),
      }),
    );
    await fixture.whenStable();
    expect((await locked.result).reason).toBe('submit');
    const backdrop = service.open(null, { label: 'Backdrop' });
    await fixture.whenStable();
    dialog = document.querySelector('dialog')!;
    for (const xy of [{ clientX: -1 }, { clientX: 1 }, { clientY: -1 }, { clientY: 1 }]) {
      dialog.dispatchEvent(new MouseEvent('click', xy));
    }
    dialog.dispatchEvent(new MouseEvent('pointerdown', { clientX: -1 }));
    dialog.dispatchEvent(new MouseEvent('click', { clientX: -1 }));
    await fixture.whenStable();
    expect((await backdrop.result).reason).toBe('backdrop');
    const external = service.open(null, { label: 'External' });
    await fixture.whenStable();
    document.querySelector('dialog')!.dispatchEvent(new Event('close'));
    await fixture.whenStable();
    expect(external.closed()).toBe(true);
    const parent = service.open(null, { label: 'Parent' });
    await fixture.whenStable();
    const child = service.open(null, { label: 'Child' });
    await fixture.whenStable();
    parent.destroy();
    expect(child.closed()).toBe(true);
    expect(document.documentElement.classList.contains('cdk-global-scrollblock')).toBe(false);
    fixture.destroy();
  });
  it('opens overlay fallback, honors dismissal policies, errors, body ownership and queued confirmation', async () => {
    const { fixture, host, service } = await setup();
    const saved = document.createElement('aside');
    saved.inert = true;
    saved.setAttribute('aria-hidden', 'false');
    document.body.append(saved);
    const spy = vi.spyOn(TestBed.inject(ɵZdOverlayCoordinator), 'open');
    const ref = service.open(
      host.template(),
      { label: 'Fallback', backend: 'overlay', placement: 'end', beforeClose: () => false },
      host.container,
    );
    await fixture.whenStable();
    expect(document.querySelector('dialog')!.getAttribute('data-native')).toBe('false');
    const config = spy.mock.calls.at(-1)![0];
    config.canClose!('escape');
    config.canClose!('backdrop');
    config.canClose!('outside-pointer');
    await fixture.whenStable();
    expect(ref.closed()).toBe(false);
    config.onCloseRequest('destroy');
    await fixture.whenStable();
    expect(saved.inert).toBe(true);
    expect(saved.getAttribute('aria-hidden')).toBe('false');
    const noDismiss = service.open(null, {
      label: 'No dismiss',
      backend: 'overlay',
      closeOnEscape: false,
      closeOnBackdrop: false,
    });
    await fixture.whenStable();
    spy.mock.calls.at(-1)![0].canClose!('escape');
    spy.mock.calls.at(-1)![0].canClose!('backdrop');
    expect(noDismiss.closed()).toBe(false);
    saved.inert = false;
    saved.setAttribute('aria-hidden', 'consumer');
    noDismiss.destroy();
    expect(saved.getAttribute('aria-hidden')).toBe('consumer');
    expect(saved.inert).toBe(false);
    saved.remove();
    const promise = service.confirm({
      label: 'Confirm',
      backend: 'overlay',
      confirmLabel: 'Yes',
      cancelLabel: 'No',
      message: 'Question',
      errorMessage: 'Retry',
      action: () => Promise.reject('Failure'),
    });
    await fixture.whenStable();
    document.querySelectorAll<HTMLButtonElement>('dialog button')[1].click();
    await fixture.whenStable();
    expect(document.querySelector('[role=alert]')!.textContent?.trim()).toBe('Retry');
    document.querySelector<HTMLButtonElement>('dialog button')!.click();
    await fixture.whenStable();
    expect(await promise).toBe(false);
    const q1 = service.enqueue(null, { label: 'First', backend: 'overlay' });
    const q2 = service.enqueue(null, { label: 'Second', backend: 'overlay' });
    await Promise.resolve();
    await fixture.whenStable();
    document.querySelectorAll<HTMLButtonElement>('dialog button')[1].click();
    await fixture.whenStable();
    expect((await q1).reason).toBe('confirm');
    await fixture.whenStable();
    document.querySelector<HTMLButtonElement>('dialog button')!.click();
    await fixture.whenStable();
    expect((await q2).reason).toBe('cancel');
    const active = service.open(null, { label: 'Destroyed service' });
    await fixture.whenStable();
    fixture.destroy();
    TestBed.resetTestingModule();
    expect(active.closed()).toBe(true);
    expect(() => service.open(null, { label: 'Late' })).toThrow();
    await expect(service.enqueue(null, { label: 'Late queued' })).rejects.toThrow();
  });
  it('uses the auto fallback, validates native support and handles disconnected restore targets', async () => {
    const { fixture, service } = await setup();
    delete (HTMLDialogElement.prototype as unknown as { showModal?: unknown }).showModal;
    expect(() => service.open(null, { label: 'Native required', backend: 'native' })).toThrow();
    const detached = document.createElement('button');
    document.body.append(detached);
    detached.focus();
    const ref = service.open(null, { label: 'Auto', size: 'full', placement: 'bottom' });
    await fixture.whenStable();
    detached.remove();
    ref.destroy();
    const nothing = service.open(null, {
      label: 'Nothing',
      initialFocus: 'dialog',
      placement: 'start',
    });
    nothing.destroy();
    await fixture.whenStable();
    fixture.destroy();
  });
  it('reports default errors and tolerates a document with no focused element', async () => {
    const { fixture, service } = await setup();
    const active = vi.spyOn(document, 'activeElement', 'get').mockReturnValue(null);
    const ref = service.open(null, {
      label: 'Failure',
      beforeClose: () => {
        throw new Error('Failure');
      },
    });
    await fixture.whenStable();
    await ref.close();
    await fixture.whenStable();
    expect(document.querySelector('[role=alert]')!.textContent).toContain('Please try again');
    ref.destroy();
    active.mockRestore();
    fixture.destroy();
  });
  it('rolls back a failed attachment and releases a service dialog when its view owner is destroyed', async () => {
    const { fixture, host, service } = await setup();
    const coordinator = TestBed.inject(ɵZdOverlayCoordinator);
    const failure = vi.spyOn(coordinator, 'open').mockImplementationOnce(() => {
      throw new Error('Attach failed');
    });
    expect(() => service.open(host.template(), { label: 'Failed' }, host.container)).toThrow(
      'Attach failed',
    );
    failure.mockRestore();
    const ref = service.open(host.template(), { label: 'Owned' }, host.container);
    await fixture.whenStable();
    fixture.destroy();
    expect(ref.closed()).toBe(true);
  });
  it('keeps declarative control with its consumer, reports accepted results and disposes removed owners', async () => {
    const { fixture, host } = await setup();
    host.open.set(true);
    await fixture.whenStable();
    document.querySelector<HTMLButtonElement>('dialog button')!.click();
    await fixture.whenStable();
    expect(host.requests).toEqual([false]);
    expect(document.querySelector('dialog')).not.toBeNull();
    host.open.set(false);
    await fixture.whenStable();
    expect(host.results).toEqual([{ reason: 'close', value: 9 }]);
    host.options.set({ label: 'Veto', backend: 'overlay', beforeClose: () => false });
    host.open.set(true);
    await fixture.whenStable();
    document.querySelector<HTMLButtonElement>('dialog button')!.click();
    await fixture.whenStable();
    expect(host.requests).toEqual([false]);
    host.open.set(false);
    await fixture.whenStable();
    expect(host.results.at(-1)).toEqual({ reason: 'close' });
    host.options.set({ label: 'Accept', backend: 'overlay', beforeClose: () => true });
    host.open.set(true);
    await fixture.whenStable();
    document.querySelector<HTMLButtonElement>('dialog button')!.click();
    await fixture.whenStable();
    host.present.set(false);
    await fixture.whenStable();
    expect(document.querySelector('dialog')).toBeNull();
    fixture.destroy();
    expect(ZdModal.ngTemplateContextGuard(null!, {})).toBe(true);
  });
});

describe('Modal server boundary', () => {
  it('rejects queued opening after its view owner is destroyed without leaving a portal or lock', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const service = TestBed.inject(ZdModalService);
    const owner = fixture.componentInstance.container;
    const first = service.enqueue(null, { label: 'First owned', backend: 'overlay' }, owner);
    const second = service.enqueue(null, { label: 'Second owned', backend: 'overlay' }, owner);
    const rejected = expect(second).rejects.toThrow();
    await Promise.resolve();
    await fixture.whenStable();
    fixture.destroy();
    expect((await first).reason).toBe('destroy');
    await rejected;
    expect(document.querySelector('.zd-modal-pane')).toBeNull();
  });
  it('rejects imperative server opening before creating a portal', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    expect(() => TestBed.inject(ZdModalService).open(null, { label: 'Server' })).toThrow(/browser/);
  });
});
