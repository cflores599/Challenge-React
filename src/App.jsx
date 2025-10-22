import React, { useState, useEffect } from "react";
import ReasonTextarea from "./components/ReasonTextarea";
import TagsInput from "./components/TagsInput";
import AssumptionsTable from "./components/AssumptionsTable";
import DirectOutcomes from "./components/DirectOutcomes";
import EditableList from "./components/EditableList";
import SaveBar from "./components/SaveBar";
import useDirty from "./hooks/useDirty";
import { loadJSON } from "./utils/storage";

export default function App() {
  const saved = loadJSON("challenge_snapshot", null);

  const defaultPrograms = [
    { id: "p1", text: "Community workshops and after-school activities" },
  ];
  const defaultDirect = [
    {
      id: "d1",
      title: "Students enhance their digital skills",
      open: false,
      subs: [
        {
          id: "d1s1",
          text: "Students incorporate resilience and wellbeing practices",
        },
      ],
    },
  ];
  const defaultIndirect = [
    { id: "i1", text: "Parents adopt supportive study routines at home" },
    { id: "i2", text: "Local businesses offer internships to youth" },
    { id: "i3", text: "Peers form study groups" },
  ];
  const defaultUltimate = [
    {
      id: "u1",
      text: "Youth finish school with qualifications and resilience",
    },
    { id: "u2", text: "Communities benefit from higher youth engagement" },
  ];

  const [reason, setReason] = useState(saved?.reason || "");
  const [tags, setTags] = useState(saved?.tags || []);
  const [assumptions, setAssumptions] = useState(saved?.assumptions || []);
  const [programs, setPrograms] = useState(saved?.programs || defaultPrograms);
  const [directOutcomes, setDirectOutcomes] = useState(
    saved?.directOutcomes || defaultDirect
  );
  const [indirectOutcomes, setIndirectOutcomes] = useState(
    saved?.indirectOutcomes || defaultIndirect
  );
  const [ultimateOutcomes, setUltimateOutcomes] = useState(
    saved?.ultimateOutcomes || defaultUltimate
  );

  const { dirty, mark, reset } = useDirty(false);
  useEffect(() => {
    if (saved) reset();
  }, []);

  const data = {
    reason,
    tags,
    assumptions,
    programs,
    directOutcomes,
    indirectOutcomes,
    ultimateOutcomes,
    meta: { savedAt: new Date().toISOString() },
  };
  function handleSave() {
    reset();
  }

  return (
    <div className="min-h-screen bg-bgLight">
      <div className="page-wrapper py-10">
        <h1 className="text-2xl font-bold text-brand mb-6">Theory of change</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card p-4">
            <div className="card-title">The reason we exist</div>
            <div className="card-body p-0">
              <div className="p-3">
                <ReasonTextarea
                  value={reason}
                  onChange={setReason}
                  markDirty={mark}
                />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="card-title">The people we serve</div>
            <div className="card-body p-0">
              <div className="p-3">
                <TagsInput tags={tags} onChange={setTags} markDirty={mark} />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-4 mb-6">
          <div className="card-title">What we believe to be true</div>
          <div className="p-2">
            <AssumptionsTable
              initial={assumptions}
              onChange={setAssumptions}
              markDirty={mark}
            />
          </div>
        </div>

        <div className="icon-grid mb-2">
          <div className="icon-cell">
            <div className="icon-circle">👥</div>
          </div>
          <div className="icon-cell">
            <div className="icon-circle">📋</div>
          </div>
          <div className="icon-cell">
            <div className="icon-circle">🔁</div>
          </div>
          <div className="icon-cell">
            <div className="icon-circle">🎯</div>
          </div>
        </div>
        <div className="purple-divider" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-4">
            <div className="card-title">Programmes</div>
            <div className="card-body">
              <div className="text-sm text-gray-700">
                {programs.map((p) => (
                  <div key={p.id} className="mb-2">
                    {p.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer">Zone of control</div>
          </div>

          <div className="card p-4">
            <div className="card-title">Direct outcomes</div>
            <div className="card-body">
              <DirectOutcomes
                initial={directOutcomes}
                onChange={setDirectOutcomes}
                markDirty={mark}
              />
            </div>
            <div className="card-footer">Zone of direct influence</div>
          </div>

          <div className="card p-4">
            <div className="card-title">Indirect outcomes</div>
            <div className="card-body p-0">
              <EditableList
                title="Indirect outcomes"
                zoneLabel="Zone of indirect influence"
                items={indirectOutcomes}
                onChange={setIndirectOutcomes}
                markDirty={mark}
              />
            </div>
            <div className="card-footer">Zone of indirect influence</div>
          </div>

          <div className="card p-4 card-dotted">
            <div className="card-title">Ultimate impact</div>
            <div className="card-body p-0">
              <EditableList
                title="Ultimate impact"
                zoneLabel="Zone of contribution"
                items={ultimateOutcomes}
                onChange={setUltimateOutcomes}
                markDirty={mark}
              />
            </div>
            <div className="card-footer">Zone of contribution</div>
          </div>
        </div>
      </div>

      <SaveBar data={data} dirty={dirty} onSaved={handleSave} />
    </div>
  );
}
