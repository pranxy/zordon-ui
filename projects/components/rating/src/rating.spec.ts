import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdRating, ZdRatingHidden } from './rating';

@Component({
  imports: [ReactiveFormsModule, ZdRating, ZdRatingHidden],
  template: `
    <div zdRating size="lg">
      <input
        type="radio"
        zdRatingHidden
        name="rating"
        value="0"
        aria-label="Clear rating"
        [formControl]="value"
      />
      <input type="radio" name="rating" value="1" aria-label="1 star" [formControl]="value" />
      <input type="radio" name="rating" value="2" aria-label="2 stars" [formControl]="value" />
    </div>
    <div zdRating half></div>
  `,
})
class Host {
  readonly value = new FormControl('1', { nonNullable: true });
}

describe('ZdRating', () => {
  it('preserves native radio forms while applying daisyUI container and clear classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const rating = fixture.nativeElement.querySelector('[zdRating]') as HTMLElement;
    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;

    expect(rating.classList.contains('rating')).toBe(true);
    expect(rating.classList.contains('rating-lg')).toBe(true);
    expect(radios[0].classList.contains('rating-hidden')).toBe(true);
    expect(radios[1].checked).toBe(true);
    radios[2].checked = true;
    radios[2].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value.value).toBe('2');
    expect(
      (fixture.nativeElement.querySelectorAll('[zdRating]')[1] as HTMLElement).classList.contains(
        'rating-half',
      ),
    ).toBe(true);
  });
});
