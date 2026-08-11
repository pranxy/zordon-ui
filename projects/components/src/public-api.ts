/*
 * Public API surface of @pranxy/zordon-ui.
 *
 * Stable exports are added only after they satisfy the tracked Definition of Done.
 */

export {
  provideZordonUi,
  ZdClassNames,
  type ZdClassPrefixConfig,
  type ZdConfig,
} from './config/zordon-ui-config';

export { ZdTheme } from './theme/theme';

export type {
  ZdBlockPlacement,
  ZdColor,
  ZdDensity,
  ZdInlinePlacement,
  ZdOrientation,
  ZdPlacement,
  ZdShape,
  ZdSize,
  ZdStyle,
} from './types/vocabularies';
