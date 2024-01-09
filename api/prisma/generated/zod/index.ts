import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','label','createdAt','updatedAt','order']);

export const TaskScalarFieldEnumSchema = z.enum(['id','label','targetDate','createdAt','updatedAt','order','categoryId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1, { message: "Le libellé ne peut être vide" }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  order: z.number().int(),
})

export type Category = z.infer<typeof CategorySchema>

// CATEGORY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CategoryOptionalDefaultsSchema = CategorySchema.merge(z.object({
  id: z.string().uuid().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type CategoryOptionalDefaults = z.infer<typeof CategoryOptionalDefaultsSchema>

/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////

export const TaskSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1, { message: "Le libellé ne peut être vide" }),
  targetDate: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  order: z.number().int(),
  categoryId: z.string(),
})

export type Task = z.infer<typeof TaskSchema>

// TASK OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const TaskOptionalDefaultsSchema = TaskSchema.merge(z.object({
  id: z.string().uuid().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type TaskOptionalDefaults = z.infer<typeof TaskOptionalDefaultsSchema>
