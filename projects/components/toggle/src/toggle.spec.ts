import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdToggle } from './toggle';
@Component({
  imports: [ReactiveFormsModule, ZdToggle],
  template: '<input type="checkbox" zdToggle color="primary" size="lg" [formControl]="enabled">',
})
class Host {
  readonly enabled = new FormControl(false, { nonNullable: true });
}
describe('ZdToggle', () => {
  it('preserves native checkbox and Reactive Forms behavior', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('[zdToggle]') as HTMLInputElement;
    expect(toggle.className).toContain('toggle-primary');
    expect(toggle.className).toContain('toggle-lg');
    toggle.click();
    expect(fixture.componentInstance.enabled.value).toBe(true);
  });
});
