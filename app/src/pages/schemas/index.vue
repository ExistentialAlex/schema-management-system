<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/vue-table';
import type { PaginationQuery, Schema } from 'schema-manager-schemas';
import { getLatestVersionNumber } from 'schema-manager-utils';
import { definePage } from 'unplugin-vue-router/runtime';
import { h, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import PaginatedTable from '@/components/paginated-table.vue';
import { usePagination, useTable } from '@/composables';

definePage({
  name: 'schema-list',
  meta: {
    title: 'app.pages.schemas.list.title',
    requiresAuth: true,
    layout: 'default',
  },
});

const { t } = useI18n();
const { sortableColumn, linkCell, actionsCell } = useTable<Schema>('schema-list');
const router = useRouter();
const toast = useToast();

const getActionItems = (row: Row<Schema>): DropdownMenuItem[] => [
  {
    'type': 'label',
    'label': t('app.pages.schemas.list.actions.title'),
    'data-testid': 'schema-list:actions:menu',
  },
  {
    type: 'separator',
  },
  {
    'label': t('app.pages.schemas.list.actions.edit'),
    'onSelect': () => router.push({ path: `/schemas/${row.original.id}` }),
    'icon': 'i-lucide-edit',
    'data-testid': 'schema-list:actions:edit',
  },
];

const columns: TableColumn<Schema>[] = [
  {
    accessorKey: 'title',
    cell: linkCell('title', (row) => `/schemas/${row.original.id}`),
    header: sortableColumn(t('app.pages.schemas.list.columns.title')),
  },
  {
    id: 'latest-version',
    header: () => t('app.pages.schemas.list.columns.latest-version'),
    cell: ({ row }) => h('p', getLatestVersionNumber(row.original.versions)),
  },
  {
    id: 'versions',
    header: () => t('app.pages.schemas.list.columns.number-of-versions'),
    cell: ({ row }) => h('p', row.original.versions.length),
  },
  {
    id: 'actions',
    cell: actionsCell(getActionItems),
  },
];

const { pageSize, search, sort, error, pageSizeItems, state } = usePagination<
  Schema,
  PaginationQuery
>(['schemas'], '/schemas');

watch(error, (err) => {
  if (err) {
    toast.add({
      title: t('app.pages.schemas.list.toasts.fetchListError'),
      description: err.message,
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
});
</script>

<template>
  <ListTemplate
    v-model:page-size="pageSize"
    :title="t('app.pages.schemas.list.title')"
    data-testid="schema-list"
    :previous="state.data?.previous"
    :next="state.data?.next"
    :page-size-items="pageSizeItems"
    :page="state.data?.page || 1"
    :total="state.data?.count || 0"
  >
    <template #navbar-right>
      <UButton
        icon="i-lucide-plus"
        data-testid="schema-list:create"
        @click="router.push('/schemas/create')"
      >
        {{ t('app.pages.schemas.list.create') }}
      </UButton>
    </template>
    <template #body>
      <PaginatedTable
        v-model:search="search"
        v-model:sort="sort"
        :data="state.data?.results || []"
        :columns="columns"
        :loading="state.status === 'pending'"
        data-testid="schema-list"
        multi-sort
      />
    </template>
  </ListTemplate>
</template>
