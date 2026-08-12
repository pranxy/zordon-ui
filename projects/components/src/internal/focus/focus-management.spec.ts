import { CdkMonitorFocus, CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, PLATFORM_ID, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

@Component({
  imports: [CdkMonitorFocus, CdkTrapFocus],
  template: `
    <button data-testid="trigger" type="button">Open region</button>
    @if (open()) {
      <section
        aria-label="Focus compatibility region"
        cdkTrapFocus
        cdkTrapFocusAutoCapture
        data-testid="region"
      >
        <button data-testid="first" type="button">First</button>
        <button cdkFocusInitial cdkMonitorElementFocus data-testid="initial" type="button">
          Initial
        </button>
        <button data-testid="last" type="button">Last</button>
      </section>
    }
  `,
})
class TestFocusRegion {
  readonly open = signal(false);
}

@Component({
  imports: [CdkMonitorFocus],
  template: `
    @if (open()) {
      <button cdkMonitorElementFocus data-testid="monitored" type="button">Monitored</button>
    }
  `,
})
class TestFocusMonitor {
  readonly open = signal(true);
}

describe('CDK focus management compatibility', () => {
  it('reports programmatic focus and removes monitor classes on destroy', () => {
    TestBed.configureTestingModule({ imports: [TestFocusMonitor] });
    const fixture = TestBed.createComponent(TestFocusMonitor);
    fixture.detectChanges();
    const monitored = fixture.nativeElement.querySelector(
      '[data-testid="monitored"]',
    ) as HTMLButtonElement;

    monitored.focus();
    expect(monitored.classList.contains('cdk-program-focused')).toBe(true);

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();

    expect(monitored.classList.contains('cdk-focused')).toBe(false);
    expect(monitored.classList.contains('cdk-program-focused')).toBe(false);
  });

  it('does not create or activate a focus trap while server rendering', async () => {
    TestBed.configureTestingModule({
      imports: [TestFocusRegion],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const fixture = TestBed.createComponent(TestFocusRegion);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLButtonElement;

    trigger.focus();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const initial = fixture.nativeElement.querySelector(
      '[data-testid="initial"]',
    ) as HTMLButtonElement;
    const trapDirective = fixture.debugElement
      .query(By.directive(CdkTrapFocus))
      .injector.get(CdkTrapFocus);

    expect(trapDirective.focusTrap).toBeUndefined();
    expect(document.activeElement).toBe(trigger);
    expect(initial.classList.contains('cdk-focused')).toBe(false);
  });
});
