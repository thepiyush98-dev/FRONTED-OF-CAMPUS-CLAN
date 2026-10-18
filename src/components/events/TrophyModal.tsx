import React, { useState } from "react"
import { Trophy, EventItem, Student, Clan } from "@/types"
import Icon from "@/components/common/Icon"

interface TrophyModalProps {
  isOpen: boolean
  events: EventItem[]
  students: Student[]
  clans: Clan[]
  onClose: () => void
  onSave: (trophyData: Omit<Trophy, "id">) => void
}

/**
 * TrophyModal: Section 10 Trophy Awarding Workflow
 * Implements the 6-step trophy creation and recipient assignment sequence.
 */
export default function TrophyModal({
  isOpen,
  events,
  students,
  clans,
  onClose,
  onSave,
}: TrophyModalProps) {
  if (!isOpen) return null

  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || "")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [recipientType, setRecipientType] = useState<"student" | "clan">("clan")
  const [selectedRecipientId, setSelectedRecipientId] = useState(clans[0]?.id || "")
  const [error, setError] = useState("")

  const selectedEvent = events.find((e) => e.id === selectedEventId)
  const recipientName =
    recipientType === "clan"
      ? clans.find((c) => c.id === selectedRecipientId)?.name || ""
      : students.find((s) => s.id === selectedRecipientId)?.name || ""

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim()) {
      setError("Please provide an award name and citation description.")
      return
    }

    onSave({
      name,
      description,
      eventId: selectedEventId,
      eventName: selectedEvent?.title || "Campus Event",
      recipientType,
      recipientName,
      awardDate: new Date().toISOString().split("T")[0],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#172033] to-[#25334d] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center">
              <Icon name="trophy" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Award Verified Campus Trophy</h3>
              <p className="text-xs text-slate-300">Section 10 Official Achievement Allocation</p>
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

        {/* Workflow Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {/* Step 1: Select Event */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              1. Associated Campus Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.status} · {evt.type})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Award Name & Citation */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              2. Award / Trophy Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. First Place: Best Scalable Architecture"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              3. Achievement Description / Citation
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the reason for the award, exceptional metrics, or jury verdict..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
              required
            />
          </div>

          {/* Step 3: Recipient Type & Target */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
              4. Recipient Type
            </label>
            <div className="grid grid-cols-2 gap-3 mb-2.5">
              <button
                type="button"
                onClick={() => {
                  setRecipientType("clan")
                  setSelectedRecipientId(clans[0]?.id || "")
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  recipientType === "clan"
                    ? "bg-amber-400 text-slate-950 border-amber-400"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                Clan Team
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecipientType("student")
                  setSelectedRecipientId(students[0]?.id || "")
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  recipientType === "student"
                    ? "bg-amber-400 text-slate-950 border-amber-400"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                Individual Student
              </button>
            </div>

            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {recipientType === "clan"
                ? clans.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.speciality})
                    </option>
                  ))
                : students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.branch})
                    </option>
                  ))}
            </select>
          </div>

          {error && <p className="text-rose-600 text-xs font-semibold">{error}</p>}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md shadow-amber-400/20"
            >
              Confirm & Award Trophy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
