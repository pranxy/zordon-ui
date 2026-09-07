import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend } from './fieldset';

@Component({
  imports: [ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend],
  template: `<fieldset
    zdFieldset
    class="consumer"
    style="--consumer-fieldset-gap: 1rem"
    aria-describedby="fieldset-help fieldset-error"
    disabled
  >
    <legend zdFieldsetLegend>Delivery <input id="legend-control" /></legend>
    <label zdFieldsetLabel for="method">Method</label>
    <input id="method" aria-describedby="fieldset-help fieldset-error" />
    <p id="fieldset-help">Choose a delivery method.</p>
    <p id="fieldset-error" role="alert">A delivery method is required.</p>
    <fieldset zdFieldset data-testid="nested-fieldset">
      <legend zdFieldsetLegend>Nested delivery settings</legend>
      <label zdFieldsetLabel for="nested-method">Nested method</label>
      <input id="nested-method" />
    </fieldset>
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
    expect(fieldset.style.getPropertyValue('--consumer-fieldset-gap')).toBe('1rem');
    expect(fieldset.getAttribute('aria-describedby')).toBe('fieldset-help fieldset-error');
    expect(fieldset.hasAttribute('role')).toBe(false);
    expect(legend.classList.contains('fieldset-legend')).toBe(true);
    expect(label.classList.contains('fieldset-label')).toBe(true);
    expect(label.htmlFor).toBe('method');
    expect(fieldset.querySelector('#method')?.matches(':disabled')).toBe(true);
    expect(fieldset.querySelector('#nested-method')?.matches(':disabled')).toBe(true);
    expect(fieldset.querySelector('#legend-control')?.matches(':disabled')).toBe(false);
    expect(fieldset.querySelector('#method')?.getAttribute('aria-describedby')).toBe(
      'fieldset-help fieldset-error',
    );
    expect(fieldset.querySelector('#fieldset-error')?.getAttribute('role')).toBe('alert');
    expect(
      (fieldset.querySelector('[data-testid="nested-fieldset"]') as HTMLFieldSetElement).disabled,
    ).toBe(false);
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
