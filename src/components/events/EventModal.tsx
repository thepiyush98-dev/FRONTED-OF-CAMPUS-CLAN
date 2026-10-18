import React, { useState, useEffect } from "react"
import { EventItem, ParticipationMode } from "@/types"
import Icon from "@/components/common/Icon"

interface EventModalProps {
  isOpen: boolean
  eventToEdit: EventItem | null
  onClose: () => void
  onSave: (eventData: Partial<EventItem>) => void
}

/**
 * EventModal: Section 8 Create/Edit Event Form
 * Validates dates, required fields, participation mode, and external links.
 */
export default function EventModal({
  isOpen,
  eventToEdit,
  onClose,
  onSave,
}: EventModalProps) {
  if (!isOpen) return null

  const isEditing = !!eventToEdit

  const [title, setTitle] = useState(eventToEdit?.title || "")
  const [type, setType] = useState<EventItem["type"]>(eventToEdit?.type || "Hackathon")
  const [description, setDescription] = useState(eventToEdit?.description || "")
  const [location, setLocation] = useState(eventToEdit?.location || "")
  const [startDate, setStartDate] = useState(eventToEdit?.startDate || "2026-10-25")
  const [endDate, setEndDate] = useState(eventToEdit?.endDate || "2026-10-27")
  const [time, setTime] = useState(eventToEdit?.time || "10:00 AM")
  const [participationMode, setParticipationMode] = useState<ParticipationMode>(
    eventToEdit?.participationMode || "both"
  )
  const [externalLink, setExternalLink] = useState(eventToEdit?.externalLink || "")
  const [mediaUrl, setMediaUrl] = useState(eventToEdit?.mediaUrl || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title)
      setType(eventToEdit.type)
      setDescription(eventToEdit.description)
      setLocation(eventToEdit.location)
      setStartDate(eventToEdit.startDate)
      setEndDate(eventToEdit.endDate)
      setTime(eventToEdit.time)
      setParticipationMode(eventToEdit.participationMode)
      setExternalLink(eventToEdit.externalLink || "")
      setMediaUrl(eventToEdit.mediaUrl || "")
    }
  }, [eventToEdit])

  // Form Validation per Section 8
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!title.trim()) newErrors.title = "Event title is required."
    if (!description.trim()) newErrors.description = "Event description is required."
    if (!location.trim()) newErrors.location = "Campus venue / location is required."
    if (new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date cannot be earlier than start date."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      title,
      type,
      description,
      location,
      startDate,
      endDate,
      time,
      participationMode,
      externalLink,
      mediaUrl: mediaUrl || undefined,
      status: "Upcoming",
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#172033] to-[#25334d] text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white">
              {isEditing ? "Edit Campus Event" : "Create New Campus Event"}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Event will be published to the student portal and campus calendar
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {/* Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Event Name / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. North India Hackfest 2026"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
              {errors.title && <span className="text-rose-600 text-[10px] mt-0.5 block">{errors.title}</span>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventItem["type"])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Talk">Talk / Keynote</option>
                <option value="Build Night">Build Night</option>
                <option value="Competition">Competition</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline event goals, target student audience, and agenda..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
            />
            {errors.description && <span className="text-rose-600 text-[10px] mt-0.5 block">{errors.description}</span>}
          </div>

          {/* Venue & Participation Mode (Section 8) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Location / Venue <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Innovation Hub, 3rd Floor"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
              {errors.location && <span className="text-rose-600 text-[10px] mt-0.5 block">{errors.location}</span>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Participation Mode
              </label>
              <select
                value={participationMode}
                onChange={(e) => setParticipationMode(e.target.value as ParticipationMode)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="both">Both Individual & Clan Teams</option>
                <option value="clan">Clan Teams Only</option>
                <option value="individual">Individual Students Only</option>
              </select>
            </div>
          </div>

          {/* Dates & Time Validation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
              {errors.endDate && <span className="text-rose-600 text-[10px] mt-0.5 block">{errors.endDate}</span>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Optional External Link & Media Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                External Link (Optional)
              </label>
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="https://event-site.edu"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Media Banner Image URL (Optional)
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md shadow-amber-400/20 transition-all"
            >
              {isEditing ? "Save Event Changes" : "Publish Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
