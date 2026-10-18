import React from "react"
import Icon from "@/components/common/Icon"

export interface MobileNavItem {
  id: string
  label: string
  icon: string
  badge?: string
  isAvatar?: boolean
  avatarText?: string
}

interface MobileBottomBarProps {
  items: MobileNavItem[]
  activeId: string
  onSelect: (id: string) => void
  theme?: "dark" | "light"
}

/**
 * MobileBottomBar: Instagram-style mobile bottom navigation bar
 * - Fixed docked frosted glass footer
 * - Tactile spring-animated icon buttons
 * - Active glowing dot indicator
 * - Notification badges & profile avatar pill
 * - Safe area support for modern phones
 */
export default function MobileBottomBar({
  items,
  activeId,
  onSelect,
  theme = "dark",
}: MobileBottomBarProps) {
  const isDark = theme === "dark"

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
        isDark
          ? "bg-[#172033]/92 backdrop-blur-2xl border-t border-white/10 text-slate-300 shadow-[0_-10px_30px_rgba(0,0,0,0.25)]"
          : "bg-white/90 backdrop-blur-2xl border-t border-slate-200/80 text-slate-600 shadow-[0_-10px_25px_rgba(15,23,42,0.06)]"
      }`}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
      }}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = activeId === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-200 active:scale-90 group focus:outline-none"
            >
              {/* Icon Container with active bounce */}
              <div
                className={`relative flex items-center justify-center w-10 h-7 transition-all duration-200 ${
                  isActive ? "scale-110 -translate-y-0.5" : "group-hover:scale-105"
                }`}
              >
                {item.isAvatar ? (
                  /* Instagram-style circular avatar button */
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      isActive
                        ? "bg-amber-400 text-slate-950 ring-2 ring-amber-400 ring-offset-2 ring-offset-[#172033]"
                        : isDark
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {item.avatarText || "U"}
                  </div>
                ) : (
                  <span
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,184,0,0.5)]"
                        : isDark
                        ? "text-slate-400 group-hover:text-white"
                        : "text-slate-500 group-hover:text-slate-900"
                    }`}
                  >
                    <Icon name={item.icon} size={22} />
                  </span>
                )}

                {/* Notification Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-extrabold rounded-full bg-rose-500 text-white ring-2 ring-[#172033] shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-semibold tracking-tight transition-all duration-200 ${
                  isActive
                    ? "text-amber-400 font-bold scale-105"
                    : isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                {item.label}
              </span>

              {/* Instagram Active Glowing Dot Indicator */}
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f5b800] transition-all animate-scale-up" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
