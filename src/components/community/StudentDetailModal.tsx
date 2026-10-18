import React, { useState } from "react"
import { Student } from "@/types"
import StatusBadge from "@/components/common/StatusBadge"
import Icon from "@/components/common/Icon"

interface StudentDetailModalProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedStudent: Student) => void
  onSuspend: (student: Student) => void
  onUnsuspend: (student: Student) => void
  onDelete: (student: Student) => void
  onSendMessage: (student: Student) => void
}

/**
 * StudentDetailModal: Section 4 Student Detail Screen & Actions
 * Displays student profile, permitted edit fields, and administrative controls.
 */
export default function StudentDetailModal({
  student,
  isOpen,
  onClose,
  onSave,
  onSuspend,
  onUnsuspend,
  onDelete,
  onSendMessage,
}: StudentDetailModalProps) {
  if (!isOpen || !student) return null

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: student.name,
    department: student.department,
    branch: student.branch,
    about: student.about,
    skills: student.skills.join(", "),
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...student,
      name: formData.name,
      department: formData.department,
      branch: formData.branch,
      about: formData.about,
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
    })
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#172033] to-[#25334d] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-400/20">
              {student.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{student.name}</h3>
                <StatusBadge status={student.status} size="sm" />
              </div>
              <span className="text-xs text-slate-300 font-mono">
                @{student.username} · {student.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          {/* Section 4 Suspension Rule Notice */}
          {student.status === "Suspended" && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <strong className="text-rose-900 font-bold block flex items-center gap-1.5">
                <Icon name="shield" size={14} className="text-rose-600" />
                Student Account Suspended
              </strong>
              <p className="text-rose-700">
                <strong>Reason:</strong> {student.suspensionDetails?.reason || "Administrative review"}
              </p>
              <p className="text-[11px] text-rose-600">
                Duration: {student.suspensionDetails?.durationDays} days (until {student.suspensionDetails?.endDate}).
                <em className="block mt-0.5">Note: As per Campus Clans policy, this student can still log in but protected actions (clan creation, project commits, event participation) are blocked.</em>
              </p>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Branch / Program
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  About / Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Academic & Clan Information */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                  <strong className="text-slate-800 text-xs block mt-0.5">{student.department}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Branch & Year</span>
                  <strong className="text-slate-800 text-xs block mt-0.5">{student.branch} ({student.year})</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Clan Membership</span>
                  <strong className="text-slate-800 text-xs block mt-0.5">
                    {student.clanName || "No Clan Assigned"}
                  </strong>
                </div>
              </div>

              {/* About Section */}
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                  About Student
                </span>
                <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-700 leading-relaxed">
                  {student.about || "No student bio provided."}
                </p>
              </div>

              {/* Skills Tags */}
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-2">
                  Verified Skills & Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats & Portfolio Overview */}
              <div className="flex items-center gap-4 p-3 bg-slate-100/60 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">Projects Completed: <strong>{student.projectsCount}</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-medium">Trophies Won: <strong>{student.trophiesCount}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Icon name="edit" size={14} />
                <span>Edit Permitted Info</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose()
                onSendMessage(student)
              }}
              className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Icon name="send" size={14} />
              <span>Direct Message</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {student.status === "Active" ? (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onSuspend(student)
                }}
                className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-1.5"
              >
                <Icon name="shield" size={14} />
                <span>Suspend Student</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onUnsuspend(student)
                }}
                className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>Unsuspend / Restore</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose()
                onDelete(student)
              }}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Icon name="trash" size={14} />
              <span>Permanent Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
