import {
  ZdRadialProgress,
  type ZdRadialProgressColor,
  type ZdRadialProgressFormatter,
  type ZdRadialProgressThreshold,
} from '@pranxy/zordon-ui/radial-progress';
declare const radial: ZdRadialProgress;
const complete: boolean = radial.complete();
const format: ZdRadialProgressFormatter = state => `${state.value} / ${state.max}`;
const threshold: ZdRadialProgressThreshold = { at: 75, color: 'success' };
void complete;
void format;
void threshold;
// @ts-expect-error Only documented semantic colors are supported.
const color: ZdRadialProgressColor = 'brand';
void color;
// @ts-expect-error Progress state is derived and read-only.
radial.state.set({});
// @ts-expect-error Threshold boundaries are numeric percentages.
const invalid: ZdRadialProgressThreshold = { at: '75%', color: 'warning' };
void invalid;
