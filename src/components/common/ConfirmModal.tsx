import React from "react"
import Icon from "./Icon"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  target: string
  impact: string
  reversibility: "reversible" | "permanent"
  confirmButtonText?: string
  isDestructive?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * ConfirmModal: Section 6 & 8 Destructive Action Confirmation Dialog
 * Clearly distinguishes between reversible suspensions and permanent deletions.
 */
export default function ConfirmModal({
  isOpen,
  title,
  target,
  impact,
  reversibility,
  confirmButtonText = "Confirm Action",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-md p-6 bg-white/95 rounded-2xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] backdrop-blur-xl animate-scale-up">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${
              isDestructive
                ? "bg-rose-100/80 text-rose-600 border border-rose-200"
                : "bg-amber-100/80 text-amber-700 border border-amber-200"
            }`}
          >
            <Icon name={isDestructive ? "trash" : "alert"} size={22} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Target: <span className="text-slate-950 underline decoration-amber-400">{target}</span>
            </p>
          </div>
        </div>

        {/* Impact Description */}
        <div className="mt-4 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-600 leading-relaxed">
          <strong className="block mb-1 text-slate-800 font-semibold">Impact:</strong>
          {impact}
        </div>

        {/* Reversibility Notice */}
        <div
          className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
            reversibility === "permanent"
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-amber-50 text-amber-800 border border-amber-200"
          }`}
        >
          <Icon name="alert" size={14} />
          <span>
            {reversibility === "permanent"
              ? "Permanent Action: This operation cannot be undone."
              : "Reversible Action: You can restore this access anytime."}
          </span>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                : "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/20"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isLoading && <Icon name="refresh" size={16} className="animate-spin" />}
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}
