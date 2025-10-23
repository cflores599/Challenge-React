import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SaveBar({ data, dirty, onSaved }) {
  function handleSave() {
    console.log("=== Saved JSON ===");
    console.log(JSON.stringify(data, null, 2));
    alert("✅ Saved!");
    onSaved?.();
  }

  return (
    <div className="fixed bottom-4 right-6">
      <button
        onClick={handleSave}
        disabled={!dirty}
        className={`btn btn-primary px-4 py-2 text-sm flex items-center gap-2 shadow-md ${
          !dirty ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <CheckCircleIcon className="w-4 h-4" />
        Save
      </button>
    </div>
  );
}
