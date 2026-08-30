import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdAvatarPresence = 'online' | 'offline';

@Directive({ selector: '[zdAvatar]', host: { '[class]': 'hostClasses()' } })
export class ZdAvatar {
  readonly placeholder = input(false, { transform: booleanAttribute });
  readonly presence = input<ZdAvatarPresence | undefined, ZdAvatarPresence | undefined>(undefined, {
    transform: resolveAvatarPresence,
  });
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('avatar'),
      this.placeholder() ? this.classNames.daisyUi('avatar-placeholder') : undefined,
      this.presence() === undefined
        ? undefined
        : this.classNames.daisyUi(`avatar-${this.presence()}`),
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

@Directive({ selector: '[zdAvatarGroup]', host: { '[class]': 'hostClass' } })
export class ZdAvatarGroup {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('avatar-group');
}

export function resolveAvatarPresence(value: unknown): ZdAvatarPresence | undefined {
  if (value === undefined) return undefined;
  if (value === 'online' || value === 'offline') return value;
  throw new RangeError(
    `Zordon UI Avatar presence must be online, offline, or undefined; received ${String(value)}.`,
  );
}
