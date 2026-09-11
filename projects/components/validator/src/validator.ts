import { Directive, inject } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';
@Directive({
  selector: 'input[zdValidator], textarea[zdValidator], select[zdValidator]',
  host: { '[class]': 'hostClass' },
})
export class ZdValidator {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('validator');
}
@Directive({ selector: '[zdValidatorHint]', host: { '[class]': 'hostClass' } })
export class ZdValidatorHint {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('validator-hint');
}
