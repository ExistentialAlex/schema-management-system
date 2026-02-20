import type { FetchError } from 'ofetch';
import type { CreateSchemaRequestBody, Schema } from 'schema-manager-schemas';
import type { MaybeRefOrGetter } from 'vue';
import { useMutation } from '@pinia/colada';
import { toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFetch } from '@/core';

export const useCreateSchema = () => {
  const { $fetch } = useFetch();
  const toast = useToast();
  const { t } = useI18n();

  return useMutation({
    mutation: async (model: MaybeRefOrGetter<CreateSchemaRequestBody>) =>
      $fetch<Schema>('/schemas', {
        method: 'POST',
        body: toValue(model),
      }),
    onSuccess: async (res) => {
      toast.add({
        title: t('app.composables.schemas.useCreateSchema.toasts.onSuccess.title'),
        description: t('app.composables.schemas.useCreateSchema.toasts.onSuccess.description', {
          name: res.title,
        }),
        color: 'success',
      });
    },
    onError: (error) => {
      toast.add({
        title: t('app.composables.schemas.useCreateSchema.toasts.onError.title'),
        description: (error as FetchError).data,
        color: 'error',
      });
    },
  });
};
