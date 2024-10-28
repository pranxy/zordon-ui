export type ZdButtonColor = 'default' | 'primary' | 'secondary' | 'danger';

export type ZdButtonVariant = 'outline' | 'text' | 'fill';

export type ZdButtonSize = 'sm' | 'md' | 'lg';

export type ZdButtonLoadingPosition = 'before' | 'over' | 'after';

export interface ZdButtonConfig {
    variant?: ZdButtonVariant;
    color?: ZdButtonColor;
    size?: ZdButtonSize;
    loadingPosition?: ZdButtonLoadingPosition;
}
