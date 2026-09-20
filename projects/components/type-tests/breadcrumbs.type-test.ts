import {
  type ZdBreadcrumbItem,
  type ZdBreadcrumbOverflow,
  ZdBreadcrumbs,
} from '@pranxy/zordon-ui/breadcrumbs';
const item: ZdBreadcrumbItem = {
  id: 'home',
  label: 'Home',
  routerLink: ['/home'],
  queryParams: { page: 1 },
  canonicalUrl: 'https://example.com',
};
const overflow: ZdBreadcrumbOverflow = 'scroll';
declare const component: ZdBreadcrumbs;
const items: readonly ZdBreadcrumbItem[] = component.items();
// @ts-expect-error A stable ID is required.
const invalid: ZdBreadcrumbItem = { label: 'Missing ID' };
// @ts-expect-error Overflow modes are explicit.
const invalidMode: ZdBreadcrumbOverflow = 'menu';
void item;
void overflow;
void items;
void invalid;
void invalidMode;
