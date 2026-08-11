import { ZdIdGenerator } from '../src/public-api';

export declare const ids: ZdIdGenerator;
export const generatedId: string = ids.next('button-description');

// @ts-expect-error ID scopes are strings, not numeric sequence selectors.
ids.next(1);
// @ts-expect-error The generator does not expose mutable counter state.
ids.counters;
