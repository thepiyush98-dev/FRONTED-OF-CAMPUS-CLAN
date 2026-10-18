import React, { useState } from "react"
import { Student, Clan } from "@/types"
import Icon from "@/components/common/Icon"

interface SuspendModalProps {
  isOpen: boolean
  students: Student[]
  clans: Clan[]
  targetEntity?: { type: "student" | "clan"; id: string } | null
  onClose: () => void
  onConfirmSuspend: (type: "student" | "clan", id: string, reason: string, durationDays: number, endDate: string) => void
}

/**
 * SuspendModal: Section 6 Administrative Suspension Dialog
 * Calculates dynamic end date and clarifies the difference between reversible suspension and permanent deletion.
 */
export default function SuspendModal({
  isOpen,
  students,
  clans,
  targetEntity,
  onClose,
  onConfirmSuspend,
}: SuspendModalProps) {
  if (!isOpen) return null

  const activeStudents = students.filter((s) => s.status === "Active")
  const activeClans = clans.filter((c) => c.status === "Active")

  const [type, setType] = useState<"student" | "clan">(targetEntity?.type || "student")
  const [selectedId, setSelectedId] = useState<string>(
    targetEntity?.id || (type === "student" ? activeStudents[0]?.id || "" : activeClans[0]?.id || "")
  )
  const [durationDays, setDurationDays] = useState(14)
  const [reason, setReason] = useState("")

  // Calculate dynamic end date
  const startDate = new Date()
  const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reason.trim()) return

    onConfirmSuspend(type, selectedId, reason, durationDays, endDate)
    onClose()
  }

  const targetName =
    type === "student"
      ? students.find((s) => s.id === selectedId)?.name || "Selected Student"
      : clans.find((c) => c.id === selectedId)?.name || "Selected Clan"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center">
              <Icon name="shield" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Apply Suspension Restriction</h3>
              <p className="text-xs text-rose-200">Reversible Disciplinary Hold (Section 6)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          {/* Target Type Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
              1. Suspension Target Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType("student")
                  setSelectedId(activeStudents[0]?.id || "")
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  type === "student"
                    ? "bg-rose-50 text-rose-800 border-rose-300 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                Individual Student
              </button>

              <button
                type="button"
                onClick={() => {
                  setType("clan")
                  setSelectedId(activeClans[0]?.id || "")
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  type === "clan"
                    ? "bg-rose-50 text-rose-800 border-rose-300 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                Clan Team
              </button>
            </div>
          </div>

          {/* Target Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              2. Select {type === "student" ? "Student" : "Clan"}
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 bg-white"
            >
              {type === "student"
                ? activeStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (@{s.username} · {s.branch})
                    </option>
                  ))
                : activeClans.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.speciality})
                    </option>
                  ))}
            </select>
          </div>

          {/* Duration Selector & End Date Calculation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Duration (Days)
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              >
                <option value={7}>7 Days (1 Week)</option>
                <option value={14}>14 Days (2 Weeks)</option>
                <option value={30}>30 Days (1 Month)</option>
                <option value={90}>90 Days (Term)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Calculated Expiry Date
              </label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-900">
                {endDate}
              </div>
            </div>
          </div>

          {/* Suspension Reason (Mandatory per Section 6) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Mandatory Suspension Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the verified policy infraction, required documents, or behavioral report..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 leading-relaxed"
              required
            />
          </div>

          {/* Section 6 Reversibility Clarification */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900">
            <strong>Reversibility Confirmation:</strong> Unlike permanent deletion, suspensions are fully reversible at any point from the Suspension Management screen.
          </div>

          {/* Controls */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20"
            >
              Apply Suspension to {targetName}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
