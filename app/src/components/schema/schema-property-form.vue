<script setup lang="ts">
import type { SchemaProperty } from 'schema-manager-schemas';
import { SchemaPropertySchema } from 'schema-manager-schemas';

const model = defineModel<SchemaProperty[]>({ required: true });
</script>

<template>
  <UForm v-for="(property, index) in model" :key="index" nested :schema="SchemaPropertySchema">
    <UFormField name="name" label="Name">
      <UInput v-model="property.name" />
    </UFormField>
    <UFormField name="type" label="Type">
      <USelectMenu v-model="property.type" />
    </UFormField>
    <UFormField name="description" label="Description">
      <UInput v-model="property.description" />
    </UFormField>
  </UForm>
</template>
