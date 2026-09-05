import { Directive, inject } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: '[zdTextRotate]', host: { '[class]': 'hostClass' } })
export class ZdTextRotate {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('text-rotate');
}
