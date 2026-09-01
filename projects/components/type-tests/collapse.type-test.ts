import {
  type ZdCollapseForcedState,
  type ZdCollapseIndicator,
  ZdCollapse,
  ZdCollapseContent,
  ZdCollapseTitle,
} from '@pranxy/zordon-ui/collapse';

const forcedState: ZdCollapseForcedState = 'open';
const indicator: ZdCollapseIndicator = 'arrow';
void forcedState;
void indicator;
void ZdCollapse;
void ZdCollapseContent;
void ZdCollapseTitle;

// @ts-expect-error Collapse forced state is limited to upstream candidates.
const invalidForcedState: ZdCollapseForcedState = 'expanded';
// @ts-expect-error Collapse indicator is limited to upstream candidates.
const invalidIndicator: ZdCollapseIndicator = 'chevron';
void invalidForcedState;
void invalidIndicator;
