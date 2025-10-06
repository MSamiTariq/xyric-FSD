import { z } from "zod";

export const itemCreateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(0).optional().default(0),
  tags: z.array(z.string().min(1).max(50)).max(50).nullable().optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export const itemUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  price: z.coerce.number().min(0).optional(),
  quantity: z.coerce.number().int().min(0).optional(),
  tags: z.array(z.string().min(1).max(50)).max(50).nullable().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const itemQuerySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["active", "inactive"]).optional(),
  category: z.string().optional(),
});

export type ItemCreateInput = z.infer<typeof itemCreateSchema>;
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>;
export type ItemQuery = z.infer<typeof itemQuerySchema>;
