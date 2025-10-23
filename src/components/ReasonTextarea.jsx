import React, { useState } from "react";

export default function ReasonTextarea({ value, onChange, markDirty }) {
  const [text, setText] = useState(value || "");
  const limit = 250;
  function handleChange(e) {
    const val = e.target.value;
    setText(val);
    onChange(val);
    markDirty?.();
  }
  return (
    <div className="flex flex-col">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Describe the reason your organization exists..."
        maxLength={limit}
        className="w-full h-32 p-2 border rounded text-sm focus:ring-2 focus:ring-brand/50 resize-none"
      />
      <div className="text-xs text-gray-500 mt-1 text-right">
        {text.length}/{limit}
      </div>
    </div>
  );
}
