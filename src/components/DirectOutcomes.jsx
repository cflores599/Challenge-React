import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

/**
 * DirectOutcomes
 * - outcomes: [{ id, title, subs: [{id, text}] }]
 * - add outcome via bottom input (Enter)
 * - expand outcome to show subs (and sub input inside expanded area)
 * - edit title inline (Pencil) and edit subs inline
 * - delete outcome / delete sub
 * - show more / show less (internal list slice) - keeps card height fixed
 *
 * Props:
 *  - initial: array
 *  - onChange: (next) => void
 *  - markDirty: () => void
 */
export default function DirectOutcomes({ initial = [], onChange, markDirty }) {
  const [outcomes, setOutcomes] = useState(() =>
    (initial || []).map((o) => ({ ...o, subs: o.subs || [] }))
  );

  // expanded outcome id for accordion
  const [expandedId, setExpandedId] = useState(null);

  // editing states
  const [editingOutcomeId, setEditingOutcomeId] = useState(null);
  const [editingSub, setEditingSub] = useState({
    outcomeId: null,
    subId: null,
  });

  // controlled input for creating new outcome
  const [newOutcomeText, setNewOutcomeText] = useState("");

  // show more toggle for the list
  const [showAll, setShowAll] = useState(false);

  const editOutcomeRef = useRef(null);
  const editSubRef = useRef(null);
  const newOutcomeRef = useRef(null);
  const newSubRefs = useRef({}); // map outcomeId -> ref

  useEffect(() => {
    onChange?.(outcomes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcomes]);

  // helpers to persist state + notify
  function setAndNotify(next) {
    setOutcomes(next);
    onChange?.(next);
    markDirty?.();
  }

  // Add new outcome with text (from input)
  function addOutcomeFromInput(text) {
    const t = String(text || "").trim();
    if (!t) return;
    const next = [
      ...outcomes,
      { id: Date.now().toString(), title: t, subs: [] },
    ];
    setAndNotify(next);
    setNewOutcomeText("");
    // optional: expand new one
    setTimeout(() => setExpandedId(next[next.length - 1].id), 50);
  }

  function deleteOutcome(id) {
    const next = outcomes.filter((o) => o.id !== id);
    setAndNotify(next);
    if (expandedId === id) setExpandedId(null);
  }

  function startEditOutcome(id) {
    setEditingOutcomeId(id);
    setTimeout(() => editOutcomeRef.current?.focus(), 0);
  }

  function saveEditOutcome(id, newTitle) {
    const t = String(newTitle || "").trim();
    if (!t) return cancelEditOutcome();
    const next = outcomes.map((o) => (o.id === id ? { ...o, title: t } : o));
    setAndNotify(next);
    setEditingOutcomeId(null);
  }

  function cancelEditOutcome() {
    setEditingOutcomeId(null);
  }

  // subs
  function addSubFromInput(outcomeId, text) {
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
    setAndNotify(next);
    // clear the input for that outcome
    if (newSubRefs.current[outcomeId]) {
      newSubRefs.current[outcomeId].value = "";
      newSubRefs.current[outcomeId].focus();
    }
  }

  function startEditSub(outcomeId, subId) {
    setEditingSub({ outcomeId, subId });
    setTimeout(() => editSubRef.current?.focus(), 0);
  }

  function saveEditSub(outcomeId, subId, newText) {
    const t = String(newText || "").trim();
    if (!t) return cancelEditSub();
    const next = outcomes.map((o) =>
      o.id === outcomeId
        ? {
            ...o,
            subs: o.subs.map((s) => (s.id === subId ? { ...s, text: t } : s)),
          }
        : o
    );
    setAndNotify(next);
    setEditingSub({ outcomeId: null, subId: null });
  }

  function cancelEditSub() {
    setEditingSub({ outcomeId: null, subId: null });
  }

  function deleteSub(outcomeId, subId) {
    const next = outcomes.map((o) =>
      o.id === outcomeId
        ? { ...o, subs: o.subs.filter((s) => s.id !== subId) }
        : o
    );
    setAndNotify(next);
  }

  // visible slice for show more
  const visible = showAll ? outcomes : outcomes.slice(0, 2);

  return (
    <div className="flex flex-col h-full">
      {/* internal scroll area */}
      <div className="flex-1 overflow-auto scroll-hidden space-y-3 pr-2">
        {visible.map((outcome) => (
          <div
            key={outcome.id}
            className="bg-white border border-gray-100 rounded-md p-2"
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="flex-1 min-w-0">
                {editingOutcomeId === outcome.id ? (
                  <input
                    ref={editOutcomeRef}
                    value={outcome.title}
                    onChange={(e) => {
                      const next = outcomes.map((o) =>
                        o.id === outcome.id
                          ? { ...o, title: e.target.value }
                          : o
                      );
                      setOutcomes(next);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        saveEditOutcome(outcome.id, outcome.title);
                      if (e.key === "Escape") cancelEditOutcome();
                    }}
                    onBlur={() => cancelEditOutcome()}
                    className="w-full border rounded p-1 text-sm"
                  />
                ) : (
                  <div className="font-medium text-sm whitespace-pre-wrap break-words">
                    {outcome.title}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 justify-end">
                {/* Edit */}
                <button
                  onClick={() =>
                    editingOutcomeId === outcome.id
                      ? cancelEditOutcome()
                      : startEditOutcome(outcome.id)
                  }
                  className="btn btn-muted p-0.5"
                  aria-label="Edit outcome"
                  title="Edit"
                >
                  <PencilIcon className="w-2.5 h-2.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteOutcome(outcome.id)}
                  className="btn btn-muted p-0.5"
                  aria-label="Delete outcome"
                  title="Delete"
                >
                  <TrashIcon className="w-2.5 h-2.5" />
                </button>

                {/* Toggle expand */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === outcome.id ? null : outcome.id)
                  }
                  className="btn btn-muted p-0.5"
                  aria-label="Toggle expand"
                  title={expandedId === outcome.id ? "Collapse" : "Expand"}
                >
                  {expandedId === outcome.id ? (
                    <ChevronUpIcon className="w-2.5 h-2.5" />
                  ) : (
                    <ChevronDownIcon className="w-2.5 h-2.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded content: subs + input */}
            {expandedId === outcome.id && (
              <div className="mt-2 pl-3 border-l-2 border-gray-100 space-y-2 max-h-40 overflow-auto scroll-hidden">
                {(outcome.subs || []).map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2">
                    {editingSub.outcomeId === outcome.id &&
                    editingSub.subId === sub.id ? (
                      <input
                        ref={editSubRef}
                        className="border rounded p-1 flex-1 text-sm"
                        value={sub.text}
                        onChange={(e) => {
                          const next = outcomes.map((o) =>
                            o.id === outcome.id
                              ? {
                                  ...o,
                                  subs: o.subs.map((s) =>
                                    s.id === sub.id
                                      ? { ...s, text: e.target.value }
                                      : s
                                  ),
                                }
                              : o
                          );
                          setOutcomes(next);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            saveEditSub(outcome.id, sub.id, sub.text);
                          if (e.key === "Escape") cancelEditSub();
                        }}
                        onBlur={() => cancelEditSub()}
                      />
                    ) : (
                      <div className="flex-1 text-sm break-words">
                        {sub.text}
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      {/* Edit sub */}
                      <button
                        onClick={() =>
                          setEditingSub((prev) =>
                            prev.outcomeId === outcome.id &&
                            prev.subId === sub.id
                              ? { outcomeId: null, subId: null }
                              : { outcomeId: outcome.id, subId: sub.id }
                          )
                        }
                        className="btn btn-muted p-0.5"
                        aria-label="Edit sub"
                        title="Edit sub-outcome"
                      >
                        <PencilIcon className="w-2.5 h-2.5" />
                      </button>

                      {/* Delete sub */}
                      <button
                        onClick={() => deleteSub(outcome.id, sub.id)}
                        className="btn btn-muted p-0.5"
                        aria-label="Delete sub"
                        title="Delete sub-outcome"
                      >
                        <TrashIcon className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add sub input */}
                <input
                  ref={(el) => (newSubRefs.current[outcome.id] = el)}
                  className="border rounded p-1 w-full text-sm"
                  placeholder="Type and press Enter to add sub-outcome"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = e.target.value;
                      addSubFromInput(outcome.id, val);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {/* if not showing all and there are more, indicate count */}
        {!showAll && outcomes.length > 2 && (
          <div className="text-xs text-gray-500">
            Showing 2 of {outcomes.length}
          </div>
        )}
      </div>

      {/* show more / show less */}
      {outcomes.length > 2 && (
        <div className="mt-2 text-right">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="text-xs text-brand hover:underline"
            aria-label="Show more or less outcomes"
          >
            {showAll ? "Show less ↑" : "Show more ↓"}
          </button>
        </div>
      )}

      {/* add outcome input (no button; Enter adds) */}
      <div className="mt-2">
        <input
          ref={newOutcomeRef}
          value={newOutcomeText}
          onChange={(e) => setNewOutcomeText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addOutcomeFromInput(newOutcomeText);
            }
          }}
          placeholder="Type and press Enter to add outcome"
          className="w-full border rounded p-2 text-sm"
        />
      </div>
    </div>
  );
}
