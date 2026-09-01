import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdChatBubbleColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
export type ZdChatPlacement = 'start' | 'end';

@Directive({
  selector: '[zdChat]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdChat {
  readonly placement = input.required<ZdChatPlacement, ZdChatPlacement>({
    transform: resolveChatPlacement,
  });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [this.classNames.daisyUi('chat'), this.classNames.daisyUi(`chat-${this.placement()}`)].join(
      ' ',
    ),
  );
}

@Directive({ selector: '[zdChatImage]', host: { '[class]': 'hostClass' } })
export class ZdChatImage {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('chat-image');
}

@Directive({ selector: '[zdChatHeader]', host: { '[class]': 'hostClass' } })
export class ZdChatHeader {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('chat-header');
}

@Directive({ selector: '[zdChatFooter]', host: { '[class]': 'hostClass' } })
export class ZdChatFooter {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('chat-footer');
}

@Directive({
  selector: '[zdChatBubble]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdChatBubble {
  readonly color = input<ZdChatBubbleColor | undefined, ZdChatBubbleColor | undefined>(undefined, {
    transform: resolveChatBubbleColor,
  });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('chat-bubble'),
      this.color() === undefined
        ? undefined
        : this.classNames.daisyUi(`chat-bubble-${this.color()}`),
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

export function resolveChatPlacement(value: unknown): ZdChatPlacement {
  if (value === 'start' || value === 'end') return value;
  throw new RangeError(
    `Zordon UI Chat placement must be start or end; received ${String(value)}.`,
  );
}

export function resolveChatBubbleColor(value: unknown): ZdChatBubbleColor | undefined {
  if (value === undefined) return undefined;
  if (
    value === 'neutral' ||
    value === 'primary' ||
    value === 'secondary' ||
    value === 'accent' ||
    value === 'info' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'error'
  ) {
    return value;
  }
  throw new RangeError(
    `Zordon UI Chat Bubble color must be neutral, primary, secondary, accent, info, success, warning, error, or undefined; received ${String(value)}.`,
  );
}
