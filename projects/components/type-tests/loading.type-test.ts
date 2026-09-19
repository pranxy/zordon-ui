import {
  ZdLoading,
  type ZdLoadingVariant,
  type ZdLoadingColor,
  type ZdLoadingLayout,
} from '@pranxy/zordon-ui/loading';
const variant: ZdLoadingVariant = 'infinity';
void variant;
declare const loading: ZdLoading;
const visible: boolean = loading.visible();
void visible;
// @ts-expect-error Indeterminate Loading does not expose determinate progress.
loading.value();
// @ts-expect-error Layout is an exact contract.
const layout: ZdLoadingLayout = 'modal';
void layout;
// @ts-expect-error Use consumer CSS rather than invented semantic color tokens.
const color: ZdLoadingColor = 'brand';
void color;
// @ts-expect-error Visibility is read-only derived state.
loading.visible.set(true);
