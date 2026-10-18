import React, { useState } from "react"
import { EventItem, EventStatus } from "@/types"
import GlassCard from "@/components/common/GlassCard"
import StatusBadge from "@/components/common/StatusBadge"
import Icon from "@/components/common/Icon"

interface EventsViewProps {
  events: EventItem[]
  onCreateEvent: () => void
  onEditEvent: (event: EventItem) => void
  onDeleteEvent: (event: EventItem) => void
  onReviewParticipants: (event: EventItem) => void
  onManageTrophies: (event: EventItem) => void
}

/**
 * EventsView: Campus Event Administration
 * Strictly implements Section 8 (Event management, list screen, actions, and lifecycle).
 */
export default function EventsView({
  events,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onReviewParticipants,
  onManageTrophies,
}: EventsViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = events.filter((evt) => {
    const matchStatus = filterStatus === "all" || evt.status === filterStatus
    const matchQuery =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchQuery
  })

  return (
    <div className="space-y-6 animate-fade pb-10">
      {/* Header & Controls Toolbar */}
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Icon name="search" size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, type, or venue..."
                className="w-full pl-9 pr-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Event Lifecycles</option>
              <option value="Upcoming">Upcoming Events</option>
              <option value="Active">Active / Live Now</option>
              <option value="Ended">Ended Events</option>
            </select>
          </div>

          {/* Section 8 Create Event Trigger */}
          <button
            type="button"
            onClick={onCreateEvent}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Icon name="plus" size={16} />
            <span>Create New Event</span>
          </button>
        </div>
      </GlassCard>

      {/* Events List Screen (Section 8 Requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => {
          // Participation mode badge label
          const modeLabel =
            evt.participationMode === "both"
              ? "Individual & Clan"
              : evt.participationMode === "clan"
              ? "Clan-Only"
              : "Individual-Only"

          return (
            <GlassCard
              key={evt.id}
              className="overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                {/* Event Banner */}
                <div
                  className="h-36 relative bg-gradient-to-br from-[#172033] to-[#25334d] flex items-center justify-center p-4 bg-cover bg-center"
                  style={evt.mediaUrl ? { backgroundImage: `url(${evt.mediaUrl})` } : undefined}
                >
                  <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]" />

                  {/* Date badge */}
                  <div className="absolute top-3 right-3 bg-white/95 text-slate-900 px-2.5 py-1.5 rounded-xl shadow-md text-center">
                    <span className="block text-sm font-black leading-none">
                      {evt.startDate.split("-")[2]}
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-amber-700">
                      OCT
                    </span>
                  </div>

                  {/* Status & Type Pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-sm">
                      {evt.type}
                    </span>
                    <StatusBadge status={evt.status} size="sm" />
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Icon name="calendar" size={13} className="text-slate-400" />
                      <span>{evt.startDate} to {evt.endDate} · {evt.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Icon name="users" size={13} className="text-slate-400" />
                      <span>Mode: <strong>{modeLabel}</strong> ({evt.participantsCount} registered)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 8 Required Actions & Review Links */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Link to Participants / Applications (Section 8 & 9) */}
                  <button
                    type="button"
                    onClick={() => onReviewParticipants(evt)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Icon name="users" size={13} />
                    <span>Participants</span>
                  </button>

                  {/* Link to Trophies Management (Section 8 & 10) */}
                  <button
                    type="button"
                    onClick={() => onManageTrophies(evt)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Icon name="trophy" size={13} />
                    <span>Awards</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {/* Edit event */}
                  <button
                    type="button"
                    onClick={() => onEditEvent(evt)}
                    title="Edit Event"
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Icon name="edit" size={15} />
                  </button>

                  {/* Delete event with confirmation */}
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(evt)}
                    title="Delete Event"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
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
