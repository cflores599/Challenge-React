import React, { useState } from "react";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function EditableList({
  items: initial = [],
  onChange,
  markDirty,
}) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const [newText, setNewText] = useState("");
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, 3);

  function addItem() {
    if (!newText.trim()) return;
    const next = [...items, { id: Date.now(), text: newText.trim() }];
    setItems(next);
    onChange(next);
    markDirty?.();
    setNewText("");
  }

  function updateItem(id, text) {
    const next = items.map((i) => (i.id === id ? { ...i, text } : i));
    setItems(next);
    onChange(next);
    markDirty?.();
  }

  function deleteItem(id) {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    onChange(next);
    markDirty?.();
  }

  function startEdit(item) {
    setEditing(item.id);
    setDraft(item.text);
  }
  function saveEdit(id) {
    const t = draft.trim();
    if (!t) {
      // cancel if empty
      setEditing(null);
      return;
    }
    updateItem(id, t);
    setEditing(null);
  }
  function cancelEdit() {
    setEditing(null);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto scroll-hidden space-y-2 pr-1">
        {visibleItems.map((it) => (
          <div key={it.id} className="text-sm">
            {editing === it.id ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  className="border rounded p-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(it.id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                  aria-label="Edit item"
                />
                <button
                  onClick={() => saveEdit(it.id)}
                  className="btn btn-muted p-0.5"
                  aria-label="Save item"
                  title="Save"
                >
                  <CheckIcon className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="btn btn-muted p-0.5"
                  aria-label="Cancel edit"
                  title="Cancel"
                >
                  <XMarkIcon className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {it.text}
              </div>
            )}
            <div className="mt-1 flex items-center justify-end gap-1">
              <button
                onClick={() => (editing === it.id ? cancelEdit() : startEdit(it))}
                className="btn btn-muted p-0.5"
                aria-label="Edit item"
                title="Edit"
              >
                <PencilIcon className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => deleteItem(it.id)}
                className="btn btn-muted p-0.5"
                aria-label="Delete item"
                title="Delete"
              >
                <TrashIcon className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <input
        className="border rounded p-1 text-sm w-full mt-2 focus:outline-none focus:ring-2 focus:ring-brand/50 placeholder:truncate"
        placeholder="Type and press Enter to add..."
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addItem()}
        aria-label="Add list item"
        title="Type and press Enter to add"
      />

      {items.length > 3 && (
        <button
          className="text-brand text-xs font-medium mt-2 hover:underline self-center"
          onClick={() => setExpanded(!expanded)}
          aria-label="Show more or less items"
        >
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      )}
    </div>
  );
}
