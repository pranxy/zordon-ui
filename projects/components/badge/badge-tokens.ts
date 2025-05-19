import { ZdBadgeColor, ZdBadgeSize, ZdBadgeType } from './badge.model';

export const BADGE_COLOR: Record<ZdBadgeColor, string> = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'badge-neutral',
};

export const BADGE_SIZE: Record<ZdBadgeSize, string> = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
};

export const BADGE_STYLE: Record<Exclude<ZdBadgeType, 'default'>, string> = {
    outline: 'badge-outline',
    dash: 'badge-dash',
    soft: 'badge-soft',
    ghost: 'badge-ghost',
};
