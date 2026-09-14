import type {
  ZdTooltip,
  ZdTooltipAlign,
  ZdTooltipColor,
  ZdTooltipSide,
  ZdTooltipTrigger,
} from '@pranxy/zordon-ui/tooltip';
const side: ZdTooltipSide = 'start';
const align: ZdTooltipAlign = 'center';
const color: ZdTooltipColor = 'warning';
const trigger: ZdTooltipTrigger = 'manual';
// @ts-expect-error physical placements are not part of the logical vocabulary
const physical: ZdTooltipSide = 'left';
// @ts-expect-error unsupported color
const invalid: ZdTooltipColor = 'purple';
declare const tooltip: ZdTooltip;
// @ts-expect-error expanded state is read-only
tooltip.expanded.set(true);
void [side, align, color, trigger, physical, invalid];
