import { z } from "zod";

export const getBudgetsSchema = z.object({
  query: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  }),
});

export const updateBudgetSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    limit: z.coerce.number().positive("Budget limit must be positive"),
  }),
});
