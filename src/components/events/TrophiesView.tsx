import React from "react"
import { Trophy, EventItem } from "@/types"
import GlassCard from "@/components/common/GlassCard"
import Icon from "@/components/common/Icon"

interface TrophiesViewProps {
  trophies: Trophy[]
  events: EventItem[]
  onAwardTrophy: () => void
  onDeleteTrophy: (trophy: Trophy) => void
}

/**
 * TrophiesView: Trophy & Awards Management
 * Implements Section 10 (Trophy information, 48-hour deadline reminder, and awarding workflow).
 */
export default function TrophiesView({
  trophies,
  events,
  onAwardTrophy,
  onDeleteTrophy,
}: TrophiesViewProps) {
  // Section 10: 48-Hour Trophy Deadline Reminder
  // Find events ended recently that need trophies awarded
  const pendingTrophyEvents = events.filter(
    (e) => e.status === "Ended" && !e.trophiesAwarded && (e.endedHoursAgo || 0) <= 48
  )

  return (
    <div className="space-y-6 animate-fade pb-10">
      {/* Section 10: 48-Hour Award Deadline Notification */}
      {pendingTrophyEvents.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/10 border border-amber-400/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-md shadow-amber-400/30">
              <Icon name="trophy" size={20} />
            </div>
            <div>
              <strong className="text-sm font-bold text-slate-900 block leading-tight">
                Trophy Allocation Deadline Warning (48-Hour Policy)
              </strong>
              <p className="text-xs text-slate-600 mt-1">
                Event <strong>&quot;{pendingTrophyEvents[0].title}&quot;</strong> concluded {pendingTrophyEvents[0].endedHoursAgo} hours ago. As per project rules, institutional trophies must be awarded within 48 hours ({48 - (pendingTrophyEvents[0].endedHoursAgo || 0)} hours remaining).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAwardTrophy}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all shrink-0 flex items-center gap-2"
          >
            <Icon name="plus" size={15} />
            <span>Award Trophy Now</span>
          </button>
        </div>
      )}

      {/* Header Toolbar */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block mb-0.5">
              Verified Achievements
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Campus Trophy Directory
            </h2>
            <p className="text-xs text-slate-500">
              Allocated honors, hackathon podium placements, and NAAC verified citations
            </p>
          </div>

          <button
            type="button"
            onClick={onAwardTrophy}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md shadow-amber-400/20 transition-all flex items-center gap-2"
          >
            <Icon name="plus" size={15} />
            <span>Grant New Trophy</span>
          </button>
        </div>
      </GlassCard>

      {/* Trophy Cards Grid (Section 10 Trophy Information) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {trophies.map((trophy) => (
          <GlassCard key={trophy.id} className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-800 flex items-center justify-center">
                    <Icon name="trophy" size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {trophy.name}
                    </h3>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Icon name="calendar" size={13} />
                      Event: <strong className="text-slate-800">{trophy.eventName}</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteTrophy(trophy)}
                  title="Delete Trophy"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                {trophy.description}
              </p>

              {/* Recipient breakdown */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">
                    Recipient ({trophy.recipientType === "clan" ? "Clan Team" : "Individual Student"})
                  </span>
                  <strong className="text-slate-900 text-xs block mt-0.5">
                    {trophy.recipientName}
                  </strong>
                  {trophy.clanRepresentatives && (
                    <span className="text-[11px] text-slate-500 block">
                      Reps: {trophy.clanRepresentatives.join(", ")}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Awarded On</span>
                  <span className="font-semibold text-slate-700 text-[11px]">{trophy.awardDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified Institutional Citation</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Icon name="check" size={13} />
                Synced with Student Profile
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
