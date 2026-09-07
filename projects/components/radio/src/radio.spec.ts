import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';

import { ZdRadio } from './radio';

@Component({
  imports: [ReactiveFormsModule, ZdRadio],
  template: `
    <label><input type="radio" zdRadio color="primary" size="lg" value="starter" [formControl]="plan"> Starter</label>
    <label><input type="radio" zdRadio value="pro" [formControl]="plan"> Pro</label>
  `,
})
class Host {
  readonly plan = new FormControl('starter', { nonNullable: true });
}

@Component({
  imports: [FormField, ZdRadio],
  template: `
    <label><input type="radio" zdRadio value="starter" [formField]="settingsForm.plan"> Starter</label>
    <label><input type="radio" zdRadio value="pro" [formField]="settingsForm.plan"> Pro</label>
  `,
})
class SignalFormsHost {
  readonly settings = signal({ plan: 'starter' });
  readonly settingsForm = form(this.settings);
}

describe('ZdRadio', () => {
  it('preserves native radio selection and Reactive Forms behavior while applying daisyUI classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('[zdRadio]') as NodeListOf<HTMLInputElement>;
    expect(radios[0].type).toBe('radio');
    expect(radios[0].classList.contains('radio')).toBe(true);
    expect(radios[0].classList.contains('radio-primary')).toBe(true);
    expect(radios[0].classList.contains('radio-lg')).toBe(true);
    expect(radios[0].checked).toBe(true);

    radios[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.plan.value).toBe('pro');
    expect(radios[1].checked).toBe(true);
  });

  it('keeps its styling-only contract with Angular Signal Forms', () => {
    TestBed.configureTestingModule({ imports: [SignalFormsHost] });
    const fixture = TestBed.createComponent(SignalFormsHost);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('[zdRadio]') as NodeListOf<HTMLInputElement>;
    expect(radios[0].className).toBe('radio');
    expect(radios[0].checked).toBe(true);

    radios[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.settings().plan).toBe('pro');
  });
});
