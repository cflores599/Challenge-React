import React, { useState, useEffect, useRef } from "react";

const CERTAINTY = ["Very certain", "Moderately certain", "Uncertain"];
const PER_PAGE = 5;

function CertaintyPill({ value }) {
  const color =
    value === "Very certain"
      ? "bg-green-100 text-green-800"
      : value === "Moderately certain"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {value}
    </span>
  );
}

export default function AssumptionsTable({
  initial = [],
  onChange,
  markDirty,
}) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState({ id: null, desc: "", certainty: "" });
  const [page, setPage] = useState(0);
  const [newDesc, setNewDesc] = useState("");
  const [newCertainty, setNewCertainty] = useState("Moderately certain");
  const editRef = useRef();
  const newInputRef = useRef();

  useEffect(() => setRows(initial || []), [initial]);
  useEffect(() => onChange?.(rows), [rows, onChange]);

  function addRow(desc, certainty = "Moderately certain") {
    if (!desc?.trim()) return;
    const newRow = {
      id: Date.now().toString(),
      description: desc.trim(),
      certainty: certainty || "Moderately certain",
    };
    setRows((r) => [...r, newRow]);
    setNewDesc("");
    setNewCertainty("Moderately certain");
    markDirty?.();
    setTimeout(() => newInputRef.current?.focus(), 0);
    setPage(Math.floor(rows.length / PER_PAGE));
  }

  function deleteRow(id) {
    setRows((r) => r.filter((x) => x.id !== id));
    markDirty?.();
  }
  function startEdit(row) {
    setEditing({ id: row.id, desc: row.description, certainty: row.certainty });
    setTimeout(() => editRef.current?.focus(), 0);
  }
  function saveEdit() {
    setRows((r) =>
      r.map((x) =>
        x.id === editing.id
          ? {
              ...x,
              description: editing.desc.trim() || x.description,
              certainty: editing.certainty,
            }
          : x
      )
    );
    setEditing({ id: null, desc: "", certainty: "" });
    markDirty?.();
  }
  function cancelEdit() {
    setEditing({ id: null, desc: "", certainty: "" });
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const paged = rows.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="text-xs text-gray-500 border-b border-border">
          <tr>
            <th className="w-auto font-medium pb-2">Description</th>
            <th className="w-[180px] font-medium pb-2">Certainty</th>
            <th className="w-[100px] font-medium pb-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 align-top">
              <td className="py-2 pr-2">
                {editing.id === row.id ? (
                  <input
                    ref={editRef}
                    value={editing.desc}
                    onChange={(e) =>
                      setEditing((e0) => ({ ...e0, desc: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-brand/50"
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div
                    onDoubleClick={() => startEdit(row)}
                    className="cursor-text"
                  >
                    {row.description}
                  </div>
                )}
              </td>

              <td className="py-2 pr-2">
                {editing.id === row.id ? (
                  <div
                    className="fancy-select-wrapper"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <select
                      value={editing.certainty}
                      onChange={(e) =>
                        setEditing((e0) => ({
                          ...e0,
                          certainty: e.target.value,
                        }))
                      }
                      className="fancy-select"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") cancelEdit();
                      }}
                    >
                      {CERTAINTY.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="fancy-arrow"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="#6b21a8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <CertaintyPill value={row.certainty} />
                )}
              </td>

              <td className="py-2 text-center">
                {editing.id === row.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="text-sm mr-2 text-green-600"
                      aria-label="save-edit"
                    >
                      ✔
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-sm text-gray-500"
                      aria-label="cancel-edit"
                    >
                      ✖
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(row)}
                      className="text-gray-600 mr-2"
                      aria-label={`edit-${row.id}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="text-gray-600"
                      aria-label={`delete-${row.id}`}
                    >
                      🗑
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {/* new row */}
          <tr className="align-top">
            <td className="py-2 pr-2">
              <input
                ref={newInputRef}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addRow(newDesc, newCertainty);
                }}
                placeholder="Type and press Enter to add..."
                className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-brand/50"
                aria-label="new-assumption-description"
                onMouseDown={(e) => e.stopPropagation()}
              />
            </td>

            <td className="py-2 pr-2">
              <div
                className="fancy-select-wrapper"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <select
                  value={newCertainty}
                  onChange={(e) => setNewCertainty(e.target.value)}
                  className="fancy-select"
                  aria-label="new-assumption-certainty"
                >
                  {CERTAINTY.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <svg
                  className="fancy-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#6b21a8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
            </td>

            <td className="py-2 text-center">
              <button
                onClick={() => addRow(newDesc, newCertainty)}
                className="btn btn-primary"
                aria-label="add-assumption"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* pagination */}
      <div className="mt-3 flex justify-between text-xs text-gray-600 items-center">
        <div>
          Showing {paged.length} of {rows.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="btn btn-muted px-2 py-1 text-xs"
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn btn-muted px-2 py-1 text-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
