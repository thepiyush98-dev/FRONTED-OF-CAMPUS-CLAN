import React from "react"

interface CampusLogoProps {
  size?: number
  showText?: boolean
  subtitle?: string
  adminVariant?: boolean
  className?: string
  onClick?: () => void
}

/**
 * CampusLogo: Official Brand Logo for Campus Clans
 * Replaces the old 3-lines icon with the official interlocking "CC" emblem
 * featuring the community/clan silhouette.
 */
export default function CampusLogo({
  size = 38,
  showText = true,
  subtitle = "Connect · Collaborate · Grow",
  adminVariant = false,
  className = "",
  onClick,
}: CampusLogoProps) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none group cursor-pointer transition-all ${className}`}
    >
      {/* Official Interlocking CC Emblem Container */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-white p-1 shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-amber-400/30 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400 group-hover:shadow-[0_6px_20px_rgba(245,184,0,0.25)]"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.jpg"
          alt="Campus Clans"
          className="w-full h-full object-contain rounded-lg"
          loading="eager"
        />
      </div>

      {/* Brand Typography & Tagline */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-amber-500 transition-colors leading-tight font-heading">
            Campus<span className="text-amber-500">{adminVariant ? "Admin" : "Clans"}</span>
          </span>
          {subtitle && (
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase leading-tight mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
