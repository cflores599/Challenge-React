import React, { useState, useRef } from "react";

function EditableItem({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef();

  function start() {
    setEditing(true);
    setTimeout(() => ref.current?.focus(), 0);
  }

  return editing ? (
    <input
      ref={ref}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSave(val);
          setEditing(false);
        }
        if (e.key === "Escape") {
          setVal(value);
          setEditing(false);
        }
      }}
      onBlur={() => setEditing(false)}
      className="w-full p-1 border rounded text-sm"
      onMouseDown={(e) => e.stopPropagation()}
    />
  ) : (
    <div onDoubleClick={start} className="cursor-text text-sm">
      {value}
    </div>
  );
}

export default function EditableList({
  title,
  zoneLabel,
  items = [],
  onChange,
  markDirty,
}) {
  const [list, setList] = useState(items || []);
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef();

  function add(text) {
    const t = String(text || "").trim();
    if (!t) return;
    const next = [...list, { id: Date.now().toString(), text: t }];
    setList(next);
    onChange?.(next);
    markDirty?.();
    if (inputRef.current) inputRef.current.value = "";
  }
  function remove(id) {
    const next = list.filter((x) => x.id !== id);
    setList(next);
    onChange?.(next);
    markDirty?.();
  }
  function edit(id, text) {
    const next = list.map((x) => (x.id === id ? { ...x, text } : x));
    setList(next);
    onChange?.(next);
    markDirty?.();
  }

  const visible = showAll ? list : list.slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 text-xs text-gray-500">{zoneLabel}</div>

      <div className="flex-1 overflow-auto scroll-hidden pr-2">
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="flex justify-between items-start">
              <div className="flex-1 pr-2">
                <EditableItem
                  value={item.text}
                  onSave={(v) => edit(item.id, v)}
                />
              </div>
              <div className="ml-2">
                <button
                  aria-label={`delete-${item.id}`}
                  onClick={() => remove(item.id)}
                  className="text-sm"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <input
          ref={inputRef}
          placeholder="Type and press Enter to add..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              add(e.target.value);
              e.target.value = "";
            }
          }}
          className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-brand/50"
          onMouseDown={(e) => e.stopPropagation()}
        />
        <div className="mt-2 flex items-center justify-between">
          {list.length > 3 && (
            <button
              onClick={() => setShowAll((s) => !s)}
              className="text-xs text-brand underline"
            >
              {showAll ? "Show less ↑" : "Show more ↓"}
            </button>
          )}
          <div className="text-xs text-gray-400">{list.length} items</div>
        </div>
      </div>
    </div>
  );
}
