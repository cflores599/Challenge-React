import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function TagsInput({ tags = [], onChange, markDirty }) {
  const [input, setInput] = useState("");

  function addTag(t) {
    const val = t.trim();
    if (!val || tags.some((tag) => tag.toLowerCase() === val.toLowerCase()))
      return;
    const next = [...tags, val];
    onChange(next);
    markDirty?.();
    setInput("");
  }

  function removeTag(i) {
    const next = tags.filter((_, idx) => idx !== i);
    onChange(next);
    markDirty?.();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t, i) => (
          <span
            key={t}
            className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs"
          >
            {t}
            <button
              onClick={() => removeTag(i)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
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
        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-brand/50"
      />
    </div>
  );
}
