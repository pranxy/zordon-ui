import {
  afterNextRender,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Keep independent SSR probes out of the primary fixture's initial bundle. */
@Component({
  selector: 'ssr-example-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<router-outlet />',
})
export class SsrExampleShellComponent {
  constructor() {
    const appRef = inject(ApplicationRef);
    const document = inject(DOCUMENT);
    // Once the lazy route has hydrated, mark the page: end-to-end tests wait for this before input.
    afterNextRender(() => {
      void appRef
        .whenStable()
        .then(() => document.documentElement.setAttribute('data-hydrated', ''));
    });
  }
}
