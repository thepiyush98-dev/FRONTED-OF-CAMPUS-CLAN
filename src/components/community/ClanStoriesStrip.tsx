import React, { useState, useEffect, useRef } from "react"
import { djangoApi } from "@/services/djangoApi"

export interface StoryViewer {
  id: string
  name: string
  avatar: string
  branch: string
  viewedAt: string
  hasLiked?: boolean
}

export interface HomeClanStory {
  id: string
  clanName: string
  clanInitials: string
  avatarGradient: string
  storyImage: string
  caption: string
  createdAt: number // timestamp in ms
  expiresAt: number // timestamp in ms (createdAt + 24 * 3600 * 1000)
  views: number
  likes: number
  isLiked?: boolean
  leaderName: string
  coLeaderName: string
  tags?: string[]
  viewers: StoryViewer[]
}

// Preset high-res campus sprint photos for quick story creation
const STORY_IMAGE_PRESETS = [
  {
    name: "⚡ Hackathon War Room",
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
    tag: "#Hackathon",
  },
  {
    name: "🐺 GPU AI Cluster",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    tag: "#AIPod",
  },
  {
    name: "🤖 Robotics Lab Stress Test",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    tag: "#HardwareLab",
  },
  {
    name: "🚀 Incubation Pitch Deck",
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    tag: "#DemoDay",
  },
  {
    name: "🛡️ Cyber Defense CTF Battle",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tag: "#CTFDefense",
  },
]

const NOW = Date.now()
const HOUR = 3600 * 1000

const INITIAL_STORIES: HomeClanStory[] = [
  {
    id: "cs-1",
    clanName: "Pixel Pirates",
    clanInitials: "PP",
    avatarGradient: "from-sky-500 to-blue-700",
    storyImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
    caption: "⚡ All-nighter at Lab 3! Finalizing 3D panoramic event carousels for the North Zone Hackfest!",
    createdAt: NOW - 2 * HOUR,
    expiresAt: NOW - 2 * HOUR + 24 * HOUR,
    views: 312,
    likes: 84,
    leaderName: "Aarav Khanna",
    coLeaderName: "Riya Malhotra",
    tags: ["#Hackathon", "#3DCarousels", "#AllNighter"],
    viewers: [
      { id: "stu-2", name: "Riya Malhotra", avatar: "RM", branch: "B.Tech IT · 3rd Year", viewedAt: "8m ago", hasLiked: true },
      { id: "stu-3", name: "Devansh Sharma", avatar: "DS", branch: "B.Tech CSE · 3rd Year", viewedAt: "25m ago", hasLiked: false },
      { id: "stu-4", name: "Simran Kaur", avatar: "SK", branch: "B.Tech AI · 2nd Year", viewedAt: "42m ago", hasLiked: true },
      { id: "stu-5", name: "Kabir Singh", avatar: "KS", branch: "B.Tech ECE · 4th Year", viewedAt: "1h ago", hasLiked: false },
      { id: "stu-6", name: "Ananya Roy", avatar: "AR", branch: "B.Tech CSE · 3rd Year", viewedAt: "2h ago", hasLiked: true },
    ],
  },
  {
    id: "cs-2",
    clanName: "Binary Beasts",
    clanInitials: "BB",
    avatarGradient: "from-emerald-500 to-teal-700",
    storyImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    caption: "🐺 Fine-tuning campus LLM models on GPU cluster. Latency dropped to 14ms! Proud of our AI pod.",
    createdAt: NOW - 3.5 * HOUR,
    expiresAt: NOW - 3.5 * HOUR + 24 * HOUR,
    views: 245,
    likes: 67,
    leaderName: "Devansh Sharma",
    coLeaderName: "Simran Kaur",
    tags: ["#CampusAI", "#FastInference", "#GPUCluster"],
    viewers: [
      { id: "stu-1", name: "Aarav Khanna", avatar: "AK", branch: "B.Tech CSE · 3rd Year", viewedAt: "10m ago", hasLiked: true },
      { id: "stu-2", name: "Riya Malhotra", avatar: "RM", branch: "B.Tech IT · 3rd Year", viewedAt: "30m ago", hasLiked: true },
      { id: "stu-5", name: "Kabir Singh", avatar: "KS", branch: "B.Tech ECE · 4th Year", viewedAt: "1h ago", hasLiked: false },
    ],
  },
  {
    id: "cs-3",
    clanName: "Circuit Crew",
    clanInitials: "CC",
    avatarGradient: "from-amber-500 to-orange-600",
    storyImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    caption: "🤖 Autonomous rover telemetry WebSocket test passed 60 FPS bench stress test. See you at Demo Day!",
    createdAt: NOW - 5 * HOUR,
    expiresAt: NOW - 5 * HOUR + 24 * HOUR,
    views: 198,
    likes: 52,
    leaderName: "Kabir Singh",
    coLeaderName: "Priya Das",
    tags: ["#Robotics", "#Hardware", "#Telemetry"],
    viewers: [
      { id: "stu-3", name: "Devansh Sharma", avatar: "DS", branch: "B.Tech CSE · 3rd Year", viewedAt: "40m ago", hasLiked: true },
      { id: "stu-4", name: "Simran Kaur", avatar: "SK", branch: "B.Tech AI · 2nd Year", viewedAt: "2h ago", hasLiked: false },
    ],
  },
  {
    id: "cs-4",
    clanName: "Venture Verse",
    clanInitials: "VV",
    avatarGradient: "from-purple-500 to-indigo-700",
    storyImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    caption: "🚀 Pitch deck rehearsal with campus incubation mentors. 3 student ventures selected for seed grants!",
    createdAt: NOW - 7.5 * HOUR,
    expiresAt: NOW - 7.5 * HOUR + 24 * HOUR,
    views: 278,
    likes: 91,
    leaderName: "Naina Kapoor",
    coLeaderName: "Siddharth Roy",
    tags: ["#Incubator", "#SeedGrants", "#Startups"],
    viewers: [
      { id: "stu-1", name: "Aarav Khanna", avatar: "AK", branch: "B.Tech CSE · 3rd Year", viewedAt: "1h ago", hasLiked: true },
      { id: "stu-2", name: "Riya Malhotra", avatar: "RM", branch: "B.Tech IT · 3rd Year", viewedAt: "3h ago", hasLiked: true },
    ],
  },
  {
    id: "cs-5",
    clanName: "Cyber Sentinels",
    clanInitials: "CS",
    avatarGradient: "from-rose-500 to-red-700",
    storyImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    caption: "🛡️ Red Team vs Blue Team CTF in progress! Zero flag breaches on our server over 24 hours.",
    createdAt: NOW - 11 * HOUR,
    expiresAt: NOW - 11 * HOUR + 24 * HOUR,
    views: 164,
    likes: 43,
    leaderName: "Ananya Roy",
    coLeaderName: "Vikram Mehta",
    tags: ["#CTF", "#InfoSec", "#Defense"],
    viewers: [
      { id: "stu-5", name: "Kabir Singh", avatar: "KS", branch: "B.Tech ECE · 4th Year", viewedAt: "4h ago", hasLiked: true },
    ],
  },
]

function formatRemainingTime(expiresAt: number): string {
  const diff = expiresAt - Date.now()
  if (diff <= 0) return "Expired"
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

interface ClanStoriesStripProps {
  onOpenClan?: (clanName: string) => void
}

export default function ClanStoriesStrip({ onOpenClan }: ClanStoriesStripProps) {
  const [stories, setStories] = useState<HomeClanStory[]>(INITIAL_STORIES)
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null)
  const [viewedStories, setViewedStories] = useState<string[]>([])
  const [replyText, setReplyText] = useState("")

  // Modals & Drawers
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewersModal, setShowViewersModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [viewerSearch, setViewerSearch] = useState("")
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [heartAnim, setHeartAnim] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Create Story Form State
  const [createClanName, setCreateClanName] = useState("Pixel Pirates")
  const [createCaption, setCreateCaption] = useState("")
  const [createImage, setCreateImage] = useState(STORY_IMAGE_PRESETS[0].url)
  const [createTag, setCreateTag] = useState("#Hackathon")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Current logged-in user
  const currentStudent = {
    id: "stu-1",
    name: "Aarav Khanna",
    avatar: "AK",
    branch: "B.Tech CSE · 3rd Year",
  }

  const activeStory = activeStoryIdx !== null ? stories[activeStoryIdx] : null

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // 1. OPEN STORY & RECORD VIEW (/story/<id>/view/)
  const handleOpenStory = (index: number) => {
    setActiveStoryIdx(index)
    setShowViewersModal(false)
    setShowDeleteConfirm(false)
    setIsPaused(false)
    const st = stories[index]
    if (st) {
      // Record view via Django API (/story/<id>/view/)
      djangoApi.stories.recordView(st.id).catch(() => {})

      // Check if current user is already in viewers list
      const alreadyViewed = st.viewers.some((v) => v.id === currentStudent.id)
      if (!alreadyViewed) {
        const newViewer: StoryViewer = {
          id: currentStudent.id,
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          branch: currentStudent.branch,
          viewedAt: "Just now",
          hasLiked: !!st.isLiked,
        }
        setStories((prev) =>
          prev.map((s, idx) =>
            idx === index
              ? {
                  ...s,
                  views: s.views + 1,
                  viewers: [newViewer, ...s.viewers],
                }
              : s
          )
        )
      }

      if (!viewedStories.includes(st.id)) {
        setViewedStories((prev) => [...prev, st.id])
      }
    }
  }

  // 2. TOGGLE STORY LIKE (/story/<id>/like/)
  const handleToggleLike = async (storyId: string) => {
    // Heart burst animation
    setHeartAnim(true)
    setTimeout(() => setHeartAnim(false), 900)

    try {
      await djangoApi.stories.likeStory(storyId)
    } catch {}

    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const nextLiked = !s.isLiked
          // Update viewers list so current user shows heart
          const updatedViewers = s.viewers.map((v) =>
            v.id === currentStudent.id ? { ...v, hasLiked: nextLiked } : v
          )
          return {
            ...s,
            isLiked: nextLiked,
            likes: nextLiked ? s.likes + 1 : Math.max(0, s.likes - 1),
            viewers: updatedViewers,
          }
        }
        return s
      })
    )
  }

  // 3. CREATE 24-HOUR STORY (/clan/<name>/story/create/)
  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createCaption.trim() || !createImage.trim()) return

    setIsSubmitting(true)
    try {
      await djangoApi.stories.createStory(createClanName, {
        caption: createCaption.trim(),
        storyImage: createImage.trim(),
        tags: [createTag],
      })
    } catch {}

    const clanConfig: Record<string, { initials: string; gradient: string; leader: string; coLeader: string }> = {
      "Pixel Pirates": { initials: "PP", gradient: "from-sky-500 to-blue-700", leader: "Aarav Khanna", coLeader: "Riya Malhotra" },
      "Binary Beasts": { initials: "BB", gradient: "from-emerald-500 to-teal-700", leader: "Devansh Sharma", coLeader: "Simran Kaur" },
      "Circuit Crew": { initials: "CC", gradient: "from-amber-500 to-orange-600", leader: "Kabir Singh", coLeader: "Priya Das" },
      "Venture Verse": { initials: "VV", gradient: "from-purple-500 to-indigo-700", leader: "Naina Kapoor", coLeader: "Siddharth Roy" },
      "Cyber Sentinels": { initials: "CS", gradient: "from-rose-500 to-red-700", leader: "Ananya Roy", coLeader: "Vikram Mehta" },
    }

    const cfg = clanConfig[createClanName] || {
      initials: createClanName.slice(0, 2).toUpperCase(),
      gradient: "from-amber-500 to-rose-600",
      leader: "Aarav Khanna",
      coLeader: "Campus Lead",
    }

    const createdTime = Date.now()
    const newStory: HomeClanStory = {
      id: `cs-${Date.now()}`,
      clanName: createClanName,
      clanInitials: cfg.initials,
      avatarGradient: cfg.gradient,
      storyImage: createImage.trim(),
      caption: createCaption.trim(),
      createdAt: createdTime,
      expiresAt: createdTime + 24 * HOUR,
      views: 1,
      likes: 0,
      leaderName: cfg.leader,
      coLeaderName: cfg.coLeader,
      tags: [createTag],
      viewers: [
        {
          id: currentStudent.id,
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          branch: currentStudent.branch,
          viewedAt: "Just now",
        },
      ],
    }

    setStories([newStory, ...stories])
    setIsSubmitting(false)
    setShowCreateModal(false)
    setCreateCaption("")
    showToast(`✓ 24-hour clan story posted for ${createClanName} (/clan/${createClanName}/story/create/)!`)
  }

  // 4. DELETE STORY (/story/<id>/delete/)
  const handleDeleteStory = async (storyId: string) => {
    try {
      await djangoApi.stories.deleteStory(storyId)
    } catch {}

    const remaining = stories.filter((s) => s.id !== storyId)
    setStories(remaining)
    setShowDeleteConfirm(false)

    if (remaining.length === 0) {
      setActiveStoryIdx(null)
    } else if (activeStoryIdx !== null && activeStoryIdx >= remaining.length) {
      setActiveStoryIdx(remaining.length - 1)
    }

    showToast("✓ Story deleted successfully (/story/<id>/delete/).")
  }

  // 5. TEST EXPIRE STORY (Simulate 24-hour auto-expiry)
  const handleSimulateExpiry = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, expiresAt: Date.now() - 1000 } : s))
    )
    showToast("Story marked as expired (24h lifespan completed).")
  }

  // Navigation handlers
  const handlePrevStory = () => {
    if (activeStoryIdx !== null && activeStoryIdx > 0) {
      handleOpenStory(activeStoryIdx - 1)
    }
  }

  const handleNextStory = () => {
    if (activeStoryIdx !== null && activeStoryIdx < activeNonExpiredStories.length - 1) {
      handleOpenStory(activeStoryIdx + 1)
    } else {
      setActiveStoryIdx(null)
    }
  }

  // Active non-expired stories
  const activeNonExpiredStories = stories.filter((s) => s.expiresAt > Date.now())

  // Auto-advance timer (5 seconds) - paused if viewing viewers modal or delete confirmation
  useEffect(() => {
    if (activeStoryIdx === null || showViewersModal || showDeleteConfirm || isPaused) return
    const timer = setTimeout(() => {
      handleNextStory()
    }, 5500)
    return () => clearTimeout(timer)
  }, [activeStoryIdx, showViewersModal, showDeleteConfirm, isPaused])

  // Filtered viewers in viewers modal
  const filteredViewers = activeStory
    ? activeStory.viewers.filter(
        (v) =>
          v.name.toLowerCase().includes(viewerSearch.toLowerCase()) ||
          v.branch.toLowerCase().includes(viewerSearch.toLowerCase())
      )
    : []

  return (
    <section className="space-y-3.5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-60 bg-slate-900 text-amber-400 px-4 py-2.5 rounded-xl shadow-2xl border border-amber-400/40 text-xs font-black animate-bounce flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Stories Strip Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            24-Hour Clan Stories
          </h3>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>📸</span>
            <span>Ephemeral Live</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="text-xs font-extrabold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>+</span>
            <span>Post Clan Story</span>
          </button>
        </div>
      </div>

      {/* Horizontal Story Bubble Scroll Strip */}
      <div className="relative p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
        {/* ADD STORY BUBBLE (Instagram / Snapchat style "+") */}
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer focus:outline-none"
        >
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-500 transition-transform duration-300 group-hover:scale-105 shadow-md">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white overflow-hidden p-0.5">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-amber-400 leading-none">+</span>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Story</span>
              </div>
            </div>
            {/* Plus badge */}
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-xs text-slate-950 font-black shadow-xs">
              +
            </span>
          </div>
          <div className="text-center w-20 sm:w-22">
            <span className="text-xs font-black text-slate-900 truncate block group-hover:text-amber-600 transition-colors">
              Add Story
            </span>
            <span className="text-[10px] text-amber-700 font-bold truncate block">
              Pixel Pirates
            </span>
          </div>
        </button>

        {/* ACTIVE STORIES */}
        {activeNonExpiredStories.map((story, idx) => {
          const isViewed = viewedStories.includes(story.id)
          const timeLeft = formatRemainingTime(story.expiresAt)

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => handleOpenStory(idx)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer focus:outline-none"
            >
              {/* Story Ring Avatar */}
              <div
                className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105 ${
                  isViewed
                    ? "bg-slate-300"
                    : "bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md shadow-rose-500/20 animate-[spin_10s_linear_infinite_paused] hover:animate-[spin_4s_linear_infinite]"
                }`}
              >
                <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-br ${story.avatarGradient} flex items-center justify-center text-white font-black text-xs shadow-inner relative`}
                  >
                    <img
                      src={story.storyImage}
                      alt={story.clanName}
                      className="w-full h-full object-cover rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-slate-950/35 rounded-full flex items-center justify-center font-black text-[11px] text-white">
                      {story.clanInitials}
                    </div>
                  </div>
                </div>

                {/* Live Indicator Dot */}
                {!isViewed ? (
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                    ⚡
                  </span>
                ) : (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-white" />
                )}
              </div>

              {/* Clan Name and Remaining Time */}
              <div className="text-center w-20 sm:w-22">
                <span className="text-xs font-black text-slate-900 truncate block group-hover:text-amber-600 transition-colors">
                  {story.clanName}
                </span>
                <span className="text-[10px] text-rose-600 font-bold truncate block">
                  {timeLeft}
                </span>
              </div>
            </button>
          )
        })}

        {activeNonExpiredStories.length === 0 && (
          <div className="py-4 px-6 text-xs text-slate-400 italic">
            No active 24h stories. Click "+ Post Clan Story" to publish one!
          </div>
        )}
      </div>

      {/* 
        ================================================================
        FULLSCREEN STORY VIEWER MODAL
        ================================================================
      */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          {/* Backdrop Click to Close */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setActiveStoryIdx(null)
              setShowViewersModal(false)
            }}
          />

          {/* Story Container Phone Card */}
          <div className="relative z-10 w-full max-w-md h-[88vh] max-h-[740px] rounded-3xl overflow-hidden bg-slate-950 border border-white/20 shadow-2xl flex flex-col justify-between">
            {/* Top Segmented Progress Bar */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {activeNonExpiredStories.map((st, i) => (
                <div key={st.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      i < activeStoryIdx!
                        ? "w-full"
                        : i === activeStoryIdx
                        ? isPaused || showViewersModal || showDeleteConfirm
                          ? "w-1/2"
                          : "w-full animate-[pulse_5.5s_linear]"
                        : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="relative z-30 p-4 pt-7 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeStory.avatarGradient} flex items-center justify-center text-xs font-black border-2 border-white`}
                >
                  {activeStory.clanInitials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-sm font-black text-white">{activeStory.clanName}</strong>
                    <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-1.5 py-0.5 rounded-full">
                      ⏳ {formatRemainingTime(activeStory.expiresAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">
                    ⭐ Co-Leader: {activeStory.coLeaderName}
                  </p>
                </div>
              </div>

              {/* Header Actions: Options, Delete & Close */}
              <div className="flex items-center gap-1.5">
                {/* Manual Delete Story (Leader / Author) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(true)
                    setShowDeleteConfirm(true)
                  }}
                  title="Delete Story (/story/<id>/delete/)"
                  className="w-8 h-8 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center font-bold text-xs cursor-pointer border border-rose-400/30 transition-all"
                >
                  🗑️
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStoryIdx(null)
                    onOpenClan?.(activeStory.clanName)
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] border border-white/30 backdrop-blur-md cursor-pointer transition-all"
                >
                  Clan →
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStoryIdx(null)
                    setShowViewersModal(false)
                  }}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Center Story Image / Media */}
            <div
              className="absolute inset-0 z-0 select-none cursor-pointer"
              onDoubleClick={() => handleToggleLike(activeStory.id)}
            >
              <img
                src={activeStory.storyImage}
                alt={activeStory.clanName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

              {/* Double-tap Floating Heart Burst */}
              {heartAnim && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
                  <span className="text-7xl filter drop-shadow-[0_0_20px_#f43f5e]">❤️</span>
                </div>
              )}
            </div>

            {/* Tap Targets: Left Half (Previous) / Right Half (Next) */}
            <div className="absolute inset-y-16 inset-x-0 z-10 flex">
              <div
                className="w-1/2 h-full cursor-w-resize"
                onClick={handlePrevStory}
                title="Tap for previous story"
              />
              <div
                className="w-1/2 h-full cursor-e-resize"
                onClick={handleNextStory}
                title="Tap for next story"
              />
            </div>

            {/* Story Bottom Bar: Caption, Likes, Viewers List Trigger */}
            <div className="relative z-30 p-5 bg-gradient-to-t from-black via-black/85 to-transparent space-y-3">
              {/* Tags */}
              {activeStory.tags && activeStory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeStory.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-amber-300 border border-white/20 backdrop-blur-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Caption */}
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow">
                {activeStory.caption}
              </p>

              {/* Interactive Cheer & Like Input */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/15">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  placeholder={`Cheer on ${activeStory.clanName}...`}
                  className="flex-1 px-3.5 py-2 text-xs rounded-full bg-white/15 border border-white/25 text-white placeholder-white/60 focus:outline-none focus:border-amber-400 backdrop-blur-md"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && replyText.trim()) {
                      showToast(`Cheer sent to ${activeStory.clanName}: "${replyText}"`)
                      setReplyText("")
                      handleToggleLike(activeStory.id)
                    }
                  }}
                />

                {/* LIKE BUTTON (/story/<id>/like/) */}
                <button
                  type="button"
                  onClick={() => handleToggleLike(activeStory.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md border ${
                    activeStory.isLiked
                      ? "bg-rose-600 text-white border-rose-500 shadow-md scale-105"
                      : "bg-white/20 hover:bg-white/30 text-white border-white/25"
                  }`}
                >
                  <span className="text-sm">{activeStory.isLiked ? "❤️" : "🤍"}</span>
                  <span>{activeStory.likes}</span>
                </button>
              </div>

              {/* Viewers & Expiry Footer */}
              <div className="flex items-center justify-between text-[11px] text-white/80 pt-1">
                {/* VIEWERS TRIGGER BUTTON (/story/<id>/viewers/) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(true)
                    setShowViewersModal(true)
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/30 text-white font-bold cursor-pointer transition-all border border-white/20"
                >
                  <span>👁️</span>
                  <span>{activeStory.views} Views</span>
                  <span className="text-amber-300 text-[10px]">· Viewers List →</span>
                </button>

                <div className="flex items-center gap-2 text-[10px] text-slate-300">
                  <span>Leader: {activeStory.leaderName}</span>
                </div>
              </div>
            </div>

            {/* 
              ================================================================
              SUB-MODAL: VIEWERS LIST (/story/<id>/viewers/)
              ================================================================
            */}
            {showViewersModal && (
              <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn p-5 text-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>👁️ Story Viewers</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-amber-300">
                          {activeStory.views} Total
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        GET /story/{activeStory.id}/viewers/
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowViewersModal(false)
                        setIsPaused(false)
                      }}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Search Viewers */}
                  <input
                    type="text"
                    value={viewerSearch}
                    onChange={(e) => setViewerSearch(e.target.value)}
                    placeholder="Search viewers by student name or branch..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-amber-400"
                  />

                  {/* Viewers Scrollable List */}
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                    {filteredViewers.map((viewer) => (
                      <div
                        key={viewer.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center font-black text-slate-950 text-xs shadow-xs">
                            {viewer.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{viewer.name}</span>
                              {viewer.id === currentStudent.id && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-300 block">{viewer.branch}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-right">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {viewer.viewedAt}
                          </span>
                          {viewer.hasLiked ? (
                            <span className="text-rose-400 text-sm" title="Liked this story">
                              ❤️
                            </span>
                          ) : (
                            <span className="text-slate-600 text-sm">🤍</span>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredViewers.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400 italic">
                        No viewers matching your search.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    ❤️ {activeStory.likes} students liked this story
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowViewersModal(false)
                      setIsPaused(false)
                    }}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-sm"
                  >
                    Resume Story
                  </button>
                </div>
              </div>
            )}

            {/* 
              ================================================================
              SUB-MODAL: DELETE CONFIRMATION (/story/<id>/delete/)
              ================================================================
            */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 text-white animate-fadeIn">
                <div className="w-full p-5 rounded-2xl bg-white/10 border border-white/20 text-center space-y-4">
                  <span className="text-4xl block">🗑️</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Delete Clan Story?</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      This ephemeral story will be immediately deleted across campus feeds before its 24-hour expiry.
                    </p>
                    <code className="text-[10px] text-rose-300 font-mono block mt-1">
                      POST /story/{activeStory.id}/delete/
                    </code>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setIsPaused(false)
                      }}
                      className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(activeStory.id)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-md"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 
        ================================================================
        CREATE 24-HOUR CLAN STORY MODAL (/clan/<name>/story/create/)
        ================================================================
      */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>📸 Post 24h Clan Story</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                    Ephemeral
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  POST /clan/{createClanName}/story/create/ · Auto-expires in 24 hours
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateStory} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Select Clan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Clan Author
                </label>
                <select
                  value={createClanName}
                  onChange={(e) => setCreateClanName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Pixel Pirates">Pixel Pirates (👑 You are Leader)</option>
                  <option value="Binary Beasts">Binary Beasts</option>
                  <option value="Circuit Crew">Circuit Crew</option>
                  <option value="Venture Verse">Venture Verse</option>
                  <option value="Cyber Sentinels">Cyber Sentinels</option>
                </select>
              </div>

              {/* Photo Image Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Choose Photo Preset or Enter Image URL
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {STORY_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setCreateImage(preset.url)
                        setCreateTag(preset.tag)
                      }}
                      className={`p-2 rounded-xl text-left border cursor-pointer transition-all flex flex-col gap-1 ${
                        createImage === preset.url
                          ? "bg-amber-50 border-amber-400 shadow-2xs font-black text-amber-900"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[11px] truncate font-bold">{preset.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{preset.tag}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={createImage}
                  onChange={(e) => setCreateImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Story Image Preview */}
              {createImage && (
                <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
                  <img
                    src={createImage}
                    alt="Preview"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-[10px] backdrop-blur-xs">
                    Preview: {createTag}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-medium truncate drop-shadow">
                    {createCaption || "Your story caption will appear here..."}
                  </div>
                </div>
              )}

              {/* Story Caption */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Story Caption</label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {createCaption.length}/180 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={createCaption}
                  maxLength={180}
                  onChange={(e) => setCreateCaption(e.target.value)}
                  placeholder="What is your clan building, hacking, or celebrating right now?"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Sprint Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Sprint Tag</label>
                <div className="flex flex-wrap gap-1.5">
                  {["#Hackathon", "#AIPod", "#HardwareLab", "#DemoDay", "#CTFDefense", "#AllNighter"].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setCreateTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          createTag === tag
                            ? "bg-slate-900 text-amber-400 border border-slate-900"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 24h Auto-Expiry Rule Info Box */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <span>⏳</span>
                  <span>24-Hour Ephemeral Guarantee</span>
                </div>
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  This story will be live on campus feeds for exactly 24 hours. Views, likes, and viewers tracking are captured in real-time.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl font-black text-xs cursor-pointer shadow-sm hover:brightness-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Publish 24h Clan Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
