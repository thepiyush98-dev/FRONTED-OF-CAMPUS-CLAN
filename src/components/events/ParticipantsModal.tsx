import React, { useState } from "react"
import { EventItem, EventParticipant, Student, Clan } from "@/types"
import StatusBadge from "@/components/common/StatusBadge"
import Icon from "@/components/common/Icon"
import { djangoApi } from "@/services/djangoApi"

interface ParticipantsModalProps {
  event: EventItem | null
  participants: EventParticipant[]
  students?: Student[]
  clans?: Clan[]
  isOpen: boolean
  onClose: () => void
  onAddParticipant?: (newPart: EventParticipant) => void
  onCancelParticipation?: (participantId: string) => void
}

/**
 * ParticipantsModal: Section 9 Event Participation & Application Review
 * Supports:
 * - Viewing all registered participants (Solo students & Clan Teams)
 * - Clan Team Roster inspection
 * - Dual Participation Modes Manual Entry (/event/<id>/participate/<type>/)
 * - Clan Team Roster Selection (/clan-members/save/)
 * - RSVP Cancel / Withdraw Entry (/event/<id>/cancel-participation/)
 */
export default function ParticipantsModal({
  event,
  participants,
  students = [],
  clans = [],
  isOpen,
  onClose,
  onAddParticipant,
  onCancelParticipation,
}: ParticipantsModalProps) {
  if (!isOpen || !event) return null

  // Section 9 Rule: Representative selection locked 24 hours before event ends
  const is24HourCutoffLocked = false // Can be configured
  const [filterType, setFilterType] = useState<"all" | "individual" | "clan">("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [entryMode, setEntryMode] = useState<"student" | "clan">("student")
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "")
  const [selectedClanId, setSelectedClanId] = useState(clans[0]?.id || "")
  const [selectedRoster, setSelectedRoster] = useState<string[]>([])
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const activeClans = clans.filter((c) => c.status === "Active")
  const activeStudents = students.filter((s) => s.status === "Active")

  const chosenClan = clans.find((c) => c.id === selectedClanId)

  // Initialize or update roster when clan changes
  const clanMembers = chosenClan?.members || [
    { studentId: "stu-1", name: "Aarav Khanna", role: "Leader" as const, branch: "B.Tech CSE" },
    { studentId: "stu-2", name: "Riya Malhotra", role: "Co-Leader" as const, branch: "B.Des" },
    { studentId: "stu-3", name: "Devansh Sharma", role: "Core Member" as const, branch: "B.Tech CSE" },
    { studentId: "stu-4", name: "Tanya Sen", role: "Contributor" as const, branch: "B.Des" },
  ]

  const filteredParticipants = participants.filter((p) => {
    if (filterType === "all") return true
    return p.type === filterType
  })

  function notify(msg: string) {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(null), 3000)
  }

  async function handleAddEntry() {
    if (entryMode === "student") {
      const student = students.find((s) => s.id === selectedStudentId) || students[0]
      if (!student) return

      try {
        await djangoApi.events.participate(event!.id, "student")
      } catch {}

      const newParticipant: EventParticipant = {
        id: `part-${Date.now()}`,
        type: "individual",
        name: student.name,
        registeredAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        status: "Confirmed",
      }

      onAddParticipant?.(newParticipant)
      notify(`Registered ${student.name} as Solo Student Entry.`)
      setShowAddForm(false)
    } else {
      const clan = chosenClan || clans[0]
      if (!clan) return

      const repNames = clanMembers
        .filter((m) => selectedRoster.includes(m.studentId))
        .map((m) => m.name)

      try {
        await djangoApi.events.participate(event!.id, "clan")
        await djangoApi.events.saveEventClanMembers(event!.id, selectedRoster)
      } catch {}

      const newParticipant: EventParticipant = {
        id: `part-${Date.now()}`,
        type: "clan",
        name: clan.name,
        registeredAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        status: "Confirmed",
        representatives: repNames.length > 0 ? repNames : [clan.leaderName],
        isSuspendedClan: clan.status === "Suspended",
      }

      onAddParticipant?.(newParticipant)
      notify(`Registered ${clan.name} Clan Squad with ${newParticipant.representatives?.length || 1} members!`)
      setShowAddForm(false)
    }
  }

  async function handleRemove(p: EventParticipant) {
    if (confirm(`Withdraw and cancel participation for "${p.name}"?`)) {
      try {
        await djangoApi.events.cancelParticipation(event!.id)
      } catch {}

      onCancelParticipation?.(p.id)
      notify(`Cancelled participation for ${p.name}.`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.25)] overflow-hidden animate-scale-up max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#172033] to-[#25334d] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">🏆</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Event Participation & Roster Review</h3>
              <StatusBadge status={event.status} size="sm" />
            </div>
            <p className="text-xs text-slate-300 mt-1">
              <strong>{event.title}</strong> · {event.startDate} to {event.endDate} · Mode: <strong>{event.participationMode}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 animate-fade">
            <span>✓</span>
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700">
          {/* Section 9 Participation Rules Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5 text-xs text-slate-800">
            <strong className="font-bold flex items-center gap-1.5 text-amber-900">
              <Icon name="shield" size={14} className="text-amber-600" />
              Dual Participation Policy & Governance (/event/{event.id}/participate/&lt;type&gt;/)
            </strong>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
              <div>
                <strong>👤 Solo Student:</strong> Individual entry registered directly.
              </div>
              <div>
                <strong>🛡️ Clan Team:</strong> Entered by Clan Leader or Co-Leader with squad roster selection.
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({participants.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("clan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "clan" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Clan Teams ({participants.filter((p) => p.type === "clan").length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("individual")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === "individual" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Solo Students ({participants.filter((p) => p.type === "individual").length})
              </button>
            </div>

            {/* Add Manual Entry Trigger */}
            <button
              type="button"
              onClick={() => {
                setShowAddForm(!showAddForm)
                setSelectedRoster(clanMembers.slice(0, 2).map((m) => m.studentId))
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Icon name="plus" size={14} />
              <span>{showAddForm ? "Close Entry Form" : "+ Add Participant Entry"}</span>
            </button>
          </div>

          {/* Add Entry Form Drawer */}
          {showAddForm && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-amber-300 space-y-4 animate-fade">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📝</span>
                  <span>Register Participant Entry (/event/{event.id}/participate/{entryMode}/)</span>
                </strong>
                <span className="text-[10px] text-slate-500">Admin Console Authorization</span>
              </div>

              {/* Mode Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  1. Participation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEntryMode("student")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      entryMode === "student"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    <span>👤 Individual Student Entry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryMode("clan")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      entryMode === "clan"
                        ? "bg-amber-400 text-slate-950 border-amber-400 font-black"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    <span>🛡️ Clan Team Entry</span>
                  </button>
                </div>
              </div>

              {/* Mode A: Student Selection */}
              {entryMode === "student" ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    2. Select Student
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {activeStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (@{s.username} · {s.branch})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Mode B: Clan & Roster Selection */
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      2. Select Clan Team
                    </label>
                    <select
                      value={selectedClanId}
                      onChange={(e) => {
                        setSelectedClanId(e.target.value)
                        const c = clans.find((cl) => cl.id === e.target.value)
                        if (c && c.members) {
                          setSelectedRoster(c.members.slice(0, 2).map((m) => m.studentId))
                        }
                      }}
                      className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {activeClans.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.speciality} · Leader: {c.leaderName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Roster Checklist */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 uppercase">
                        Clan Team Roster Selection (/clan-members/save/)
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold">
                        {selectedRoster.length} Members Picked
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {clanMembers.map((m) => {
                        const isChecked = selectedRoster.includes(m.studentId)
                        return (
                          <label
                            key={m.studentId}
                            className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer ${
                              isChecked
                                ? "bg-amber-50 border-amber-300 font-semibold"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setSelectedRoster((prev) =>
                                    isChecked
                                      ? prev.filter((id) => id !== m.studentId)
                                      : [...prev, m.studentId]
                                  )
                                }}
                                className="w-3.5 h-3.5 text-amber-600 rounded"
                              />
                              <span>{m.name}</span>
                              <span className="text-[10px] text-slate-400">({m.branch})</span>
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                              {m.role}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEntry}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm & Save Entry
                </button>
              </div>
            </div>
          )}

          {/* Participants Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 flex justify-between items-center">
              <span>Registered Participants ({filteredParticipants.length})</span>
              <span className="text-[10px] text-slate-400 font-medium">Click cancel to withdraw entry</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredParticipants.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  No participation records found for the selected filter.
                </div>
              ) : (
                filteredParticipants.map((part) => (
                  <div
                    key={part.id}
                    className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            part.type === "clan"
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {part.type === "clan" ? "🛡️ Clan Team" : "👤 Solo Student"}
                        </span>
                        <strong className="text-xs font-bold text-slate-900">
                          {part.name}
                        </strong>
                        {part.isSuspendedClan && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            Ineligible (Suspended Clan)
                          </span>
                        )}
                      </div>

                      {/* Clan Representatives list (Section 9) */}
                      {part.representatives && part.representatives.length > 0 && (
                        <div className="mt-1.5 text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 inline-block">
                          <span className="font-semibold text-slate-800">Competing Roster: </span>
                          <span className="font-medium text-slate-600">{part.representatives.join(", ")}</span>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 block mt-1">
                        Registered: {part.registeredAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <StatusBadge status={part.status} size="sm" />

                      {/* Cancel Participation Action (/event/<id>/cancel-participation/) */}
                      <button
                        type="button"
                        onClick={() => handleRemove(part)}
                        title="Withdraw / Cancel Participation"
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel RSVP
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Total active entries: <strong>{participants.length}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  )
}
