import React, { useState, useEffect } from "react";

export default function ReasonTextarea({ value, onChange, markDirty }) {
  const [text, setText] = useState(value || "");
  useEffect(() => setText(value || ""), [value]);

  function handleChange(e) {
    const v = e.target.value.slice(0, 250);
    setText(v);
    onChange?.(v);
    markDirty?.();
  }

  return (
    <label className="block">
      <div className="text-sm font-medium mb-1">
        La razón por la que existimos
      </div>
      <textarea
        aria-label="Reason"
        placeholder="Describe brevemente por qué existimos..."
        value={text}
        onChange={handleChange}
        className="w-full min-h-[96px] p-3 border border-border rounded-md focus:border-brand focus:ring-1 focus:ring-brand transition-shadow hover:shadow-sm"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Helper: conciso y claro.</span>
        <span>{text.length}/250</span>
      </div>
    </label>
  );
}
