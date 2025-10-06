import { z } from "zod";

export const itemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  price: z.union([z.number(), z.string()]),
  quantity: z.number(),
  tags: z.array(z.string()).nullable().optional(),
  status: z.enum(["active", "inactive"]),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Item = z.infer<typeof itemSchema>;

export async function listItems(
  apiBase: string,
  params: {
    q?: string;
    page?: number;
    pageSize?: number;
    status?: "active" | "inactive";
    category?: string;
  }
) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.status) search.set("status", params.status);
  if (params.category) search.set("category", params.category);
  const res = await fetch(`${apiBase}/api/items?${search.toString()}`);
  if (!res.ok) throw new Error("Failed to load items");
  const data = await res.json();
  return data as {
    items: Item[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export async function createItem(
  apiBase: string,
  payload: Omit<Partial<Item>, "id" | "created_at" | "updated_at"> & {
    title: string;
    price: number;
  }
) {
  const res = await fetch(`${apiBase}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return (await res.json()) as Item;
}

export async function updateItem(
  apiBase: string,
  id: number,
  payload: Partial<Item>
) {
  const res = await fetch(`${apiBase}/api/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return (await res.json()) as Item;
}

export async function deleteItem(apiBase: string, id: number) {
  const res = await fetch(`${apiBase}/api/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete item");
}
