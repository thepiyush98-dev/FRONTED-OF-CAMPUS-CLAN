import React from "react"
import { EventItem, EventParticipant } from "@/types"
import StatusBadge from "@/components/common/StatusBadge"
import Icon from "@/components/common/Icon"

interface ParticipantsModalProps {
  event: EventItem | null
  participants: EventParticipant[]
  isOpen: boolean
  onClose: () => void
}

/**
 * ParticipantsModal: Section 9 Event Participation & Application Review
 * Displays registered individuals and clans with representative lists and 24-hour lock rules.
 */
export default function ParticipantsModal({
  event,
  participants,
  isOpen,
  onClose,
}: ParticipantsModalProps) {
  if (!isOpen || !event) return null

  // Section 9 Rule: Representative selection locked 24 hours before event ends
  const is24HourCutoffLocked = true // Simulated rule state

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#172033] to-[#25334d] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">Event Participation Review</h3>
              <StatusBadge status={event.status} size="sm" />
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {event.title} · {event.startDate} to {event.endDate}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {/* Section 9 Participation Rules Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5 text-xs text-slate-800">
            <strong className="font-bold flex items-center gap-1.5 text-amber-900">
              <Icon name="lock" size={14} className="text-amber-600" />
              Section 9 Operational Guidelines & Cutoff
            </strong>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
              <li>
                <strong>24-Hour Representative Lock:</strong> Representative selection locks 24 hours prior to event closing. Changes are currently {is24HourCutoffLocked ? <span className="text-amber-800 font-bold">LOCKED</span> : "unlocked"}.
              </li>
              <li>
                <strong>Eligibility Rule:</strong> Suspended clans are ineligible to participate in campus events.
              </li>
            </ul>
          </div>

          {/* Participants Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 flex justify-between">
              <span>Registered Participants ({participants.length})</span>
              <span>Mode: {event.participationMode}</span>
            </div>

            <div className="divide-y divide-slate-100">
              {participants.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No participation records submitted for this event yet.
                </div>
              ) : (
                participants.map((part) => (
                  <div key={part.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {part.type}
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
                        <div className="mt-1.5 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">Reps: </span>
                          {part.representatives.join(", ")}
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 block mt-1">
                        Registered: {part.registeredAt}
                      </span>
                    </div>

                    <StatusBadge status={part.status} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  )
}
