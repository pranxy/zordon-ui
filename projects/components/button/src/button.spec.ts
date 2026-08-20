import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, type TestModuleMetadata } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { withButtonDefaults } from './button-defaults';
import { ZdButton } from './button';

@Component({
  imports: [ZdButton],
  template: `
    <button
      zdButton
      class="consumer-static"
      [class.consumer-dynamic]="consumerClass()"
      [color]="color()"
      [variant]="variant()"
      [size]="size()"
      [layout]="layout()"
      [active]="active()"
      [pressed]="pressed()"
      [loading]="loading()"
    >
      Save
    </button>
  `,
})
class TestButtonHost {
  readonly color = signal<'primary' | undefined>(undefined);
  readonly variant = signal<'outline' | undefined>(undefined);
  readonly size = signal<'sm' | undefined>(undefined);
  readonly layout = signal<'wide' | undefined>(undefined);
  readonly active = signal(false);
  readonly pressed = signal<boolean | null | undefined>(undefined);
  readonly loading = signal(false);
  readonly consumerClass = signal(true);
}

@Component({
  imports: [ZdButton],
  template: `
    <a zdButton href="/settings" tabindex="2" [zdDisabled]="disabled()" [loading]="loading()">
      Settings
    </a>
  `,
})
class TestLinkHost {
  readonly disabled = signal(false);
  readonly loading = signal(false);
}

@Component({
  imports: [ZdButton],
  template: `<button zdButton disabled>Save</button>`,
})
class TestNativeDisabledButton {}

@Component({
  imports: [ZdButton],
  template: `<button zdButton [zdDisabled]="true">Save</button>`,
})
class TestInvalidDisabledButton {}

function createButtonFixture(
  providers: NonNullable<TestModuleMetadata['providers']> = [],
): ComponentFixture<TestButtonHost> {
  TestBed.configureTestingModule({
    imports: [TestButtonHost],
    providers,
  });
  const fixture = TestBed.createComponent(TestButtonHost);
  fixture.detectChanges();
  return fixture;
}

function buttonOf(fixture: ComponentFixture<TestButtonHost>): HTMLButtonElement {
  return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
}

describe('ZdButton', () => {
  it('adds base and explicit modifiers while preserving consumer classes', () => {
    const fixture = createButtonFixture();
    const button = buttonOf(fixture);

    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.variant.set('outline');
    fixture.componentInstance.size.set('sm');
    fixture.componentInstance.layout.set('wide');
    fixture.componentInstance.active.set(true);
    fixture.detectChanges();

    for (const token of [
      'btn',
      'btn-primary',
      'btn-outline',
      'btn-sm',
      'btn-wide',
      'btn-active',
      'consumer-static',
      'consumer-dynamic',
    ]) {
      expect(button.classList.contains(token)).toBe(true);
    }
  });

  it('resolves omitted, application, local, and reset defaults without leaking stale classes', () => {
    const fixture = createButtonFixture([
      provideZordonUi({}, withButtonDefaults({ color: 'secondary', size: 'lg' })),
    ]);
    const button = buttonOf(fixture);

    expect(button.classList.contains('btn-secondary')).toBe(true);
    expect(button.classList.contains('btn-lg')).toBe(true);

    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.size.set('sm');
    fixture.detectChanges();

    expect(button.classList.contains('btn-primary')).toBe(true);
    expect(button.classList.contains('btn-secondary')).toBe(false);
    expect(button.classList.contains('btn-sm')).toBe(true);
    expect(button.classList.contains('btn-lg')).toBe(false);

    fixture.componentInstance.color.set(undefined);
    fixture.componentInstance.size.set(undefined);
    fixture.detectChanges();

    expect(button.classList.contains('btn-secondary')).toBe(true);
    expect(button.classList.contains('btn-lg')).toBe(true);
    expect(button.classList.contains('btn-primary')).toBe(false);
    expect(button.classList.contains('btn-sm')).toBe(false);
  });

  it('sets and clears only controlled pressed state', () => {
    const fixture = createButtonFixture();
    const button = buttonOf(fixture);

    expect(button.hasAttribute('aria-pressed')).toBe(false);

    fixture.componentInstance.pressed.set(true);
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');

    fixture.componentInstance.pressed.set(false);
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('false');

    fixture.componentInstance.pressed.set(null);
    fixture.detectChanges();
    expect(button.hasAttribute('aria-pressed')).toBe(false);
  });

  it('keeps native disabled state authoritative without adding synthetic ARIA state', async () => {
    await TestBed.configureTestingModule({ imports: [TestNativeDisabledButton] }).compileComponents();
    const fixture = TestBed.createComponent(TestNativeDisabledButton);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.classList.contains('btn')).toBe(true);
    expect(button.classList.contains('btn-disabled')).toBe(false);
    expect(button.hasAttribute('aria-disabled')).toBe(false);
  });

  it('guards a disabled link without removing its href, tabindex, or event propagation', async () => {
    await TestBed.configureTestingModule({ imports: [TestLinkHost] }).compileComponents();
    const fixture = TestBed.createComponent(TestLinkHost);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    let observedDefaultPrevented = false;
    link.addEventListener('click', (event) => {
      observedDefaultPrevented = event.defaultPrevented;
    });

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const accepted = link.dispatchEvent(event);

    expect(accepted).toBe(false);
    expect(observedDefaultPrevented).toBe(true);
    expect(link.getAttribute('href')).toBe('/settings');
    expect(link.getAttribute('tabindex')).toBe('2');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.classList.contains('btn-disabled')).toBe(true);
  });

  it('uses loading as a focusable presentation guard without suppressing consumer listeners', () => {
    const fixture = createButtonFixture();
    const button = buttonOf(fixture);
    let consumerEvents = 0;
    button.addEventListener('click', () => {
      consumerEvents += 1;
    });

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    expect(button.dispatchEvent(event)).toBe(false);
    expect(consumerEvents).toBe(1);
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.classList.contains('btn-disabled')).toBe(true);
  });

  it('does not prevent the default action of an enabled Button', () => {
    const fixture = createButtonFixture();
    const button = buttonOf(fixture);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    expect(button.dispatchEvent(event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });

  it('rejects link-only disabled state on a native button', async () => {
    await TestBed.configureTestingModule({ imports: [TestInvalidDisabledButton] }).compileComponents();
    const fixture = TestBed.createComponent(TestInvalidDisabledButton);

    expect(() => fixture.detectChanges()).toThrowError(/zdDisabled is supported only/);
  });

  it('uses complete configured prefix tokens', () => {
    const fixture = createButtonFixture([
      provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } }),
    ]);
    const button = buttonOf(fixture);

    fixture.componentInstance.color.set('primary');
    fixture.detectChanges();

    expect(button.classList.contains('tw:d-btn')).toBe(true);
    expect(button.classList.contains('tw:d-btn-primary')).toBe(true);
    expect(button.classList.contains('btn')).toBe(false);
  });
});
