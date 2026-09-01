import {
  type ZdChatBubbleColor,
  type ZdChatPlacement,
  ZdChat,
  ZdChatBubble,
  ZdChatFooter,
  ZdChatHeader,
  ZdChatImage,
} from '@pranxy/zordon-ui/chat-bubble';

const color: ZdChatBubbleColor = 'success';
const placement: ZdChatPlacement = 'start';
void color;
void placement;
void ZdChat;
void ZdChatBubble;
void ZdChatFooter;
void ZdChatHeader;
void ZdChatImage;

// @ts-expect-error Chat placement is limited to upstream candidates.
const invalidPlacement: ZdChatPlacement = 'middle';
// @ts-expect-error Chat Bubble color is limited to upstream candidates.
const invalidColor: ZdChatBubbleColor = 'brand';
void invalidPlacement;
void invalidColor;
