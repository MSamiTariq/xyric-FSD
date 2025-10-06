import { Request, Response, NextFunction } from "express";
import {
  itemCreateSchema,
  itemQuerySchema,
  itemUpdateSchema,
} from "./items.schema";
import {
  createItem,
  deleteItem,
  getItemById,
  listItems,
  updateItem,
} from "./items.service";

export async function handleList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = itemQuerySchema.parse(req.query);
    const result = await listItems(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function handleGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });
    const item = await getItemById(id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function handleCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = itemCreateSchema.parse(req.body);
    const created = await createItem(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });
    const data = itemUpdateSchema.parse(req.body);
    const updated = await updateItem(id, data);
    if (!updated) return res.status(404).json({ error: "Item not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function handleDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });
    const ok = await deleteItem(id);
    if (!ok) return res.status(404).json({ error: "Item not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
