import type { PaginationQuery, PaginationResponse, Schema } from 'schema-manager-schemas';
import { useQuery } from '@pinia/colada';
import { refDebounced } from '@vueuse/core';
import defu from 'defu';
import { shallowRef, toValue } from 'vue';
import { useFetch } from '@/core';
import { updatePaginatedUrls } from '@/utils';

export const useSearchSchemas = (options: PaginationQuery = {}) => {
  const queryParams: PaginationQuery = defu(options, { page_size: 25 });

  const { $fetch } = useFetch();

  const search = shallowRef('');
  const debouncedSearch = refDebounced(search, 500);

  const query = useQuery<PaginationResponse<Schema>>({
    key: () => ['schemas', toValue(debouncedSearch)],
    query: () =>
      $fetch<PaginationResponse<Schema>>('/schemas', {
        query: {
          ...queryParams,
          search: toValue(debouncedSearch),
        },
      }).then(updatePaginatedUrls),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    search,
  };
};
