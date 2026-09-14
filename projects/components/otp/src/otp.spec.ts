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

  it('supports typing, empty backspace, filtered paste, reset, and disabled Forms state', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    inputs[0].value = 'x1';
    inputs[0].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value.value).toBe('1');
    expect(document.activeElement).toBe(inputs[1]);
    inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(document.activeElement).toBe(inputs[0]);
    inputs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    inputs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    inputs[3].value = '4';
    inputs[3].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value.value).toBe('14');
    inputs[2].value = 'x';
    inputs[2].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value.value).toBe('14');
    const paste = new Event('paste') as ClipboardEvent;
    Object.defineProperty(paste, 'clipboardData', { value: { getData: () => 'letters' } });
    inputs[1].dispatchEvent(paste);
    inputs[1].dispatchEvent(new Event('paste'));
    expect(fixture.componentInstance.value.value).toBe('14');
    fixture.componentInstance.value.reset();
    fixture.detectChanges();
    expect(Array.from(inputs, input => input.value)).toEqual(['', '', '', '']);
    fixture.componentInstance.value.disable();
    fixture.detectChanges();
    expect(inputs[0].disabled).toBe(true);
    fixture.componentInstance.value.enable();
    fixture.detectChanges();
    expect(inputs[0].disabled).toBe(false);
  });

  it('accepts standalone writes without user emissions and handles invalid regex configuration', () => {
    const fixture = TestBed.createComponent(ZdOtp);
    fixture.componentRef.setInput('length', 2);
    fixture.detectChanges();
    const changes: string[] = [];
    fixture.componentInstance.valueChange.subscribe(value => changes.push(value));
    fixture.componentInstance.writeValue('12');
    fixture.detectChanges();
    expect(changes).toEqual([]);
    fixture.componentInstance.writeValue(null);
    fixture.detectChanges();
    fixture.componentRef.setInput('pattern', '[');
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    inputs[0].value = 'a';
    inputs[0].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(changes).toEqual(['a']);
    fixture.componentRef.setInput('length', 1);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(1);
    fixture.componentRef.setInput('length', 8);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(8);
    expect(fixture.nativeElement.querySelectorAll('input')[7].value).toBe('');
  });
});
