import { type ZdAvatarPresence, ZdAvatar, ZdAvatarGroup } from '@pranxy/zordon-ui/avatar';
const presence: ZdAvatarPresence = 'online';
void presence;
void ZdAvatar;
void ZdAvatarGroup;
// @ts-expect-error Avatar presence is limited to upstream candidates.
const invalid: ZdAvatarPresence = 'away';
void invalid;
