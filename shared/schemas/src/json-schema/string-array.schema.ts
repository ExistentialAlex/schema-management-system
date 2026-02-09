import * as z from 'zod';
import { unique } from '../utils/unique';

export const UniqueStringArraySchema = unique(z.array(z.string())).default([]);
export type UniqueStringArray = z.infer<typeof UniqueStringArraySchema>;
