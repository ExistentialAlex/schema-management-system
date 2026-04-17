import type { FetchError } from 'ofetch';
import type { CreateSchemaVersionRequestBody, GetSchemaRequestParam, Schema } from 'schema-manager-schemas';
import { useMutation } from '@pinia/colada';
import { toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFetch } from '@/core';

export const useCreateSchemaVersion = () => {
  const { $fetch } = useFetch();
  const toast = useToast();
  const { t } = useI18n();

  return useMutation({
    mutation: async (model: { body: CreateSchemaVersionRequestBody; params: GetSchemaRequestParam }) =>
      $fetch<Schema>(`/schemas/${model.params.id}`, {
        method: 'POST',
        body: toValue(model.body),
      }),
    onSuccess: async (res) => {
      toast.add({
        title: t('app.composables.schemas.useCreateSchemaVersion.toasts.onSuccess.title'),
        description: t('app.composables.schemas.useCreateSchemaVersion.toasts.onSuccess.description', {
          name: res.title,
        }),
        color: 'success',
      });
    },
    onError: (error) => {
      toast.add({
        title: t('app.composables.schemas.useCreateSchemaVersion.toasts.onError.title'),
        description: (error as FetchError).data,
        color: 'error',
      });
    },
  });
};
