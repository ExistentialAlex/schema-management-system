import * as z from 'zod';
import { unique } from '../utils/unique';

export const SimpleTypesSchema = z.enum(['array', 'boolean', 'integer', 'null', 'number', 'object', 'string']);
export type SimpleTypes = z.infer<typeof SimpleTypesSchema>;

export const SimpleTypesArraySchema = unique(z.array(SimpleTypesSchema).min(1));
export type SimpleTypesArray = z.infer<typeof SimpleTypesArraySchema>;
