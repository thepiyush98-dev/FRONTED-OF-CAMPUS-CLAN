import React from "react"
import { Student, Clan } from "@/types"
import GlassCard from "@/components/common/GlassCard"
import Icon from "@/components/common/Icon"

interface SuspensionViewProps {
  students: Student[]
  clans: Clan[]
  onOpenSuspendModal: () => void
  onUnsuspendStudent: (student: Student) => void
  onUnsuspendClan: (clan: Clan) => void
}

/**
 * SuspensionView: Dedicated Suspension Management Area
 * Strictly implements Section 6 & 13 (Suspension rules, duration, reasons, and restorations).
 */
export default function SuspensionView({
  students,
  clans,
  onOpenSuspendModal,
  onUnsuspendStudent,
  onUnsuspendClan,
}: SuspensionViewProps) {
  const suspendedStudents = students.filter((s) => s.status === "Suspended")
  const suspendedClans = clans.filter((c) => c.status === "Suspended")

  return (
    <div className="space-y-6 animate-fade pb-10">
      {/* Header Toolbar */}
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 block mb-0.5">
              Disciplinary Governance
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Suspension & Access Control Management
            </h2>
            <p className="text-xs text-slate-500">
              Review temporary restriction holds, end dates, and restore permissions upon compliance
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSuspendModal}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Icon name="shield" size={15} />
            <span>Issue New Suspension Hold</span>
          </button>
        </div>
      </GlassCard>

      {/* Established Suspension Rules Banner (Section 4 & 5 Mandatory Policy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-slate-800 space-y-1">
          <strong className="font-bold flex items-center gap-1.5 text-amber-900">
            <Icon name="users" size={14} className="text-amber-600" />
            Student Suspension Policy (Section 4)
          </strong>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            An established requirement is that a suspended student <strong>can still log in</strong> but cannot perform protected actions (clan joining, project code submissions, event signups). The UI does not block login itself.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-slate-800 space-y-1">
          <strong className="font-bold flex items-center gap-1.5 text-amber-900">
            <Icon name="clans" size={14} className="text-amber-600" />
            Clan Suspension Policy (Section 5)
          </strong>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Suspended clans remain <strong>publicly visible with a &quot;Clan Suspended&quot; label</strong>. The system automatically restricts them from entering competitions or registering for new campus events.
          </p>
        </div>
      </div>

      {/* Suspended Students List (Section 6) */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Suspended Students ({suspendedStudents.length})
            </h3>
            <p className="text-xs text-slate-500">
              Active student accounts currently placed on restricted hold
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {suspendedStudents.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs italic">
              No students are currently under suspension.
            </div>
          ) : (
            suspendedStudents.map((stu) => (
              <div
                key={stu.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <strong className="text-sm font-bold text-slate-900">
                      {stu.name}
                    </strong>
                    <span className="font-mono text-xs text-slate-400">
                      @{stu.username}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                      Suspended
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>Reason:</strong> {stu.suspensionDetails?.reason || "Administrative policy violation"}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Duration: <strong>{stu.suspensionDetails?.durationDays} days</strong></span>
                    <span>Start: {stu.suspensionDetails?.startDate}</span>
                    <span>Calculated End: <strong className="text-rose-600">{stu.suspensionDetails?.endDate}</strong></span>
                  </div>
                </div>

                {/* Section 6 Restore Access Action */}
                <button
                  type="button"
                  onClick={() => onUnsuspendStudent(stu)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Icon name="check" size={14} />
                  <span>Restore Student Access</span>
                </button>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Suspended Clans List (Section 6) */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Suspended Clans ({suspendedClans.length})
            </h3>
            <p className="text-xs text-slate-500">
              Student clans marked with public suspension hold and event restrictions
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {suspendedClans.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs italic">
              No clans are currently under suspension.
            </div>
          ) : (
            suspendedClans.map((clan) => (
              <div
                key={clan.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <strong className="text-sm font-bold text-slate-900">
                      {clan.name}
                    </strong>
                    <span className="text-xs text-slate-400">
                      Leader: {clan.leaderName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                      Clan Suspended
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>Reason:</strong> {clan.suspensionDetails?.reason || "Compliance audit pending"}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Duration: <strong>{clan.suspensionDetails?.durationDays} days</strong></span>
                    <span>Start: {clan.suspensionDetails?.startDate}</span>
                    <span>Calculated End: <strong className="text-rose-600">{clan.suspensionDetails?.endDate}</strong></span>
                  </div>
                </div>

                {/* Section 6 Restore Clan Action */}
                <button
                  type="button"
                  onClick={() => onUnsuspendClan(clan)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Icon name="check" size={14} />
                  <span>Restore Clan Eligibility</span>
                </button>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  )
}
