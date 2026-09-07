import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';

import { ZdCheckbox } from './checkbox';

@Component({
  imports: [ReactiveFormsModule, ZdCheckbox],
  template:
    '<label><input type="checkbox" zdCheckbox color="primary" size="lg" [formControl]="accepted"> Accept terms</label>',
})
class Host {
  readonly accepted = new FormControl(false, { nonNullable: true });
}

@Component({
  imports: [FormField, ZdCheckbox],
  template:
    '<label><input type="checkbox" zdCheckbox [formField]="settingsForm.accepted"> Receive product updates</label>',
})
class SignalFormsHost {
  readonly settings = signal({ accepted: false });
  readonly settingsForm = form(this.settings);
}

describe('ZdCheckbox', () => {
  it('preserves native checkbox and Reactive Forms behavior while applying daisyUI classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector('[zdCheckbox]') as HTMLInputElement;
    expect(checkbox.type).toBe('checkbox');
    expect(checkbox.classList.contains('checkbox')).toBe(true);
    expect(checkbox.classList.contains('checkbox-primary')).toBe(true);
    expect(checkbox.classList.contains('checkbox-lg')).toBe(true);
    expect(checkbox.checked).toBe(false);

    checkbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.accepted.value).toBe(true);
    expect(checkbox.checked).toBe(true);
  });

  it('keeps its default styling-only contract with Angular Signal Forms', () => {
    TestBed.configureTestingModule({ imports: [SignalFormsHost] });
    const fixture = TestBed.createComponent(SignalFormsHost);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector('[zdCheckbox]') as HTMLInputElement;
    expect(checkbox.className).toBe('checkbox');
    expect(checkbox.checked).toBe(false);

    checkbox.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.settings().accepted).toBe(true);
  });
});
