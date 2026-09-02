import { Directive, inject } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: '[zdCountdown]', host: { '[class]': 'hostClass' } })
export class ZdCountdown {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('countdown');
}
