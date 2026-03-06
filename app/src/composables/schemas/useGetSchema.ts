import type { UseQueryOptions } from '@pinia/colada';
import type { Schema } from 'schema-manager-schemas';
import type { MaybeRefOrGetter } from 'vue';
import { useQuery } from '@pinia/colada';
import { toValue } from 'vue';
import { useFetch } from '@/core';

export const useGetSchema = (
  id: MaybeRefOrGetter<string>,
  options: Partial<UseQueryOptions<Schema>> = {},
) => {
  const { $fetch } = useFetch();

  return useQuery({
    key: ['schema-details', toValue(id)],
    query: async () => $fetch<Schema>(`/schemas/${toValue(id)}`),
    ...options,
  });
};
