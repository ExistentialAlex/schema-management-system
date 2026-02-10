import * as z from 'zod';
import { NonNegativeIntegerDefault0Schema, NonNegativeIntegerSchema, UniqueStringArraySchema } from './json-schema';
import { isRegex } from './utils/regex';

export const SimplePropertyTypeSchema = z.enum(['array', 'boolean', 'integer', 'null', 'number', 'string']);
export type SimplePropertyType = z.infer<typeof SimplePropertyTypeSchema>;

export const SchemaPropertySchema = z.strictObject({
  name: z.string(),
  description: z.string().optional(),
  type: z.union([z.array(SimplePropertyTypeSchema), z.string()]),
  required: z.boolean(),
  dependsOn: UniqueStringArraySchema.optional(),

  // Number Validation
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  exclusiveMinimum: z.boolean().optional(),
  exclusiveMaximum: z.boolean().optional(),

  // String Validation
  pattern: isRegex(z.string()).optional(),
  maxLength: NonNegativeIntegerSchema.optional(),
  minLength: NonNegativeIntegerDefault0Schema.optional(),

  // Array Validation
  uniqueItems: z.boolean().optional(),
});
export type SchemaProperty = z.infer<typeof SchemaPropertySchema>;

export const SchemaSchema = z.strictObject({
  id: z.number(),
  schemaId: z.uuid(),
  title: z.string(),
  description: z.string(),
  version: z.string().regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*))*))?(?:\+([0-9a-z-]+(?:\.[0-9a-z-]+)*))?$/gim),
  draft: z.boolean(),
  properties: z.array(SchemaPropertySchema),
});
export type Schema = z.infer<typeof SchemaSchema>;

export const CreateSchemaRequestBodySchema = SchemaSchema.omit({ id: true, schemaId: true, version: true });
export type CreateSchemaRequestBody = z.infer<typeof CreateSchemaRequestBodySchema>;

export const GetSchemaRequestQuerySchema = z.strictObject({
  id: z.string(),
  version: z.string(),
});
export type GetSchemaRequestQuery = z.infer<typeof GetSchemaRequestQuerySchema>;
