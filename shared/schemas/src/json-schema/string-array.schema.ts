import * as z from 'zod';
import { unique } from '../utils/unique';

export const StringArraySchema = unique(z.array(z.string())).default([]);
export type StringArray = z.infer<typeof StringArraySchema>;
