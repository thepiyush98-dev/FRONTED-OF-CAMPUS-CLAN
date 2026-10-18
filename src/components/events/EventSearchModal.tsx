import React, { useState, useEffect } from 'react'

export interface EventItem {
  id: number | string
  title: string
  type: string
  month: string
  day: string
  time: string
  location: string
  people: number
  accent?: string
  tagline?: string
  thumbnail?: string
  venueDetails?: string
  startingDate?: string
  registrationLink?: string
  hasRegistration?: boolean
  interestedLink?: string
  description?: string
  hostClan?: string
}

export function EventSearchModal({
  isOpen,
  onClose,
  events,
  onSelectEvent,
  joinedEvents = [],
  onToggleJoin,
}: {
  isOpen: boolean
  onClose: () => void
  events: EventItem[]
  onSelectEvent?: (event: EventItem) => void
  joinedEvents?: (number | string)[]
  onToggleJoin?: (eventId: number | string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const categories = ['All', 'Hackathon', 'Workshop', 'Talk', 'Networking']

  const filteredEvents = events.filter((evt) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      evt.type.toLowerCase() === selectedCategory.toLowerCase()
    const matchesQuery =
      searchQuery.trim() === '' ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.tagline && evt.tagline.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesQuery
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/60 backdrop-blur-sm animate-fade"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campus events, hackathons, workshops..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 text-xs flex items-center justify-center cursor-pointer transition-colors"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
            aria-label="Close search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Events Results List */}
        <div className="max-h-[55vh] overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-xl font-black">
                🔍
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                No events matched "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for "HackFest", "Workshop", "Talk", or clear filters to see all campus events.
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                  }}
                  className="mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                >
                  Clear search query
                </button>
              )}
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isGoing = joinedEvents.includes(event.id)
              return (
                <div
                  key={event.id}
                  className="pt-3 first:pt-0 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/80"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Date Pill */}
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                      <span className="text-[10px] font-black uppercase text-amber-600 leading-none">
                        {event.month}
                      </span>
                      <strong className="text-base font-black leading-tight text-slate-900">
                        {event.day}
                      </strong>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider">
                          {event.type}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {event.time}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                        <span>📍 {event.location}</span>
                        <span>·</span>
                        <span className="text-emerald-600 font-medium">
                          {event.people} attending
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {onToggleJoin && (
                      <button
                        type="button"
                        onClick={() => onToggleJoin(event.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isGoing
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-2xs active:scale-95'
                        }`}
                      >
                        {isGoing ? '✓ RSVP Done' : '+ RSVP Event'}
                      </button>
                    )}
                    {onSelectEvent && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectEvent(event)
                          onClose()
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                        title="View event details"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Found <strong>{filteredEvents.length}</strong> events
          </span>
          <span className="hidden sm:inline-block text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-mono">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  )
}

export default EventSearchModal
