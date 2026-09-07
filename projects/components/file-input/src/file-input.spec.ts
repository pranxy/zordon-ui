import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdFileInput } from './file-input';

@Component({
  imports: [ZdFileInput],
  template:
    '<label><input type="file" zdFileInput color="primary" size="lg" [style]="\'ghost\'" accept="image/png" multiple> Upload images</label>',
})
class StyledHost {}

@Component({ imports: [ZdFileInput], template: '<input type="file" zdFileInput>' })
class DefaultHost {}

describe('ZdFileInput', () => {
  it('preserves native file-input attributes while applying daisyUI modifiers', () => {
    TestBed.configureTestingModule({ imports: [StyledHost] });
    const fixture = TestBed.createComponent(StyledHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[zdFileInput]') as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(input.accept).toBe('image/png');
    expect(input.multiple).toBe(true);
    expect(input.classList.contains('file-input')).toBe(true);
    expect(input.classList.contains('file-input-primary')).toBe(true);
    expect(input.classList.contains('file-input-lg')).toBe(true);
    expect(input.classList.contains('file-input-ghost')).toBe(true);
  });

  it('adds only the base class when no optional modifiers are configured', () => {
    TestBed.configureTestingModule({ imports: [DefaultHost] });
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('[zdFileInput]') as HTMLInputElement).className,
    ).toBe('file-input');
  });
});
