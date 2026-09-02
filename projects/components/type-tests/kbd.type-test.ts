import { type ZdKbdSize, ZdKbd } from '@pranxy/zordon-ui/kbd';

const size: ZdKbdSize = 'xl';
void size;
void ZdKbd;

// @ts-expect-error Kbd size is limited to upstream candidates.
const invalidSize: ZdKbdSize = '2xl';
void invalidSize;
