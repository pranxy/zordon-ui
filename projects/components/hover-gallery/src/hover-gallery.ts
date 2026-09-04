import { Directive, inject } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';
@Directive({ selector: '[zdHoverGallery]', host: { '[class]': 'hostClass' } })
export class ZdHoverGallery {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('hover-gallery');
}
