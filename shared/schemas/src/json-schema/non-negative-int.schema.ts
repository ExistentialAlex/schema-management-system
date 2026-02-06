import * as z from 'zod';

export const NonNegativeIntegerSchema = z.int().min(0);
export type NonNegativeInteger = z.infer<typeof NonNegativeIntegerSchema>;

export const NonNegativeIntegerDefault0Schema = NonNegativeIntegerSchema.default(0);
export type NonNegativeIntegerDefault0 = z.infer<typeof NonNegativeIntegerDefault0Schema>;
