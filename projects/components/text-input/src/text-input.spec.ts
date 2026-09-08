import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ZdTextInput } from './text-input';

@Component({
  imports: [ReactiveFormsModule, ZdTextInput],
  template: `
    <input
      zdTextInput
      color="primary"
      size="lg"
      [style]="'ghost'"
      type="email"
      [formControl]="email"
    />
    <input zdTextInput type="password" />
  `,
})
class Host {
  readonly email = new FormControl('hello@example.com', { nonNullable: true });
}

describe('ZdTextInput', () => {
  it('preserves native input types and Reactive Forms behavior while applying modifiers', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[zdTextInput]') as HTMLInputElement;
    input.value = 'person@example.com';
    input.dispatchEvent(new Event('input'));

    expect(input.type).toBe('email');
    expect(input.className).toContain('input');
    expect(input.className).toContain('input-primary');
    expect(input.className).toContain('input-lg');
    expect(input.className).toContain('input-ghost');
    expect(fixture.componentInstance.email.value).toBe('person@example.com');
    expect(
      (fixture.nativeElement.querySelectorAll('[zdTextInput]')[1] as HTMLInputElement).type,
    ).toBe('password');
  });
});
