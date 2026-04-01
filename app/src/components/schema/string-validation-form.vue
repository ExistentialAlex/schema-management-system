<script setup lang="ts">
import type z from 'zod';
import { SchemaPropertySchema } from 'schema-manager-schemas';

defineProps<{ index: number }>();
const StringValidationSchema = SchemaPropertySchema.pick({ pattern: true, maxLength: true, minLength: true });
type StringValidation = z.infer<typeof StringValidationSchema>;

const parameters = defineModel<StringValidation>({ required: true });
</script>

<template>
  <div>
    <h3>String Properties</h3>
    <hr class="my-2 border-muted">
    <UForm nested :schema="StringValidationSchema" class="flex gap-2" :name="`properties.${index}`">
      <UFormField name="pattern" label="Regular Expression" class="flex-1" :ui="{ error: 'whitespace-pre-line' }">
        <UInput v-model="parameters.pattern" class="w-full" />
      </UFormField>
      <UFormField name="minLength" label="Minimum Length" class="flex-1" :ui="{ error: 'whitespace-pre-line' }">
        <UInputNumber v-model="parameters.minLength" class="w-full" :min="0" :step="1" />
      </UFormField>
      <UFormField name="maxLength" label="Maximum Length" class="flex-1" :ui="{ error: 'whitespace-pre-line' }">
        <UInputNumber v-model="parameters.maxLength" class="w-full" :min="0" :step="1" />
      </UFormField>
    </UForm>
  </div>
</template>
