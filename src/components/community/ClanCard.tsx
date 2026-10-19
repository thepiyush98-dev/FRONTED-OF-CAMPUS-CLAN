import React from "react"
import Icon from "@/components/common/Icon"

export interface ClanCardData {
  name: string
  focus: string
  members: number
  projects: number
  status: "Active" | "Suspended" | "Ended"
  initials: string
  leaderName?: string
  coLeaderName?: string
  tierBadge?: string
  xp?: string
  trophies?: number
  accentColor?: "blue" | "emerald" | "purple" | "amber"
  tags?: string[]
}

interface ClanCardProps {
  clan: ClanCardData
  onJoin?: () => void
  onOpen?: () => void
  isRequested?: boolean
  className?: string
}

/**
 * ClanCard: Modern Web3 / Trading Card Style
 * Strictly inspired by the reference design:
 * - Rounded luxury dark chassis
 * - Top Artwork stage with prominent Clan Emblem / Logo, and Bottom XP/Members pill
 * - Bold high-contrast white typography
 * - Inset dark stats panel with dual metrics
 * - Direct clan profile navigation
 */
export default function ClanCard({
  clan,
  onJoin,
  onOpen,
  isRequested = false,
  className = "",
}: ClanCardProps) {
  // Deterministic clan styling based on clan name
  const getClanTheme = (name: string) => {
    switch (name) {
      case "Pixel Pirates":
        return {
          bgGradient: "from-[#0f172a] via-[#1e293b] to-[#0f172a]",
          tierBadge: "Tier 1: Elite",
          pillStat: `${clan.members} Members`,
          accentGlow: "rgba(56, 189, 248, 0.25)",
          stat1Label: "PROJECTS BUILT",
          stat1Val: `${clan.projects} Projects`,
          stat2Label: "CO-LEADER",
          stat2Val: clan.coLeaderName || "Riya Malhotra",
          statusColor: "text-emerald-400",
          leader: clan.leaderName || "Aarav Khanna",
          coLeader: clan.coLeaderName || "Riya Malhotra",
          emblem: (
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              <defs>
                <linearGradient id="ppGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              {/* Pirate Hat & Digital Bandana */}
              <path d="M20 40 Q50 15 80 40 Q85 30 50 10 Q15 30 20 40 Z" fill="#f59e0b" />
              <rect x="25" y="38" width="50" height="8" rx="3" fill="#d97706" />
              {/* Cyber Skull Face */}
              <circle cx="50" cy="55" r="22" fill="url(#ppGrad)" />
              {/* VR Neon Eyepatch / Goggles */}
              <rect x="35" y="48" width="14" height="10" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="42" cy="53" r="3" fill="#38bdf8" />
              <line x1="28" y1="46" x2="35" y2="49" stroke="#f59e0b" strokeWidth="2" />
              <line x1="49" y1="51" x2="65" y2="48" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="60" cy="53" r="4" fill="#0f172a" />
              <circle cx="60" cy="53" r="2" fill="#38bdf8" />
              {/* Teeth / Digital Grid */}
              <rect x="42" y="68" width="4" height="5" rx="1" fill="#ffffff" />
              <rect x="48" y="68" width="4" height="5" rx="1" fill="#ffffff" />
              <rect x="54" y="68" width="4" height="5" rx="1" fill="#ffffff" />
              {/* Cross Code Brackets */}
              <path d="M22 75 L32 85 M22 85 L32 75" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <path d="M78 75 L68 85 M78 85 L68 75" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ),
        }

      case "Binary Beasts":
        return {
          bgGradient: "from-[#022c22] via-[#064e3b] to-[#022c22]",
          tierBadge: "Rank #1 Campus",
          pillStat: `${clan.members} Members`,
          accentGlow: "rgba(16, 185, 129, 0.25)",
          stat1Label: "AI MODELS BUILT",
          stat1Val: `${clan.projects} Systems`,
          stat2Label: "CO-LEADER",
          stat2Val: clan.coLeaderName || "Simran Kaur",
          statusColor: "text-emerald-400",
          leader: clan.leaderName || "Devansh Sharma",
          coLeader: clan.coLeaderName || "Simran Kaur",
          emblem: (
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              <defs>
                <linearGradient id="bbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
              {/* Wolf Ears */}
              <polygon points="30,20 40,42 22,38" fill="#10b981" />
              <polygon points="70,20 60,42 78,38" fill="#10b981" />
              {/* Cyber Beast Head */}
              <polygon points="50,30 68,44 64,72 50,86 36,72 32,44" fill="url(#bbGrad)" />
              {/* Glowing Neural Circuit Lines */}
              <line x1="50" y1="36" x2="50" y2="56" stroke="#34d399" strokeWidth="2.5" />
              <line x1="42" y1="46" x2="58" y2="46" stroke="#34d399" strokeWidth="2.5" />
              {/* Glowing Eyes */}
              <polygon points="40,52 46,55 42,57" fill="#fbbf24" />
              <polygon points="60,52 54,55 58,57" fill="#fbbf24" />
              {/* Cyber Snout */}
              <polygon points="50,68 56,76 44,76" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
            </svg>
          ),
        }

      case "Venture Verse":
        return {
          bgGradient: "from-[#2e1065] via-[#4c1d95] to-[#2e1065]",
          tierBadge: "Incubated",
          pillStat: `${clan.members} Members`,
          accentGlow: "rgba(168, 85, 247, 0.25)",
          stat1Label: "STARTUP DEMOS",
          stat1Val: `${clan.projects} Pitches`,
          stat2Label: "CO-LEADER",
          stat2Val: clan.coLeaderName || "Siddharth Roy",
          statusColor: "text-amber-400",
          leader: clan.leaderName || "Naina Kapoor",
          coLeader: clan.coLeaderName || "Siddharth Roy",
          emblem: (
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              <defs>
                <linearGradient id="vvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7e22ce" />
                </linearGradient>
              </defs>
              {/* Galaxy Orbital Ring */}
              <ellipse cx="50" cy="55" rx="38" ry="14" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3" />
              {/* Cosmic Rocket Body */}
              <path d="M50 18 Q62 38 58 64 L42 64 Q38 38 50 18 Z" fill="url(#vvGrad)" />
              {/* Rocket Nose Cone & Window */}
              <path d="M50 18 Q56 30 50 36 Q44 30 50 18 Z" fill="#fbbf24" />
              <circle cx="50" cy="46" r="5" fill="#ffffff" stroke="#7e22ce" strokeWidth="2" />
              {/* Fins */}
              <polygon points="42,56 32,68 42,66" fill="#a855f7" />
              <polygon points="58,56 68,68 58,66" fill="#a855f7" />
              {/* Flame Booster */}
              <polygon points="46,65 54,65 50,82" fill="#f59e0b" />
              <polygon points="48,65 52,65 50,75" fill="#fef08a" />
            </svg>
          ),
        }

      default: // Circuit Crew
        return {
          bgGradient: "from-[#0c4a6e] via-[#075985] to-[#0c4a6e]",
          tierBadge: "Hardware Lab",
          pillStat: `${clan.members} Members`,
          accentGlow: "rgba(14, 165, 233, 0.25)",
          stat1Label: "ROBOTS & IOT",
          stat1Val: `${clan.projects} Builds`,
          stat2Label: "CO-LEADER",
          stat2Val: clan.coLeaderName || "Priya Das",
          statusColor: "text-sky-400",
          leader: clan.leaderName || "Kabir Singh",
          coLeader: clan.coLeaderName || "Priya Das",
          emblem: (
            <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              <defs>
                <linearGradient id="ccGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>
              {/* Chip Base Frame */}
              <rect x="26" y="26" width="48" height="48" rx="8" fill="url(#ccGrad)" stroke="#38bdf8" strokeWidth="2" />
              {/* Core Processor Ring */}
              <rect x="36" y="36" width="28" height="28" rx="6" fill="#0f172a" />
              {/* Glowing CPU Core */}
              <circle cx="50" cy="50" r="7" fill="#f59e0b" />
              <circle cx="50" cy="50" r="4" fill="#ffffff" />
              {/* Circuit Bus Pins */}
              <rect x="20" y="32" width="6" height="3" rx="1" fill="#f59e0b" />
              <rect x="20" y="42" width="6" height="3" rx="1" fill="#f59e0b" />
              <rect x="20" y="52" width="6" height="3" rx="1" fill="#f59e0b" />
              <rect x="20" y="62" width="6" height="3" rx="1" fill="#f59e0b" />
              <rect x="74" y="32" width="6" height="3" rx="1" fill="#f59e0b" />
              <rect x="74" y="42" width="6" height="3" rx="1" fill="#f59e0b" />
              <rect x="74" y="52" width="6" height="3" rx="1" fill="#f59e0b" />
              <rect x="74" y="62" width="6" height="3" rx="1" fill="#f59e0b" />
              {/* Top & Bottom Pins */}
              <rect x="34" y="20" width="3" height="6" rx="1" fill="#38bdf8" />
              <rect x="44" y="20" width="3" height="6" rx="1" fill="#38bdf8" />
              <rect x="54" y="20" width="3" height="6" rx="1" fill="#38bdf8" />
              <rect x="64" y="20" width="3" height="6" rx="1" fill="#38bdf8" />
              <rect x="34" y="74" width="3" height="6" rx="1" fill="#38bdf8" />
              <rect x="44" y="74" width="3" height="6" rx="1" fill="#38bdf8" />
              <rect x="54" y="74" width="3" height="6" rx="1" fill="#38bdf8" />
              <rect x="64" y="74" width="3" height="6" rx="1" fill="#38bdf8" />
            </svg>
          ),
        }
    }
  }

  const theme = getClanTheme(clan.name)

  return (
    <article
      className={`group relative rounded-[28px] bg-[#0c1017] border border-slate-800/80 p-4 shadow-xl hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full select-none cursor-pointer ${className}`}
      onClick={() => {
        if (onOpen) onOpen()
        else if (onJoin) onJoin()
      }}
    >
      <div className="space-y-4">
        {/* 
          1. TOP ARTWORK STAGE
          - Clean mascot emblem stage
          - Center Clan Logo Mascot Emblem
          - Bottom floating pill badge ("18 Members")
        */}
        <div
          className={`relative aspect-square sm:aspect-[4/3] md:aspect-square w-full rounded-[22px] overflow-hidden bg-gradient-to-b ${theme.bgGradient} flex items-center justify-center p-4 border border-white/10 shadow-inner group-hover:scale-[1.01] transition-transform`}
        >
          {/* Subtle Ambient Glow Behind Mascot */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 blur-xl"
            style={{ background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)` }}
          />

          {/* Center 3D Mascot / Clan Logo */}
          <div className="relative z-0 group-hover:scale-110 transition-transform duration-300">
            {theme.emblem}
          </div>

          {/* Bottom Floating Pill Overlay */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="px-4 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 text-white font-black text-xs shadow-lg whitespace-nowrap">
              {theme.pillStat}
            </span>
          </div>
        </div>

        {/* 
          2. CLAN INFO SECTION
          High-contrast, bold, crisp white typography + Leader & Co-Leader & Projects
        */}
        <div className="space-y-2.5 px-1">
          {/* Clan Title & Status */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
              {clan.name}
            </h3>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                clan.status === "Active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
              }`}
            >
              {clan.status}
            </span>
          </div>

          {/* Leadership: Leader & Co-Leader */}
          <div className="flex items-center justify-between text-xs py-1 border-t border-b border-white/10">
            <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <span>👑</span>
              <strong className="text-slate-200 font-bold">{theme.leader}</strong>
            </span>
            <span className="text-purple-300 font-medium text-[11px] flex items-center gap-1">
              <span>⭐</span>
              <strong className="text-purple-200 font-bold">{theme.coLeader}</strong>
            </span>
          </div>

          {/* Current Running Projects & Co-Leader Pill */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#151c28] border border-white/10 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <strong className="text-white font-extrabold">{clan.projects}</strong>
              <span className="text-slate-400 font-bold text-[10px] uppercase">Projects</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300">
              <span className="text-[10px] text-purple-400 font-black">Co-Lead:</span>
              <span className="font-bold text-[11px] text-white truncate max-w-[90px]">{theme.coLeader}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        3. DUAL ACTION BUTTONS: Explore Clan & Join Clan
      */}
      <div className="pt-3 mt-1 grid grid-cols-2 gap-2">
        {/* Explore Clan Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpen?.()
          }}
          className="w-full py-2.5 px-2 rounded-xl font-black text-[11px] tracking-wider uppercase transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1 cursor-pointer bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 hover:border-slate-500"
          title="Explore Clan Profile"
        >
          <span>Explore</span>
          <Icon name="arrow" size={12} />
        </button>

        {/* Join Clan Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onJoin?.()
          }}
          style={
            isRequested
              ? { backgroundColor: "#1e293b", color: "#fbbf24", borderColor: "rgba(245, 184, 0, 0.4)" }
              : { backgroundColor: "#f5b800", color: "#0f172a", borderColor: "#f5b800" }
          }
          className="w-full py-2.5 px-2 rounded-xl font-black text-[11px] tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 cursor-pointer hover:brightness-105 border truncate"
          title={isRequested ? "Request Sent" : "Join Clan"}
        >
          <span style={{ color: isRequested ? "#fbbf24" : "#0f172a", fontWeight: 900 }}>
            {isRequested ? "Joined ✓" : "Join Clan"}
          </span>
        </button>
      </div>
    </article>
  )
}
