import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdSelect } from './select';
@Component({
  imports: [ReactiveFormsModule, ZdSelect],
  template:
    '<select zdSelect color="primary" zdSize="lg" [formControl]="value"><option value="a">A</option><option value="b">B</option></select><select zdSelect variant="ghost" multiple size="3" style="inline-size: 8rem"></select>',
})
class Host {
  readonly value = new FormControl('a', { nonNullable: true });
}
describe('ZdSelect', () => {
  it('preserves native selection and Reactive Forms behavior', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('[zdSelect]') as HTMLSelectElement;
    expect(select.className).toContain('select-primary');
    expect(select.className).toContain('select-lg');
    select.value = 'b';
    select.dispatchEvent(new Event('change'));
    expect(fixture.componentInstance.value.value).toBe('b');
    const list = fixture.nativeElement.querySelectorAll('[zdSelect]')[1] as HTMLSelectElement;
    expect(list.className).toContain('select-ghost');
  });

  it('leaves the native size and style attributes to the platform', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelectorAll('[zdSelect]')[1] as HTMLSelectElement;
    expect(list.size).toBe(3);
    expect(list.style.inlineSize).toBe('8rem');
    expect(list.className).not.toContain('select-3');
  });
});
