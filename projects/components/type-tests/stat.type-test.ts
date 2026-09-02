import {
  type ZdStatsOrientation,
  ZdStat,
  ZdStatActions,
  ZdStatDesc,
  ZdStatFigure,
  ZdStatTitle,
  ZdStats,
  ZdStatValue,
} from '@pranxy/zordon-ui/stat';

const orientation: ZdStatsOrientation = 'vertical';
void orientation;
void ZdStats;
void ZdStat;
void ZdStatTitle;
void ZdStatValue;
void ZdStatDesc;
void ZdStatFigure;
void ZdStatActions;

// @ts-expect-error Stats orientation is limited to upstream candidates.
const invalidOrientation: ZdStatsOrientation = 'diagonal';
void invalidOrientation;
