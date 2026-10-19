import React, { useState, useEffect } from 'react'
import Icon from '@/components/common/Icon'
import { djangoApi } from '@/services/djangoApi'

export interface DetailedEvent {
  id: number | string
  title: string
  type: string
  location: string
  venueDetails?: string
  time: string
  month: string
  day: string
  startingDate?: string
  people: number
  accent?: string
  thumbnail?: string
  tagline?: string
  description?: string
  registrationLink?: string
  hasRegistration?: boolean
  interestedLink?: string
  organizer?: string
  hostClan?: string
}

interface EventDetailsModalProps {
  event: DetailedEvent | null
  isOpen: boolean
  onClose: () => void
  isInterested?: boolean
  onToggleInterested?: (eventId: number | string) => void
  userClanName?: string
  currentUserRole?: "Leader" | "Co-Leader" | "Member"
  onRegistrationChange?: (eventId: number | string, isRegistered: boolean, type?: "student" | "clan") => void
}

/**
 * EventDetailsModal
 * 
 * Implements Section 8: Campus Events & Competitions
 * - Event Listings (/events/)
 * - Dual Participation Modes (/event/<id>/participate/<type>/)
 *   - Individual Student Entry (Solo participation)
 *   - Clan Team Entry (Poori clan ki team ke roop me participate karna)
 * - Clan Team Roster Selection (/clan-members/save/)
 *   - Leader ya Co-Leader clan ki taraf se squad entry karwa sakte hain
 * - RSVP Cancel (/event/<id>/cancel-participation/)
 *   - Participation withdraw karna
 */
export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
  isInterested = false,
  onToggleInterested,
  userClanName = "Pixel Pirates",
  currentUserRole: initialUserRole = "Leader",
  onRegistrationChange,
}: EventDetailsModalProps) {
  const [localInterested, setLocalInterested] = useState<boolean>(isInterested)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [registeredSuccess, setRegisteredSuccess] = useState<boolean>(false)
  const [registeredType, setRegisteredType] = useState<"student" | "clan" | null>(null)
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false)
  const [selectedRoster, setSelectedRoster] = useState<string[]>(["stu-1", "stu-2"])
  const [teamCaptain, setTeamCaptain] = useState<string>("stu-1")
  const [isSavingRoster, setIsSavingRoster] = useState<boolean>(false)
  const [currentUserRole, setCurrentUserRole] = useState<"Leader" | "Co-Leader" | "Member">(initialUserRole)
  const [notificationToast, setNotificationToast] = useState<string | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false)

  // Clan roster available for selection
  const clanMembersList = [
    { id: "stu-1", name: "Aarav Khanna", role: "Leader", branch: "B.Tech CSE · Year 3", skills: "React, UI/UX" },
    { id: "stu-2", name: "Riya Malhotra", role: "Co-Leader", branch: "B.Des · Year 2", skills: "Design Systems, Figma" },
    { id: "stu-3", name: "Devansh Sharma", role: "Core Member", branch: "B.Tech CSE · Year 3", skills: "Python, FastAPI" },
    { id: "stu-4", name: "Tanya Sen", role: "Member", branch: "B.Des · Year 2", skills: "Visual Design, 3D" },
    { id: "stu-5", name: "Rohan Verma", role: "Contributor", branch: "B.Tech ECE · Year 2", skills: "IoT, Embedded C" },
  ]

  // Sync state when event or isInterested prop changes
  useEffect(() => {
    setLocalInterested(isInterested)
    setRegisteredSuccess(false)
    setRegisteredType(null)
    setShowRosterModal(false)
    setShowCancelConfirm(false)
    setCopiedLink(null)
  }, [event, isInterested])

  if (!isOpen || !event) return null

  const isLeaderOrCoLeader = currentUserRole === "Leader" || currentUserRole === "Co-Leader"

  const hasReg = event.hasRegistration ?? Boolean(event.registrationLink && event.registrationLink.trim().length > 0)
  const regLink = event.registrationLink || (hasReg ? `https://campusclans.edu/events/${event.id}/register` : null)
  const intLink = event.interestedLink || `https://campusclans.edu/events/${event.id}/interested`

  const startDateFormatted = event.startingDate || `${event.month} ${event.day}, 2026 · ${event.time}`
  const venueFull = event.venueDetails ? `${event.location} (${event.venueDetails})` : event.location
  const eventDesc = event.description || event.tagline || 'North India Hackfest is an intensive 36-hour code sprint & AI hackathon bringing together over 250 top student developers, designers, and innovators.'

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedLink(type)
    setTimeout(() => setCopiedLink(null), 2500)
  }

  const showToast = (msg: string) => {
    setNotificationToast(msg)
    setTimeout(() => setNotificationToast(null), 3500)
  }

  const handleInterestedClick = () => {
    setLocalInterested((prev) => !prev)
    if (onToggleInterested) {
      onToggleInterested(event.id)
    }
  }

  // 1. Individual Student Entry (POST /event/<id>/participate/student/)
  const handleIndividualEntry = async () => {
    try {
      await djangoApi.events.participate(event.id, "student")
    } catch (e) {
      console.warn("Backend participate fallback:", e)
    }
    setRegisteredType("student")
    setRegisteredSuccess(true)
    setLocalInterested(true)
    onRegistrationChange?.(event.id, true, "student")
    showToast("🎉 Successfully registered as Individual Student Entry!")
  }

  // 2. Clan Team Entry (POST /event/<id>/participate/clan/ + POST /clan-members/save/)
  const handleSaveClanRoster = async () => {
    if (selectedRoster.length === 0) {
      alert("Please select at least 1 member for the clan squad roster.")
      return
    }

    setIsSavingRoster(true)
    try {
      await djangoApi.events.participate(event.id, "clan")
      await djangoApi.events.saveEventClanMembers(event.id, selectedRoster)
    } catch (e) {
      console.warn("Backend clan entry fallback:", e)
    }
    setIsSavingRoster(false)
    setRegisteredType("clan")
    setRegisteredSuccess(true)
    setShowRosterModal(false)
    setLocalInterested(true)
    onRegistrationChange?.(event.id, true, "clan")
    showToast(`🛡️ ${userClanName} Clan Squad Entry locked with ${selectedRoster.length} competing members!`)
  }

  // 3. RSVP Cancel (POST /event/<id>/cancel-participation/)
  const handleCancelParticipation = async () => {
    try {
      await djangoApi.events.cancelParticipation(event.id)
    } catch (e) {
      console.warn("Backend cancel participation fallback:", e)
    }
    setRegisteredSuccess(false)
    setRegisteredType(null)
    setShowCancelConfirm(false)
    setLocalInterested(false)
    onRegistrationChange?.(event.id, false)
    showToast("✓ Participation successfully withdrawn. Your RSVP has been cancelled.")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Notification Toast */}
        {notificationToast && (
          <div className="absolute top-3 left-4 right-4 z-30 p-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xl border border-amber-400/40 flex items-center justify-between animate-fade">
            <span className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span>
              <span>{notificationToast}</span>
            </span>
            <button
              type="button"
              onClick={() => setNotificationToast(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Top Banner Image with 16:9 aspect ratio */}
        <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full overflow-hidden bg-slate-950 shrink-0">
          <img
            src={event.thumbnail || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1280&h=720&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/20 shadow-lg"
          >
            <Icon name="close" size={16} />
          </button>

          {/* Category Tag & Host Pill */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
            <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              {event.type}
            </span>
            {event.hostClan && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/20 text-[11px] font-bold">
                Host: {event.hostClan}
              </span>
            )}
          </div>

          {/* Date & People Pill in Banner Bottom */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-2 text-xs font-bold drop-shadow">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{event.people + (registeredSuccess || localInterested ? 1 : 0)} Students Registered / Attending</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-white/95 text-slate-950 font-black text-xs shadow-md">
              <span className="text-amber-600 uppercase mr-1">{event.month}</span>
              <span>{event.day}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title & Tagline */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {event.title}
            </h2>
            {event.tagline && (
              <p className="text-xs sm:text-sm font-semibold text-amber-700">
                {event.tagline}
              </p>
            )}
          </div>

          {/* Key Event Badges Grid (Venue, Starting Date, Time) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            {/* 1. VENUE */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Icon name="pin" size={18} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Campus Venue
                </span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug block">
                  {venueFull}
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Campus Innovation Ecosystem
                </span>
              </div>
            </div>

            {/* 2. STARTING DATE */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Icon name="calendar" size={18} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Starting Date & Time
                </span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug block">
                  {startDateFormatted}
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Schedule time: {event.time}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 8: DUAL PARTICIPATION MODES & ROSTER SELECTION */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl border transition-all space-y-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 shadow-md">
            {/* Role indicator & demo switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">🛡️ Your Clan:</span>
                <span className="font-extrabold text-white">{userClanName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Role: {currentUserRole}
                </span>
              </div>

              {/* Role Toggle for demonstration testing */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Switch Role:</span>
                {(["Leader", "Co-Leader", "Member"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCurrentUserRole(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      currentUserRole === r
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* STATUS A: User or Clan is ALREADY REGISTERED */}
            {registeredSuccess ? (
              <div className="space-y-3.5 p-4 rounded-xl bg-slate-850 border border-emerald-500/40 bg-emerald-950/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0">
                      ✓
                    </div>
                    <div>
                      <strong className="text-sm font-black text-emerald-300 block">
                        {registeredType === "clan"
                          ? `Clan Team Entry Confirmed · ${userClanName}`
                          : "Individual Solo Entry Confirmed"}
                      </strong>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {registeredType === "clan"
                          ? `Squad roster locked with ${selectedRoster.length} members. Captain: ${clanMembersList.find(m => m.id === teamCaptain)?.name || "Aarav Khanna"}.`
                          : "You are officially listed on the campus participant attendance roster."}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider shrink-0">
                    RSVP Confirmed
                  </span>
                </div>

                {/* Clan Roster Quick Pill Preview if Clan Entry */}
                {registeredType === "clan" && (
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-300">🛡️ Competing Squad Members ({selectedRoster.length}):</span>
                      {isLeaderOrCoLeader && (
                        <button
                          type="button"
                          onClick={() => setShowRosterModal(true)}
                          className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                        >
                          Modify Squad Roster
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {clanMembersList
                        .filter((m) => selectedRoster.includes(m.id))
                        .map((m) => (
                          <span
                            key={m.id}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center gap-1"
                          >
                            <span>{m.name}</span>
                            <span className="text-[9px] text-amber-400 font-bold">({m.role})</span>
                            {teamCaptain === m.id && <span className="text-[10px]" title="Team Captain">👑</span>}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* RSVP CANCEL ACTION (/event/<id>/cancel-participation/) */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Plans changed? You can withdraw your entry anytime before the event cutoff.
                  </span>

                  {!showCancelConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Withdraw RSVP / Cancel Participation
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-300 font-bold">Confirm withdraw?</span>
                      <button
                        type="button"
                        onClick={handleCancelParticipation}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow"
                      >
                        Yes, Cancel Entry
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(false)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
                      >
                        Keep Entry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* STATUS B: NOT YET REGISTERED -> DUAL PARTICIPATION MODES */
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <strong className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Dual Participation Modes Available (/event/{event.id}/participate/&lt;type&gt;/)
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Choose how you want to participate in this official campus competition:
                  </p>
                </div>

                {/* Mode Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Individual Student Entry */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between space-y-3 hover:border-slate-500 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>👤</span>
                          <span>Individual Student Entry</span>
                        </strong>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-700 text-slate-300">
                          Solo
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Compete or participate as an individual student. Perfect for workshops, talks, and solo hackathon tracks.
                      </p>
                      <div className="mt-2 text-[10px] text-slate-400">
                        Candidate: <strong>Aarav Khanna</strong> (@aarav_k)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleIndividualEntry}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-black text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Enter as Solo Student</span>
                      <span>&rarr;</span>
                    </button>
                  </div>

                  {/* Option 2: Clan Team Entry */}
                  <div
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors ${
                      isLeaderOrCoLeader
                        ? "bg-gradient-to-br from-amber-400/10 to-slate-800/90 border-amber-400/50 hover:border-amber-400"
                        : "bg-slate-800/50 border-slate-700/60 opacity-90"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                          <span>🛡️</span>
                          <span>Clan Team Entry</span>
                        </strong>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950">
                          Team Squad
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Poori clan ki team ke roop me participate karna. Leader ya Co-Leader squad roster select karke entry confirm kar sakte hain.
                      </p>

                      <div className="mt-2 text-[10px]">
                        {isLeaderOrCoLeader ? (
                          <span className="text-emerald-400 font-bold">
                            ✓ Authorized as {userClanName} {currentUserRole}
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold">
                            🔒 Requires Leader or Co-Leader authorization
                          </span>
                        )}
                      </div>
                    </div>

                    {isLeaderOrCoLeader ? (
                      <button
                        type="button"
                        onClick={() => setShowRosterModal(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-sm shadow-amber-400/20 flex items-center justify-center gap-1.5"
                      >
                        <span>Select Clan Roster & Enter</span>
                        <span>&rarr;</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Clan Team Entry must be submitted by Clan Leader or Co-Leader.\n\nCurrent clan: ${userClanName}\nLeader: Aarav Khanna\nCo-Leader: Riya Malhotra\n\nYou can switch role to Leader using the switch at the top to test.`)
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700 cursor-not-allowed text-center"
                      >
                        Leader Authorization Required
                      </button>
                    )}
                  </div>
                </div>

                {/* External Portal Link option if event has link */}
                {regLink && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">External registration portal:</span>
                    <a
                      href={regLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline font-mono text-[11px]"
                    >
                      {regLink} ↗
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================== */}
            {/* CLAN TEAM ROSTER SELECTION DRAWER (/clan-members/save/) */}
            {/* ========================================================== */}
            {showRosterModal && (
              <div className="p-4 rounded-2xl bg-slate-900 border-2 border-amber-400 space-y-4 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <strong className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-2">
                      <span>🛡️</span>
                      <span>Clan Team Roster Selection (/clan-members/save/)</span>
                    </strong>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Select which members of <strong>{userClanName}</strong> will compete in this competition:
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRosterModal(false)}
                    className="text-slate-400 hover:text-white font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Members Checklist */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {clanMembersList.map((member) => {
                    const isChecked = selectedRoster.includes(member.id)
                    const isCaptain = teamCaptain === member.id

                    return (
                      <label
                        key={member.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-amber-400/10 border-amber-400 text-white"
                            : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedRoster((prev) =>
                                isChecked ? prev.filter((id) => id !== member.id) : [...prev, member.id]
                              )
                            }}
                            className="w-4 h-4 text-amber-500 rounded border-slate-600 focus:ring-amber-400 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{member.name}</span>
                              {isCaptain && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                                  CAPTAIN
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">{member.branch} · {member.skills}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-700 text-amber-300">
                            {member.role}
                          </span>
                          {isChecked && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setTeamCaptain(member.id)
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded font-bold cursor-pointer ${
                                isCaptain
                                  ? "bg-amber-400 text-slate-950 font-black"
                                  : "text-slate-400 hover:text-amber-300 underline"
                              }`}
                            >
                              {isCaptain ? "★ Lead" : "Make Lead"}
                            </button>
                          )}
                        </div>
                      </label>
                    )
                  })}
                </div>

                {/* Quick actions & Submit footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedRoster(clanMembersList.map((m) => m.id))}
                      className="text-amber-400 hover:underline font-bold text-[11px]"
                    >
                      Select All
                    </button>
                    <span className="text-slate-600">·</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRoster([])}
                      className="text-slate-400 hover:text-white font-bold text-[11px]"
                    >
                      Clear
                    </button>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300 text-[11px]">
                      <strong>{selectedRoster.length}</strong> of {clanMembersList.length} Selected
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRosterModal(false)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={selectedRoster.length === 0 || isSavingRoster}
                      onClick={handleSaveClanRoster}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-950 disabled:opacity-50 cursor-pointer shadow-md shadow-amber-400/20 flex items-center gap-1.5"
                    >
                      {isSavingRoster ? (
                        <span>Locking Squad...</span>
                      ) : (
                        <span>Confirm Squad Roster ({selectedRoster.length}) & Enter</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EVENT DESCRIPTION & SCHEDULE */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Event Description & Requirements
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {eventDesc}
              </p>

              {/* What to bring / perks */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="block text-[11px] font-bold text-slate-900">🎓 Audience</strong>
                  <span className="text-[11px] text-slate-600">All registered campus students & clans</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="block text-[11px] font-bold text-slate-900">💻 Requirements</strong>
                  <span className="text-[11px] text-slate-600">Laptop, charger & student ID badge</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="block text-[11px] font-bold text-slate-900">🏆 Clan Rewards</strong>
                  <span className="text-[11px] text-slate-600">+120 Clan XP & Official Campus Trophies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(window.location.href, 'share')}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-200/90 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>🔗</span>
              <span>{copiedLink === 'share' ? 'Link Copied!' : 'Share Event'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
