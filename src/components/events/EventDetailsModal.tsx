import React, { useState } from 'react'
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
}

/**
 * EventDetailsModal
 * 
 * Displays rich event details upon clicking any event across the platform:
 * - Venue & Location
 * - Starting Date & Timing
 * - Registration Link (if registration is open/available)
 * - Interested Link & "Mark as Interested" action (jaha registration na ho wahha interested ka link)
 * - Full Event Description
 * - Host Clan, Categories, and Community Attendee Metrics
 */
export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
  isInterested = false,
  onToggleInterested,
}: EventDetailsModalProps) {
  const [localInterested, setLocalInterested] = useState<boolean>(isInterested)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [registeredSuccess, setRegisteredSuccess] = useState<boolean>(false)

  // Sync state when event or isInterested prop changes
  React.useEffect(() => {
    setLocalInterested(isInterested)
    setRegisteredSuccess(false)
    setCopiedLink(null)
  }, [event, isInterested])

  if (!isOpen || !event) return null

  // Determine if registration is available or if interested link should be prominent
  const hasReg = event.hasRegistration ?? Boolean(event.registrationLink && event.registrationLink.trim().length > 0)
  const regLink = event.registrationLink || (hasReg ? `https://campusclans.edu/events/${event.id}/register` : null)
  const intLink = event.interestedLink || `https://campusclans.edu/events/${event.id}/interested`

  const startDateFormatted = event.startingDate || `${event.month} ${event.day}, 2026 · ${event.time}`
  const venueFull = event.venueDetails ? `${event.location} (${event.venueDetails})` : event.location
  const eventDesc = event.description || event.tagline || 'Join fellow ambitious campus students for an immersive collaborative workshop and competitive sprint. Connect with top clan builders, learn new industry tools, and showcase your skills.'

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedLink(type)
    setTimeout(() => setCopiedLink(null), 2500)
  }

  const handleInterestedClick = () => {
    setLocalInterested((prev) => !prev)
    if (onToggleInterested) {
      onToggleInterested(event.id)
    }
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
              <span>{event.people + (localInterested ? 1 : 0)} Students Interested / Attending</span>
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

          {/* Key Event Badges Grid (Venue, Starting Date, Time, Format) */}
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

          {/* 3. REGISTRATION LINK vs INTERESTED LINK (Core User Requirement) */}
          <div className="p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 shadow-md">
            {hasReg && regLink ? (
              /* CASE A: Registration is Open -> Show Registration Link & Register CTA */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Registration Open
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    Seats filling fast · RSVP required
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    Official Registration Link:
                  </label>
                  <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 sm:px-3 text-xs">
                    <a
                      href={regLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline font-mono truncate flex-1"
                    >
                      {regLink}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(regLink, 'reg')}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
                    >
                      {copiedLink === 'reg' ? '✓ Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Choose Participation Mode (Individual vs Clan Team):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await djangoApi.events.participate(event.id, "student")
                        } catch {}
                        setRegisteredSuccess(true)
                      }}
                      className="py-2 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>👤 Individual Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await djangoApi.events.participate(event.id, "clan")
                        } catch {}
                        setRegisteredSuccess(true)
                      }}
                      className="py-2 px-3 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🛡️ Clan Team Entry</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <a
                    href={regLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setRegisteredSuccess(true)}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>🚀 Open External Portal</span>
                    <Icon name="arrowRight" size={15} />
                  </a>

                  <button
                    type="button"
                    onClick={handleInterestedClick}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                      localInterested
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <span>{localInterested ? '★ Interested (Saved)' : '☆ Mark as Interested'}</span>
                  </button>
                </div>

                {registeredSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <Icon name="check" size={16} />
                    <span>Registration window opened in new tab. See you at {event.location}!</span>
                  </div>
                )}
              </div>
            ) : (
              /* CASE B: Jaha Registration Na Ho -> Show Dedicated Interested Link & CTA */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Open Campus Access · No Registration Required
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    Walk-in entry with Student ID
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Interested Link:
                    </label>
                    <span className="text-[10px] text-amber-300 font-bold">
                      Share with classmates & clan members
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 sm:px-3 text-xs">
                    <a
                      href={intLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline font-mono truncate flex-1"
                    >
                      {intLink}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(intLink, 'int')}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
                    >
                      {copiedLink === 'int' ? '✓ Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleInterestedClick}
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer ${
                      localInterested
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/20 active:scale-98'
                    }`}
                  >
                    <span className="text-base">{localInterested ? '★' : '☆'}</span>
                    <span>
                      {localInterested
                        ? "You're Interested! We'll notify you before event starts"
                        : "I'm Interested · Add to My Schedule & Notify Me"}
                    </span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  💡 Since registration is not required for this event, clicking <strong>I'm Interested</strong> bookmarks it to your profile calendar and reserves your priority seat notification.
                </p>
              </div>
            )}
          </div>

          {/* 4. EVENT DESCRIPTION (Core User Requirement) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Event Description & Overview
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
                  <span className="text-[11px] text-slate-600">+120 Clan XP & Participation Trophies</span>
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
