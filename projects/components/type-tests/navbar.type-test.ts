import {
  ZdNavbar,
  ZdNavbarContent,
  ZdNavbarToggle,
  type ZdNavbarPosition,
  type ZdNavbarVisibility,
} from '@pranxy/zordon-ui/navbar';
declare const navbar: ZdNavbar;
declare const content: ZdNavbarContent;
declare const toggle: ZdNavbarToggle;
const position: ZdNavbarPosition = navbar.position();
const visibility: ZdNavbarVisibility = content.visibility();
toggle.expandedChange.emit(true);
// @ts-expect-error Positions are finite.
const invalid: ZdNavbarPosition = 'absolute';
// @ts-expect-error Expanded requests are booleans.
toggle.expandedChange.emit('open');
void position;
void visibility;
void invalid;
