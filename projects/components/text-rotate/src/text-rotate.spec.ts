import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdTextRotate } from './text-rotate';

@Component({
  imports: [ZdTextRotate],
  template: `<span zdTextRotate class="consumer"
    ><span><span>Design</span><span>Develop</span><span>Deploy</span></span></span
  >`,
})
class Host {}

describe('ZdTextRotate', () => {
  it('adds the documented wrapper class while preserving consumer text structure', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('[zdTextRotate]') as HTMLSpanElement;
    expect(host.tagName).toBe('SPAN');
    expect(host.classList.contains('text-rotate')).toBe(true);
    expect(host.classList.contains('consumer')).toBe(true);
    expect(host.textContent).toContain('Deploy');
    expect(host.hasAttribute('role')).toBe(false);
  });
  it('uses the complete configured prefix token', () => {
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement.querySelector('[zdTextRotate]') as HTMLElement).classList.contains(
        'tw:d-text-rotate',
      ),
    ).toBe(true);
  });
});
