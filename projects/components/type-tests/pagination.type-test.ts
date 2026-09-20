import {
  ZdPagination,
  zdPaginationRange,
  type ZdPaginationChange,
  type ZdPaginationQuery,
  type ZdPaginationToken,
} from '@pranxy/zordon-ui/pagination';
declare const pagination: ZdPagination;
const count: number | null = pagination.pageCount();
const change: ZdPaginationChange = { page: 1, pageSize: 25 };
const query: ZdPaginationQuery = { page: 'p', pageSize: 'limit' };
const range: readonly ZdPaginationToken[] = zdPaginationRange(5, 10);
pagination.stateChange.emit(change);
// @ts-expect-error Query mode names both state parameters.
const invalidQuery: ZdPaginationQuery = { page: 'p' };
// @ts-expect-error Page size is numeric.
pagination.pageSizeChange.emit('25');
void count;
void query;
void range;
void invalidQuery;
