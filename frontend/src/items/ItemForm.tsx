import { useState } from "react";
import { z } from "zod";
import type { Item } from "./api";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(5000).nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  quantity: z.coerce.number().int().min(0).default(0),
  tags: z.string().optional(), // comma-separated in UI
  status: z.enum(["active", "inactive"]).default("active"),
});

type FormValues = z.infer<typeof formSchema>;

export function ItemForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Item | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormValues>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "",
    price: Number(initial?.price ?? 0),
    quantity: initial?.quantity ?? 0,
    tags: Array.isArray(initial?.tags) ? initial?.tags?.join(", ") : "",
    status: (initial?.status as "active" | "inactive") ?? "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (v && v.length) fieldErrors[k] = v[0]!;
      }
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    const payload = {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category: parsed.data.category ?? null,
      price: parsed.data.price,
      quantity: parsed.data.quantity,
      tags: parsed.data.tags
        ? parsed.data.tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
      status: parsed.data.status,
    };

    await onSubmit(payload);
    setSubmitting(false);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="grid-2">
        <label>
          <span>Title</span>
          <input name="title" value={values.title} onChange={handleChange} />
          {errors.title && <em className="error">{errors.title}</em>}
        </label>
        <label>
          <span>Category</span>
          <input
            name="category"
            value={values.category ?? ""}
            onChange={handleChange}
          />
          {errors.category && <em className="error">{errors.category}</em>}
        </label>
      </div>
      <label>
        <span>Description</span>
        <textarea
          name="description"
          value={values.description ?? ""}
          onChange={handleChange}
        />
        {errors.description && <em className="error">{errors.description}</em>}
      </label>
      <div className="grid-3">
        <label>
          <span>Price</span>
          <input
            name="price"
            type="number"
            step="0.01"
            value={values.price}
            onChange={handleChange}
          />
          {errors.price && <em className="error">{errors.price}</em>}
        </label>
        <label>
          <span>Quantity</span>
          <input
            name="quantity"
            type="number"
            value={values.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <em className="error">{errors.quantity}</em>}
        </label>
        <label>
          <span>Status</span>
          <select name="status" value={values.status} onChange={handleChange}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          {errors.status && <em className="error">{errors.status}</em>}
        </label>
      </div>
      <label>
        <span>Tags (comma-separated)</span>
        <input
          name="tags"
          value={values.tags ?? ""}
          onChange={handleChange}
          placeholder="e.g. cardio, monitoring"
        />
        {errors.tags && <em className="error">{errors.tags}</em>}
      </label>
      <div className="actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
