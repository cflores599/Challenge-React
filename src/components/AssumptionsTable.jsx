import React, { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const CERTAINTY_COLORS = {
  "Very certain": "bg-green-100 text-green-800",
  "Moderately certain": "bg-yellow-100 text-yellow-800",
  Uncertain: "bg-red-100 text-red-800",
};

export default function AssumptionsTable({
  initial = [],
  onChange,
  markDirty,
}) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [newRow, setNewRow] = useState({ desc: "", certainty: "Very certain" });
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = rows.slice(start, end);

  function handleAdd() {
    if (!newRow.desc.trim()) return;
    const added = [...rows, { id: Date.now(), ...newRow }];
    setRows(added);
    onChange(added);
    markDirty?.();
    setNewRow({ desc: "", certainty: "Very certain" });
    // go to last page to show newly added row
    const newTotalPages = Math.max(1, Math.ceil(added.length / pageSize));
    setPage(newTotalPages);
  }

  function handleDelete(id) {
    const next = rows.filter((r) => r.id !== id);
    setRows(next);
    onChange(next);
    markDirty?.();
    // adjust page if current became empty
    const newTotalPages = Math.max(1, Math.ceil(next.length / pageSize));
    if (page > newTotalPages) setPage(newTotalPages);
  }

  function handleSaveEdit(id, updated) {
    const next = rows.map((r) => (r.id === id ? updated : r));
    setRows(next);
    onChange(next);
    markDirty?.();
    setEditing(null);
  }

  const CertaintySelect = ({ value, onChange }) => (
    <div className="fancy-select-wrapper">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="fancy-select text-sm focus:outline-none"
        aria-label="Select certainty"
      >
        {Object.keys(CERTAINTY_COLORS).map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDownIcon className="w-4 h-4 fancy-arrow text-gray-400" />
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="text-left py-2 w-2/3">Description</th>
            <th className="text-left py-2 w-1/5">Certainty</th>
            <th className="text-left py-2 w-[10%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r) => (
            <tr
              key={r.id}
              className={editing === r.id ? "active-row" : "border-b"}
            >
              <td className="py-2 pr-2">
                {editing === r.id ? (
                  <input
                    autoFocus
                    className="w-full border rounded p-1 text-sm"
                    value={r.desc}
                    onChange={(e) =>
                      setRows(
                        rows.map((x) =>
                          x.id === r.id ? { ...x, desc: e.target.value } : x
                        )
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(r.id, r);
                      if (e.key === "Escape") setEditing(null);
                    }}
                  />
                ) : (
                  r.desc
                )}
              </td>
              <td className="py-2 pr-2">
                {editing === r.id ? (
                  <CertaintySelect
                    value={r.certainty}
                    onChange={(val) =>
                      setRows(
                        rows.map((x) =>
                          x.id === r.id ? { ...x, certainty: val } : x
                        )
                      )
                    }
                  />
                ) : (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      CERTAINTY_COLORS[r.certainty]
                    }`}
                  >
                    {r.certainty}
                  </span>
                )}
              </td>
              <td className="py-2 text-gray-600">
                {editing === r.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSaveEdit(r.id, r)}
                      className="btn btn-muted p-1"
                      aria-label="Save assumption"
                      title="Save"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="btn btn-muted p-1"
                      aria-label="Cancel edit"
                      title="Cancel"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(r.id)}
                      className="btn btn-muted p-1"
                      aria-label="Edit assumption"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="btn btn-muted p-1"
                      aria-label="Delete assumption"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}

          <tr className="bg-gray-50">
            <td className="py-2 pr-2">
              <input
                placeholder="Add new assumption..."
                className="w-full border rounded p-1 text-sm"
                value={newRow.desc}
                onChange={(e) => setNewRow({ ...newRow, desc: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
            </td>
            <td className="py-2 pr-2">
              <CertaintySelect
                value={newRow.certainty}
                onChange={(val) => setNewRow({ ...newRow, certainty: val })}
              />
            </td>
            <td className="py-2">
              <button
                onClick={handleAdd}
                className="btn btn-primary text-xs py-1 px-2"
                aria-label="Add assumption"
                title="Add assumption"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
        <div>
          Rows {rows.length === 0 ? 0 : start + 1}-{Math.min(end, rows.length)} of {rows.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-muted py-1 px-2 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            title="Previous"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="btn btn-muted py-1 px-2 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            title="Next"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
