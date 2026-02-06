import type * as z from 'zod';

export const isRegex = <T extends z.ZodString>(schema: T) => schema.refine((v) => {
  try {
    const _ = new RegExp(v);
    return true;
  }
  catch {
    return false;
  }
}, {
  error: 'Input value is not a regular expression.',
});
