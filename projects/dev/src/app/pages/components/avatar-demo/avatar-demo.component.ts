import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentCard } from '../../../ui';

@Component({
    selector: 'app-avatar-demo',
    imports: [ComponentCard],
    templateUrl: './avatar-demo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AvatarDemoComponent {
    basicAvatarsCode = `<div class="avatar">
  <div class="w-24 rounded">
    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
  </div>
</div>
<div class="avatar">
  <div class="w-24 rounded-full">
    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
  </div>
</div>`;

    avatarSizesCode = `<div class="avatar">
  <div class="w-32 rounded-full">
    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
  </div>
</div>
<div class="avatar">
  <div class="w-24 rounded-full">
    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
  </div>
</div>`;

    avatarGroupCode = `<div class="avatar-group -space-x-6">
  <div class="avatar">
    <div class="w-12">
      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>
  <div class="avatar">
    <div class="w-12">
      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>
  <div class="avatar placeholder">
    <div class="w-12 bg-neutral-focus text-neutral-content">
      <span>+99</span>
    </div>
  </div>
</div>`;

    avatarStatusCode = `<div class="avatar online">
  <div class="w-24 rounded-full">
    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
  </div>
</div>
<div class="avatar offline">
  <div class="w-24 rounded-full">
    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
  </div>
</div>`;

    placeholderAvatarsCode = `<div class="avatar placeholder">
  <div class="bg-neutral-focus text-neutral-content rounded-full w-24">
    <span class="text-3xl">JO</span>
  </div>
</div>
<div class="avatar placeholder">
  <div class="bg-primary text-primary-content rounded-full w-24">
    <span>Pro</span>
  </div>
</div>`;
}
