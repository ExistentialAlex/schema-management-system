<script setup lang="ts">
import type { SchemaProperty } from 'schema-manager-schemas';
import { SchemaPropertySchema, SimplePropertyTypeSchema } from 'schema-manager-schemas';

const model = defineModel<SchemaProperty[]>({ required: true });
</script>

<template>
  <UForm
    v-for="(property, index) in model"
    :key="index"
    nested
    :schema="SchemaPropertySchema"
    :name="`properties.${index}`"
  >
    <UFormField name="name" label="Name">
      <UInput v-model="property.name" />
    </UFormField>
    <UFormField name="type" label="Type">
      <USelectMenu v-model="property.type" :items="[...Object.values(SimplePropertyTypeSchema.enum), '']" multiple />
    </UFormField>
    <UFormField name="description" label="Description">
      <UInput v-model="property.description" />
    </UFormField>
    <UFormField name="required" label="Required">
      <USwitch v-model="property.required" />
    </UFormField>
  </UForm>
</template>
