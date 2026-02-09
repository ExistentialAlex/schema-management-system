import * as z from 'zod';
import { isRegex } from '../utils/regex';
import { NonNegativeIntegerDefault0Schema, NonNegativeIntegerSchema } from './non-negative-int.schema';
import { EnumSchema, MultipleOfSchema, TypeSchema } from './properties.schema';
import { UniqueStringArraySchema } from './string-array.schema';

export const JsonSchemaSchema = z.strictObject({
  $id: z.string(),
  get properties() { return z.record(z.string(), JsonSchemaSchema); },
  type: TypeSchema,
  const: z.unknown(),
  enum: EnumSchema,

  // Number and Integer Validation
  multipleOf: MultipleOfSchema,
  maximum: z.number(),
  minimum: z.number(),
  exclusiveMaximum: z.number(),
  exclusiveMinimum: z.number(),

  // String Validation
  maxLength: NonNegativeIntegerSchema,
  minLength: NonNegativeIntegerDefault0Schema,
  pattern: isRegex(z.string()),

  // Array Validation
  maxItems: NonNegativeIntegerSchema,
  minItems: NonNegativeIntegerDefault0Schema,
  uniqueItems: z.boolean().default(false),
  maxContains: NonNegativeIntegerSchema,
  minContains: NonNegativeIntegerSchema.default(1),

  // Object Validation
  maxProperties: NonNegativeIntegerSchema,
  minProperties: NonNegativeIntegerDefault0Schema,
  required: UniqueStringArraySchema,
  dependentRequired: z.record(z.string(), UniqueStringArraySchema),
}).partial().superRefine((data, ctx) => {
  // * Validate that all keys in 'required' exist in 'properties'
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

  // * Validate that all keys in 'dependentRequired' exist in properties and that all keys specified are also present in properties.
  if (data.dependentRequired && data.properties) {
    const propertyKeys = Object.keys(data.properties);

    for (const [triggerProperty, dependentProps] of Object.entries(data.dependentRequired)) {
      // Check if the trigger property exists in properties
      if (!propertyKeys.includes(triggerProperty)) {
        ctx.addIssue({
          code: 'custom',
          message: `Property '${triggerProperty}' in dependentRequired does not exist in properties.`,
          path: ['dependentRequired', triggerProperty],
        });
      }

      // Check if all dependent properties exist in properties
      const invalidDependentProps = dependentProps.filter((prop) => !propertyKeys.includes(prop));
      if (invalidDependentProps.length > 0) {
        ctx.addIssue({
          code: 'custom',
          message: `Dependent properties [${invalidDependentProps.join(', ')}] do not exist in properties.`,
          path: ['dependentRequired', triggerProperty],
        });
      }
    }
  }
});
export type JsonSchema = z.infer<typeof JsonSchemaSchema>;
