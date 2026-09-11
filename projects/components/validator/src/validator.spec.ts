import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZdValidator, ZdValidatorHint } from './validator';
@Component({
  imports: [ReactiveFormsModule, ZdValidator, ZdValidatorHint],
  template: '<input zdValidator [formControl]="value" required><p zdValidatorHint>Required</p>',
})
class Host {
  readonly value = new FormControl('', { nonNullable: true, validators: [Validators.required] });
}
describe('ZdValidator', () => {
  it('keeps Angular validation state consumer-owned while applying classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const input = f.nativeElement.querySelector('[zdValidator]') as HTMLInputElement;
    expect(input.className).toContain('validator');
    expect(f.componentInstance.value.invalid).toBe(true);
    expect(f.nativeElement.querySelector('[zdValidatorHint]').className).toContain(
      'validator-hint',
    );
  });
});
