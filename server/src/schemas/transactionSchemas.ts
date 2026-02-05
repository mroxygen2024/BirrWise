import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    description: z.string().min(1, "Description is required").max(100),
    amount: z.coerce.number().positive("Amount must be positive"),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1, "Category is required"),
    date: z.coerce.date(),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    description: z.string().min(1, "Description is required").max(100),
    amount: z.coerce.number().positive("Amount must be positive"),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1, "Category is required"),
    date: z.coerce.date(),
  }),
});

export const deleteTransactionSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
