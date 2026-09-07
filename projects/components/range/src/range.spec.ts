import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdRange } from './range';

@Component({
  imports: [ReactiveFormsModule, ZdRange],
  template:
    '<input type="range" zdRange color="primary" size="lg" min="0" max="10" step="2" [formControl]="value"><input type="range" zdRange vertical>',
})
class Host {
  readonly value = new FormControl(2, { nonNullable: true });
}

describe('ZdRange', () => {
  it('preserves native range and Reactive Forms behavior while applying daisyUI classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const range = fixture.nativeElement.querySelector('[zdRange]') as HTMLInputElement;
    expect(range.classList.contains('range')).toBe(true);
    expect(range.classList.contains('range-primary')).toBe(true);
    expect(range.classList.contains('range-lg')).toBe(true);
    expect(range.min).toBe('0');
    expect(range.max).toBe('10');
    expect(range.step).toBe('2');
    expect(
      (
        fixture.nativeElement.querySelectorAll('[zdRange]')[1] as HTMLInputElement
      ).classList.contains('range-vertical'),
    ).toBe(true);
    range.value = '6';
    range.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value.value).toBe(6);
  });
});
