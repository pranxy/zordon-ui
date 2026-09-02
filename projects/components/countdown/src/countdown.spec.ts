import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdCountdown } from './countdown';

@Component({ imports: [ZdCountdown], template: `<span zdCountdown class="consumer"><span style="--value: 59" aria-label="59">59</span></span>` })
class Host {}

describe('ZdCountdown', () => {
  it('applies the documented wrapper while preserving consumer digit content', () => {
    TestBed.configureTestingModule({ imports: [Host] }); const fixture = TestBed.createComponent(Host); fixture.detectChanges();
    const countdown = fixture.nativeElement.querySelector('[zdCountdown]') as HTMLElement;
    expect(countdown.classList.contains('countdown')).toBe(true); expect(countdown.classList.contains('consumer')).toBe(true);
    expect(countdown.hasAttribute('role')).toBe(false); expect(countdown.querySelector('span')?.getAttribute('aria-label')).toBe('59');
  });
  it('uses a complete configured prefix token', () => {
    TestBed.configureTestingModule({ imports: [Host], providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })] }); const fixture = TestBed.createComponent(Host); fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('[zdCountdown]') as HTMLElement).classList.contains('tw:d-countdown')).toBe(true);
  });
});
