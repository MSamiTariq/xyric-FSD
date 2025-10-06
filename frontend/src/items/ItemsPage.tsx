import { useEffect, useMemo, useState } from "react";
import {
  createItem,
  deleteItem,
  listItems,
  updateItem,
  type Item,
} from "./api";
import { ItemForm } from "./ItemForm";
import { pushToast } from "../components/Toast";

export function ItemsPage({ apiBase }: { apiBase: string }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    items: Item[];
    total: number;
    page: number;
    pageSize: number;
  }>({ items: [], total: 0, page: 1, pageSize: 10 });
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);

  const debouncedQ = useDebouncedValue(q, 300);

  async function load() {
    setLoading(true);
    try {
      const res = await listItems(apiBase, { q: debouncedQ, page, pageSize });
      setData(res);
    } catch (e) {
      pushToast((e as Error).message || "Failed to load", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, page, pageSize]);

  async function onCreate(
    values: Partial<Item> & { title: string; price: number }
  ) {
    try {
      const item = await createItem(apiBase, values);
      pushToast("Item created", "success");
      setCreating(false);
      setPage(1);
      setQ("");
      await load();
    } catch (e) {
      pushToast((e as Error).message || "Create failed", "error");
    }
  }

  async function onUpdate(values: Partial<Item>) {
    if (!editing) return;
    try {
      const item = await updateItem(apiBase, editing.id, values);
      pushToast("Item updated", "success");
      setEditing(null);
      await load();
    } catch (e) {
      pushToast((e as Error).message || "Update failed", "error");
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteItem(apiBase, id);
      pushToast("Item deleted", "success");
      await load();
    } catch (e) {
      pushToast((e as Error).message || "Delete failed", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="card">
      <div className="toolbar">
        <input
          placeholder="Search items..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <button onClick={() => setCreating(true)}>New Item</button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={6}>No items</td>
              </tr>
            ) : (
              data.items.map((it) => (
                <tr key={it.id}>
                  <td data-label="Title">{it.title}</td>
                  <td data-label="Category">{it.category ?? "-"}</td>
                  <td data-label="Price">${Number(it.price).toFixed(2)}</td>
                  <td data-label="Qty">{it.quantity}</td>
                  <td data-label="Status">{it.status}</td>
                  <td data-label="Actions">
                    <button onClick={() => setEditing(it)}>Edit</button>
                    <button className="danger" onClick={() => onDelete(it.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="left">
          <span>
            Page {page} / {totalPages} • Total {data.total}
          </span>
        </div>
        <div className="right">
          <select
            className="page-size-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
          <button
            className="nav-button"
            disabled={page <= 1}
            onClick={() => setPage(1)}
          >
            {"<<"}
          </button>
          <button
            className="nav-button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {"<"}
          </button>
          <button
            className="nav-button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {">"}
          </button>
          <button
            className="nav-button"
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
          >
            {">>"}
          </button>
        </div>
      </div>

      {creating && (
        <Modal onClose={() => setCreating(false)} title="Create Item">
          <ItemForm onSubmit={onCreate} onCancel={() => setCreating(false)} />
        </Modal>
      )}

      {editing && (
        <Modal
          onClose={() => setEditing(null)}
          title={`Edit: ${editing.title}`}
        >
          <ItemForm
            initial={editing}
            onSubmit={onUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

function useDebouncedValue<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
