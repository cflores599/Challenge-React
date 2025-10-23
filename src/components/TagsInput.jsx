import React, { useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function TagsInput({ tags = [], onChange, markDirty }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  function addTag(t) {
    const val = t.trim();
    if (!val || tags.some((tag) => tag.toLowerCase() === val.toLowerCase()))
      return;
    const next = [...tags, val];
    onChange(next);
    markDirty?.();
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function removeTag(i) {
    const next = tags.filter((_, idx) => idx !== i);
    onChange(next);
    markDirty?.();
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center bg-brand/10 text-brand px-2 py-1 rounded-full text-xs border border-brand/20"
          >
            {t}
            <button
              onClick={() => removeTag(i)}
              className="ml-1 text-brand hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/40 rounded"
              aria-label={`Remove tag ${t}`}
              title={`Remove tag ${t}`}
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        aria-label="Add people tag"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
          }
          if (e.key === "Backspace" && input === "" && tags.length > 0)
            removeTag(tags.length - 1);
        }}
        placeholder="Type and press Enter..."
        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 placeholder:truncate"
        title="Type and press Enter to add"
      />
      <p className="text-[11px] text-gray-500 mt-1">Add each participant type and press Enter</p>
    </div>
  );
}
