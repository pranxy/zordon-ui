export type ZdHostClassToken = string | false | null | undefined;

/**
 * Composes complete library-owned class tokens for an Angular host class-map binding.
 *
 * Consumer classes are intentionally not read or copied here. Angular merges this binding with
 * static and dynamic classes supplied by the component consumer.
 */
export function zdHostClasses(...tokens: readonly ZdHostClassToken[]): string {
  return tokens.filter((token): token is string => typeof token === 'string').join(' ');
}
