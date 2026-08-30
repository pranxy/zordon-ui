import { Directive, inject } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({
  selector: 'label[zdLabel]',
  host: { '[class]': 'hostClass' },
})
export class ZdLabel {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('label');
}

@Directive({
  selector: 'label[zdFloatingLabel]',
  host: { '[class]': 'hostClass' },
})
export class ZdFloatingLabel {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('floating-label');
}
