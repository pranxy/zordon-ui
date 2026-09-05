import { Directive, inject } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: '[zdHero]', host: { '[class]': 'hostClass' } })
export class ZdHero {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('hero');
}

@Directive({ selector: '[zdHeroContent]', host: { '[class]': 'hostClass' } })
export class ZdHeroContent {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('hero-content');
}

@Directive({ selector: '[zdHeroOverlay]', host: { '[class]': 'hostClass' } })
export class ZdHeroOverlay {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('hero-overlay');
}
