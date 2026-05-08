<script setup lang="ts">
import type z from 'zod';
import { SchemaPropertySchema } from 'schema-manager-schemas';

defineProps<{ index: number; isInteger: boolean }>();
const NumberValidationSchema = SchemaPropertySchema.pick({
  minimum: true,
  maximum: true,
  exclusiveMinimum: true,
  exclusiveMaximum: true,
  multipleOf: true,
});
type NumberValidation = z.infer<typeof NumberValidationSchema>;

const parameters = defineModel<NumberValidation>({ required: true });
</script>

<template>
  <div>
    <h3>Number/Integer Properties</h3>
    <hr class="my-2 border-muted">
    <UForm
      nested :schema="NumberValidationSchema" class="grid grid-cols-1 gap-2"
      :class="[{ 'sm:grid-cols-3': !isInteger, 'sm:grid-cols-2': isInteger }]" :name="`properties.${index}`"
    >
      <UFormField name="minimum" label="Minimum" class="flex-1" :ui="{ error: 'whitespace-pre-line' }">
        <UInputNumber v-model="parameters.minimum" class="w-full" :step="parameters.multipleOf || 1" :min="0" />
      </UFormField>
      <UFormField name="maximum" label="Maximum" class="flex-1" :ui="{ error: 'whitespace-pre-line' }">
        <UInputNumber
          v-model="parameters.maximum" class="w-full" :step="parameters.multipleOf || 1"
          :min="parameters.minimum || 0"
        />
      </UFormField>
      <UFormField
        v-if="!isInteger" name="multipleOf" label="Multiple of" class="flex-1"
        :ui="{ error: 'whitespace-pre-line' }"
      >
        <UInputNumber v-model="parameters.multipleOf" class="w-full" :step="0.00001" :min="0" />
      </UFormField>
      <UFormField
        name="exclusiveMinimum" label="Exclusive Minimum" class="flex-1"
        :ui="{ error: 'whitespace-pre-line' }"
      >
        <UInputNumber v-model="parameters.exclusiveMinimum" class="w-full" :step="parameters.multipleOf || 1" />
      </UFormField>
      <UFormField
        name="exclusiveMaximum" label="Exclusive Maximum" class="flex-1"
        :ui="{ error: 'whitespace-pre-line' }"
      >
        <UInputNumber
          v-model="parameters.exclusiveMaximum" class="w-full" :step="parameters.multipleOf || 1"
          :min="parameters.minimum || parameters.exclusiveMinimum || 0"
        />
      </UFormField>
    </UForm>
  </div>
</template>
