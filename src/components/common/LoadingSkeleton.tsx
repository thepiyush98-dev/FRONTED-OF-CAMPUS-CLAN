import React from "react"

/**
 * LoadingSkeleton: Shimmer placeholder for fetching states
 * Fulfills Section 3 required loading states.
 */
export default function LoadingSkeleton({
  lines = 4,
  height = "h-6",
  className = "",
}: {
  lines?: number
  height?: string
  className?: string
}) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gradient-to-r from-slate-200/60 via-slate-100/80 to-slate-200/60 rounded-xl shimmer-bg`}
        />
      ))}
    </div>
  )
}
