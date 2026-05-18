<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { SchemaProperty } from 'schema-manager-schemas';
import { SimplePropertyTypeSchema } from 'schema-manager-schemas';
import { computed, h, resolveComponent } from 'vue';
import { useSearchSchemas } from '@/composables/schemas';

const model = defineModel<SchemaProperty[]>({ required: true });

const { state, search } = useSearchSchemas();
const items = computed<{ label: string; value: string }[]>(() => {
  const types: { label: string; value: string }[] = Object.values(SimplePropertyTypeSchema.enum).map((t) => ({ label: t, value: t }));

  if (state.value.status === 'success') {
    types.push(...state.value.data.results.map((s) => ({ label: s.title, value: String(s.id) })));
  }

  return types;
});

const removeProperty = (index: number) => {
  model.value.splice(index, 1);
};

const UButton = resolveComponent('UButton');
const UFormField = resolveComponent('UFormField');
const UInput = resolveComponent('UInput');
const USelectMenu = resolveComponent('USelectMenu');
const USwitch = resolveComponent('USwitch');

const columns = computed<TableColumn<SchemaProperty>[]>(() => [
  {
    id: 'toggle',
    label: '',
    dataTestid: 'schema-property-form:toggle-label',
    cell: ({ row }) =>
      h(UButton, {
        'color': 'neutral',
        'variant': 'ghost',
        'icon': 'i-lucide-chevron-down',
        'square': true,
        'aria-label': 'Expand',
        'ui': {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : '',
          ],
        },
        'onClick': () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => h(
      UFormField,
      { name: `properties.${row.index}.name`, class: 'flex-1', ui: { error: 'whitespace-pre-line' } },
      () => h(UInput, { 'modelValue': row.original.name, 'onUpdate:modelValue': (v: string) => model.value[row.index]!.name = v }),
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => h(
      UFormField,
      { name: `properties.${row.index}.description`, class: 'flex-1', ui: { error: 'whitespace-pre-line' } },
      () => h(UInput, { 'modelValue': row.original.description, 'onUpdate:modelValue': (v: string) => model.value[row.index]!.description = v }),
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => h(
      UFormField,
      { name: `properties.${row.index}.type`, class: 'flex-1', ui: { error: 'whitespace-pre-line' } },
      () => h(USelectMenu, {
        'search-term': search.value,
        'multiple': true,
        'placeholder': 'Select a Type',
        'items': items.value,
        'ignore-filter': true,
        'reset-search-term-on-select': false,
        'reset-search-term-on-blur': false,
        'modelValue': row.original.type,
        'ui': '{ content: "min-w-fit" }',
        'onUpdate:modelValue': (v: string[]) => {
          model.value[row.index]!.type = v;
          row.toggleExpanded(true);
        },
        'onUpdate:searchTerm': (v: string) => search.value = v,
      }),
    ),
  },
  {
    accessorKey: 'required',
    header: 'Required',
    cell: ({ row }) => h(
      UFormField,
      { name: `properties.${row.index}.required`, class: 'flex-1', ui: { error: 'whitespace-pre-line' } },
      () => h(USwitch, { 'modelValue': row.original.required, 'onUpdate:modelValue': (v: boolean) => model.value[row.index]!.required = v }),
    ),
  },
  {
    id: 'delete',
    header: 'Delete',
    cell: ({ row }) => h(UButton, {
      icon: 'i-lucide-x',
      variant: 'ghost',
      color: 'neutral',
      onClick: () => removeProperty(row.index),
    }),
  },
]);
</script>

<template>
  <UTable
    :data="model" :columns="columns"
    :ui="{ tr: 'data-[expanded=true]:bg-elevated/50', td: 'p-2 first:pl-4 last:pr-4' }"
    class="flex-1 bg-default rounded-lg overflow-hidden border border-muted"
  >
    <template #expanded="{ row }">
      <div class="py-2 flex flex-col gap-4">
        <h2 v-if="!row.original.type.length" class="text-center">
          Select a type to customise property
        </h2>
        <p v-if="row.original.type.length === 1 && row.original.type.includes('null')" class="text-center">
          Null properties do not have any additional options.
        </p>
        <StringValidationForm
          v-if="row.original.type.includes(SimplePropertyTypeSchema.enum.string)"
          v-model="model[row.index] as SchemaProperty" :index="row.index"
        />
        <NumberValidationForm
          v-if="row.original.type.includes(SimplePropertyTypeSchema.enum.number) || row.original.type.includes(SimplePropertyTypeSchema.enum.integer)"
          v-model="model[row.index] as SchemaProperty" :index="row.index"
          :is-integer="row.original.type.includes(SimplePropertyTypeSchema.enum.integer)"
        />
      </div>
    </template>
  </UTable>
</template>
