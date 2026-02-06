import * as z from 'zod';
import { isRegex } from '../utils/regex';
import { NonNegativeIntegerDefault0Schema, NonNegativeIntegerSchema } from './non-negative-int.schema';
import { EnumSchema, MultipleOfSchema, TypeSchema } from './properties.schema';
import { StringArraySchema } from './string-array.schema';

export const JsonSchemaSchema = z.strictObject({
  $id: z.string(),
  properties: z.object(),
  type: TypeSchema,
  const: z.unknown(),
  enum: EnumSchema,
  multipleOf: MultipleOfSchema,
  maximum: z.number(),
  minimum: z.number(),
  exclusiveMaximum: z.number(),
  exclusiveMinimum: z.number(),
  maxLength: NonNegativeIntegerSchema,
  minLength: NonNegativeIntegerDefault0Schema,
  pattern: isRegex(z.string()),
  maxItems: NonNegativeIntegerSchema,
  minItems: NonNegativeIntegerDefault0Schema,
  uniqueItems: z.boolean().default(false),
  maxContains: NonNegativeIntegerSchema,
  minContains: NonNegativeIntegerSchema.default(1),
  maxProperties: NonNegativeIntegerSchema,
  minProperties: NonNegativeIntegerDefault0Schema,
  required: StringArraySchema,
}).partial().superRefine((data, ctx) => {
  // Validate that all keys in 'required' exist in 'properties'
  if (data.required && data.properties) {
    const propertyKeys = Object.keys(data.properties);
    const invalidKeys = data.required.filter((key) => !propertyKeys.includes(key));

    if (invalidKeys.length > 0) {
      ctx.addIssue({
        code: 'custom',
        message: `Invalid keys [${invalidKeys.join(', ')}] are not defined in properties.`,
        path: ['required'],
      });
    }
  }
});
export type JsonSchema = z.infer<typeof JsonSchemaSchema>;
