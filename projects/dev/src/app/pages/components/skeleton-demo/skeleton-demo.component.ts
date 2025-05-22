import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentCard } from '../../../ui';

@Component({
    selector: 'app-skeleton-demo',
    imports: [ComponentCard],
    templateUrl: './skeleton-demo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SkeletonDemoComponent {
    basicSkeletonCode = `<div class="flex flex-col gap-4 w-52">
  <div class="skeleton h-32 w-full"></div>
  <div class="skeleton h-4 w-28"></div>
  <div class="skeleton h-4 w-full"></div>
  <div class="skeleton h-4 w-full"></div>
</div>`;

    cardSkeletonCode = `<div class="card w-96 bg-base-100 shadow-xl">
  <div class="card-body">
    <div class="flex gap-4 items-center">
      <div class="skeleton w-16 h-16 rounded-full"></div>
      <div class="flex flex-col gap-4">
        <div class="skeleton h-4 w-20"></div>
        <div class="skeleton h-4 w-28"></div>
      </div>
    </div>
    <div class="skeleton h-32 w-full"></div>
    <div class="skeleton h-4 w-full"></div>
    <div class="skeleton h-4 w-48"></div>
  </div>
</div>`;

    tableSkeletonCode = `<table class="table">
  <thead>
    <tr>
      <th><div class="skeleton h-4 w-16"></div></th>
      <th><div class="skeleton h-4 w-24"></div></th>
      <th><div class="skeleton h-4 w-24"></div></th>
      <th><div class="skeleton h-4 w-16"></div></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <div class="flex items-center gap-3">
          <div class="skeleton w-12 h-12 rounded-full"></div>
          <div class="skeleton h-4 w-20"></div>
        </div>
      </td>
      <td><div class="skeleton h-4 w-28"></div></td>
      <td><div class="skeleton h-4 w-24"></div></td>
      <th><div class="skeleton h-4 w-16"></div></th>
    </tr>
  </tbody>
</table>`;

    listSkeletonCode = `<div class="flex flex-col gap-4 w-full">
  <div class="flex gap-4 items-center">
    <div class="skeleton w-16 h-16 rounded-full"></div>
    <div class="flex flex-col gap-4">
      <div class="skeleton h-4 w-48"></div>
      <div class="skeleton h-4 w-64"></div>
    </div>
  </div>
</div>`;
}
