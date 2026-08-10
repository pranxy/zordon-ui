/** Semantic daisyUI component colors shared across Zordon UI components. */
export type ZdColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

/** The five recurring daisyUI component sizes, from smallest to largest. */
export type ZdSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Reusable visual treatments that occur across multiple daisyUI components.
 * Components narrow this union to the treatments they actually support.
 */
export type ZdStyle = 'outline' | 'dash' | 'soft' | 'ghost' | 'border';

/** Basic shapes shared by multiple components. Rich mask shapes remain Mask-specific. */
export type ZdShape = 'square' | 'circle';

/** Logical inline alignment. `start` and `end` follow the current text direction. */
export type ZdInlinePlacement = 'start' | 'center' | 'end';

/** Block-axis placement from the top edge to the bottom edge. */
export type ZdBlockPlacement = 'top' | 'middle' | 'bottom';

/** Shared single-axis placement vocabulary. Compound components use the axis-specific types. */
export type ZdPlacement = ZdInlinePlacement | ZdBlockPlacement;

/** Layout orientation shared by linear components. */
export type ZdOrientation = 'horizontal' | 'vertical';

/** Zordon UI spacing intent; this is not a direct daisyUI modifier class. */
export type ZdDensity = 'compact' | 'comfortable' | 'spacious';
