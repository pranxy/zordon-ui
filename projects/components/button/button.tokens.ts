import {
    ZdButtonAnimation,
    ZdButtonColor,
    ZdButtonShape,
    ZdButtonSize,
    ZdButtonStyle,
    ZdButtonWidth,
} from './button.model';

export const BUTTON_COLOR: Record<ZdButtonColor, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    neutral: 'btn-neutral',
};

export const BUTTON_SIZE: Record<ZdButtonSize, string> = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
};

export const BUTTON_SHAPE: Record<ZdButtonShape, string> = {
    square: 'btn-square',
    circle: 'btn-circle',
};

export const BUTTON_WIDTH: Record<ZdButtonWidth, string> = {
    wide: 'btn-wide',
    block: 'btn-block',
};

export const BUTTON_STYLE: Record<Exclude<ZdButtonStyle, 'default'>, string> = {
    outline: 'btn-outline',
    dash: 'btn-dash',
    soft: 'btn-soft',
    ghost: 'btn-ghost',
    link: 'btn-link',
};

export const BUTTON_ANIMATION: Record<ZdButtonAnimation, string> = {
    none: '', // Or a class to explicitly remove animation if needed
    pulse: 'btn-pulse', // Replace with the actual class name
};
