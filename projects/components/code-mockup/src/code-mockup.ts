import { Directive, inject } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: '[zdCodeMockup]', host: { '[class]': 'hostClass' } })
export class ZdCodeMockup {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('mockup-code');
}
