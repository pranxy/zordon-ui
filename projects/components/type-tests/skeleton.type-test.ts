import {
  ZdSkeleton,
  ZdSkeletonRegion,
  type ZdSkeletonShape,
  type ZdSkeletonPreset,
  type ZdSkeletonAnimation,
} from '@pranxy/zordon-ui/skeleton';
declare const skeleton: ZdSkeleton;
declare const region: ZdSkeletonRegion;
const active: boolean = skeleton.active();
const busy: boolean = region.loading();
void active;
void busy;
// @ts-expect-error Exact shape vocabulary.
const shape: ZdSkeletonShape = 'triangle';
// @ts-expect-error Custom layouts use composition.
const preset: ZdSkeletonPreset = 'table';
// @ts-expect-error Exact animation vocabulary.
const animation: ZdSkeletonAnimation = 'spin';
void shape;
void preset;
void animation;
