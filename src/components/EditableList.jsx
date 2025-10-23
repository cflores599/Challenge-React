import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function EditableList({
  items: initial = [],
  onChange,
  markDirty,
}) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [newText, setNewText] = useState("");
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, 3);

  function addItem() {
    if (!newText.trim()) return;
    const next = [...items, { id: Date.now(), text: newText }];
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto scroll-hidden space-y-1">
        {visibleItems.map((it) => (
          <div
            key={it.id}
            className="flex justify-between items-center text-sm"
          >
            {editing === it.id ? (
              <input
                autoFocus
                className="border rounded p-1 flex-1 mr-2"
                value={it.text}
                onChange={(e) => updateItem(it.id, e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" || e.key === "Escape"
                    ? setEditing(null)
                    : null
                }
              />
            ) : (
              <div>{it.text}</div>
            )}
            <div className="flex gap-1">
              <button
                onClick={() => setEditing(editing === it.id ? null : it.id)}
                className="btn btn-muted p-1"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteItem(it.id)}
                className="btn btn-muted p-1"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <input
        className="border rounded p-1 text-sm w-full mt-2"
        placeholder="Type and press Enter to add"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addItem()}
      />

      {items.length > 3 && (
        <button
          className="text-brand text-xs font-medium mt-2 hover:underline self-center"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      )}
    </div>
  );
}
