import React, { useState, useMemo } from "react"
import { Clan } from "@/types"
import GlassCard from "@/components/common/GlassCard"
import StatusBadge from "@/components/common/StatusBadge"
import Icon from "@/components/common/Icon"

interface ClansViewProps {
  clans: Clan[]
  onViewClan: (clan: Clan) => void
  onSuspendClan: (clan: Clan) => void
  onUnsuspendClan: (clan: Clan) => void
  onDeleteClan: (clan: Clan) => void
  onSendMessageToClan: (clan: Clan) => void
}

/**
 * ClansView: Clan Directory & Moderation Table
 * Implements Section 5 (Clan management, controls, filtering, and status handling).
 */
export default function ClansView({
  clans,
  onViewClan,
  onSuspendClan,
  onUnsuspendClan,
  onDeleteClan,
  onSendMessageToClan,
}: ClansViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSpeciality, setFilterSpeciality] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  // Filter clans based on search and selected filters
  const filteredClans = useMemo(() => {
    return clans.filter((clan) => {
      const matchSearch =
        `${clan.name} ${clan.speciality} ${clan.leaderName}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = filterStatus === "all" || clan.status === filterStatus
      const matchSpeciality =
        filterSpeciality === "all" || clan.speciality.toLowerCase().includes(filterSpeciality.toLowerCase())

      return matchSearch && matchStatus && matchSpeciality
    })
  }, [clans, searchQuery, filterStatus, filterSpeciality])

  // Pagination
  const totalPages = Math.ceil(filteredClans.length / itemsPerPage) || 1
  const paginatedClans = filteredClans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6 animate-fade pb-10">
      {/* Controls & Search Toolbar (Section 5 Recommended Controls) */}
      <GlassCard className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search clans by team name, focus, or leader..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium text-slate-900 bg-white/90 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Clan Status</option>
              <option value="Active">Active Clans</option>
              <option value="Suspended">Suspended Clans</option>
            </select>

            {/* Speciality Filter */}
            <select
              value={filterSpeciality}
              onChange={(e) => {
                setFilterSpeciality(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Specialities</option>
              <option value="Design">Design & Frontend</option>
              <option value="AI">AI & Systems</option>
              <option value="Robotics">Robotics & Hardware</option>
              <option value="Product">Product Strategy</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Clan Cards Grid (Section 5 Recommended Information) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {paginatedClans.map((clan) => {
          const isSuspended = clan.status === "Suspended"

          return (
            <GlassCard
              key={clan.id}
              className={`p-6 flex flex-col justify-between transition-all duration-300 ${
                isSuspended ? "border-rose-300/80 bg-rose-50/20" : ""
              }`}
            >
              <div>
                {/* Header: Clan badge & status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#172033] to-[#25334d] border border-white/20 text-amber-400 font-extrabold flex items-center justify-center text-base shadow-md">
                      {clan.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {clan.name}
                        </h3>
                        {/* Section 5 Clan Suspension Rule Banner */}
                        {isSuspended ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            Clan Suspended
                          </span>
                        ) : (
                          <StatusBadge status="Active" size="sm" />
                        )}
                      </div>
                      <span className="text-xs text-amber-700 font-medium block mt-0.5">
                        {clan.speciality}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewClan(clan)}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>Inspect</span>
                    <Icon name="arrowRight" size={13} />
                  </button>
                </div>

                {/* Short Description */}
                <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                  {clan.shortDescription}
                </p>

                {/* Section 5 Suspension Warning Notice */}
                {isSuspended && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-[11px] text-rose-800 space-y-0.5">
                    <span className="font-bold flex items-center gap-1.5">
                      <Icon name="alert" size={13} className="text-rose-600" />
                      Event Participation Locked
                    </span>
                    <p>
                      Suspended clans remain visible with badge, but are ineligible to enter competitions or receive verified event trophies.
                    </p>
                  </div>
                )}

                {/* Metric pill row */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Members</span>
                    <strong className="text-slate-800 text-xs mt-0.5 block">{clan.memberCount}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Projects</span>
                    <strong className="text-slate-800 text-xs mt-0.5 block">{clan.projectsCount}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Trophies</span>
                    <strong className="text-slate-800 text-xs mt-0.5 block">{clan.trophiesCount}</strong>
                  </div>
                </div>
              </div>

              {/* Clan Action Row */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Leader: <strong className="text-slate-800">{clan.leaderName}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {/* Broadcast Message to Clan (Section 7) */}
                  <button
                    type="button"
                    onClick={() => onSendMessageToClan(clan)}
                    title="Message Clan"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-amber-50 text-xs transition-colors"
                  >
                    <Icon name="send" size={15} />
                  </button>

                  {/* Suspend or Unsuspend */}
                  {isSuspended ? (
                    <button
                      type="button"
                      onClick={() => onUnsuspendClan(clan)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors"
                    >
                      Unsuspend
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSuspendClan(clan)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors"
                    >
                      Suspend
                    </button>
                  )}

                  {/* Delete Clan */}
                  <button
                    type="button"
                    onClick={() => onDeleteClan(clan)}
                    title="Permanently Disband Clan"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
