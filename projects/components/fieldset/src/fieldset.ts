import { Directive, inject } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: 'fieldset[zdFieldset]', host: { '[class]': 'hostClass' } })
export class ZdFieldset {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('fieldset');
}

@Directive({ selector: 'legend[zdFieldsetLegend]', host: { '[class]': 'hostClass' } })
export class ZdFieldsetLegend {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('fieldset-legend');
}

@Directive({ selector: 'label[zdFieldsetLabel]', host: { '[class]': 'hostClass' } })
export class ZdFieldsetLabel {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('fieldset-label');
}
