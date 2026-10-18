import React, { useState, useEffect } from 'react'
import { mernApi } from '@/services/mernApi'

/**
 * Admin Notifications Component
 * Structure:
 * └── Admin Notifications
 *     ├── Trophy Allocated
 *     ├── New Candidate Application
 *     ├── Event Reminder
 *     ├── Achievement Published
 *     ├── Weekly Leaderboard
 *     └── Recruitment Update
 */

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Trophy Allocated',
    title: 'Trophy Allocated: HackFest 2026 Champion',
    description: 'Gold Trophy for "Best Campus AI Architecture" has been officially allocated to Pixel Pirates.',
    meta: 'Awarded to Pixel Pirates · Allocation by Campus Admin',
    time: '12 mins ago',
    unread: true,
    badgeColor: 'amber',
    icon: 'trophy',
    actionLabel: 'View Trophy',
  },
  {
    id: 'notif-2',
    category: 'New Candidate Application',
    title: 'New Candidate Application: Ananya Patel',
    description: 'Ananya Patel (B.Tech IT, 1st Year) submitted a membership application to join Pixel Pirates as a Frontend Developer.',
    meta: 'Applicant: Ananya Patel · Skills: React, Tailwind, C++',
    time: '28 mins ago',
    unread: true,
    badgeColor: 'blue',
    icon: 'user-plus',
    actionLabel: 'Review Candidate',
  },
  {
    id: 'notif-3',
    category: 'Event Reminder',
    title: 'Event Reminder: Annual Campus Tech Symposium',
    description: 'HackFest 2026 & Tech Symposium starts in 2 hours at Central Auditorium. 248 registered students.',
    meta: 'Starts Today at 09:00 AM · Hall A & Design Studio 2B',
    time: '1 hour ago',
    unread: true,
    badgeColor: 'emerald',
    icon: 'calendar',
    actionLabel: 'View Event',
  },
  {
    id: 'notif-4',
    category: 'Achievement Published',
    title: 'Achievement Published: 120+ Active Clan Projects',
    description: 'New campus milestone reached: Over 120 collaborative open-source and hardware prototypes published across all active clans.',
    meta: 'Campus Ecosystem Milestone · Published to Community Feed',
    time: '3 hours ago',
    unread: false,
    badgeColor: 'purple',
    icon: 'star',
    actionLabel: 'View Achievement',
  },
  {
    id: 'notif-5',
    category: 'Weekly Leaderboard',
    title: 'Weekly Leaderboard: Week 42 Finalized',
    description: 'Pixel Pirates holds #1 with 1,840 pts, followed by Binary Beasts (1,620 pts) and Circuit Crew (1,490 pts).',
    meta: '48 Clans Evaluated · Updated Leaderboard Standings',
    time: '5 hours ago',
    unread: false,
    badgeColor: 'orange',
    icon: 'trending',
    actionLabel: 'Inspect Standings',
  },
  {
    id: 'notif-6',
    category: 'Recruitment Update',
    title: 'Recruitment Update: Circuit Crew Opened 4 Slots',
    description: 'Circuit Crew published an open recruitment call for Embedded C & IoT drone swarm developers.',
    meta: 'Clan: Circuit Crew · 4 Open Roles · Deadline: Nov 5',
    time: 'Yesterday',
    unread: false,
    badgeColor: 'sky',
    icon: 'megaphone',
    actionLabel: 'Manage Recruitment',
  },
]

function NotificationIcon({ name, size = 18, color = 'currentColor' }) {
  switch (name) {
    case 'trophy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 21h8M12 17v4M6 4h12v5a6 6 0 0 1-12 0V4Z" />
          <path d="M6 6H3v2a4 4 0 0 0 4 4M18 6h3v2a4 4 0 0 1-4 4" />
        </svg>
      )
    case 'user-plus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      )
    case 'calendar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    case 'trending':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      )
    case 'megaphone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      )
    case 'check':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'close':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'bell':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    case 'trash':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      )
    default:
      return null
  }
}

export function AdminNotifications({
  isOpen = true,
  onClose,
  onAction,
}) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [activeCategory, setActiveCategory] = useState('All')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    let isMounted = true
    mernApi.notifications.getAll()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item._id || item.id,
            category: item.category,
            title: item.title,
            description: item.description,
            meta: item.meta || '',
            time: item.time || 'Recently',
            unread: item.unread !== undefined ? item.unread : true,
            badgeColor: item.badgeColor || 'amber',
            icon: item.icon || 'bell',
            actionLabel: item.actionLabel || 'View Details',
          }))
          setNotifications(mapped)
        }
      })
      .catch((err) => {
        console.warn('[Notifications] Offline mode, using initial seed:', err)
      })
    return () => {
      isMounted = false
    }
  }, [isOpen])

  const categories = [
    'All',
    'Trophy Allocated',
    'New Candidate Application',
    'Event Reminder',
    'Achievement Published',
    'Weekly Leaderboard',
    'Recruitment Update',
  ]

  const filtered = activeCategory === 'All'
    ? notifications
    : notifications.filter((n) => n.category === activeCategory)

  const unreadCount = notifications.filter((n) => n.unread).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    mernApi.notifications.markAllRead().catch(() => {})
    setFeedback('All notifications marked as read')
    setTimeout(() => setFeedback(null), 2500)
  }

  function toggleRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    )
    mernApi.notifications.markRead(id).catch(() => {})
  }

  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    mernApi.notifications.delete(id).catch(() => {})
    setFeedback('Notification dismissed')
    setTimeout(() => setFeedback(null), 2000)
  }

  function handleActionClick(item) {
    setFeedback(`Opening ${item.category}...`)
    if (onAction) {
      onAction(item)
    }
    setTimeout(() => setFeedback(null), 2500)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black shadow-md">
              <NotificationIcon name="bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
                  ADMIN CONSOLE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-300">Live Broadcast</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                Admin Notifications
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-all cursor-pointer"
                title="Mark all as read"
              >
                <NotificationIcon name="check" size={14} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              aria-label="Close notifications"
            >
              <NotificationIcon name="close" size={18} />
            </button>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="p-3 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {categories.map((cat) => {
            const count = cat === 'All' ? notifications.length : notifications.filter((n) => n.category === cat).length
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade">
            <NotificationIcon name="check" size={14} color="#059669" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Notification Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 divide-y divide-slate-100 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <NotificationIcon name="bell" size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No notifications in this category</h3>
              <p className="text-xs text-slate-400">All alerts and updates will show up here in real-time.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const badgeTheme = {
                amber: 'bg-amber-50 text-amber-800 border-amber-200',
                blue: 'bg-blue-50 text-blue-800 border-blue-200',
                emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                purple: 'bg-purple-50 text-purple-800 border-purple-200',
                orange: 'bg-orange-50 text-orange-800 border-orange-200',
                sky: 'bg-sky-50 text-sky-800 border-sky-200',
              }[item.badgeColor] || 'bg-slate-50 text-slate-800 border-slate-200'

              const iconTheme = {
                amber: 'bg-amber-100 text-amber-700',
                blue: 'bg-blue-100 text-blue-700',
                emerald: 'bg-emerald-100 text-emerald-700',
                purple: 'bg-purple-100 text-purple-700',
                orange: 'bg-orange-100 text-orange-700',
                sky: 'bg-sky-100 text-sky-700',
              }[item.badgeColor] || 'bg-slate-100 text-slate-700'

              return (
                <div
                  key={item.id}
                  className={`pt-3.5 first:pt-0 group relative rounded-2xl p-4 transition-all duration-200 border ${
                    item.unread
                      ? 'bg-amber-50/40 border-amber-200/90 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Category Icon Badge */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${iconTheme}`}>
                      <NotificationIcon name={item.icon} size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeTheme}`}>
                            {item.category}
                          </span>
                          {item.unread && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {item.time}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-1.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-slate-500">
                        <span>{item.meta}</span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleRead(item.id)}
                            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            {item.unread ? 'Mark read' : 'Mark unread'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleActionClick(item)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                          >
                            <span>{item.actionLabel}</span>
                            <span>→</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteNotification(item.id)}
                            className="p-1 rounded-md text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Dismiss notification"
                          >
                            <NotificationIcon name="trash" size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">{notifications.length} Total Alerts</span>
            <span>·</span>
            <span className="text-amber-700 font-semibold">{unreadCount} Unread</span>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="font-bold text-amber-700 hover:text-amber-800 cursor-pointer underline"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNotifications
