import React from "react"
import { ActiveScreen, NavigationArea } from "@/types"
import Icon from "@/components/common/Icon"
import GrapeVineBackground from "@/components/common/GrapeVineBackground"
import MobileBottomBar, { MobileNavItem } from "@/components/layout/MobileBottomBar"

interface SidebarProps {
  activeScreen: ActiveScreen
  onSelectScreen: (screen: ActiveScreen) => void
  onLogout?: () => void
}

/**
 * Sidebar: Grouped into the four specific areas mandated by PDF Section 2:
 * 1. Overview: Dashboard & Reports
 * 2. Community: Students, Clans, Messages
 * 3. Events: Events, Trophies
 * 4. Administration: Suspensions, History/Audit Log
 *
 * Enhanced with:
 * - PC: An artistic growing grape vine background (अंगूर की बेल)
 * - Mobile: An Instagram-style fixed bottom navigation bar
 * - Tactile spring-animated hover feedback
 */
export default function Sidebar({
  activeScreen,
  onSelectScreen,
  onLogout,
}: SidebarProps) {
  // Navigation structure directly from Section 2 handoff document
  const navSections: {
    area: NavigationArea
    title: string
    items: { screen: ActiveScreen; label: string; icon: string; badge?: string }[]
  }[] = [
    {
      area: "overview",
      title: "OVERVIEW",
      items: [
        { screen: "dashboard", label: "Dashboard", icon: "dashboard" },
        { screen: "reports", label: "Monthly Reports", icon: "reports" },
      ],
    },
    {
      area: "community",
      title: "COMMUNITY",
      items: [
        { screen: "students", label: "Students", icon: "users" },
        { screen: "clans", label: "Clans", icon: "clans" },
      ],
    },
    {
      area: "events",
      title: "EVENTS & AWARDS",
      items: [
        { screen: "events", label: "Events", icon: "calendar" },
        { screen: "trophies", label: "Trophies", icon: "trophy" },
      ],
    },
    {
      area: "administration",
      title: "ADMINISTRATION",
      items: [
        { screen: "suspensions", label: "Suspensions", icon: "shield" },
        { screen: "audit-log", label: "History & Audit", icon: "history" },
      ],
    },
  ]

  // Instagram-style 5 core tabs for mobile phone navigation
  const mobileNavItems: MobileNavItem[] = [
    { id: "dashboard", label: "Home", icon: "dashboard" },
    { id: "students", label: "Students", icon: "users" },
    { id: "clans", label: "Clans", icon: "clans" },
    { id: "events", label: "Events", icon: "calendar" },
    { id: "suspensions", label: "Admin", icon: "shield" },
  ]

  return (
    <>
      {/* PC Sidebar: Displays on md and larger screens */}
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 z-40 w-64 flex-col bg-[#172033]/95 backdrop-blur-2xl border-r border-white/10 text-slate-300 shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Growing Grape Vine Background (PC Only) */}
        <GrapeVineBackground orientation="vertical" opacity={0.35} className="hidden md:block" />

        {/* Brand Header with Official CC Logo & Slogan */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-5 border-b border-white/10 bg-[#172033]/40 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-amber-400/40 shadow-[0_0_20px_rgba(245,184,0,0.35)] flex items-center justify-center transition-transform hover:scale-105">
            <img src="/logo.jpg" alt="Campus Clans" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <span className="block text-sm font-extrabold text-white tracking-tight">
              Campus<span className="text-amber-400">Admin</span>
            </span>
            <span className="block text-[9px] font-bold text-amber-400/90 uppercase tracking-wider">
              Connect · Collaborate · Grow
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.area} className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
                {section.title}
              </span>
              {section.items.map((item) => {
                const isActive = activeScreen === item.screen
                return (
                  <button
                    key={item.screen}
                    type="button"
                    onClick={() => onSelectScreen(item.screen)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative overflow-hidden ${
                      isActive
                        ? "bg-amber-400/20 text-white border-l-4 border-amber-400 shadow-[0_4px_15px_rgba(245,184,0,0.15)] translate-x-1"
                        : "text-slate-400 hover:text-white hover:bg-white/10 hover:translate-x-1"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`transition-all duration-200 ${
                          isActive
                            ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,184,0,0.5)] scale-110"
                            : "text-slate-400 group-hover:text-amber-300 group-hover:scale-105"
                        }`}
                      >
                        <Icon name={item.icon} size={17} />
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-slate-950 shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Campus Capacity & Foot Actions */}
        <div className="relative z-10 p-4 border-t border-white/10 bg-black/30 backdrop-blur-md space-y-3">
          {/* Capacity Widget */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs shadow-inner">
            <div className="flex justify-between items-center text-slate-300 font-medium">
              <span>Campus Capacity</span>
              <strong className="text-white font-bold">72%</strong>
            </div>
            <div className="w-full h-1.5 mt-2 bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#f5b800]"
                style={{ width: "72%" }}
              />
            </div>
            <span className="block mt-1 text-[10px] text-slate-400">
              2,486 of 3,500 student seats
            </span>
          </div>

          {/* Administrator Profile / Sign Out */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center text-xs shadow-sm">
                JD
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-white leading-tight">
                  Dr. Jayant Das
                </span>
                <span className="block text-[10px] text-slate-400 leading-tight">
                  Campus Admin
                </span>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Phone / Mobile Instagram-style Bottom Navigation Bar */}
      <MobileBottomBar
        items={mobileNavItems}
        activeId={activeScreen}
        onSelect={(screenId) => onSelectScreen(screenId as ActiveScreen)}
        theme="dark"
      />
    </>
  )
}
