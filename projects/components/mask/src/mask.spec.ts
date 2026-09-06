import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZdMask } from './mask';
@Component({
  imports: [ZdMask],
  template: '<img zdMask shape="circle" half="half-1" alt="Avery" src="avatar.png">',
})
class Host {}
describe('ZdMask', () => {
  it('preserves native image semantics while applying shape classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const image = fixture.nativeElement.querySelector('[zdMask]') as HTMLImageElement;
    expect(image.classList.contains('mask')).toBe(true);
    expect(image.classList.contains('mask-circle')).toBe(true);
    expect(image.classList.contains('mask-half-1')).toBe(true);
    expect(image.alt).toBe('Avery');
  });
});
