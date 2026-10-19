import React, { useState, useEffect } from "react"
import { djangoApi } from "@/services/djangoApi"
import Icon from "@/components/common/Icon"

interface CreateClanModalProps {
  isOpen: boolean
  onClose: () => void
  onClanCreated: (newClan: any) => void
}

const BANNER_PRESETS = [
  {
    name: "Cyber Defense",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=600&q=80",
    speciality: "Cybersecurity, Forensics & Networks",
  },
  {
    name: "Autonomous AI",
    url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&h=600&q=80",
    speciality: "AI, Deep Learning & Backend Systems",
  },
  {
    name: "Distributed Web3",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80",
    speciality: "Full Stack & Web3 Engineering",
  },
  {
    name: "Glassmorphic 3D",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=600&q=80",
    speciality: "Design Systems, 3D & Frontend",
  },
]

export default function CreateClanModal({
  isOpen,
  onClose,
  onClanCreated,
}: CreateClanModalProps) {
  const [name, setName] = useState("")
  const [focus, setFocus] = useState("Full Stack & Web3 Engineering")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [isRecruiting, setIsRecruiting] = useState(true)
  const [bannerUrl, setBannerUrl] = useState(BANNER_PRESETS[2].url)
  const [accentColor, setAccentColor] = useState<"amber" | "blue" | "emerald" | "purple" | "rose">("amber")
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [nameStatus, setNameStatus] = useState<"idle" | "available" | "taken">("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Compute 2-letter monogram
  const computedInitials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "CL"

  // Real-time debounce check for clan name availability in Django backend (/check-clan-name/)
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
    }, 350)

    return () => clearTimeout(timer)
  }, [name])

  if (!isOpen) return null

  // File upload for custom clan banner
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMsg("Clan name is required.")
      return
    }
    if (name.trim().length < 3) {
      setErrorMsg("Clan name must be at least 3 characters long.")
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
      formData.append("accent_color", accentColor)
      if (bannerUrl) formData.append("banner_url", bannerUrl)

      await djangoApi.clans.createClan(formData)

      const createdClan = {
        name: name.trim(),
        speciality: focus,
        focus,
        members: 1,
        memberCount: 1,
        projects: 0,
        status: "Active" as const,
        initials: computedInitials,
        leaderName: "Aarav Khanna",
        tier: "Tier 3: Novice",
        tierBadge: "New Clan",
        xp: "0 XP",
        trophies: 0,
        shortDescription: tagline || description.slice(0, 80),
        fullDescription: description || tagline || `${name} founded on Campus Clans.`,
        bannerUrl,
        accentColor,
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
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden animate-scale-up max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-[#172033] to-amber-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-400/20">
              🛡️
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Found a New Clan</h3>
              <p className="text-xs text-amber-300 font-semibold mt-0.5">
                Register an official campus clan with custom roles, banner & focus domain
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Clan Name with Real-time Check */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>Clan Name *</span>
                <span className="text-[10px] text-slate-400 font-normal">(/check-clan-name/)</span>
              </label>
              <div className="text-[11px] font-bold">
                {name.trim().length > 0 && name.trim().length < 3 && (
                  <span className="text-slate-400">Min 3 characters</span>
                )}
                {isCheckingName && <span className="text-slate-400 animate-pulse">Checking availability...</span>}
                {!isCheckingName && nameStatus === "available" && name.trim().length >= 3 && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span>✓</span> Available
                  </span>
                )}
                {!isCheckingName && nameStatus === "taken" && (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <span>✕</span> Name already taken
                  </span>
                )}
              </div>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quantum Quants, Neural Knights, Binary Beasts"
              required
              className={`w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border transition-all ${
                nameStatus === "taken"
                  ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                  : nameStatus === "available"
                  ? "border-emerald-400 focus:border-emerald-500 bg-emerald-50/20"
                  : "border-slate-300 focus:border-amber-500 focus:bg-white"
              }`}
            />
          </div>

          {/* Domain Focus / Speciality */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Domain Focus / Speciality *</label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Full Stack & Web3 Engineering">⚡ Full Stack & Web3 Engineering</option>
              <option value="AI, Deep Learning & Backend Systems">🧠 AI, Deep Learning & Backend Systems</option>
              <option value="Robotics, Drones & Embedded Hardware">🤖 Robotics, Drones & Embedded Hardware</option>
              <option value="Design Systems, 3D & Frontend Architecture">🎨 Design Systems, 3D & Frontend Architecture</option>
              <option value="Cybersecurity, Network Defense & CTF">🛡️ Cybersecurity, Network Defense & CTF</option>
              <option value="Competitive Programming & Algorithms">📐 Competitive Programming & Algorithms</option>
              <option value="Mobile Apps & Cross-Platform Systems">📱 Mobile Apps & Cross-Platform Systems</option>
            </select>
          </div>

          {/* Banner Selector: Upload, Presets, URL */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>🖼️</span>
                <span>Clan Cover Banner</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Upload or select a preset</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BANNER_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setBannerUrl(p.url)
                    setFocus(p.speciality)
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 text-left p-1 transition-all cursor-pointer group ${
                    bannerUrl === p.url ? "border-amber-400 ring-2 ring-amber-400/40" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-full h-12 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                  <span className="block text-[10px] font-bold text-slate-800 pt-1 truncate">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0">
                <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Upload Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerFileUpload}
                />
              </label>

              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="Or paste banner image URL..."
                className="flex-1 p-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Accent Color Selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Clan Accent Theme</label>
            <div className="flex items-center gap-2">
              {[
                { id: "amber", name: "Gold / Amber", color: "bg-amber-400" },
                { id: "blue", name: "Cyber / Blue", color: "bg-blue-500" },
                { id: "emerald", name: "Matrix / Green", color: "bg-emerald-500" },
                { id: "purple", name: "Neon / Violet", color: "bg-purple-500" },
                { id: "rose", name: "Crimson / Red", color: "bg-rose-500" },
              ].map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccentColor(acc.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    accentColor === acc.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${acc.color}`} />
                  <span>{acc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Punchy Tagline */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Clan Tagline / Motto</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Crafting high-performance distributed systems at campus scale."
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Full Manifesto / Description */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">About the Clan / Vision *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your clan's goals, sprint cadence, hackathon aspirations, and who you are looking to recruit..."
              required
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all leading-relaxed"
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

          {/* Live Preview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#172033] text-white border border-slate-800 shadow-md space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              Live Clan Card Preview
            </span>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                  {computedInitials}
                </div>
                <div>
                  <h4 className="text-base font-black text-white">{name.trim() || "Untitled Clan"}</h4>
                  <span className="text-xs text-amber-300 font-bold block">{focus}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                {isRecruiting ? "Recruiting" : "Closed"}
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 italic">
              "{tagline || description || "Campus clan dedicated to building and competing together."}"
            </p>
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
              disabled={isSubmitting || nameStatus === "taken" || name.trim().length < 3}
              style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
              className="px-6 py-2.5 rounded-xl font-black shadow-md shadow-amber-400/20 active:scale-95 transition-all cursor-pointer border border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
