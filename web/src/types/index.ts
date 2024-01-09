import { z } from 'zod';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const transactionIsolationLevelSchema = z.enum([
  'ReadUncommitted',
  'ReadCommitted',
  'RepeatableRead',
  'Serializable',
]);

export const categoryScalarFieldEnumSchema = z.enum([
  'id',
  'label',
  'createdAt',
  'updatedAt',
  'order',
]);

export const taskScalarFieldEnumSchema = z.enum([
  'id',
  'label',
  'targetDate',
  'createdAt',
  'updatedAt',
  'order',
  'categoryId',
]);

export const sortOrderSchema = z.enum(['asc', 'desc']);

export const nullsOrderSchema = z.enum(['first', 'last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const categorySchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1, { message: 'Le libellé ne peut être vide' }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  order: z.number().int(),
});

export type TCategory = z.infer<typeof categorySchema>;

// CATEGORY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const categoryOptionalDefaultsSchema = categorySchema.merge(
  z.object({
    id: z.string().uuid().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
);

export type CategoryOptionalDefaults = z.infer<
  typeof categoryOptionalDefaultsSchema
>;

/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////

export const taskSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1, { message: 'Le libellé ne peut être vide' }),
  targetDate: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  order: z.number().int(),
  categoryId: z.string(),
});

export type TTask = z.infer<typeof taskSchema>;

// TASK OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const taskOptionalDefaultsSchema = taskSchema.merge(
  z.object({
    id: z.string().uuid().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
);

export type TaskOptionalDefaults = z.infer<typeof taskOptionalDefaultsSchema>;

// Custom
export interface CategoryAPIResponse
  extends Omit<TCategory, 'createdAt' | 'updatedAt'> {
  tasks?: TTask[];
}
