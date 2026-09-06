import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZdCodeMockup } from './code-mockup';

@Component({
  imports: [ZdCodeMockup],
  template: '<section zdCodeMockup><pre data-prefix="$"><code>npm run test</code></pre></section>',
})
class Host {}

describe('ZdCodeMockup', () => {
  it('keeps native code markup consumer-owned while adding the mockup class', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('[zdCodeMockup]') as HTMLElement;
    expect(host.tagName).toBe('SECTION');
    expect(host.classList.contains('mockup-code')).toBe(true);
    expect(host.querySelector('pre[data-prefix] code')?.textContent).toBe('npm run test');
  });
});
