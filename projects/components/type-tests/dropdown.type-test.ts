import {
  ZdDropdown,
  type ZdDropdownSide,
  type ZdDropdownAlign,
  type ZdDropdownCloseReason,
} from '@pranxy/zordon-ui/dropdown';

declare const dropdown: ZdDropdown;
const side: ZdDropdownSide = 'end';
const align: ZdDropdownAlign = 'center';
const reason: ZdDropdownCloseReason = 'navigation';
dropdown.close(reason);
dropdown.show();
const expanded: boolean = dropdown.expanded();
void [side, align, expanded];
// @ts-expect-error Physical placement is not part of the logical public vocabulary.
const invalidSide: ZdDropdownSide = 'left';
// @ts-expect-error Expanded state is read-only; use open/openChange or show/close.
dropdown.expanded.set(true);
void invalidSide;
