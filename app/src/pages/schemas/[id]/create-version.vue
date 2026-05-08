<script setup lang="ts">
import type { CreateSchemaVersionRequestBody } from 'schema-manager-schemas';
import { CreateSchemaVersionRequestBodySchema } from 'schema-manager-schemas';
import { doublet, getLatestVersion } from 'schema-manager-utils';
import { definePage } from 'unplugin-vue-router/runtime';
import { computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useGetSchema } from '@/composables/schemas';
import { useCreateSchemaVersion } from '@/composables/schemas/useCreateSchemaVersion.composable';

definePage({
  name: 'create-json-schema-version',
  meta: {
    title: 'app.pages.schemas.create-version.title',
    requiresAuth: true,
    layout: 'default',
  },
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute('create-json-schema-version');

const model = reactive<CreateSchemaVersionRequestBody>({
  draft: true,
  properties: [],
});

const { refresh, state } = useGetSchema(route.params.id, { enabled: false });
const { mutateAsync: createSchemaVersion } = useCreateSchemaVersion();

const latestVersion = computed(() => state.value.data?.versions ? getLatestVersion(state.value.data.versions) : undefined);
const title = computed(() => latestVersion.value ? `${latestVersion.value.id} -> New Version` : 'New Version');

onMounted(async () => {
  const res = await refresh();

  if (!res.data) {
    router.push({ name: 'schema-list' });
    return;
  }

  const latestVersion = getLatestVersion(res.data.versions);
  model.properties = latestVersion?.properties || [];
});

const onSubmit = async () => {
  const [err] = await doublet(createSchemaVersion, {
    body: model,
    params: { id: Number(route.params.id) },
  });

  if (err) {
    return;
  }

  router.push({ name: 'view-json-schema', params: { id: route.params.id } });
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
  <BuilderTemplate :title="t('app.pages.schemas.create-version.title')" back-to="/schema" data-testid="schema-form">
    <template #body>
      <UForm
        id="schema-form" :state="model" :schema="CreateSchemaVersionRequestBodySchema" @error="console.log"
        @submit="onSubmit"
      >
        <FormCardHeader
          :title="title"
          description="Details of your new schema version"
        />
        <UPageCard variant="subtle" class="mb-8 w-full">
          <UForm>
            <HorizontalFormField
              label="Draft"
              description="Is this new version a draft?"
              required
              name="draft"
            >
              <USwitch v-model="model.draft" class="w-full" />
            </HorizontalFormField>
          </UForm>
        </UPageCard>
        <FormCardHeader
          title="Schema Properties"
          description="Add properties to your schema."
        />
        <UPageCard variant="subtle" class="mb-8 w-full">
          <SchemaPropertyForm v-model="model.properties" />
          <UButton class="w-fit" icon="i-lucide-plus" @click="addProperty">
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
