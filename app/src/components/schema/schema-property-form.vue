<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { SchemaProperty } from 'schema-manager-schemas';
import { SimplePropertyTypeSchema } from 'schema-manager-schemas';
import { computed, h, resolveComponent } from 'vue';

const model = defineModel<SchemaProperty[]>({ required: true });

const items = computed<string[]>(() => [...Object.values(SimplePropertyTypeSchema.enum)]);

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
      () => h(USelectMenu, { 'multiple': true, 'placeholder': 'Select a Type', 'items': items.value, 'modelValue': row.original.type, 'onUpdate:modelValue': (v: string[]) => {
        model.value[row.index]!.type = v;
        row.toggleExpanded(true);
      } }),
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
    :data="model" :columns="columns" :ui="{ tr: 'data-[expanded=true]:bg-elevated/50', td: 'p-2 first:pl-4 last:pr-4' }"
    class="flex-1 bg-default rounded-lg overflow-hidden border border-muted"
  >
    <template #expanded="{ row }">
      <div class="py-2">
        <h2 v-if="!row.original.type.length" class="text-center">
          Select a type to customise property
        </h2>
        <p v-if="row.original.type.length === 1 && row.original.type.includes('null')" class="text-center">
          Null properties do not have any additional options.
        </p>
        <StringValidationForm
          v-if="row.original.type.includes(SimplePropertyTypeSchema.enum.string)"
          v-model="model[row.index] as SchemaProperty"
          :index="row.index"
        />
      </div>
    </template>
  </UTable>
</template>
