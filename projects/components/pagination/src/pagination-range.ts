export type ZdPaginationToken = number | 'ellipsis-start' | 'ellipsis-end';

/** @internal Validate finite safe integer configuration without silently changing caller data. */
export function paginationInteger(value: number, minimum: number): number {
  if (!Number.isSafeInteger(value) || value < minimum)
    throw new RangeError(`Pagination requires a safe integer greater than or equal to ${minimum}.`);
  return value;
}

/** Bounded page window with first/last boundaries and single-gap expansion. */
export function zdPaginationRange(
  page: number,
  pageCount: number,
  siblings = 1,
): readonly ZdPaginationToken[] {
  paginationInteger(page, 1);
  paginationInteger(pageCount, 0);
  paginationInteger(siblings, 0);
  if (siblings > 5) throw new RangeError('Pagination supports zero through five siblings.');
  if (pageCount === 0) return [];
  const current = Math.min(page, pageCount);
  const pages = new Set([1, pageCount]);
  const start = Math.max(1, current - siblings);
  const end = Math.min(pageCount, current + siblings);
  // A bounded offset also avoids an increment overflowing MAX_SAFE_INTEGER.
  for (let offset = 0; offset <= end - start; offset++) pages.add(start + offset);
  const result: ZdPaginationToken[] = [];
  let previous = 0;
  for (const number of [...pages].sort((a, b) => a - b)) {
    const gap = number - previous;
    if (gap === 2) result.push(previous + 1);
    else if (gap > 2) result.push(number <= current ? 'ellipsis-start' : 'ellipsis-end');
    result.push(number);
    previous = number;
  }
  return result;
}
