import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend } from './fieldset';

@Component({
  imports: [ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend],
  template: `<fieldset zdFieldset class="consumer" disabled>
    <legend zdFieldsetLegend>Delivery</legend>
    <label zdFieldsetLabel for="method">Method</label><input id="method" />
  </fieldset>`,
})
class TestFieldsetHost {}

describe('ZdFieldset', () => {
  it('adds candidates while preserving native grouping and disabled semantics', () => {
    TestBed.configureTestingModule({ imports: [TestFieldsetHost] });
    const fixture = TestBed.createComponent(TestFieldsetHost);
    fixture.detectChanges();
    const fieldset = fixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;
    const legend = fixture.nativeElement.querySelector('legend') as HTMLLegendElement;
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(fieldset.classList.contains('fieldset')).toBe(true);
    expect(fieldset.classList.contains('consumer')).toBe(true);
    expect(fieldset.disabled).toBe(true);
    expect(fieldset.hasAttribute('role')).toBe(false);
    expect(legend.classList.contains('fieldset-legend')).toBe(true);
    expect(label.classList.contains('fieldset-label')).toBe(true);
    expect(label.htmlFor).toBe('method');
  });

  it('uses complete configured prefix tokens', () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
      imports: [TestFieldsetHost],
    });
    const fixture = TestBed.createComponent(TestFieldsetHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('fieldset').classList.contains('tw:d-fieldset'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('legend').classList.contains('tw:d-fieldset-legend'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('label').classList.contains('tw:d-fieldset-label'),
    ).toBe(true);
  });
});
