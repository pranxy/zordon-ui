import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentCard } from '../../../ui';

@Component({
    selector: 'app-card-demo',
    imports: [ComponentCard],
    templateUrl: './card-demo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CardDemoComponent {
    basicCardCode = `<div class="card w-96 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Card title</h2>
    <p>This is a basic card with only content and no image.</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>`;

    imageCardCode = `<div class="card w-96 bg-base-100 shadow-xl">
  <figure>
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>`;

    badgeCardCode = `<div class="card w-96 bg-base-100 shadow-xl">
  <figure>
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">
      Shoes!
      <div class="badge badge-secondary">NEW</div>
    </h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <div class="badge badge-outline">Fashion</div>
      <div class="badge badge-outline">Products</div>
    </div>
  </div>
</div>`;

    bottomImageCardCode = `<div class="card w-96 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
  </div>
  <figure>
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />
  </figure>
</div>`;

    centeredCardCode = `<div class="card w-96 bg-base-100 shadow-xl">
  <figure class="px-10 pt-10">
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" class="rounded-xl" />
  </figure>
  <div class="card-body items-center text-center">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>`;

    overlayCardCode = `<div class="card w-96 bg-base-100 shadow-xl image-full">
  <figure>
    <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>`;

    sideCardCode = `<div class="card card-side bg-base-100 shadow-xl">
  <figure>
    <img src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg" alt="Movie" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">New movie is released!</h2>
    <p>Click the button to watch on Netflix.</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Watch</button>
    </div>
  </div>
</div>`;
}
