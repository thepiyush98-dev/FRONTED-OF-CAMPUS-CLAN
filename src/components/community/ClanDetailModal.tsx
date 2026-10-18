import React from "react"
import { Clan } from "@/types"
import StatusBadge from "@/components/common/StatusBadge"
import Icon from "@/components/common/Icon"

interface ClanDetailModalProps {
  clan: Clan | null
  isOpen: boolean
  onClose: () => void
  onRemoveMember: (clanId: string, studentId: string, memberName: string) => void
  onSuspendClan: (clan: Clan) => void
  onUnsuspendClan: (clan: Clan) => void
  onDeleteClan: (clan: Clan) => void
}

/**
 * ClanDetailModal: Section 5 Clan Inspection Screen
 * Details clan identity, member roster with roles, projects, recruitment openings, and trophies.
 */
export default function ClanDetailModal({
  clan,
  isOpen,
  onClose,
  onRemoveMember,
  onSuspendClan,
  onUnsuspendClan,
  onDeleteClan,
}: ClanDetailModalProps) {
  if (!isOpen || !clan) return null

  const isSuspended = clan.status === "Suspended"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Banner & Header */}
        <div className="p-6 bg-gradient-to-r from-[#172033] to-[#25334d] text-white flex items-start justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-400/20">
              {clan.initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-white">{clan.name}</h3>
                {isSuspended ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Clan Suspended
                  </span>
                ) : (
                  <StatusBadge status="Active" size="sm" />
                )}
              </div>
              <span className="text-xs text-amber-300 font-semibold block mt-0.5">
                {clan.speciality} · Leader: {clan.leaderName}
              </span>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          {/* Suspension Status Banner */}
          {isSuspended && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <Icon name="shield" size={14} className="text-rose-600" />
                Administrative Hold: Event Ineligibility
              </strong>
              <p>
                Reason: {clan.suspensionDetails?.reason || "Pending administrative inquiry"}
              </p>
              <p className="text-[11px] text-rose-600">
                Duration: {clan.suspensionDetails?.durationDays} days (until {clan.suspensionDetails?.endDate}).
              </p>
            </div>
          )}

          {/* Full Description */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              About the Clan
            </span>
            <p className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl text-slate-700 leading-relaxed text-xs">
              {clan.fullDescription}
            </p>
          </div>

          {/* Member Roster with Administrative Removal Control (Section 5 Requirement) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Member Roster ({clan.members.length} core listed)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Total Team Seats: {clan.memberCount}
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
              {clan.members.map((member) => (
                <div
                  key={member.studentId}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong className="block text-slate-900 font-bold text-xs">
                        {member.name}
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        {member.branch}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {member.role}
                    </span>

                    {/* Section 5 Remove Member from Clan Action */}
                    <button
                      type="button"
                      onClick={() => onRemoveMember(clan.id, member.studentId, member.name)}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects & Recruitment Openings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Projects */}
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Active Projects ({clan.activeProjects.length})
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {clan.activeProjects.map((proj, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{proj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recruitment Openings */}
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Current Recruitment Openings
              </span>
              {clan.recruitmentOpenings.length === 0 ? (
                <span className="text-slate-400 text-xs italic">
                  No active recruitment listings.
                </span>
              ) : (
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {clan.recruitmentOpenings.map((role, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {isSuspended ? (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onUnsuspendClan(clan)
                }}
                className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Unsuspend Clan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onSuspendClan(clan)
                }}
                className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
              >
                Suspend Clan
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose()
                onDeleteClan(clan)
              }}
              className="px-4 py-2 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors"
            >
              Permanent Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
