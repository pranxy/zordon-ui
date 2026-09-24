import { Component, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdAlert, type ZdAlertDismissReason } from './alert';

@Component({
  imports: [ZdAlert],
  template: `<zd-alert
    [open]="open()"
    [autoDismiss]="delay()"
    dismissible
    dismissLabel="Close message"
    (openChange)="requests.push($event)"
    (dismissRequested)="reasons.push($event)"
    ><span zdAlertIcon>!</span>
    <h2 zdAlertTitle>Title</h2>
    <p>Message</p>
    <button zdAlertActions>Retry</button>
    <details zdAlertDetails>
      <summary>Details</summary>
      More information
    </details></zd-alert
  >`,
})
class Host {
  readonly open = signal(true);
  readonly delay = signal(0);
  readonly alert = viewChild.required(ZdAlert);
  requests: boolean[] = [];
  reasons: ZdAlertDismissReason[] = [];
}

describe('Alert', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it('projects anatomy, preserves native details, maps exact prefixed classes and live semantics', () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-' } })],
    });
    const fixture = TestBed.createComponent(ZdAlert);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.className).toBe('d-alert');
    expect(element.hasAttribute('role')).toBe(false);
    fixture.componentRef.setInput('color', 'warning');
    fixture.componentRef.setInput('variant', 'soft');
    fixture.componentRef.setInput('direction', 'vertical');
    fixture.componentRef.setInput('announcement', 'polite');
    fixture.detectChanges();
    expect(Array.from(element.classList).sort()).toEqual(
      ['d-alert', 'd-alert-warning', 'd-alert-soft', 'd-alert-vertical'].sort(),
    );
    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-atomic')).toBe('true');
    fixture.componentRef.setInput('announcement', 'assertive');
    fixture.detectChanges();
    expect(element.getAttribute('role')).toBe('alert');
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    expect(element.hidden).toBe(true);
    expect(element.hasAttribute('inert')).toBe(true);
    expect(element.hasAttribute('role')).toBe(false);
    const host = TestBed.createComponent(Host);
    host.detectChanges();
    expect(host.nativeElement.querySelector('.zd-alert-icon').textContent).toBe('!');
    expect(host.nativeElement.querySelector('.zd-alert-content h2').textContent).toBe('Title');
    expect(host.nativeElement.querySelector('.zd-alert-actions button').textContent).toBe('Retry');
    expect(host.nativeElement.querySelector('details summary').textContent).toBe('Details');
  });
  it('requests controlled dismissal once, preserves content until accepted and resets after reopen', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = fixture.nativeElement.querySelector('.zd-alert-close') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Close message');
    button.click();
    fixture.detectChanges();
    host.alert().dismiss();
    expect(host.requests).toEqual([false]);
    expect(host.reasons).toEqual(['close-button']);
    expect(fixture.nativeElement.querySelector('zd-alert').hidden).toBe(false);
    host.open.set(false);
    fixture.detectChanges();
    host.alert().dismiss();
    host.open.set(true);
    fixture.detectChanges();
    host.alert().dismiss();
    fixture.detectChanges();
    expect(host.reasons).toEqual(['close-button', 'api']);
  });
  it('counts only active browser time, pauses for focus/hover/visibility and emits one timeout', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    host.delay.set(1000);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('zd-alert') as HTMLElement;
    vi.advanceTimersByTime(200);
    element.dispatchEvent(new Event('pointerenter'));
    fixture.detectChanges();
    vi.advanceTimersByTime(2000);
    expect(host.requests).toEqual([]);
    element.dispatchEvent(new Event('pointerleave'));
    fixture.detectChanges();
    vi.advanceTimersByTime(200);
    element.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    vi.advanceTimersByTime(2000);
    element.dispatchEvent(
      new FocusEvent('focusout', { relatedTarget: element.querySelector('button') }),
    );
    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    expect(host.requests).toEqual([]);
    element.dispatchEvent(new FocusEvent('focusout'));
    fixture.detectChanges();
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange'));
    fixture.detectChanges();
    vi.advanceTimersByTime(2000);
    expect(host.requests).toEqual([]);
    hidden.mockReturnValue(false);
    document.dispatchEvent(new Event('visibilitychange'));
    fixture.detectChanges();
    vi.advanceTimersByTime(599);
    expect(host.requests).toEqual([]);
    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(host.reasons).toEqual(['timeout']);
    vi.advanceTimersByTime(5000);
    expect(host.requests).toEqual([false]);
    host.delay.set(100);
    fixture.detectChanges();
    vi.advanceTimersByTime(100);
    fixture.detectChanges();
    expect(host.reasons).toEqual(['timeout', 'timeout']);
    host.open.set(false);
    fixture.detectChanges();
    host.open.set(true);
    fixture.detectChanges();
    const remove = vi.spyOn(document, 'removeEventListener');
    fixture.destroy();
    vi.advanceTimersByTime(1000);
    expect(host.requests).toHaveLength(2);
    expect(remove).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });
  it('validates delays and never starts timers on the server', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(ZdAlert);
    for (const invalid of [-1, NaN, Infinity, 2147483648])
      expect(() => fixture.componentRef.setInput('autoDismiss', invalid)).toThrow(/autoDismiss/);
    fixture.componentRef.setInput('autoDismiss', '10');
    const requests: unknown[] = [];
    fixture.componentInstance.openChange.subscribe(value => requests.push(value));
    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    expect(requests).toEqual([]);
  });
});
