import pool from "../../db/pool";
import { ItemCreateInput, ItemQuery, ItemUpdateInput } from "./items.schema.js";

export type Item = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string; // numeric from pg
  quantity: number;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
};

export async function createItem(data: ItemCreateInput): Promise<Item> {
  const result = await pool.query<Item>(
    `INSERT INTO items (title, description, category, price, quantity, tags, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [
      data.title,
      data.description ?? null,
      data.category ?? null,
      data.price ?? 0,
      data.quantity ?? 0,
      data.tags ?? null,
      data.status ?? "active",
    ]
  );
  return result.rows[0] as unknown as Item;
}

export async function getItemById(id: number): Promise<Item | null> {
  const result = await pool.query<Item>("SELECT * FROM items WHERE id = $1", [
    id,
  ]);
  return result.rows[0] ?? null;
}

export async function updateItem(
  id: number,
  data: ItemUpdateInput
): Promise<Item | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${idx++}`);
    values.push(value as unknown);
  }
  if (fields.length === 0) return await getItemById(id);
  values.push(id);
  const sql = `UPDATE items SET ${fields.join(
    ", "
  )} WHERE id = $${idx} RETURNING *`;
  const result = await pool.query<Item>(sql, values);
  return result.rows[0] ?? null;
}

export async function deleteItem(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM items WHERE id = $1", [id]);
  return (result as any).rowCount > 0;
}

export async function listItems(
  params: ItemQuery
): Promise<{ items: Item[]; total: number; page: number; pageSize: number }> {
  const { q, page = 1, pageSize = 10, status, category } = params;
  const filters: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  if (q && q.trim()) {
    // Escape special chars to avoid tsquery errors
    const safeQ = q.replace(/[':]/g, " ");
    filters.push(
      `to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')) @@ to_tsquery('english', $${idx})`
    );
    values.push(`${safeQ}:*`); // 👈 add :* for prefix match
    idx++;
  }
  if (status) {
    filters.push(`status = $${idx}`);
    values.push(status);
    idx++;
  }
  if (category) {
    filters.push(`category = $${idx}`);
    values.push(category);
    idx++;
  }
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const offset = (page - 1) * pageSize;

  const totalRes = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text as count FROM items ${where}`,
    values
  );
  const total = parseInt(totalRes.rows[0]?.count ?? "0", 10);

  const listRes = await pool.query<Item>(
    `SELECT * FROM items ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${
      idx + 1
    }`,
    [...values, pageSize, offset]
  );

  return { items: listRes.rows as unknown as Item[], total, page, pageSize };
}
