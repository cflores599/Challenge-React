import React, { useState, useRef, useEffect } from "react";

export default function TagsInput({ tags = [], onChange, markDirty }) {
  const [items, setItems] = useState(tags);
  const [input, setInput] = useState("");
  const inputRef = useRef();

  useEffect(() => setItems(tags || []), [tags]);

  function addTag(v) {
    const normalized = v.trim();
    if (!normalized) return;
    if (items.some((t) => t.toLowerCase() === normalized.toLowerCase())) {
      setInput("");
      return;
    }
    const next = [...items, normalized];
    setItems(next);
    onChange?.(next);
    markDirty?.();
    setInput("");
  }

  function removeAt(i) {
    const next = items.filter((_, idx) => idx !== i);
    setItems(next);
    onChange?.(next);
    markDirty?.();
  }

  return (
    <div>
      <div className="mb-2 text-sm font-medium">
        Las personas a quienes servimos
      </div>
      <div className="flex flex-wrap gap-2 items-center border border-border p-2 rounded-md">
        {items.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-brand/10 text-brand px-2 py-1 rounded-full text-sm"
          >
            {t}
            <button
              aria-label={`remove-${t}`}
              onClick={() => removeAt(i)}
              className="hover:text-red-500 transition-colors text-xs"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(input);
            }
            if (e.key === "Backspace" && input === "" && items.length) {
              removeAt(items.length - 1);
            }
          }}
          placeholder="Presiona Enter para agregar..."
          className="flex-1 min-w-[120px] p-1 outline-none focus:ring-1 focus:ring-brand/50"
        />
      </div>
    </div>
  );
}
