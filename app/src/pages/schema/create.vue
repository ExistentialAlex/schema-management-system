<script setup lang="ts">
import type { CreateSchemaRequestBody } from 'schema-manager-schemas';
import { CreateSchemaRequestBodySchema } from 'schema-manager-schemas';
import { definePage } from 'unplugin-vue-router/runtime';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

definePage({
  name: 'create-json-schema',
  meta: {
    title: 'app.pages.users.create.title',
    requiresAuth: true,
    layout: 'default',
  },
});

const { t } = useI18n();

const model = reactive<CreateSchemaRequestBody>({
  title: '',
  description: '',
  draft: false,
  properties: [],
});
</script>

<template>
  <BuilderTemplate :title="t('app.pages.users.create.title')" back-to="/users" data-testid="user-form">
    <template #body>
      <UForm :state="model" :schema="CreateSchemaRequestBodySchema">
        <FormCardHeader
          :title="t('app.pages.users.create.form.title')"
          :description="t('app.pages.users.create.form.description')"
        />
        <UPageCard variant="subtle" class="mb-8">
          <SchemaDetailsForm v-model="model" />
        </UPageCard>
        <UPageCard variant="subtle" class="mb-8">
          <SchemaPropertyForm v-model="model.properties" />
        </UPageCard>
      </UForm>
    </template>
  </BuilderTemplate>
</template>
