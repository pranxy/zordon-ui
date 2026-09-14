import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Keep independent SSR probes out of the primary fixture's initial bundle. */
@Component({
  selector: 'ssr-example-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<router-outlet />',
})
export class SsrExampleShellComponent {}
