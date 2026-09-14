import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideZordonUi } from '@pranxy/zordon-ui';
import {
  ZdSwap,
  ZdSwapInput,
  ZdSwapOn,
  ZdSwapOff,
  ZdSwapIndeterminate,
  type ZdSwapEffect,
} from './swap';

@Component({
  imports: [ZdSwap, ZdSwapInput, ZdSwapOn, ZdSwapOff, ZdSwapIndeterminate, ReactiveFormsModule],
  template: `
    <button
      type="button"
      zdSwap
      class="consumer"
      [active]="active()"
      [indeterminate]="mixed()"
      [effect]="effect()"
      [disabled]="disabled()"
      [readOnly]="readOnly()"
      (activeChange)="requests.push($event)"
      aria-label="Mute"
    >
      <span zdSwapOn>On</span><span zdSwapOff>Off</span><span zdSwapIndeterminate>Mixed</span>
    </button>
    <label zdSwap [readOnly]="readOnly()">
      <input
        type="checkbox"
        zdSwapInput
        [formControl]="checked"
        [indeterminate]="mixed()"
        aria-label="Enabled"
      />
      <span zdSwapOn>Yes</span><span zdSwapOff>No</span><span zdSwapIndeterminate>Some</span>
    </label>
    <div zdSwap [active]="active()" [indeterminate]="mixed()">
      <span zdSwapOn>Day</span><span zdSwapOff>Night</span>
    </div>
  `,
})
class Host {
  readonly active = signal(false);
  readonly mixed = signal(false);
  readonly disabled = signal(false);
  readonly readOnly = signal(false);
  readonly effect = signal<ZdSwapEffect>('fade');
  readonly checked = new FormControl(false, { nonNullable: true });
  readonly requests: boolean[] = [];
}

describe('ZdSwap', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'dui-' } })],
    }),
  );
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      element,
      button: element.querySelector('button')!,
      input: element.querySelector('input')!,
    };
  }
  it('requests controlled button state without mutation and retains classes, parts and native naming', async () => {
    const { fixture, host, element, button } = await setup();
    expect(button.className).toContain('consumer');
    expect(button.className).toContain('dui-swap');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    button.click();
    expect(host.requests).toEqual([true]);
    expect(host.active()).toBe(false);
    host.active.set(true);
    host.effect.set('rotate');
    await fixture.whenStable();
    expect(button.className).toContain('dui-swap-active');
    expect(button.className).toContain('dui-swap-rotate');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    button.click();
    expect(host.requests).toEqual([true, false]);
    host.effect.set('flip');
    host.mixed.set(true);
    await fixture.whenStable();
    expect(button.className).toContain('dui-swap-flip');
    expect(button.className).not.toContain('dui-swap-rotate');
    expect(button.getAttribute('aria-pressed')).toBe('mixed');
    expect(button.getAttribute('data-zd-swap-state')).toBe('indeterminate');
    host.effect.set('custom');
    await fixture.whenStable();
    expect(button.className).not.toContain('dui-swap-flip');
    for (const part of element.querySelectorAll('[data-zd-swap-part]')) {
      expect(part.getAttribute('aria-hidden')).toBe('true');
      expect(part.hasAttribute('inert')).toBe(true);
      expect(part.className).toContain('dui-swap-');
    }
    expect(element.querySelector('div')!.hasAttribute('aria-pressed')).toBe(false);
  });
  it('preserves Forms, native indeterminate and reset without emitting button requests', async () => {
    const { fixture, host, input } = await setup();
    input.click();
    expect(host.checked.value).toBe(true);
    expect(host.requests).toEqual([]);
    host.checked.setValue(false);
    host.mixed.set(true);
    await fixture.whenStable();
    expect(input.checked).toBe(false);
    expect(input.indeterminate).toBe(true);
    input.click();
    expect(input.indeterminate).toBe(false);
    expect(host.checked.value).toBe(true);
    input.dispatchEvent(new Event('blur'));
    expect(host.checked.touched).toBe(true);
    host.checked.reset();
    expect(input.checked).toBe(false);
    host.checked.disable();
    input.click();
    expect(input.disabled).toBe(true);
    expect(host.checked.value).toBe(false);
  });
  it('blocks read-only native activation, supports programmatic updates, and removes capture listeners', async () => {
    const { fixture, host, button, input } = await setup();
    host.readOnly.set(true);
    await fixture.whenStable();
    button.click();
    input.click();
    expect(host.requests).toEqual([]);
    expect(host.checked.value).toBe(false);
    expect(input.checked).toBe(false);
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    // Even Angular's direct event dispatch (which bypasses native capture) rejects the request.
    fixture.debugElement
      .query(By.css('button'))
      .triggerEventHandler('click', new MouseEvent('click'));
    expect(host.requests).toEqual([]);
    host.active.set(true);
    host.checked.setValue(true);
    await fixture.whenStable();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(input.checked).toBe(true);
    host.readOnly.set(false);
    host.disabled.set(true);
    await fixture.whenStable();
    button.dispatchEvent(new MouseEvent('click'));
    expect(host.requests).toEqual([]);
    expect(input.hasAttribute('aria-readonly')).toBe(false);
    host.readOnly.set(true);
    await fixture.whenStable();
    fixture.destroy();
    const event = new MouseEvent('click', { cancelable: true });
    button.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
