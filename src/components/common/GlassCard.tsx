import React, { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  onClick?: () => void
}

/**
 * GlassCard: Translucent glassmorphism container
 * Provides subtle blur, gentle white highlight border, and soft elevation.
 */
export default function GlassCard({
  children,
  className = "",
  hoverEffect = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl border border-white/60 bg-white/75 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ${
        hoverEffect
          ? "hover:translate-y-[-2px] hover:shadow-[0_16px_36px_rgba(30,41,59,0.08)] hover:border-amber-400/40 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}
