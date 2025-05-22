import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZdBadge, ZdBadgeColor, ZdBadgeSize, ZdBadgeType } from '@pranxy/zordon-ui/badge';
import { ComponentCard } from '../../../ui';

@Component({
    selector: 'dev-badge-demo',
    imports: [ZdBadge, TitleCasePipe, ComponentCard],
    templateUrl: './badge-demo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BadgeDemoComponent {
    colors: ZdBadgeColor[] = [
        'warning',
        'success',
        'secondary',
        'primary',
        'neutral',
        'info',
        'error',
        'accent',
    ];

    sizes: ZdBadgeSize[] = ['xs', 'sm', 'md', 'lg'];

    types: ZdBadgeType[] = ['dash', 'ghost', 'outline', 'soft'];

    basicBadgesCode = `<div class="badge">neutral</div>
<div class="badge badge-primary">primary</div>
<div class="badge badge-secondary">secondary</div>
<div class="badge badge-accent">accent</div>
<div class="badge badge-ghost">ghost</div>`;

    badgeSizesCode = `<div class="badge badge-sm">small</div>
<div class="badge">normal</div>
<div class="badge badge-lg">large</div>`;

    badgeVariantsCode = `<div class="badge badge-outline">outline</div>
<div class="badge badge-primary badge-outline">primary</div>
<div class="badge badge-secondary badge-outline">secondary</div>
<div class="badge badge-accent badge-outline">accent</div>`;

    statusBadgesCode = `<div class="badge badge-info gap-2">
  <div class="w-2 h-2 rounded-full bg-current"></div>
  info
</div>
<div class="badge badge-success gap-2">
  <div class="w-2 h-2 rounded-full bg-current"></div>
  success
</div>`;

    badgeComponentsCode = `<button class="btn">
  Inbox
  <div class="badge badge-secondary">+99</div>
</button>

<button class="btn">
  Notifications
  <div class="badge badge-primary badge-sm">3</div>
</button>

<div class="card w-96 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      New feature!
      <div class="badge badge-secondary">NEW</div>
    </h2>
    <p>This card has a badge in its title</p>
  </div>
</div>`;
}
