import type { PaginationResponseSchema } from 'schema-manager-schemas';
import { appendQueryAndHash } from 'schema-manager-utils';

export const updatePaginatedUrls = <T>(
  data: PaginationResponseSchema<T>,
): PaginationResponseSchema<T> => {
  // If they're present, transform the next and previous URLs to use the correct URL.
  const transformedData = structuredClone(data);

  if (data.next) {
    transformedData.next = appendQueryAndHash(window.location.pathname, data.next);
  }

  if (data.previous) {
    transformedData.previous = appendQueryAndHash(window.location.pathname, data.previous);
  }

  return transformedData;
};
