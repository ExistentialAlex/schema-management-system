import * as z from 'zod';
import { SimpleTypesArraySchema, SimpleTypesSchema } from './simple-types.schema';

export const TypeSchema = z.union([SimpleTypesSchema, SimpleTypesArraySchema]);
export type Type = z.infer<typeof TypeSchema>;

export const ConstSchema = TypeSchema;
export type Const = z.infer<typeof ConstSchema>;

export const EnumSchema = z.array(TypeSchema);
export type Enum = z.infer<typeof EnumSchema>;

export const MultipleOfSchema = z.number().gt(0);
export type MultipleOf = z.infer<typeof MultipleOfSchema>;
