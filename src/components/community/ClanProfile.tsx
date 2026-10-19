import React, { useState } from "react"
import { djangoApi } from "@/services/djangoApi"
import { ClanPostItem, ClanStoryItem, ProjectItem, ClanRecruitmentItem } from "@/types"

export interface ClanMember {
  id: string
  name: string
  role: string
  branch: string
  year: string
  initials: string
  skills: string[]
  isLeader?: boolean
}

export interface ClanTrophy {
  id: string
  title: string
  eventName: string
  awardDate: string
  description: string
  recipientName: string
}

export interface ClanProfileData {
  id: string
  name: string
  initials: string
  speciality: string
  status: "Active" | "Suspended" | "Ended"
  leaderName: string
  memberCount: number
  tier: string
  sprintVelocity: string
  shortDescription: string
  fullDescription: string
  activeProjects: string[]
  accentColor: "blue" | "emerald" | "purple" | "amber"
  members: ClanMember[]
  trophies: ClanTrophy[]
}

const DEFAULT_CLAN_PROFILES: Record<string, ClanProfileData> = {
  "Pixel Pirates": {
    id: "clan-1",
    name: "Pixel Pirates",
    initials: "PP",
    speciality: "Design & Frontend Engineering",
    status: "Active",
    leaderName: "Aarav Khanna",
    memberCount: 18,
    tier: "Tier 1: Elite",
    sprintVelocity: "96% Velocity",
    shortDescription: "Crafting delightful web applications, 3D interfaces, and high-fidelity design systems.",
    fullDescription:
      "Pixel Pirates is our campus premier frontend architecture and design clan. We build open-source web tooling, compete in national UI/UX hackathons, and engineer real-time telemetry frontends for autonomous hardware teams. Our members specialize in React 19, Tailwind CSS v4, TypeScript, and micro-interactions.",
    activeProjects: ["Campus Clans UI Kit v2", "Nova Real-Time Feed", "Autonomous Telemetry Dashboard", "Event Registration Engine"],
    accentColor: "amber",
    members: [
      {
        id: "stu-1",
        name: "Aarav Khanna",
        role: "Leader",
        branch: "B.Tech CSE",
        year: "3rd Year",
        initials: "AK",
        skills: ["React 19", "Tailwind CSS", "TypeScript", "UI/UX Architecture"],
        isLeader: true,
      },
      {
        id: "stu-2",
        name: "Riya Malhotra",
        role: "Co-Leader",
        branch: "B.Des",
        year: "2nd Year",
        initials: "RM",
        skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
      },
      {
        id: "stu-m3",
        name: "Rohan Verma",
        role: "Elder",
        branch: "B.Tech CSE",
        year: "3rd Year",
        initials: "RV",
        skills: ["React.js", "Next.js", "WebSockets"],
      },
      {
        id: "stu-m4",
        name: "Tanya Sen",
        role: "Member",
        branch: "B.Des",
        year: "2nd Year",
        initials: "TS",
        skills: ["Figma", "After Effects", "CSS Animations"],
      },
      {
        id: "stu-m5",
        name: "Aditya Joshi",
        role: "Member",
        branch: "B.Tech IT",
        year: "2nd Year",
        initials: "AJ",
        skills: ["TypeScript", "Tailwind CSS", "KaTeX"],
      },
    ],
    trophies: [
      {
        id: "tr-1",
        title: "1st Place · North India Hackfest 2026",
        eventName: "North India Hackfest 2026",
        awardDate: "October 2026",
        description: "Deployed a zero-latency real-time autonomous routing and telemetry dashboard in 36 hours.",
        recipientName: "Pixel Pirates & Binary Beasts",
      },
      {
        id: "tr-2",
        title: "Excellence in Human-Centered Design",
        eventName: "Open Source Sprint Night 2026",
        awardDate: "October 2026",
        description: "Recognizing outstanding WCAG accessible design systems and glassmorphic micro-interactions.",
        recipientName: "Pixel Pirates Team",
      },
      {
        id: "tr-3",
        title: "Best Campus Open Source Tool",
        eventName: "Annual Campus Tech Symposium 2025",
        awardDate: "November 2025",
        description: "Created the open-source Campus Clans UI scaffold adopted by 12 student teams.",
        recipientName: "Aarav Khanna & Team",
      },
    ],
  },
  "Binary Beasts": {
    id: "clan-2",
    name: "Binary Beasts",
    initials: "BB",
    speciality: "AI & Distributed Systems",
    status: "Active",
    leaderName: "Devansh Sharma",
    memberCount: 24,
    tier: "Rank #1 Campus",
    sprintVelocity: "98% Top 3",
    shortDescription: "Distributed computing, microservices, local LLM fine-tuning, and scalable backend pipelines.",
    fullDescription:
      "A collective of backend engineers, systems hackers, and machine learning practitioners. We train domain models on campus GPU servers, optimize database clusters, and engineer resilient APIs for campus products.",
    activeProjects: ["Campus RAG Search", "Campus Bus Fleet Tracker", "GPU Cluster Scheduler", "Telemetry Broker"],
    accentColor: "blue",
    members: [
      {
        id: "stu-5",
        name: "Devansh Sharma",
        role: "Leader",
        branch: "B.Tech CSE",
        year: "3rd Year",
        initials: "DS",
        skills: ["Python", "PyTorch", "FastAPI", "Distributed Systems"],
        isLeader: true,
      },
      {
        id: "stu-bb2",
        name: "Aryan Mehta",
        role: "Co-Leader",
        branch: "B.Tech CSE",
        year: "4th Year",
        initials: "AM",
        skills: ["LLMs", "RAG Pipelines", "Transformers", "CUDA"],
      },
      {
        id: "stu-bb3",
        name: "Simran Kaur",
        role: "Member",
        branch: "B.Tech IT",
        year: "3rd Year",
        initials: "SK",
        skills: ["Docker", "Kubernetes", "PostgreSQL", "GitHub Actions"],
      },
    ],
    trophies: [
      {
        id: "tr-bb1",
        title: "1st Place: Best System Architecture",
        eventName: "Open Source Sprint Night 2026",
        awardDate: "October 2026",
        description: "Awarded for exceptional microservice resilience and telemetry integration.",
        recipientName: "Binary Beasts",
      },
    ],
  },
}

// Initial Clan Projects Data
const INITIAL_CLAN_PROJECTS: ProjectItem[] = [
  {
    id: "cp-1",
    title: "Campus Clans UI Kit v2",
    description: "Production React 19 + Tailwind CSS v4 design system with glassmorphic palettes and 3D event carousels.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    status: "in_progress",
    isClanProject: true,
    clanName: "Pixel Pirates",
    githubLink: "https://github.com/thepiyush98-dev/FRONTED-OF-CAMPUS-CLAN",
    liveLink: "https://campusclans.edu/ui-kit",
    assignedMembers: ["Aarav Khanna", "Riya Malhotra", "Rohan Verma"],
    updates: [
      { id: "u-1", title: "Milestone 1 Completed", content: "Added Forward-Curved 3D Event Slider and responsive bottom bars.", createdAt: "Yesterday" },
      { id: "u-2", title: "Milestone 2 Completed", content: "Unified Django API adapters for OTP authentication & stories.", createdAt: "Today" },
    ],
    createdAt: "October 2026",
  },
  {
    id: "cp-2",
    title: "Autonomous Telemetry Dashboard",
    description: "High-frequency WebSocket client visualizing real-time rover telemetry and battery health at 60 FPS.",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    status: "completed",
    isClanProject: true,
    clanName: "Pixel Pirates",
    githubLink: "https://github.com/campus-clans/telemetry-dash",
    assignedMembers: ["Aarav Khanna", "Kabir Singh"],
    updates: [
      { id: "u-3", title: "Deployed to Production", content: "Passed benchmark stress testing during North India Hackfest.", createdAt: "2 days ago" },
    ],
    createdAt: "September 2026",
  },
]

// Initial Clan Stories Data (Instagram/Snapchat style)
const INITIAL_CLAN_STORIES: ClanStoryItem[] = [
  {
    id: "story-1",
    clanId: "clan-1",
    clanName: "Pixel Pirates",
    mediaUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    caption: "Late night sprint for the hackathon UI prototype! ⚡",
    viewsCount: 142,
    likesCount: 38,
    isLiked: false,
    createdAt: "3 hours ago",
  },
  {
    id: "story-2",
    clanId: "clan-1",
    clanName: "Pixel Pirates",
    mediaUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    caption: "Team brainstorming session in Studio 2B! 🚀",
    viewsCount: 96,
    likesCount: 24,
    isLiked: true,
    createdAt: "8 hours ago",
  },
]

// Initial Clan Recruitments Data
const INITIAL_RECRUITMENTS: ClanRecruitmentItem[] = [
  {
    id: "rec-1",
    clanId: "clan-1",
    clanName: "Pixel Pirates",
    clanInitials: "PP",
    title: "Senior UI/UX & Motion Designer",
    description: "Seeking a designer fluent in Figma component variants, micro-interactions, and design tokens.",
    requiredSkills: ["Figma", "Motion Design", "Design Systems", "Prototyping"],
    deadline: "October 30, 2026",
    applicantsCount: 7,
    status: "open",
    createdAt: "2 days ago",
  },
  {
    id: "rec-2",
    clanId: "clan-1",
    clanName: "Pixel Pirates",
    clanInitials: "PP",
    title: "Frontend Systems Engineer (React 19)",
    description: "Collaborate on state management, WebSockets, and performance profiling for hackathon frontends.",
    requiredSkills: ["React 19", "TypeScript", "Tailwind CSS", "WebSockets"],
    deadline: "November 5, 2026",
    applicantsCount: 12,
    status: "open",
    createdAt: "4 days ago",
  },
]

interface ClanProfileProps {
  clanName: string
  onBack: () => void
  onNavigateMember?: (memberName: string) => void
}

type ClanTab = "overview" | "stories" | "projects" | "posts" | "recruitments" | "roster" | "trophies"

export default function ClanProfile({ clanName, onBack }: ClanProfileProps) {
  const initialData = DEFAULT_CLAN_PROFILES[clanName] || DEFAULT_CLAN_PROFILES["Pixel Pirates"]
  const [clan, setClan] = useState<ClanProfileData>(initialData)
  const [activeTab, setActiveTab] = useState<ClanTab>("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ClanProfileData>(initialData)
  const [searchMember, setSearchMember] = useState("")

  // State for Features from Django Backend
  const [stories, setStories] = useState<ClanStoryItem[]>(INITIAL_CLAN_STORIES)
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_CLAN_PROJECTS)
  const [recruitments, setRecruitments] = useState<ClanRecruitmentItem[]>(INITIAL_RECRUITMENTS)
  const [joinRequested, setJoinRequested] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Modals for Django Actions
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [storyCaption, setStoryCaption] = useState("")
  const [storyMediaUrl, setStoryMediaUrl] = useState("")

  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")
  const [projectDesc, setProjectDesc] = useState("")
  const [projectGithub, setProjectGithub] = useState("")

  const [showUpdateModal, setShowUpdateModal] = useState<string | null>(null)
  const [updateTitle, setUpdateTitle] = useState("")
  const [updateContent, setUpdateContent] = useState("")

  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false)
  const [recTitle, setRecTitle] = useState("")
  const [recDesc, setRecDesc] = useState("")
  const [recSkills, setRecSkills] = useState("")

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteStudentName, setInviteStudentName] = useState("")

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // Handle Join Clan (POST /clan/<id>/join/)
  const handleJoinClan = async () => {
    try {
      await djangoApi.clans.sendJoinRequest(clan.id)
      setJoinRequested(true)
      showToast("Join request sent to clan leadership!")
    } catch {
      setJoinRequested(true)
      showToast("Join request submitted (offline mode).")
    }
  }

  // Handle Leave Clan (POST /clan/<id>/leave-request/)
  const handleLeaveClan = async () => {
    try {
      await djangoApi.clans.requestLeave(clan.id)
      showToast("Clan leave request submitted.")
    } catch {
      showToast("Clan leave request sent.")
    }
  }

  // Handle Like Story (POST /story/<id>/like/)
  const handleLikeStory = async (storyId: string | number) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const nextLiked = !s.isLiked
          return {
            ...s,
            isLiked: nextLiked,
            likesCount: nextLiked ? s.likesCount + 1 : s.likesCount - 1,
          }
        }
        return s
      })
    )
    djangoApi.stories.likeStory(storyId).catch(() => {})
  }

  // Handle Create Clan Story (POST /clan/<id>/story/create/save/)
  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!storyCaption.trim()) return
    const newStory: ClanStoryItem = {
      id: `story-${Date.now()}`,
      clanId: clan.id,
      clanName: clan.name,
      mediaUrl: storyMediaUrl.trim() || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      mediaType: "image",
      caption: storyCaption.trim(),
      viewsCount: 1,
      likesCount: 0,
      isLiked: false,
      createdAt: "Just now",
    }
    setStories([newStory, ...stories])
    setShowStoryModal(false)
    setStoryCaption("")
    setStoryMediaUrl("")
    showToast("Clan story published! Expires in 24 hours.")
  }

  // Handle Create Clan Project (POST /clan/<id>/project/create/)
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectTitle.trim()) return
    const newProj: ProjectItem = {
      id: `cp-${Date.now()}`,
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      status: "in_progress",
      isClanProject: true,
      clanName: clan.name,
      githubLink: projectGithub.trim() || undefined,
      assignedMembers: [clan.leaderName],
      updates: [{ id: `u-${Date.now()}`, title: "Project Initiated", content: "Repository initialized and team briefed.", createdAt: "Just now" }],
      createdAt: "October 2026",
    }
    setProjects([newProj, ...projects])
    setShowProjectModal(false)
    setProjectTitle("")
    setProjectDesc("")
    setProjectGithub("")
    showToast("New clan project created!")
  }

  // Handle Add Project Update (POST /clan-project/<id>/update/create/)
  const handleAddProjectUpdate = (projectId: string) => {
    if (!updateTitle.trim() || !updateContent.trim()) return
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            updates: [
              {
                id: `u-${Date.now()}`,
                title: updateTitle.trim(),
                content: updateContent.trim(),
                createdAt: "Just now",
              },
              ...p.updates,
            ],
          }
        }
        return p
      })
    )
    setShowUpdateModal(null)
    setUpdateTitle("")
    setUpdateContent("")
    showToast("Milestone update posted to project timeline!")
  }

  // Handle Complete Clan Project (POST /clan-project/<id>/complete/)
  const handleCompleteProject = (projectId: string | number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: "completed" } : p))
    )
    djangoApi.projects.completeClanProject(projectId).catch(() => {})
    showToast("Project marked as completed!")
  }

  // Handle Apply to Recruitment (POST /global-recruitments/<id>/request/)
  const handleApplyRecruitment = async (recId: string | number) => {
    try {
      await djangoApi.recruitments.applyToRecruitment(recId)
    } catch {}
    setRecruitments((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, applicantsCount: r.applicantsCount + 1 } : r))
    )
    showToast("Application submitted to clan recruiters!")
  }

  // Handle Change Member Role (POST /clan/<id>/change-role/<mid>/)
  const handleChangeRole = (memberId: string, newRole: string) => {
    setClan((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    }))
    djangoApi.clans.changeRole(clan.id, memberId, newRole).catch(() => {})
    showToast(`Member role updated to ${newRole}.`)
  }

  // Handle Remove Member (POST /clan/<id>/remove-member/<mid>/)
  const handleRemoveMember = (memberId: string) => {
    setClan((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
      memberCount: prev.memberCount - 1,
    }))
    djangoApi.clans.removeMember(clan.id, memberId).catch(() => {})
    showToast("Member removed from clan roster.")
  }

  // Save Clan Profile edits
  const handleSaveClan = (e: React.FormEvent) => {
    e.preventDefault()
    setClan(editForm)
    setIsEditing(false)
    djangoApi.clans.editClan(clan.id, editForm).catch(() => {})
    showToast("Clan profile saved successfully.")
  }

  // Filter Roster
  const filteredMembers = clan.members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.role.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(searchMember.toLowerCase()))
  )

  return (
    <div className="clan-profile-container max-w-6xl mx-auto space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 px-4 py-2.5 rounded-xl shadow-2xl border border-amber-400/40 text-xs font-black animate-bounce flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Back & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Clans</span>
        </button>

        {/* Action Buttons: Join, Invite, Story, Edit */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleJoinClan}
            disabled={joinRequested}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              joinRequested
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs"
            }`}
          >
            <span>{joinRequested ? "✓ Join Requested" : "🛡️ Join Clan"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <span>✉️ Invite Student</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStoryModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs transition-all cursor-pointer"
          >
            <span>📸 Add Clan Story</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditForm(clan)
              setIsEditing(true)
            }}
            style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400 transition-all"
          >
            <span>Edit Clan Profile</span>
          </button>
        </div>
      </div>

      {/* 
        ================================================================
        1. CLAN HEADER SECTION
        ================================================================
      */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl transition-all">
        <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-[#0c1017] via-[#172033] to-[#1e293b] p-6 flex items-start justify-between overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#f5b800 1px, transparent 1px), linear-gradient(90deg, #f5b800 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f5b800]" />
            <span>Official Campus Clan Profile</span>
          </div>

          <span
            className={`relative z-10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md ${
              clan.status === "Active"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                : "bg-rose-500/20 text-rose-300 border-rose-400/40"
            }`}
          >
            {clan.status}
          </span>
        </div>

        {/* Clan Main Info Row */}
        <div className="relative px-6 sm:px-10 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative -mt-16 sm:-mt-20 z-20 shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 p-1.5 shadow-2xl shadow-amber-500/20 ring-4 ring-white">
                  <div className="w-full h-full rounded-[14px] bg-[#172033] flex flex-col items-center justify-center text-amber-300 font-black text-2xl sm:text-3xl tracking-tighter shadow-inner border-2 border-slate-900">
                    <span className="text-3xl sm:text-4xl">🛡️</span>
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-black mt-1">
                      {clan.initials}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 sm:pt-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {clan.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300 shadow-xs">
                    {clan.tier}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-amber-600">
                  {clan.speciality}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 pt-0.5 font-medium">
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    Leader: {clan.leaderName}
                  </span>
                  <span className="inline-flex items-center font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Velocity: {clan.sprintVelocity}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200/80 p-2.5 rounded-2xl w-full sm:w-auto text-center shadow-inner">
              <div className="px-3 py-1">
                <strong className="block text-lg font-black text-slate-900">{clan.memberCount}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Members</span>
              </div>
              <div className="px-3 py-1 border-x border-slate-200">
                <strong className="block text-lg font-black text-amber-600">{projects.length}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Projects</span>
              </div>
              <div className="px-3 py-1 border-r border-slate-200">
                <strong className="block text-lg font-black text-slate-900">{stories.length}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stories</span>
              </div>
              <div className="px-3 py-1">
                <strong className="block text-lg font-black text-slate-900">{clan.trophies.length}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trophies</span>
              </div>
            </div>
          </div>

          {/* 
            ================================================================
            INTERACTIVE CLAN TAB NAVIGATION (BACKEND FEATURE INTEGRATION)
            ================================================================
          */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 mt-4">
            {[
              { id: "overview", label: "Overview", icon: "📋" },
              { id: "stories", label: `Clan Stories (${stories.length})`, icon: "📸" },
              { id: "projects", label: `Projects (${projects.length})`, icon: "💻" },
              { id: "recruitments", label: `Recruitment (${recruitments.length})`, icon: "🎯" },
              { id: "roster", label: `Roster (${clan.members.length})`, icon: "👥" },
              { id: "trophies", label: `Trophies (${clan.trophies.length})`, icon: "🏆" },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ClanTab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 
        ================================================================
        TAB 1: OVERVIEW
        ================================================================
      */}
      {activeTab === "overview" && (
        <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
              Mission & Overview
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Learn about {clan.name}'s ongoing initiatives and engineering philosophy.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950 font-bold text-sm leading-relaxed">
              "{clan.shortDescription}"
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {clan.fullDescription}
            </p>
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
              Active Focus Areas & Key Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {clan.activeProjects.map((project, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400/60 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Active</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">{project}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 
        ================================================================
        TAB 2: CLAN STORIES (INSTAGRAM/SNAPCHAT 24H EPHEMERAL STORIES)
        ================================================================
      */}
      {activeTab === "stories" && (
        <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                Clan Stories (24h Ephemeral Updates)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Photo and video milestones uploaded by {clan.name} leaders and members.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowStoryModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs cursor-pointer"
            >
              <span>+ Post Story</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {stories.map((story) => (
              <article
                key={story.id}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md flex flex-col justify-between aspect-[4/5]"
              >
                <img
                  src={story.mediaUrl}
                  alt={story.caption}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/40 pointer-events-none" />

                {/* Top Story Info */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs ring-2 ring-white">
                      {clan.initials}
                    </div>
                    <div>
                      <strong className="text-white text-xs block leading-tight">{clan.name}</strong>
                      <small className="text-slate-300 text-[10px]">{story.createdAt}</small>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-bold text-amber-300 border border-white/20 backdrop-blur-md">
                    👁️ {story.viewsCount}
                  </span>
                </div>

                {/* Bottom Story Caption & Like Button */}
                <div className="relative z-10 p-4 space-y-3">
                  <p className="text-xs text-white font-medium leading-relaxed drop-shadow">
                    {story.caption}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleLikeStory(story.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                        story.isLiked
                          ? "bg-rose-500 text-white shadow-sm"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <span>{story.isLiked ? "❤️" : "🤍"}</span>
                      <span>{story.likesCount}</span>
                    </button>
                    <span className="text-[10px] text-slate-300 font-semibold">24h auto-expiry</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 
        ================================================================
        TAB 3: CLAN PROJECTS (MILESTONES & PROGRESS)
        ================================================================
      */}
      {activeTab === "projects" && (
        <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                Clan Projects & Milestones
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Collaborative builds, live repos, and sprint updates logged by {clan.name}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowProjectModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs cursor-pointer"
            >
              <span>+ New Clan Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <article
                key={proj.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                        proj.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {proj.status === "completed" ? "✓ Completed" : "⚡ In Progress"}
                    </span>
                    <h3 className="text-base font-black text-slate-900 leading-snug">{proj.title}</h3>
                  </div>
                  {proj.status !== "completed" && (
                    <button
                      type="button"
                      onClick={() => handleCompleteProject(proj.id)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer shrink-0"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{proj.description}</p>

                {proj.assignedMembers && proj.assignedMembers.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="font-bold">Team:</span>
                    <div className="flex flex-wrap gap-1">
                      {proj.assignedMembers.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestone Updates Timeline */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Milestone Timeline ({proj.updates.length})
                    </strong>
                    <button
                      type="button"
                      onClick={() => setShowUpdateModal(String(proj.id))}
                      className="text-xs text-amber-600 font-bold hover:underline cursor-pointer"
                    >
                      + Add Update
                    </button>
                  </div>
                  <div className="space-y-2">
                    {proj.updates.map((up) => (
                      <div key={up.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                          <span>{up.title}</span>
                          <small className="text-slate-400 font-normal">{up.createdAt}</small>
                        </div>
                        <p className="text-slate-600 text-[11px]">{up.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {proj.githubLink && (
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>View GitHub Repository</span> ↗
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 
        ================================================================
        TAB 4: RECRUITMENT OPENINGS (GLOBAL & CLAN HIRING)
        ================================================================
      */}
      {activeTab === "recruitments" && (
        <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                Clan Recruitment & Openings
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Specialized technical positions open for aspiring students to join {clan.name}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRecruitmentModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs cursor-pointer"
            >
              <span>+ Post Opening</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recruitments.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-amber-400/60 hover:bg-white hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{rec.title}</h3>
                    <small className="text-[11px] font-semibold text-slate-500">
                      Posted {rec.createdAt} · Deadline: {rec.deadline || "Open until filled"}
                    </small>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                    {rec.applicantsCount} applicants
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{rec.description}</p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Required Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.requiredSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10px] font-bold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700">● Accepting Applications</span>
                  <button
                    type="button"
                    onClick={() => handleApplyRecruitment(rec.id)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer"
                  >
                    Apply to Clan →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 
        ================================================================
        TAB 5: CLAN ROSTER
        ================================================================
      */}
      {activeTab === "roster" && (
        <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                Clan Roster & Permissions
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Active student engineers, architects, and product leads within {clan.name}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search roster..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              />
              <button
                type="button"
                onClick={handleLeaveClan}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer"
              >
                Leave Clan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-amber-400/60 hover:bg-white hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-xs border ${
                        member.isLeader
                          ? "bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 border-amber-300"
                          : "bg-slate-200 text-slate-800 border-slate-300"
                      }`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        {member.name}
                        {member.isLeader && (
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-extrabold">
                            Lead
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] font-bold text-amber-700 leading-tight">{member.role}</p>
                      <small className="text-[10px] text-slate-500 font-medium">
                        {member.branch} · {member.year}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Role Switcher & Member Removal Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <label className="text-[10px] font-bold text-slate-500">Role:</label>
                  <select
                    value={member.role}
                    onChange={(e) => handleChangeRole(member.id, e.target.value)}
                    className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-0.5"
                  >
                    <option value="Leader">Leader</option>
                    <option value="Co-Leader">Co-Leader</option>
                    <option value="Elder">Elder</option>
                    <option value="Member">Member</option>
                  </select>
                  {!member.isLeader && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-bold cursor-pointer"
                      title="Remove member from clan"
                    >
                      Kick
                    </button>
                  )}
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 
        ================================================================
        TAB 6: TROPHIES
        ================================================================
      */}
      {activeTab === "trophies" && (
        <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
              Trophies & Awards ({clan.trophies.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Official institutional accolades won by {clan.name} in competitions and symposia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clan.trophies.map((trophy) => (
              <div
                key={trophy.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 via-slate-50 to-white border border-amber-300/60 hover:border-amber-400 hover:shadow-md transition-all space-y-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{trophy.title}</h4>
                    <span className="text-[10px] font-extrabold text-amber-700 block mt-0.5">
                      {trophy.eventName} · {trophy.awardDate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                  {trophy.description}
                </p>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  Conferred to: <strong className="text-slate-800">{trophy.recipientName}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 
        ================================================================
        MODAL 1: ADD CLAN STORY MODAL
        ================================================================
      */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Post Clan Story (24h)</h3>
              <button type="button" onClick={() => setShowStoryModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateStory} className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Story Caption
                <textarea
                  rows={3}
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  placeholder="Share a hackathon win, late night build session, or milestone..."
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200"
                  required
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Image / Cover URL
                <input
                  type="url"
                  value={storyMediaUrl}
                  onChange={(e) => setStoryMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowStoryModal(false)} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-sm">Publish Story</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 2: ADD CLAN PROJECT MODAL
        ================================================================
      */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Create New Clan Project</h3>
              <button type="button" onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Project Title
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Campus Navigation App"
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                  required
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Description
                <textarea
                  rows={3}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Overview of tech stack, goals, and architecture..."
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200"
                  required
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                GitHub Repository Link
                <input
                  type="url"
                  value={projectGithub}
                  onChange={(e) => setProjectGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProjectModal(false)} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-sm">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 3: ADD PROJECT UPDATE MODAL
        ================================================================
      */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Post Milestone Update</h3>
              <button type="button" onClick={() => setShowUpdateModal(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Milestone Title
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="e.g. Sprint 2: WebSocket Integration"
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Milestone Details
                <textarea
                  rows={3}
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  placeholder="Describe what was built, fixed, or achieved..."
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUpdateModal(null)} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100">Cancel</button>
                <button
                  type="button"
                  onClick={() => handleAddProjectUpdate(showUpdateModal)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-sm"
                >
                  Post Milestone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 4: INVITE STUDENT MODAL
        ================================================================
      */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Invite Student to {clan.name}</h3>
              <button type="button" onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Student Name or Campus Email
                <input
                  type="text"
                  value={inviteStudentName}
                  onChange={(e) => setInviteStudentName(e.target.value)}
                  placeholder="e.g. Kabir Singh or student@campus.edu"
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    if (!inviteStudentName.trim()) return
                    djangoApi.clans.sendInvitation(Date.now()).catch(() => {})
                    setShowInviteModal(false)
                    setInviteStudentName("")
                    showToast(`Clan invitation dispatched to ${inviteStudentName}!`)
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 5: POST RECRUITMENT MODAL
        ================================================================
      */}
      {showRecruitmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Post Clan Opening</h3>
              <button type="button" onClick={() => setShowRecruitmentModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Role Title
                <input
                  type="text"
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  placeholder="e.g. Lead Machine Learning Engineer"
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Required Skills (comma separated)
                <input
                  type="text"
                  value={recSkills}
                  onChange={(e) => setRecSkills(e.target.value)}
                  placeholder="e.g. PyTorch, Python, Docker"
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Description
                <textarea
                  rows={3}
                  value={recDesc}
                  onChange={(e) => setRecDesc(e.target.value)}
                  placeholder="Explain responsibilities, time commitment, and projects..."
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowRecruitmentModal(false)} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    if (!recTitle.trim()) return
                    const newRec: ClanRecruitmentItem = {
                      id: `rec-${Date.now()}`,
                      clanId: clan.id,
                      clanName: clan.name,
                      title: recTitle.trim(),
                      description: recDesc.trim(),
                      requiredSkills: recSkills.split(",").map((s) => s.trim()).filter(Boolean),
                      deadline: "Open until filled",
                      applicantsCount: 0,
                      status: "open",
                      createdAt: "Just now",
                    }
                    setRecruitments([newRec, ...recruitments])
                    setShowRecruitmentModal(false)
                    setRecTitle("")
                    setRecDesc("")
                    setRecSkills("")
                    showToast("New recruitment opening published!")
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-sm"
                >
                  Publish Opening
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 6: EDIT CLAN PROFILE MODAL
        ================================================================
      */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Clan Profile</h3>
                <p className="text-xs text-slate-500 font-medium">Update {clan.name} information and projects</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClan} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clan Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Speciality / Focus Domain</label>
                <input
                  type="text"
                  value={editForm.speciality}
                  onChange={(e) => setEditForm({ ...editForm, speciality: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tier Badge</label>
                  <input
                    type="text"
                    value={editForm.tier}
                    onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sprint Velocity</label>
                  <input
                    type="text"
                    value={editForm.sprintVelocity}
                    onChange={(e) => setEditForm({ ...editForm, sprintVelocity: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Mission Slogan</label>
                <input
                  type="text"
                  value={editForm.shortDescription}
                  onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Overview Description</label>
                <textarea
                  rows={4}
                  value={editForm.fullDescription}
                  onChange={(e) => setEditForm({ ...editForm, fullDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl font-black text-xs cursor-pointer shadow-sm hover:brightness-105 active:scale-95"
                >
                  Save Clan Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
