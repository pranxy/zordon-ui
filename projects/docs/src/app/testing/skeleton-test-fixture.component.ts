import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { ZdSkeleton, ZdSkeletonRegion, type ZdSkeletonAnimation } from '@pranxy/zordon-ui/skeleton';
@Component({
  selector: 'docs-skeleton-daisy-styles',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './skeleton-daisy-fixture.css',
})
class SkeletonDaisyStyles {}
@Component({
  selector: 'docs-skeleton-test-fixture',
  imports: [ZdSkeleton, ZdSkeletonRegion, SkeletonDaisyStyles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './skeleton-fixture.css',
  template: `
    <docs-skeleton-daisy-styles />
    <main data-testid="skeleton-fixture" [dir]="direction()">
      <h1>Skeleton</h1>
      <p>Decorative placeholders while the application loads content.</p>
      <div class="controls">
        <button type="button" (click)="loading.set(!loading())">
          {{ loading() ? 'Finish' : 'Start' }} loading
        </button>
        <button
          type="button"
          (click)="
            animation.set(
              animation() === 'shimmer' ? 'pulse' : animation() === 'pulse' ? 'none' : 'shimmer'
            )
          "
        >
          Animation: {{ animation() }}
        </button>
        <button type="button" (click)="speed.set(speed() === 1800 ? 3000 : 1800)">
          Speed: {{ speed() }}
        </button>
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
      </div>
      <p role="status">{{ loading() ? 'Loading profile' : 'Profile ready' }}</p>
      <section class="region" aria-label="Profile" [zdSkeletonRegion]="loading()">
        <zd-skeleton
          data-testid="skeleton-active"
          preset="avatar-text"
          [active]="loading()"
          [animation]="animation()"
          [speed]="speed()"
        />
        @if (!loading()) {
          <h2>Alex Morgan</h2>
          <p>Your profile is ready.</p>
          <button type="button">Edit profile</button>
        }
      </section>
      <div class="matrix" data-testid="skeleton-matrix">
        <section>
          <h2>Text lines</h2>
          <zd-skeleton
            shape="text"
            [lines]="4"
            lastLineWidth="75%"
            [animation]="animation()"
            [speed]="speed()"
          />
        </section>
        <section>
          <h2>Rectangle</h2>
          <zd-skeleton height="5rem" radius="1rem" [animation]="animation()" [speed]="speed()" />
        </section>
        <section>
          <h2>Circle</h2>
          <zd-skeleton shape="circle" [animation]="animation()" [speed]="speed()" />
        </section>
        <section>
          <h2>Custom shape</h2>
          <zd-skeleton
            shape="custom"
            width="6rem"
            height="5rem"
            clipPath="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
            [animation]="animation()"
            [speed]="speed()"
          />
        </section>
        <section>
          <h2>Paragraph</h2>
          <zd-skeleton preset="paragraph" [animation]="animation()" [speed]="speed()" />
        </section>
        <section>
          <h2>Avatar and text</h2>
          <zd-skeleton preset="avatar-text" [animation]="animation()" [speed]="speed()" />
        </section>
        <section>
          <h2>Card</h2>
          <zd-skeleton preset="card" [animation]="animation()" [speed]="speed()" />
        </section>
      </div>
    </main>
  `,
})
export class SkeletonTestFixtureComponent {
  readonly loading = signal(true);
  readonly animation = signal<ZdSkeletonAnimation>('shimmer');
  readonly speed = signal(1800);
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
}
