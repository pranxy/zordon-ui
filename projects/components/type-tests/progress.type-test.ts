import {
  ZdProgress,
  type ZdProgressColor,
  type ZdProgressFormatter,
} from '@pranxy/zordon-ui/progress';
declare const progress: ZdProgress;
const complete: boolean = progress.complete();
const format: ZdProgressFormatter = state => `${state.value} / ${state.max}`;
void complete;
void format;
// @ts-expect-error Progress color is an exact semantic vocabulary.
const color: ZdProgressColor = 'brand';
void color;
// @ts-expect-error Derived state is read-only.
progress.state.set({});
// @ts-expect-error Progress is not a value-editing control.
progress.valueChange.emit(20);
