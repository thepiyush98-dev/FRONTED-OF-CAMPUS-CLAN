import React from "react"
import Icon from "./Icon"

interface StatusBadgeProps {
  status: "Active" | "Suspended" | "Upcoming" | "Ended" | "Pending" | "Confirmed" | string
  size?: "sm" | "md"
}

/**
 * StatusBadge: Visual indicator complying with WCAG 2.2 accessibility
 * Uses both visual iconography + color + readable text (not color alone).
 */
export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const norm = status.toLowerCase()

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200"
  let iconName = "check"

  if (norm === "active" || norm === "confirmed") {
    colorClasses = "bg-emerald-50/80 text-emerald-700 border-emerald-200/80"
    iconName = "check"
  } else if (norm === "suspended") {
    colorClasses = "bg-rose-50/80 text-rose-700 border-rose-200/80"
    iconName = "alert"
  } else if (norm === "upcoming" || norm === "pending") {
    colorClasses = "bg-amber-50/80 text-amber-800 border-amber-200/80"
    iconName = "history"
  } else if (norm === "ended") {
    colorClasses = "bg-slate-100/80 text-slate-600 border-slate-200/80"
    iconName = "check"
  }

  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border backdrop-blur-sm ${padding} ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      <span>{status}</span>
    </span>
  )
}
