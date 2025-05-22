import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dev-components',
    imports: [RouterLink],
    templateUrl: './components-overview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComponentsComponent {
    components = [
        {
            title: 'Buttons',
            description: 'Customizable buttons with various styles, sizes, and states.',
            link: '/components/button',
            ready: true,
            preview: () => `
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
          <button class="btn btn-accent">Accent</button>
        </div>
      `,
        },
        {
            title: 'Cards',
            description: 'Versatile cards for displaying content and actions.',
            link: '/components/card',
            ready: true,
            preview: () => `
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4">
            <h3 class="card-title text-sm">Sample Card</h3>
            <p class="text-xs">Flexible container for any content.</p>
          </div>
        </div>
      `,
        },
        {
            title: 'Forms',
            description: 'Form controls with validation and accessibility.',
            link: '/components/form',
            ready: true,
            preview: () => `
        <div class="space-y-2">
          <input type="text" placeholder="Input" class="input input-bordered w-full" />
          <select class="select select-bordered w-full">
            <option>Select option</option>
          </select>
        </div>
      `,
        },
        {
            title: 'Typography',
            description: 'Text styles for clear visual hierarchy.',
            link: '/components/typography',
            ready: true,
            preview: () => `
        <div class="space-y-1">
          <h3 class="text-lg font-bold">Heading</h3>
          <p class="text-sm">Beautiful typography styles.</p>
          <p class="text-xs opacity-70">With responsive scaling.</p>
        </div>
      `,
        },
        {
            title: 'Modals',
            description: 'Accessible modal dialogs and popovers.',
            link: '/components/modal',
            ready: true,
            preview: () => `
        <button class="btn btn-sm" onclick="demo_modal.showModal()">Open Modal</button>
        <dialog id="demo_modal" class="modal">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Sample Modal</h3>
            <p class="py-4">Click outside to close</p>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      `,
        },
        {
            title: 'Alerts',
            description: 'Contextual feedback messages.',
            link: '/components/alert',
            ready: true,
            preview: () => `
        <div class="alert alert-success text-xs">
          <span>Sample success alert</span>
        </div>
      `,
        },
        {
            title: 'Tables',
            description: 'Data tables with sorting and filtering.',
            link: '/components/table',
            ready: true,
            preview: () => `
        <div class="overflow-x-auto">
          <table class="table table-xs">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sample</td>
                <td>Data</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
        },
        {
            title: 'Navigation',
            description: 'Navigation components and menus.',
            link: '/components/navigation',
            ready: true,
            preview: () => `
        <div class="tabs tabs-sm">
          <a class="tab tab-active">Tab 1</a>
          <a class="tab">Tab 2</a>
        </div>
      `,
        },
        {
            title: 'Badges',
            description: 'Status indicators and counters.',
            link: '/components/badge',
            ready: true,
            preview: () => `
        <div class="flex flex-wrap gap-2">
          <div class="badge">Default</div>
          <div class="badge badge-primary">Primary</div>
          <div class="badge badge-secondary">Secondary</div>
        </div>
      `,
        },
        {
            title: 'Avatars',
            description: 'User avatars and placeholders.',
            link: '/components/avatar',
            ready: true,
            preview: () => `
        <div class="flex gap-2">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div class="avatar placeholder">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
              <span>MX</span>
            </div>
          </div>
        </div>
      `,
        },
        {
            title: 'Skeletons',
            description: 'Loading state placeholders.',
            link: '/components/skeleton',
            ready: false,
            preview: () => `
        <div class="flex flex-col gap-4">
          <div class="skeleton h-4 w-20"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-28"></div>
        </div>
      `,
        },
        {
            title: 'Toasts',
            description: 'Notification messages.',
            link: '/components/toast',
            ready: false,
            preview: () => `
        <div class="alert alert-success">
          <span>Message sent successfully!</span>
        </div>
      `,
        },
        {
            title: 'Tooltips',
            description: 'Informative hover tooltips.',
            link: '/components/tooltip',
            ready: false,
            preview: () => `
        <div class="tooltip" data-tip="Hello!">
          <button class="btn">Hover me</button>
        </div>
      `,
        },
    ];
}
