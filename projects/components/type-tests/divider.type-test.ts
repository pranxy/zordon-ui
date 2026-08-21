import type { ZdColor } from '@pranxy/zordon-ui';
import {
  ZdDivider,
  type ZdDividerDefaults,
  type ZdDividerOrientation,
  type ZdDividerPlacement,
  withDividerDefaults,
} from '@pranxy/zordon-ui/divider';

const color: ZdColor = 'primary';
const orientation: ZdDividerOrientation = 'horizontal';
const placement: ZdDividerPlacement = 'end';
const defaults: ZdDividerDefaults = { color, orientation, placement };

withDividerDefaults(defaults);
void ZdDivider;

// @ts-expect-error Divider color intentionally accepts only semantic daisyUI colors.
const invalidColor: ZdDividerDefaults = { color: 'brand' };
// @ts-expect-error Divider orientation intentionally has two layout directions.
const invalidOrientation: ZdDividerDefaults = { orientation: 'diagonal' };
// @ts-expect-error Divider placement intentionally excludes block-axis placement.
const invalidPlacement: ZdDividerDefaults = { placement: 'top' };

void invalidColor;
void invalidOrientation;
void invalidPlacement;
