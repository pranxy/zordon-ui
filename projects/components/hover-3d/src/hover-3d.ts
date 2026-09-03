import { Directive, inject } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: '[zdHover3d]', host: { '[class]': 'hostClass' } })
export class ZdHover3d {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('hover-3d');
}
