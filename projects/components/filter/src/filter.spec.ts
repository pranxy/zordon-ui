import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdFilter, ZdFilterItem, ZdFilterReset } from './filter';

@Component({
  imports: [ZdFilter, ZdFilterItem, ZdFilterReset],
  template: `
    <form zdFilter>
      <input
        type="radio"
        zdFilterItem
        zdFilterReset
        name="plan"
        value="all"
        checked
        aria-label="All plans"
      />
      <input
        type="radio"
        zdFilterItem
        color="primary"
        size="lg"
        name="plan"
        value="pro"
        aria-label="Pro plans"
      />
      <input type="reset" zdFilterItem [style]="'ghost'" value="Reset" />
    </form>
  `,
})
class Host {}

describe('ZdFilter', () => {
  it('adds daisyUI classes without replacing native radio selection or form reset behavior', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const filter = fixture.nativeElement.querySelector('[zdFilter]') as HTMLFormElement;
    const radios = filter.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    const reset = filter.querySelector('input[type="reset"]') as HTMLInputElement;
    expect(filter.classList.contains('filter')).toBe(true);
    expect(radios[0].classList).toContain('btn');
    expect(radios[0].classList).toContain('filter-reset');
    expect(radios[1].classList).toContain('btn-primary');
    expect(radios[1].classList).toContain('btn-lg');
    expect(reset.classList).toContain('btn-ghost');

    radios[1].click();
    expect(radios[1].checked).toBe(true);
    reset.click();
    expect(radios[0].checked).toBe(true);
  });
});
