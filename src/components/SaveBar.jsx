import React, { useState } from "react";
import { saveJSON } from "../utils/storage";

export default function SaveBar({ data, dirty, onSaved }) {
  const [savedMsg, setSavedMsg] = useState("");

  function handleSave() {
    console.log("Saved JSON:", JSON.stringify(data, null, 2));
    saveJSON("challenge_snapshot", data);
    setSavedMsg("Saved!");
    onSaved?.();
    setTimeout(() => setSavedMsg(""), 2000);
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <button
        disabled={!dirty}
        onClick={handleSave}
        className={`btn ${
          dirty ? "btn-primary" : "btn-muted cursor-not-allowed"
        } shadow-sm`}
      >
        💾 Save
      </button>
      {savedMsg && (
        <div className="mt-2 text-sm text-green-600 animate-fade-in">
          {savedMsg}
        </div>
      )}
    </div>
  );
}
