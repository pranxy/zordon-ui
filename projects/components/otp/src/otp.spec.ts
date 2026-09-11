import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdOtp } from './otp';

@Component({
  imports: [ReactiveFormsModule, ZdOtp],
  template: '<zd-otp [formControl]="value" [length]="4" (completed)="code = $event" />',
})
class Host {
  readonly value = new FormControl('', { nonNullable: true });
  code = '';
}

describe('ZdOtp', () => {
  it('distributes a pasted code, completes it, and updates the Angular form control', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    expect(inputs).toHaveLength(4);
    const paste = new Event('paste') as ClipboardEvent;
    Object.defineProperty(paste, 'clipboardData', {
      value: { getData: () => '1234' },
    });
    inputs[0].dispatchEvent(paste);
    fixture.detectChanges();
    expect(fixture.componentInstance.value.value).toBe('1234');
    expect(fixture.componentInstance.code).toBe('1234');
    expect(Array.from(inputs, input => input.value)).toEqual(['1', '2', '3', '4']);
  });
});
