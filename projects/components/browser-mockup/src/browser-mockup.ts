import { Directive, inject } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: '[zdBrowserMockup]', host: { '[class]': 'hostClass' } })
export class ZdBrowserMockup {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('mockup-browser');
}

@Directive({ selector: '[zdBrowserMockupToolbar]', host: { '[class]': 'hostClass' } })
export class ZdBrowserMockupToolbar {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('mockup-browser-toolbar');
}
