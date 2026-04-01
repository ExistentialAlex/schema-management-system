import * as z from 'zod';
import { NonNegativeIntegerDefault0Schema, NonNegativeIntegerSchema, UniqueStringArraySchema } from './json-schema';
import { min } from './utils';
import { isRegex } from './utils/regex';

export const SimplePropertyTypeSchema = z.enum(['array', 'boolean', 'integer', 'null', 'number', 'string']);
export type SimplePropertyType = z.infer<typeof SimplePropertyTypeSchema>;

export const SchemaPropertySchema = z.object({
  name: z.string().min(1, 'Name is Required'),
  description: z.string().optional(),
  type: z.array(z.union([SimplePropertyTypeSchema, z.string()])).min(1, 'Select at least one type'),
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

export const SemverStringSchema = z.string().regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*))*))?(?:\+([0-9a-z-]+(?:\.[0-9a-z-]+)*))?$/gim);
export type SemverString = z.infer<typeof SemverStringSchema>;

/**
 * Check that the names of all schema properties are unique.
 * @param v The object with properties.
 * @param ctx The Zod context.
 */
const propertyNamesUnique = <T extends { properties: SchemaProperty[] }>(v: T, ctx: z.core.$RefinementCtx<T>) => {
  const seenNames = new Map<string, number>();

  for (let i = 0; i < v.properties.length; i++) {
    const name = v.properties[i].name;

    if (seenNames.has(name)) {
      ctx.addIssue({
        path: ['properties', i, 'name'],
        message: 'Property name must be unique',
        code: 'custom',
      });
      continue;
    }

    seenNames.set(name, i);
  }
};

export const SchemaVersionSchema = z.object({
  id: SemverStringSchema,
  schemaId: z.number(),
  draft: z.boolean(),
  createdDate: z.iso.datetime(),
  updatedDate: z.iso.datetime().optional(),
  properties: z.array(SchemaPropertySchema),
});
export type SchemaVersion = z.infer<typeof SchemaVersionSchema>;

export const SchemaSchema = z.object({
  id: z.number(),
  title: z.string()
    .refine(min(1), {
      params: {
        i18n: 'schemas.SchemaSchema.title.min',
      },
    }),
  description: z.string()
    .refine(min(1), {
      params: {
        i18n: 'schemas.SchemaSchema.description.min',
      },
    }),
  versions: z.array(SchemaVersionSchema),
  createdDate: z.iso.datetime(),
  updatedDate: z.iso.datetime().optional(),
});
export type Schema = z.infer<typeof SchemaSchema>;

export const CreateSchemaVersionRequestBodySchema = SchemaVersionSchema.omit({ id: true, schemaId: true });
export type CreateSchemaVersionRequestBody = z.infer<typeof CreateSchemaVersionRequestBodySchema>;

export const CreateSchemaRequestBodySchema = SchemaSchema.omit({ id: true, versions: true, createdDate: true }).extend({ properties: z.array(SchemaPropertySchema) }).superRefine(propertyNamesUnique);
export type CreateSchemaRequestBody = z.infer<typeof CreateSchemaRequestBodySchema>;

export const UpdateSchemaVersionRequestBodySchema = CreateSchemaVersionRequestBodySchema;
export type UpdateSchemaVersionRequestBody = z.infer<typeof UpdateSchemaVersionRequestBodySchema>;

export const UpdateSchemaRequestBodySchema = SchemaSchema.omit({ id: true, versions: true });
export type UpdateSchemaRequestBody = z.infer<typeof UpdateSchemaRequestBodySchema>;

export const GetSchemaRequestParamSchema = z.strictObject({
  id: z.coerce.number(),
});
export type GetSchemaRequestParam = z.infer<typeof GetSchemaRequestParamSchema>;

export const GetSchemaVersionRequestParamSchema = z.strictObject({
  id: z.coerce.number(),
  version: SemverStringSchema,
});
export type GetSchemaVersionRequestParam = z.infer<typeof GetSchemaVersionRequestParamSchema>;
