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
      <label htmlFor="reason-textarea" className="sr-only">The reason we exist</label>
      <textarea
        id="reason-textarea"
        aria-describedby="reason-helper"
        value={text}
        onChange={handleChange}
        placeholder="e.g. Strengthening local neighbourhoods through the power of food."
        maxLength={limit}
        className="w-full h-32 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none placeholder:truncate"
      />
      <div id="reason-helper" className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
        <span>Main challenge your organization adressess (up to 250 words).</span>
        <span>{text.length}/{limit}</span>
      </div>
    </div>
  );
}
