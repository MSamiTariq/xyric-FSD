import { Router } from "express";
import {
  handleCreate,
  handleDelete,
  handleGet,
  handleList,
  handleUpdate,
} from "../modules/items/items.controller";

const router = Router();

router.get("/", handleList);
router.get("/:id", handleGet);
router.post("/", handleCreate);
router.put("/:id", handleUpdate);
router.delete("/:id", handleDelete);

export default router;
