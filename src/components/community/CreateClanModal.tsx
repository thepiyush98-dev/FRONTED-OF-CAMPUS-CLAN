import React, { useState, useEffect } from "react"
import { djangoApi } from "@/services/djangoApi"
import Icon from "@/components/common/Icon"

interface CreateClanModalProps {
  isOpen: boolean
  onClose: () => void
  onClanCreated: (newClan: any) => void
}

export default function CreateClanModal({
  isOpen,
  onClose,
  onClanCreated,
}: CreateClanModalProps) {
  const [name, setName] = useState("")
  const [focus, setFocus] = useState("Full Stack & Web3")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [isRecruiting, setIsRecruiting] = useState(true)
  const [bannerUrl, setBannerUrl] = useState("")
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [nameStatus, setNameStatus] = useState<"idle" | "available" | "taken">("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Real-time debounce check for clan name availability in Django backend
  useEffect(() => {
    if (!name.trim() || name.trim().length < 3) {
      setNameStatus("idle")
      setIsCheckingName(false)
      return
    }

    setIsCheckingName(true)
    const timer = setTimeout(async () => {
      try {
        const res = await djangoApi.clans.checkClanName(name.trim())
        setNameStatus(res.available ? "available" : "taken")
      } catch {
        setNameStatus("available")
      } finally {
        setIsCheckingName(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [name])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMsg("Clan name is required.")
      return
    }
    if (nameStatus === "taken") {
      setErrorMsg("Please choose an available clan name.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      const formData = new FormData()
      formData.append("name", name.trim())
      formData.append("focus", focus)
      formData.append("tagline", tagline.trim())
      formData.append("description", description.trim())
      formData.append("is_recruiting", isRecruiting ? "true" : "false")
      if (bannerUrl) formData.append("banner_url", bannerUrl)

      await djangoApi.clans.createClan(formData)

      const initials = name
        .trim()
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()

      const createdClan = {
        name: name.trim(),
        focus,
        members: 1,
        projects: 0,
        status: "Active" as const,
        initials: initials || "CL",
        leaderName: "Aarav Khanna",
        tierBadge: "New Clan",
        xp: "0 XP",
        trophies: 0,
        shortDescription: tagline || description.slice(0, 80),
        fullDescription: description,
      }

      onClanCreated(createdClan)
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create clan. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-400/20">
              🛡️
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Found a New Clan</h3>
              <p className="text-xs text-amber-300 font-semibold mt-0.5">
                Register an official campus clan backed by the Django engine
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">
              {errorMsg}
            </div>
          )}

          {/* Clan Name with Real-time Check */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-800">Clan Name *</label>
              <div className="text-[11px] font-bold">
                {isCheckingName && <span className="text-slate-400 animate-pulse">Checking availability...</span>}
                {!isCheckingName && nameStatus === "available" && (
                  <span className="text-emerald-600 font-bold">✓ Name Available</span>
                )}
                {!isCheckingName && nameStatus === "taken" && (
                  <span className="text-rose-600 font-bold">✗ Name already registered</span>
                )}
              </div>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quantum Quants, Neural Knights, Pixel Pirates"
              required
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Speciality / Focus */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Domain Focus / Speciality *</label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Full Stack & Web3">Full Stack & Web3 Engineering</option>
              <option value="AI & Backend Systems">AI, Deep Learning & Backend Systems</option>
              <option value="Robotics & Embedded">Robotics, Drones & Hardware</option>
              <option value="Design & Frontend">Design Systems, 3D & Frontend</option>
              <option value="Cybersecurity & CTF">Cybersecurity, Forensics & Networks</option>
              <option value="Product & Strategy">Product Management & Startup Strategy</option>
            </select>
          </div>

          {/* Punchy Tagline */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Clan Tagline / Motto</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Crafting delightful distributed systems at campus scale."
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Full Manifesto / Description */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">About the Clan / Vision *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your clan's goals, meeting cadence, hackathon aspirations, and who you are looking to recruit..."
              required
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Banner URL (Optional) */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Banner Image URL (Optional)</label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Recruitment Toggle */}
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <input
              type="checkbox"
              id="recruitToggle"
              checked={isRecruiting}
              onChange={(e) => setIsRecruiting(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
            />
            <label htmlFor="recruitToggle" className="cursor-pointer select-none">
              <strong className="block text-slate-900 font-bold">Open for Recruitment</strong>
              <span className="text-[11px] text-slate-500">
                Allow other campus students to send join requests to your roster.
              </span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || nameStatus === "taken"}
              className="px-6 py-2.5 rounded-xl font-black bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md shadow-amber-400/20 active:scale-95 transition-all cursor-pointer border border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Founding Clan...</span>
                </>
              ) : (
                <>
                  <span>Found Clan</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
