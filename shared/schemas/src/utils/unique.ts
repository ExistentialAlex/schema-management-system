import type * as z from 'zod';

export const unique = <T extends z.core.SomeType, A extends z.ZodArray<T>>(schema: A) => schema.refine((v) => v.length === new Set(v).size, {
  error: 'Array items must be unique',
});
