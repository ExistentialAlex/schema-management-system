<script setup lang="ts">
import type { CreateSchemaRequestBody } from 'schema-manager-schemas';
import { CreateSchemaRequestBodySchema } from 'schema-manager-schemas';
import { doublet } from 'schema-manager-utils';
import { definePage } from 'unplugin-vue-router/runtime';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCreateSchema } from '@/composables/schemas/useCreateSchema';

definePage({
  name: 'create-json-schema',
  meta: {
    title: 'app.pages.users.create.title',
    requiresAuth: true,
    layout: 'default',
  },
});

const { t } = useI18n();
const router = useRouter();

const model = reactive<CreateSchemaRequestBody>({
  title: '',
  description: '',
  properties: [],
});

const { mutateAsync: createSchema } = useCreateSchema();

const onSubmit = async () => {
  const [err] = await doublet(createSchema, model);

  if (err) {
    return;
  }

  router.push('/schemas');
};

const addProperty = () => {
  model.properties.push({
    name: '',
    required: false,
    type: [],
  });
};
</script>

<template>
  <BuilderTemplate :title="t('app.pages.schemas.create.title')" back-to="/schema" data-testid="schema-form">
    <template #body>
      <UForm id="schema-form" :state="model" :schema="CreateSchemaRequestBodySchema" @error="console.log" @submit="onSubmit">
        <FormCardHeader
          :title="t('app.pages.users.create.form.title')"
          :description="t('app.pages.users.create.form.description')"
        />
        <UPageCard variant="subtle" class="mb-8">
          <SchemaDetailsForm v-model="model" />
        </UPageCard>
        <UPageCard variant="subtle" class="mb-8">
          <SchemaPropertyForm v-model="model.properties" />
          <UButton @click="addProperty">
            Add Property
          </UButton>
        </UPageCard>
      </UForm>
    </template>
    <template #footer>
      <UButton
        type="submit" class="ml-auto justify-center" data-testid="schema-form:create" color="neutral"
        form="schema-form"
      >
        {{ t('app.pages.schemas.create.form.submit') }}
      </UButton>
    </template>
  </BuilderTemplate>
</template>
