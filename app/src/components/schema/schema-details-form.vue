<script setup lang="ts">
import { CreateSchemaRequestBodySchema } from 'schema-manager-schemas';
import z from 'zod';

const SchemaDetailsSchema = z.object(CreateSchemaRequestBodySchema.shape).omit({ properties: true }).partial();
type SchemaDetails = z.infer<typeof SchemaDetailsSchema>;

const model = defineModel<SchemaDetails>({ required: true });
</script>

<template>
  <UForm :schema="SchemaDetailsSchema" nested class="flex flex-col gap-8">
    <HorizontalFormField
      label="Title"
      description="Provide a title for your schema that's easily identifiable."
      required
      name="title"
    >
      <UInput v-model="model.title" class="w-full" />
    </HorizontalFormField>
    <USeparator />
    <HorizontalFormField
      label="Description"
      description="Provide a description for your schema that outlines what it's for."
      required
      name="description"
    >
      <UTextarea v-model="model.description" autoresize class="w-full" />
    </HorizontalFormField>
  </UForm>
</template>
