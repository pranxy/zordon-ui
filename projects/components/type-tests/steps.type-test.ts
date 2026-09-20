import {
  ZdSteps,
  type ZdStep,
  type ZdStepState,
  type ZdStepIconContext,
  type ZdOrientation,
  type ZdColor,
} from '@pranxy/zordon-ui/steps';
declare const steps: ZdSteps;
declare const icon: ZdStepIconContext;
const item: ZdStep = { id: 'details', label: 'Details', state: 'complete', color: 'success' };
const state: ZdStepState = icon.state;
const index: number = steps.currentIndex();
const orientation: ZdOrientation = steps.orientation();
const color: ZdColor = steps.color();
steps.currentIdChange.emit('details');
// @ts-expect-error Current state is controlled by currentId.
const invalid: ZdStep = { id: 'x', label: 'X', state: 'current' };
// @ts-expect-error IDs are strings, not array indices.
steps.currentIdChange.emit(1);
void item;
void state;
void index;
void orientation;
void color;
void invalid;
