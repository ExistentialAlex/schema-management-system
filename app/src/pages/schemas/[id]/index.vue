<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { SchemaVersion } from 'schema-manager-schemas';
import { sortVersions } from 'schema-manager-utils';
import { definePage } from 'unplugin-vue-router/runtime';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useTable } from '@/composables';
import { useGetSchema } from '@/composables/schemas';

definePage({
  name: 'view-json-schema',
  meta: {
    title: 'app.pages.schemas.view.title',
    requiresAuth: true,
    layout: 'default',

  },
});

const route = useRoute('view-json-schema');
const router = useRouter();
const { t } = useI18n();

const { state } = useGetSchema(route.params.id);

const { dateCell } = useTable<SchemaVersion>('schema-version-table');

const versionColumns = computed<TableColumn<SchemaVersion>[]>(() => [
  {
    accessorKey: 'id',
    header: () => t('app.pages.schemas.view.version-table.columns.id'),
  },
  {
    accessorKey: 'draft',
    header: () => t('app.pages.schemas.view.version-table.columns.draft'),
  },
  {
    accessorKey: 'createdDate',
    header: () => t('app.pages.schemas.view.version-table.columns.created-date'),
    cell: dateCell('createdDate'),
  },
  {
    accessorKey: 'updatedDate',
    header: () => t('app.pages.schemas.view.version-table.columns.updated-date'),
    cell: dateCell('updatedDate'),
  },
]);
</script>

<template>
  <DefaultTemplate :title="t('app.pages.schemas.view.header', { name: state.data?.title || '' })">
    <template #body>
      <div v-if="state.status !== 'success'">
        <USkeleton class="h-10" />
      </div>
      <div v-else class="grid gap-4">
        <UCard>
          <template #header>
            <div class="flex">
              <h1 class="text-xl">
                <span class="text-muted mr-4">#{{ state.data.id }}</span>
                {{ state.data.title }}
              </h1>
            </div>
          </template>
          <template #default>
            <p>{{ state.data.description }}</p>
          </template>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex justify-between">
              <h1 class="text-xl">
                {{ t('app.pages.schemas.view.version-table.title') }}
              </h1>
              <UButton icon="i-lucide-plus" @click="router.push(`/schemas/${route.params.id}/create-version`)">
                {{ t('app.pages.schemas.view.version-table.add-version') }}
              </UButton>
            </div>
          </template>
          <template #default>
            <UTable :data="sortVersions(state.data.versions)" :columns="versionColumns" :empty="t('app.pages.schemas.view.version-table.empty')" />
          </template>
        </UCard>
      </div>
    </template>
  </DefaultTemplate>
</template>
