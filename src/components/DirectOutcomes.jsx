import React, { useState } from "react";

function OutcomeItem({ o, onToggle, onDelete, onAddSub, onDeleteSub }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onToggle(o.id)}
          className="flex-1 text-left font-medium text-sm"
        >
          {o.open ? "▼" : "▶"} {o.title}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => onDelete(o.id)} aria-label={`delete-${o.id}`}>
            🗑
          </button>
        </div>
      </div>

      {o.open && (
        <div className="mt-2 ml-4 space-y-2">
          {(o.subs || []).map((s) => (
            <div
              key={s.id}
              className="flex items-start justify-between text-sm"
            >
              <div className="flex-1 pr-2">{s.text}</div>
              <div>
                <button
                  className="text-xs"
                  onClick={() => onDeleteSub(o.id, s.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}

          <input
            placeholder="Type and press Enter to add..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAddSub(o.id, e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full p-1 border rounded text-sm focus:ring-1 focus:ring-brand/50"
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default function DirectOutcomes({ initial = [], onChange, markDirty }) {
  const [outcomes, setOutcomes] = useState(initial || []);

  function addOutcome(title) {
    const t = String(title || "").trim();
    if (!t) return;
    const next = [
      ...outcomes,
      { id: Date.now().toString(), title: t, open: false, subs: [] },
    ];
    setOutcomes(next);
    onChange?.(next);
    markDirty?.();
  }
  function deleteOutcome(id) {
    setOutcomes(outcomes.filter((o) => o.id !== id));
    onChange?.(outcomes.filter((o) => o.id !== id));
    markDirty?.();
  }
  function toggleOpen(id) {
    setOutcomes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, open: !o.open } : o))
    );
  }
  function addSub(outcomeId, text) {
    const t = String(text || "").trim();
    if (!t) return;
    const next = outcomes.map((o) =>
      o.id === outcomeId
        ? {
            ...o,
            subs: [...(o.subs || []), { id: Date.now().toString(), text: t }],
          }
        : o
    );
    setOutcomes(next);
    onChange?.(next);
    markDirty?.();
  }
  function deleteSub(outcomeId, subId) {
    const next = outcomes.map((o) =>
      o.id === outcomeId
        ? { ...o, subs: (o.subs || []).filter((s) => s.id !== subId) }
        : o
    );
    setOutcomes(next);
    onChange?.(next);
    markDirty?.();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto scroll-hidden pr-2">
        {outcomes.length === 0 && (
          <div className="text-sm text-gray-500">
            No direct outcomes yet. Add one below.
          </div>
        )}
        {outcomes.map((o) => (
          <OutcomeItem
            key={o.id}
            o={o}
            onToggle={toggleOpen}
            onDelete={deleteOutcome}
            onAddSub={addSub}
            onDeleteSub={deleteSub}
          />
        ))}
      </div>

      <div className="mt-3">
        <input
          placeholder="Add outcome (Enter)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addOutcome(e.target.value);
              e.target.value = "";
            }
          }}
          className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-brand/50"
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
