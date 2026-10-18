import React from "react"
import { ActiveScreen } from "@/types"
import Icon from "@/components/common/Icon"

interface HeaderProps {
  activeScreen: ActiveScreen
  onQuickSearch?: (query: string) => void
}

const SCREEN_TITLES: Record<ActiveScreen, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Campus Overview",
    subtitle: "Real-time activity, clan progress, and student participation statistics",
  },
  reports: {
    title: "Monthly Institutional Reports",
    subtitle: "Generate and export official NAAC-ready monthly PDF reports",
  },
  students: {
    title: "Student Management",
    subtitle: "Search, inspect, and moderate student profiles and credentials",
  },
  clans: {
    title: "Clan Directory & Moderation",
    subtitle: "Review student team formations, projects, and active rosters",
  },
  messages: {
    title: "Campus Communications",
    subtitle: "Send targeted broadcasts to clans or individual student inboxes",
  },
  events: {
    title: "Event Administration",
    subtitle: "Create, schedule, and oversee campus hackathons, workshops, and meetups",
  },
  trophies: {
    title: "Trophies & Awards Management",
    subtitle: "Allocate verified achievements with 48-hour post-event award tracking",
  },
  suspensions: {
    title: "Suspension Management",
    subtitle: "Manage duration, reasons, and access restorations for students and clans",
  },
  "audit-log": {
    title: "History & Administrative Audit",
    subtitle: "Traceable log of previous administrative actions and historical records",
  },
}

/**
 * Header: Top administrative status bar
 * Provides campus context, notification indicator, and current screen title.
 */
export default function Header({ activeScreen }: HeaderProps) {
  const meta = SCREEN_TITLES[activeScreen] || {
    title: "Campus Admin",
    subtitle: "Campus Clans administrative portal",
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 md:h-20 px-4 md:px-8 bg-white/75 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all">
      {/* Title & Screen Description */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {meta.title}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {meta.subtitle}
        </p>
      </div>

      {/* Campus Selector & Topbar Utilities */}
      <div className="flex items-center gap-4">
        {/* Campus Context Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs font-semibold text-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Campus Community Portal</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all"
        >
          <Icon name="bell" size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  )
}
