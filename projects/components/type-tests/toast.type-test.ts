import { ZdToastService, type ZdToastPosition, type ZdToastOptions } from '@pranxy/zordon-ui/toast';
declare const service: ZdToastService;
const id: string = service.show({ message: 'Saved' });
const result: Promise<number> = service.track(Promise.resolve(1), {
  loading: { message: 'Wait' },
  success: value => ({ message: `${value}` }),
  error: () => ({ message: 'Failed' }),
});
void id;
void result;
// @ts-expect-error A textual announcement is required even for custom templates.
const missing: ZdToastOptions = { duration: 0 };
// @ts-expect-error Positions use logical edges.
const position: ZdToastPosition = 'bottom-right';
void missing;
void position;
