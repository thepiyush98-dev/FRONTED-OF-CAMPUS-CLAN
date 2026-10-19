import React, { useState } from "react"
import { djangoApi } from "@/services/djangoApi"
import { ClanPostItem, ClanStoryItem, ProjectItem, ClanRecruitmentItem } from "@/types"
import { ALL_STUDENT_PROFILES } from "@/data/studentProfilesData"

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
  coLeaderName?: string
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
    coLeaderName: "Riya Malhotra",
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
    coLeaderName: "Aryan Mehta",
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
    tags: ["React19", "TailwindCSSv4", "DesignSystem", "TypeScript"],
    assignedMembers: ["Aarav Khanna", "Riya Malhotra", "Rohan Verma"],
    updates: [
      { id: "u-1", title: "Forward-Curved 3D Slider Shipped", content: "Added 3D panoramic event carousel with 16:9 thumbnails and responsive bottom mobile bars.", createdAt: "Yesterday" },
      { id: "u-2", title: "Django API Unified Adapters", content: "Integrated OTP email authentication and real-time name verification endpoints.", createdAt: "Today" },
    ],
    createdAt: "October 2026",
  },
  {
    id: "cp-2",
    title: "Autonomous Telemetry Dashboard",
    description: "High-frequency WebSocket client visualizing real-time rover telemetry, sensor arrays, and battery health at 60 FPS under competitive race conditions.",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    status: "completed",
    isClanProject: true,
    clanName: "Pixel Pirates",
    githubLink: "https://github.com/campus-clans/telemetry-dash",
    liveLink: "https://telemetry.campusclans.edu",
    tags: ["WebSockets", "DataViz", "RTOS", "ThreeJS"],
    assignedMembers: ["Aarav Khanna", "Kabir Singh", "Rohan Verma"],
    updates: [
      { id: "u-3", title: "Deployed to Production", content: "Passed benchmark stress testing during North India Hackfest. Won 1st place overall!", createdAt: "2 days ago" },
    ],
    createdAt: "September 2026",
  },
]

// Initial Clan Community Posts Data (Announcements, Tech Highlights & Discussions)
const INITIAL_CLAN_POSTS: ClanPostItem[] = [
  {
    id: "cp-post-1",
    clanId: "clan-1",
    clanName: "Pixel Pirates",
    authorId: "stu-1",
    authorName: "Aarav Khanna",
    authorRole: "Leader",
    content: "🚀 National UI/UX Symposium 2026 Kickoff! We're engineering a multi-agent canvas with WebSockets & React 19. If you want to contribute to the animation engine, ping me or Riya in the clan channel.",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"],
    likesCount: 42,
    isLiked: false,
    commentsCount: 9,
    createdAt: "Today at 2:15 PM",
    isAnnouncement: true,
    tags: ["#Hackathon", "#React19", "#WebSockets"],
    likers: [
      { id: "stu-2", name: "Riya Malhotra", avatar: "RM", branch: "B.Tech IT · 3rd Year", likedAt: "10m ago" },
      { id: "stu-3", name: "Devansh Sharma", avatar: "DS", branch: "B.Tech CSE · 3rd Year", likedAt: "25m ago" },
      { id: "stu-4", name: "Simran Kaur", avatar: "SK", branch: "B.Tech AI · 2nd Year", likedAt: "45m ago" },
      { id: "stu-5", name: "Kabir Singh", avatar: "KS", branch: "B.Tech ECE · 4th Year", likedAt: "1h ago" },
      { id: "stu-6", name: "Ananya Roy", avatar: "AR", branch: "B.Tech CSE · 3rd Year", likedAt: "2h ago" },
    ],
  },
  {
    id: "cp-post-2",
    clanId: "clan-1",
    clanName: "Pixel Pirates",
    authorId: "stu-2",
    authorName: "Riya Malhotra",
    authorRole: "Co-Leader",
    content: "🎨 Version 2.0 of Campus Clans UI Kit is officially shipped! Built with Tailwind CSS v4, custom glassmorphism shaders, and accessible KaTeX math primitives. Star the repo on GitHub! ⭐",
    images: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"],
    likesCount: 56,
    isLiked: true,
    commentsCount: 14,
    createdAt: "Yesterday at 6:40 PM",
    isAnnouncement: false,
    tags: ["#DesignSystem", "#TailwindCSS", "#OpenSource"],
    likers: [
      { id: "stu-1", name: "Aarav Khanna", avatar: "AK", branch: "B.Tech CSE · 3rd Year", likedAt: "Yesterday" },
      { id: "stu-3", name: "Devansh Sharma", avatar: "DS", branch: "B.Tech CSE · 3rd Year", likedAt: "Yesterday" },
      { id: "stu-5", name: "Kabir Singh", avatar: "KS", branch: "B.Tech ECE · 4th Year", likedAt: "Yesterday" },
      { id: "stu-6", name: "Ananya Roy", avatar: "AR", branch: "B.Tech CSE · 3rd Year", likedAt: "Yesterday" },
    ],
  },
  {
    id: "cp-post-3",
    clanId: "clan-1",
    clanName: "Pixel Pirates",
    authorId: "stu-m3",
    authorName: "Rohan Verma",
    authorRole: "Elder",
    content: "⚡ Sprint Milestone Passed: Telemetry WebSocket benchmark achieved 60 FPS under simulated stress testing with 500 concurrent subscribers. Zero dropped frames!",
    images: [],
    likesCount: 29,
    isLiked: false,
    commentsCount: 4,
    createdAt: "2 days ago",
    isAnnouncement: false,
    tags: ["#Performance", "#Benchmarking"],
    likers: [
      { id: "stu-1", name: "Aarav Khanna", avatar: "AK", branch: "B.Tech CSE · 3rd Year", likedAt: "2 days ago" },
      { id: "stu-2", name: "Riya Malhotra", avatar: "RM", branch: "B.Tech IT · 3rd Year", likedAt: "2 days ago" },
    ],
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

type ClanTab = "overview" | "posts" | "projects" | "recruitments" | "roster" | "trophies"

export default function ClanProfile({ clanName, onBack }: ClanProfileProps) {
  const initialData = DEFAULT_CLAN_PROFILES[clanName] || DEFAULT_CLAN_PROFILES["Pixel Pirates"]
  const [clan, setClan] = useState<ClanProfileData>(initialData)
  const [activeTab, setActiveTab] = useState<ClanTab>("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ClanProfileData>(initialData)
  const [searchMember, setSearchMember] = useState("")

  // State for Features from Django Backend
  const [posts, setPosts] = useState<ClanPostItem[]>(INITIAL_CLAN_POSTS)
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_CLAN_PROJECTS)
  const [recruitments, setRecruitments] = useState<ClanRecruitmentItem[]>(INITIAL_RECRUITMENTS)
  const [joinRequested, setJoinRequested] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Clan Post Creation Modal State (/clan/<name>/post/create/)
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [postImage, setPostImage] = useState("")
  const [isAnnouncementPost, setIsAnnouncementPost] = useState(false)
  const [postTag, setPostTag] = useState("#Announcement")

  // Clan Post Likers List Modal (/post/<id>/likes/)
  const [selectedLikersPost, setSelectedLikersPost] = useState<ClanPostItem | null>(null)
  const [likerSearch, setLikerSearch] = useState("")

  // Clan Post Delete Confirmation Modal (/post/<id>/delete/)
  const [deletePostTarget, setDeletePostTarget] = useState<ClanPostItem | null>(null)

  // Project Star Reactions State
  const [projectStars, setProjectStars] = useState<Record<string, boolean>>({ "cp-1": true, "cp-2": false })
  const [projectStarCounts, setProjectStarCounts] = useState<Record<string, number>>({ "cp-1": 48, "cp-2": 35 })

  // Current User enrollment & role detection
  const currentUserId = "stu-1" // Signed in campus student (Aarav Khanna)
  const currentMember = clan.members.find((m) => m.id === currentUserId)
  const isEnrolled = !!currentMember
  const currentUserRole = currentMember?.role || "Visitor"
  const isLeader = currentUserRole === "Leader" || clan.leaderName === "Aarav Khanna"
  const isCoLeader = currentUserRole === "Co-Leader"
  const isLeaderOrCoLeader = isLeader || isCoLeader

  // Helper to render role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Leader":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-2xs border border-amber-400">
            👑 Leader
          </span>
        )
      case "Co-Leader":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
            ⭐ Co-Leader
          </span>
        )
      case "Elder":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
            🛡️ Elder
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            👤 Member
          </span>
        )
    }
  }

  // Leadership Transfer Confirmation Modal State
  const [transferLeaderTarget, setTransferLeaderTarget] = useState<ClanMember | null>(null)

  // Member Removal (Kick) Modal State
  const [memberToRemove, setMemberToRemove] = useState<ClanMember | null>(null)
  const [removeReason, setRemoveReason] = useState("Inactive in clan sprints")

  // Leave Clan Confirmation & Warning State
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaderLeaveWarning, setLeaderLeaveWarning] = useState(false)

  // Role Permissions Matrix Guide Modal State
  const [showPermissionsMatrix, setShowPermissionsMatrix] = useState(false)

  // Direct Student Invite Modal State (/clan/<name>/invite/)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedInviteStudentId, setSelectedInviteStudentId] = useState("")
  const [inviteCustomName, setInviteCustomName] = useState("")
  const [inviteRole, setInviteRole] = useState<"Member" | "Elder" | "Co-Leader">("Member")
  const [inviteMessage, setInviteMessage] = useState("")

  // Modals for Django Actions
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [storyCaption, setStoryCaption] = useState("")
  const [storyMediaUrl, setStoryMediaUrl] = useState("")

  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")
  const [projectDesc, setProjectDesc] = useState("")
  const [projectGithub, setProjectGithub] = useState("")
  const [projectLive, setProjectLive] = useState("")
  const [projectTags, setProjectTags] = useState("")
  const [projectCoverImage, setProjectCoverImage] = useState("")

  const [showUpdateModal, setShowUpdateModal] = useState<string | null>(null)
  const [updatePhase, setUpdatePhase] = useState("Sprint 1: Architecture & Prototyping")
  const [updateTitle, setUpdateTitle] = useState("")
  const [updateContent, setUpdateContent] = useState("")

  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false)
  const [recTitle, setRecTitle] = useState("")
  const [recDesc, setRecDesc] = useState("")
  const [recSkills, setRecSkills] = useState("")

  // Backend ClanJoinRequest: Pending student applications to join the clan
  const [pendingJoinRequests, setPendingJoinRequests] = useState([
    {
      id: "req-1",
      name: "Kabir Singh",
      branch: "B.Tech ECE · 4th Year",
      initials: "KS",
      skills: ["Hardware Interfacing", "RTOS", "C++", "Drones"],
      requestedAt: "2 hours ago",
      pitch: "Excited to assist with microcontroller telemetry feeds in the upcoming hackathon!",
    },
    {
      id: "req-2",
      name: "Naina Kapoor",
      branch: "BBA · 2nd Year",
      initials: "NK",
      skills: ["Product Strategy", "Figma", "Pitch Decks", "User Research"],
      requestedAt: "Yesterday",
      pitch: "I can lead product marketing, pitch deck presentation, and user testing sprints.",
    },
  ])

  // Backend ClanRecruitmentApplication: Applicants for open vacancies
  const [showApplicantsModal, setShowApplicantsModal] = useState<string | null>(null)
  const [applicantsList, setApplicantsList] = useState<Record<string, Array<{ id: string; name: string; branch: string; skills: string[]; note: string; date: string }>>>({
    "rec-1": [
      { id: "app-1", name: "Ananya Roy", branch: "B.Tech CSE · 3rd Year", skills: ["React 19", "Tailwind CSS", "TypeScript"], note: "Built 3 production apps with React 19 and Framer Motion. Ready to sprint!", date: "Today" },
      { id: "app-2", name: "Vikram Mehta", branch: "B.Des · 3rd Year", skills: ["Figma", "Design Systems", "Prototyping"], note: "Experienced with component architecture and UI design systems.", date: "Yesterday" }
    ],
    "rec-2": [
      { id: "app-3", name: "Devansh Sharma", branch: "B.Tech CSE · 3rd Year", skills: ["PyTorch", "FastAPI", "Vector DB"], note: "Authored 2 campus AI research projects and deployed RAG search.", date: "2 days ago" }
    ]
  })

  // Apply to Clan Recruitment Vacancy Modal State (/recruitment/<id>/apply/)
  const [showApplyModal, setShowApplyModal] = useState<ClanRecruitmentItem | null>(null)
  const [applyPitch, setApplyPitch] = useState("")
  const [applySkills, setApplySkills] = useState("React 19, TypeScript, Tailwind CSS")
  const [isSubmittingApply, setIsSubmittingApply] = useState(false)

  const handleOpenApplyModal = (rec: ClanRecruitmentItem) => {
    setShowApplyModal(rec)
    setApplyPitch(
      `I am excited to apply for ${rec.title} in ${clan.name}. I have experience delivering production features and can commit 10-15 hours/week for upcoming hackathons.`
    )
    setApplySkills(rec.requiredSkills.slice(0, 3).join(", ") || "React 19, TypeScript, Tailwind CSS")
  }

  const handleSubmitApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showApplyModal) return
    setIsSubmittingApply(true)

    const skillList = applySkills.split(",").map((s) => s.trim()).filter(Boolean)
    try {
      await djangoApi.recruitments.applyToRecruitment(showApplyModal.id, {
        pitch: applyPitch.trim(),
        skills: skillList,
      })
    } catch {}

    const newApplicant = {
      id: `app-${Date.now()}`,
      name: "Aarav Khanna",
      branch: "B.Tech CSE · 3rd Year",
      skills: skillList.length > 0 ? skillList : showApplyModal.requiredSkills,
      note: applyPitch.trim(),
      date: "Just now",
    }

    setApplicantsList((prev) => ({
      ...prev,
      [String(showApplyModal.id)]: [newApplicant, ...(prev[String(showApplyModal.id)] || [])],
    }))

    setRecruitments((prev) =>
      prev.map((r) =>
        r.id === showApplyModal.id ? { ...r, applicantsCount: (r.applicantsCount || 0) + 1 } : r
      )
    )

    setIsSubmittingApply(false)
    setShowApplyModal(null)
    showToast(`✓ Application submitted for "${showApplyModal.title}" (/recruitment/${showApplyModal.id}/apply/)!`)
  }

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  const handleAcceptJoinRequest = (reqId: string) => {
    const req = pendingJoinRequests.find((r) => r.id === reqId)
    if (!req) return
    const newMember: ClanMember = {
      id: `stu-${Date.now()}`,
      name: req.name,
      role: "Member",
      branch: req.branch.split(" · ")[0] || "B.Tech",
      year: req.branch.split(" · ")[1] || "Year 2",
      initials: req.initials,
      skills: req.skills,
    }
    setClan((prev) => ({
      ...prev,
      memberCount: prev.memberCount + 1,
      members: [...prev.members, newMember],
    }))
    setPendingJoinRequests((prev) => prev.filter((r) => r.id !== reqId))
    showToast(`✓ Accepted ${req.name} into the clan! Added to roster.`)
  }

  const handleDeclineJoinRequest = (reqId: string) => {
    setPendingJoinRequests((prev) => prev.filter((r) => r.id !== reqId))
    showToast("Join request dismissed.")
  }

  const handleAcceptApplicant = (recId: string, appId: string) => {
    const list = applicantsList[recId] || []
    const applicant = list.find((a) => a.id === appId)
    if (!applicant) return
    const newMember: ClanMember = {
      id: `stu-${Date.now()}`,
      name: applicant.name,
      role: "Member",
      branch: applicant.branch.split(" · ")[0] || "B.Tech",
      year: applicant.branch.split(" · ")[1] || "Year 2",
      initials: applicant.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
      skills: applicant.skills,
    }
    setClan((prev) => ({
      ...prev,
      memberCount: prev.memberCount + 1,
      members: [...prev.members, newMember],
    }))
    setApplicantsList((prev) => ({
      ...prev,
      [recId]: (prev[recId] || []).filter((a) => a.id !== appId),
    }))
    showToast(`✓ ${applicant.name} accepted into clan roster!`)
  }

  const handleRejectApplicant = (recId: string, appId: string) => {
    setApplicantsList((prev) => ({
      ...prev,
      [recId]: (prev[recId] || []).filter((a) => a.id !== appId),
    }))
    showToast("Application rejected.")
  }

  // Handle Join Clan (/clan/<name>/request-join/)
  const handleJoinClan = async () => {
    try {
      await djangoApi.clans.sendJoinRequest(clan.name)
      setJoinRequested(true)
      showToast(`✓ Join request submitted to clan leadership (/clan/${clan.name}/request-join/)!`)
    } catch {
      setJoinRequested(true)
      showToast("Join request sent to clan leadership.")
    }
  }

  // Handle Cancel Join Clan Request (/cancel-join-request/)
  const handleCancelJoinRequest = async () => {
    try {
      await djangoApi.clans.cancelJoinRequest(clan.name)
      setJoinRequested(false)
      showToast("✓ Join request cancelled (/cancel-join-request/).")
    } catch {
      setJoinRequested(false)
      showToast("Join request cancelled.")
    }
  }

  // Handle Leave Clan Trigger (/clan/<name>/request-leave/)
  const handleLeaveClanClick = () => {
    if (isLeader) {
      setLeaderLeaveWarning(true)
      return
    }
    setShowLeaveModal(true)
  }

  // Handle Confirm Leave Clan
  const handleConfirmLeaveClan = async () => {
    try {
      await djangoApi.clans.requestLeave(clan.name)
    } catch {}
    setClan((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== currentUserId),
      memberCount: Math.max(0, prev.memberCount - 1),
    }))
    setShowLeaveModal(false)
    showToast(`✓ You have departed ${clan.name} (/clan/${clan.name}/request-leave/).`)
  }

  // Handle Create Clan Post (/clan/<name>/post/create/)
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postContent.trim()) return
    const authorDisplayName = currentMember?.name || clan.leaderName
    const newPost: ClanPostItem = {
      id: `cp-post-${Date.now()}`,
      clanId: clan.id,
      clanName: clan.name,
      authorId: currentUserId,
      authorName: authorDisplayName,
      authorRole: currentUserRole,
      content: postContent.trim(),
      images: postImage.trim() ? [postImage.trim()] : [],
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      createdAt: "Just now",
      isAnnouncement: isAnnouncementPost,
      tags: [postTag],
      likers: [
        {
          id: currentUserId,
          name: authorDisplayName,
          avatar: "AK",
          branch: "B.Tech CSE · 3rd Year",
          likedAt: "Just now",
        },
      ],
    }

    try {
      await djangoApi.posts.createPost(clan.name, {
        content: postContent.trim(),
        image: postImage.trim() || undefined,
        isAnnouncement: isAnnouncementPost,
        tags: [postTag],
      })
    } catch {}

    setPosts([newPost, ...posts])
    setShowPostModal(false)
    setPostContent("")
    setPostImage("")
    setIsAnnouncementPost(false)
    showToast(`✓ Clan post published to ${clan.name} feed (/clan/${clan.name}/post/create/)!`)
  }

  // Handle Create 24h Clan Story (POST /clan/<name>/story/create/)
  const handleCreateClanStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storyCaption.trim() || !storyMediaUrl.trim()) return
    try {
      await djangoApi.stories.createStory(clan.name, {
        caption: storyCaption.trim(),
        storyImage: storyMediaUrl.trim(),
      })
    } catch {}
    setShowStoryModal(false)
    setStoryCaption("")
    setStoryMediaUrl("")
    showToast(`✓ 24-hour ephemeral clan story published for ${clan.name} (/clan/${clan.name}/story/create/)!`)
  }

  // Handle Like / Unlike Clan Post (POST /post/<id>/like/)
  const handleLikePost = async (postId: string | number) => {
    try {
      await djangoApi.posts.toggleLike(postId)
    } catch {}

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked
          const currentStudentLiker = {
            id: currentUserId,
            name: currentMember?.name || clan.leaderName,
            avatar: "AK",
            branch: "B.Tech CSE · 3rd Year",
            likedAt: "Just now",
          }
          const updatedLikers = nextLiked
            ? [currentStudentLiker, ...(p.likers || [])]
            : (p.likers || []).filter((l) => l.id !== currentUserId)

          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
            likers: updatedLikers,
          }
        }
        return p
      })
    )
  }

  // Handle Delete Clan Post (POST /post/<id>/delete/)
  const handleDeletePost = async (postId: string | number) => {
    try {
      await djangoApi.posts.deletePost(postId)
    } catch {}

    setPosts((prev) => prev.filter((p) => p.id !== postId))
    setDeletePostTarget(null)
    showToast("✓ Clan post deleted (/post/<id>/delete/).")
  }

  // Handle Project Star Toggle
  const handleToggleProjectStar = (projId: string | number) => {
    const key = String(projId)
    setProjectStars((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Handle Create Clan Project (POST /clan/<id>/project/create/)
  // Handle Create Clan Project (POST /clan/<name>/project/create/)
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectTitle.trim()) return

    const parsedTags = projectTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)

    const newProj: ProjectItem = {
      id: `cp-${Date.now()}`,
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      coverImage:
        projectCoverImage.trim() ||
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80",
      status: "in_progress",
      isClanProject: true,
      clanName: clan.name,
      githubLink: projectGithub.trim() || undefined,
      liveLink: projectLive.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : ["Architecture", "React19", "WebSockets"],
      assignedMembers: [clan.leaderName, clan.coLeaderName || "Riya Malhotra"],
      updates: [
        {
          id: `u-${Date.now()}`,
          title: "Phase 1: Architecture Blueprint & Sprint Kickoff",
          content: "Repository initialized, technical specifications outlined, and squad assigned.",
          createdAt: "Just now",
        },
      ],
      createdAt: "October 2026",
    }

    try {
      await djangoApi.projects.createClanProject(clan.name, newProj)
    } catch {}

    setProjects([newProj, ...projects])
    setShowProjectModal(false)
    setProjectTitle("")
    setProjectDesc("")
    setProjectGithub("")
    setProjectLive("")
    setProjectTags("")
    setProjectCoverImage("")
    showToast(`✓ Clan collaborative project "${newProj.title}" launched (/clan/${clan.name}/project/create/)!`)
  }

  // Handle Add Project Milestone Update (/update/ or POST /project/<id>/update/)
  const handleAddProjectUpdate = async (projectId: string) => {
    if (!updateTitle.trim() || !updateContent.trim()) return
    const updatePayload = {
      title: updatePhase ? `${updatePhase}: ${updateTitle.trim()}` : updateTitle.trim(),
      content: updateContent.trim(),
      phase: updatePhase,
    }

    try {
      await djangoApi.projects.addMilestoneUpdate(projectId, updatePayload)
    } catch {}

    setProjects((prev) =>
      prev.map((p) => {
        if (String(p.id) === String(projectId)) {
          return {
            ...p,
            updates: [
              {
                id: `u-${Date.now()}`,
                title: updatePayload.title,
                content: updatePayload.content,
                createdAt: "Just now",
              },
              ...(p.updates || []),
            ],
          }
        }
        return p
      })
    )
    setShowUpdateModal(null)
    setUpdateTitle("")
    setUpdateContent("")
    showToast("✓ Development milestone update logged to project timeline (/update/)!")
  }

  // Handle Project Completion Status (/complete/ or POST /project/<id>/complete/)
  const handleCompleteProject = async (projectId: string | number) => {
    const target = projects.find((p) => String(p.id) === String(projectId))
    const nextStatus = target?.status === "completed" ? "in_progress" : "completed"

    try {
      await djangoApi.projects.completeProject(projectId, nextStatus)
    } catch {}

    setProjects((prev) =>
      prev.map((p) =>
        String(p.id) === String(projectId) ? { ...p, status: nextStatus as "completed" | "in_progress" } : p
      )
    )

    if (nextStatus === "completed") {
      showToast("🏆 Project status marked as 'Completed' (/complete/)!")
    } else {
      showToast("⚡ Project reopened for active development sprint!")
    }
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

  // Handle Change Member Role (/clan/<name>/change-role/)
  const handleChangeRole = (memberId: string, newRole: string) => {
    const target = clan.members.find((m) => m.id === memberId)
    if (!target) return

    // If promoting to Leader, trigger Leadership Transfer Safeguard Modal
    if (newRole === "Leader") {
      setTransferLeaderTarget(target)
      return
    }

    setClan((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    }))
    djangoApi.clans.changeRole(clan.name, memberId, newRole).catch(() => {})
    showToast(`✓ Updated ${target.name}'s role to ${newRole} (/clan/${clan.name}/change-role/).`)
  }

  // Confirm Leadership Transfer (Full Control)
  const handleConfirmLeadershipTransfer = () => {
    if (!transferLeaderTarget) return
    const newLeaderName = transferLeaderTarget.name

    setClan((prev) => ({
      ...prev,
      leaderName: newLeaderName,
      members: prev.members.map((m) => {
        if (m.id === transferLeaderTarget.id) return { ...m, role: "Leader", isLeader: true }
        if (m.isLeader || m.role === "Leader") return { ...m, role: "Co-Leader", isLeader: false }
        return m
      }),
    }))
    djangoApi.clans.changeRole(clan.name, transferLeaderTarget.id, "Leader").catch(() => {})
    setTransferLeaderTarget(null)
    showToast(`👑 Clan leadership successfully transferred to ${newLeaderName}! You are now Co-Leader.`)
  }

  // Handle Member Removal Initiation (/clan/<name>/remove-member/)
  const handleInitiateRemoveMember = (member: ClanMember) => {
    if (member.isLeader || member.role === "Leader") {
      alert("Clan Leader cannot be removed.")
      return
    }
    setMemberToRemove(member)
    setRemoveReason("Inactive in clan sprints")
  }

  // Confirm Member Removal (Kick)
  const handleConfirmRemoveMember = () => {
    if (!memberToRemove) return
    setClan((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberToRemove.id),
      memberCount: Math.max(0, prev.memberCount - 1),
    }))
    djangoApi.clans.removeMember(clan.name, memberToRemove.id, removeReason).catch(() => {})
    showToast(`✓ Removed ${memberToRemove.name} from clan roster (/clan/${clan.name}/remove-member/). Reason: ${removeReason}`)
    setMemberToRemove(null)
  }

  // Handle Direct Student Invite (/clan/<name>/invite/)
  const handleSendDirectInvite = (e: React.FormEvent) => {
    e.preventDefault()
    let targetStudentName = inviteCustomName.trim()
    let targetStudentId = selectedInviteStudentId

    if (selectedInviteStudentId) {
      const found = ALL_STUDENT_PROFILES.find((s) => s.id === selectedInviteStudentId)
      if (found) {
        targetStudentName = found.name
      }
    }

    if (!targetStudentName) return

    djangoApi.clans.sendInvitation(clan.name, targetStudentId || targetStudentName, inviteRole, inviteMessage).catch(() => {})
    setShowInviteModal(false)
    setSelectedInviteStudentId("")
    setInviteCustomName("")
    setInviteMessage("")
    showToast(`🎉 Official clan invite sent to ${targetStudentName} as ${inviteRole} (/clan/${clan.name}/invite/)!`)
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
        {/* Action Buttons: Join / Cancel / Leave / Invite / Story / Edit */}
        <div className="flex flex-wrap items-center gap-2">
          {!isEnrolled ? (
            <>
              {joinRequested ? (
                <button
                  type="button"
                  onClick={handleCancelJoinRequest}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 shadow-xs transition-all cursor-pointer"
                  title="Cancel pending join request (/cancel-join-request/)"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>✕ Cancel Join Request</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinClan}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-amber-400"
                  title="Submit join request to clan leadership (/clan/<name>/request-join/)"
                >
                  <span>🛡️ Request to Join Clan</span>
                </button>
              )}
            </>
          ) : (
            <>
              {/* Enrolled Role Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-black shadow-2xs">
                <span>{currentUserRole === "Leader" ? "👑" : currentUserRole === "Co-Leader" ? "⭐" : currentUserRole === "Elder" ? "🛡️" : "👤"}</span>
                <span>My Rank: {currentUserRole}</span>
              </div>

              {/* Leave Clan Button */}
              <button
                type="button"
                onClick={handleLeaveClanClick}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                title="Leave this clan (/clan/<name>/request-leave/)"
              >
                <span>🚪 Leave Clan</span>
              </button>
            </>
          )}

          {isLeaderOrCoLeader && (
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs transition-all cursor-pointer"
              title="Directly invite a student to this clan (/clan/<name>/invite/)"
            >
              <span>✉️ Direct Student Invite</span>
            </button>
          )}

          {isLeaderOrCoLeader && (
            <button
              type="button"
              onClick={() => setShowStoryModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300/80 shadow-xs transition-all cursor-pointer"
              title="Post ephemeral 24-hour clan story (/clan/<name>/story/create/)"
            >
              <span>📸 Post 24h Story</span>
            </button>
          )}

          {isLeaderOrCoLeader && (
            <button
              type="button"
              onClick={() => setShowPostModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs transition-all cursor-pointer"
            >
              <span>📝 Create Clan Post</span>
            </button>
          )}

          {isLeaderOrCoLeader && (
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
          )}
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
                <div className="flex flex-wrap items-center gap-2.5 text-xs pt-1 font-medium">
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    👑 Leader: {clan.leaderName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200 shadow-2xs">
                    ⭐ Co-Leader: {clan.coLeaderName || "Riya Malhotra"}
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
                <strong className="block text-lg font-black text-slate-900">{posts.length}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Posts</span>
              </div>
              <div className="px-3 py-1">
                <strong className="block text-lg font-black text-slate-900">{clan.trophies.length}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trophies</span>
              </div>
            </div>
          </div>

          {/* 
            ================================================================
            CAPSULE FLOATING NAVBAR (MODERN PILL TABS DESIGN)
            ================================================================
          */}
          <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-center sm:justify-start">
            <nav className="inline-flex p-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-inner overflow-x-auto max-w-full gap-1 backdrop-blur-md">
              {[
                { id: "overview", label: "Overview", icon: "📋" },
                { id: "posts", label: `Clan Posts (${posts.length})`, icon: "📰" },
                { id: "projects", label: `Clan Projects (${projects.length})`, icon: "💻" },
                { id: "recruitments", label: `Recruitments (${recruitments.length})`, icon: "🎯" },
                { id: "roster", label: `Clan Roster (${clan.members.length})`, icon: "👥" },
                { id: "trophies", label: `Trophies (${clan.trophies.length})`, icon: "🏆" },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as ClanTab)}
                    className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? "bg-slate-950 text-white shadow-md font-black scale-[1.02]"
                        : "text-slate-600 hover:text-slate-950 hover:bg-white/80 font-bold"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
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
        TAB 2: CLAN POSTS (ANNOUNCEMENTS, RELEASES & TECH HIGHLIGHTS)
        ================================================================
      */}
      {activeTab === "posts" && (
        <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f5b800]" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  Clan Posts & Announcements
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official dispatches, release notes, and technical updates logged by {clan.name}.
              </p>
            </div>
            {isLeaderOrCoLeader && (
              <button
                type="button"
                onClick={() => setShowPostModal(true)}
                style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
              >
                <span>📝 + Create Clan Post</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {posts.map((post) => {
              const canDelete =
                isLeaderOrCoLeader ||
                post.authorId === currentUserId ||
                post.authorName === (currentMember?.name || clan.leaderName)

              return (
                <article
                  key={post.id}
                  className="rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Post Header */}
                  <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-400/40">
                        {clan.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-black text-slate-900">{post.authorName}</strong>
                          {getRoleBadge(post.authorRole)}
                          <span className="text-slate-400 text-xs">·</span>
                          <span className="text-[11px] text-slate-500 font-medium">{post.createdAt}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">{clan.name} Community Dispatch</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.isAnnouncement ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <span>📢</span>
                          <span>Official Announcement</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-200">
                          📝 Clan Update
                        </span>
                      )}

                      {/* Delete Post Button (/post/<id>/delete/) */}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setDeletePostTarget(post)}
                          title="Delete Clan Post (/post/<id>/delete/)"
                          className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center text-xs transition-all cursor-pointer border border-slate-200"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Body Content */}
                  <div className="p-5 space-y-3.5">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Post Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Attached Media / Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-950 max-h-96">
                        <img
                          src={post.images[0]}
                          alt="Clan post media"
                          className="w-full h-full object-cover object-center hover:scale-[1.01] transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Post Action Footer: Likes, Likers List, Comments */}
                  <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* LIKE BUTTON (/post/<id>/like/) */}
                      <button
                        type="button"
                        onClick={() => handleLikePost(post.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          post.isLiked
                            ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        <span>{post.isLiked ? "❤️" : "🤍"}</span>
                        <span>{post.isLiked ? "Liked" : "Like"}</span>
                      </button>

                      {/* LIKERS LIST TRIGGER (/post/<id>/likes/) */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLikersPost(post)
                          setLikerSearch("")
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-amber-900 hover:bg-amber-100/70 font-bold transition-all cursor-pointer text-xs"
                      >
                        <span className="text-amber-500 font-black">❤️</span>
                        <span>{post.likesCount} Likers</span>
                        <span className="text-[10px] text-slate-400 font-normal">· View list →</span>
                      </button>

                      <span className="text-slate-500 font-medium text-xs flex items-center gap-1">
                        <span>💬</span>
                        <span>{post.commentsCount} comments</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      Verified Clan Broadcast · /clan/{clan.name}/post/create/
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* 
        ================================================================
        TAB 3: CLAN PROJECTS (SHOWCASE FEED LIKE PERSONAL PROJECTS)
        ================================================================
      */}
      {activeTab === "projects" && (
        <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  Clan Projects & Architecture Showcase
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Production builds, architecture screenshots, and sprint changelogs engineered by {clan.name}.
              </p>
            </div>
            {isLeaderOrCoLeader && (
              <button
                type="button"
                onClick={() => setShowProjectModal(true)}
                style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
              >
                <span>💻 + New Clan Project</span>
              </button>
            )}
          </div>

          <div className="space-y-8">
            {projects.map((proj) => (
              <article
                key={proj.id}
                className="rounded-3xl border border-slate-200/90 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Post Card Header: Clan Badge, Timestamp, Status & Controls */}
                <div className="p-5 sm:p-6 pb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-sm shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-amber-300 font-black text-sm overflow-hidden">
                        {clan.initials}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-slate-900">{clan.name}</strong>
                        <span className="text-[10px] font-bold text-slate-400">·</span>
                        <span className="text-[11px] font-medium text-slate-500">{proj.createdAt || "October 2026"}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Lead: {clan.leaderName} · Co-Leader: {clan.coLeaderName || "Riya Malhotra"}
                      </p>
                    </div>
                  </div>

                  {/* Top Right Badges & Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                        proj.status === "completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-900 border-amber-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          proj.status === "completed" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                        }`}
                      />
                      {proj.status === "completed" ? "✓ Shipped & Completed" : "⚡ In Active Development"}
                    </span>

                    {/* Clan Lead Controls: Project Completion Status (/complete/) */}
                    {isLeaderOrCoLeader && (
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleCompleteProject(proj.id)}
                          className={`px-3 py-1 text-[11px] font-black rounded-xl cursor-pointer transition-all border flex items-center gap-1.5 shadow-2xs ${
                            proj.status === "completed"
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
                          }`}
                          title="Toggle project completion status (/complete/)"
                        >
                          <span>{proj.status === "completed" ? "🔄 Reopen Sprint" : "✓ Mark Completed"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Media Section: Project Image / Screenshot Showcase */}
                {proj.coverImage && (
                  <div className="relative group/media overflow-hidden bg-slate-950 border-y border-slate-100">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-64 sm:h-80 md:h-[400px] object-cover object-center group-hover/media:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white text-xs drop-shadow">
                      <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 text-[11px] font-bold">
                        <span>📸</span>
                        <span>Clan Architecture & Live Screenshot</span>
                      </span>
                      {proj.liveLink && (
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl font-black text-xs shadow-lg transition-transform active:scale-95"
                        >
                          <span>🚀 Launch Demo</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Post Content Body: Title, Description, Tags */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mb-2 font-heading">
                      {proj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {proj.description}
                    </p>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {(proj.tags && proj.tags.length > 0
                      ? proj.tags
                      : ["React19", "TypeScript", "TailwindCSS", "FullStack"]
                    ).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-extrabold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 px-3 py-1 rounded-xl transition-colors"
                      >
                        #{tag.replace(/^#/, "")}
                      </span>
                    ))}
                  </div>

                  {/* Milestone Changelog & Sprint Updates */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <strong className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Milestone Changelog & Sprints ({proj.updates?.length || 0})
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowUpdateModal(String(proj.id))}
                        className="text-xs text-amber-700 hover:text-amber-900 font-black hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>+ Post Sprint Milestone</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {proj.updates && proj.updates.length > 0 ? (
                        proj.updates.map((up) => (
                          <div
                            key={up.id}
                            className="p-3 rounded-xl bg-white border border-slate-200/70 text-xs shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                <span className="text-amber-500">⚡</span>
                                <span>{up.title}</span>
                              </span>
                              <small className="text-slate-400 font-medium">{up.createdAt}</small>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-relaxed pl-4">{up.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No sprint milestones posted yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Post Footer Bar: Star Reaction, GitHub, Live Demo, Team Avatars */}
                <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Star / Upvote Reaction */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleProjectStar(proj.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        projectStars[proj.id]
                          ? "bg-amber-100 text-amber-950 border border-amber-300 shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <span className={projectStars[proj.id] ? "text-amber-600" : "text-slate-400"}>
                        {projectStars[proj.id] ? "⭐" : "☆"}
                      </span>
                      <span>{projectStars[proj.id] ? "Starred" : "Star Project"}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-900">
                        {(projectStarCounts[proj.id] ?? 24) + (projectStars[proj.id] ? 1 : 0)}
                      </span>
                    </button>
                  </div>

                  {/* Action Links & Assigned Members */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {proj.githubLink && (
                      <a
                        href={proj.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>Code Repository</span>
                        <span className="text-[10px] text-slate-400">↗</span>
                      </a>
                    )}

                    {proj.liveLink && (
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-2xs transition-all active:scale-95"
                      >
                        <span>🚀 Launch Demo</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    )}

                    {/* Team Members List */}
                    {proj.assignedMembers && proj.assignedMembers.length > 0 && (
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team:</span>
                        <div className="flex -space-x-1.5">
                          {proj.assignedMembers.map((m, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white text-amber-300 text-[9px] font-black flex items-center justify-center shadow-2xs"
                              title={m}
                            >
                              {m.split(" ").map((w) => w[0]).join("")}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
            {isLeaderOrCoLeader && (
              <button
                type="button"
                onClick={() => setShowRecruitmentModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs cursor-pointer"
                title="Post new vacancy (/clan/<name>/recruitment/create/)"
              >
                <span>+ Post Opening</span>
              </button>
            )}
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
                    {applicantsList[rec.id]?.length ?? rec.applicantsCount} applicants
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

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-emerald-700">● Accepting Applications</span>
                  <div className="flex items-center gap-2">
                    {isLeaderOrCoLeader && (
                      <button
                        type="button"
                        onClick={() => setShowApplicantsModal(rec.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                      >
                        View Applicants ({applicantsList[rec.id]?.length ?? rec.applicantsCount})
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(rec)}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Apply directly to this opening (/recruitment/<id>/apply/)"
                    >
                      Apply to Clan →
                    </button>
                  </div>
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
          {/* Backend ClanJoinRequest: Pending Join Requests Inbox for Leadership */}
          {pendingJoinRequests.length > 0 && isLeaderOrCoLeader && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/40 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Pending Join Requests ({pendingJoinRequests.length})
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                  Clan Leadership Review (Leader & Co-Leader)
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Students who submitted a direct request to join your clan roster:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {pendingJoinRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-white border border-amber-300/80 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center">
                          {req.initials}
                        </div>
                        <div>
                          <strong className="text-xs font-black text-slate-900 block">{req.name}</strong>
                          <span className="text-[10px] text-slate-500 font-semibold">{req.branch} · {req.requestedAt}</span>
                        </div>
                      </div>
                    </div>
                    {req.pitch && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                        "{req.pitch}"
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {req.skills.map((sk) => (
                        <span key={sk} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeclineJoinRequest(req.id)}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptJoinRequest(req.id)}
                        className="px-3 py-1 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs cursor-pointer"
                      >
                        ✓ Accept into Clan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  Clan Roster & Hierarchy
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  {clan.members.length} Members
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Active student engineers, architects, and leads within {clan.name}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search roster or skills..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />

              <button
                type="button"
                onClick={() => setShowPermissionsMatrix(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                title="View clan hierarchy & role permissions breakdown"
              >
                <span>ℹ️ Roles & Permissions</span>
              </button>

              {isLeaderOrCoLeader && (
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-amber-400"
                  title="Directly invite a student (/clan/<name>/invite/)"
                >
                  <span>✉️ Invite Student</span>
                </button>
              )}

              {isEnrolled && (
                <button
                  type="button"
                  onClick={handleLeaveClanClick}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer transition-colors"
                  title="Leave clan (/clan/<name>/request-leave/)"
                >
                  Leave Clan
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              const isCurrentUser = member.id === currentUserId
              const canManageThisMember =
                isLeaderOrCoLeader && !member.isLeader && !isCurrentUser

              const canKickThisMember =
                isLeaderOrCoLeader && !member.isLeader && !isCurrentUser

              return (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-amber-400/60 hover:bg-white hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => onNavigateMember?.(member.name)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-xs border cursor-pointer hover:scale-105 transition-transform ${
                          member.isLeader || member.role === "Leader"
                            ? "bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 border-amber-300"
                            : member.role === "Co-Leader"
                            ? "bg-purple-100 text-purple-900 border-purple-200"
                            : member.role === "Elder"
                            ? "bg-blue-100 text-blue-900 border-blue-200"
                            : "bg-slate-200 text-slate-800 border-slate-300"
                        }`}
                        title="Click to view student profile"
                      >
                        {member.initials}
                      </div>
                      <div>
                        <h4
                          onClick={() => onNavigateMember?.(member.name)}
                          className="text-sm font-black text-slate-900 flex items-center gap-1.5 cursor-pointer hover:text-amber-600 transition-colors"
                        >
                          {member.name}
                          {isCurrentUser && (
                            <span className="text-[9px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md font-bold">
                              You
                            </span>
                          )}
                        </h4>
                        <div className="mt-1 flex items-center gap-1.5">
                          {getRoleBadge(member.role)}
                        </div>
                        <small className="text-[10px] text-slate-500 font-medium block mt-1">
                          {member.branch} · {member.year}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Role Switcher & Member Removal Actions */}
                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                    {canManageThisMember ? (
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-slate-500">Role:</label>
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value)}
                          className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2 py-0.5 shadow-2xs focus:border-amber-400 focus:outline-none"
                          title="Change member role (/clan/<name>/change-role/)"
                        >
                          <option value="Member">👤 Member</option>
                          <option value="Elder">🛡️ Elder</option>
                          <option value="Co-Leader">⭐ Co-Leader</option>
                          {isLeaderOrCoLeader && <option value="Leader">👑 Promote to Leader</option>}
                        </select>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium italic">
                        {member.isLeader || member.role === "Leader" ? "Clan Founder & Head" : "Roster Member"}
                      </span>
                    )}

                    {canKickThisMember && (
                      <button
                        type="button"
                        onClick={() => handleInitiateRemoveMember(member)}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove member from clan (/clan/<name>/remove-member/)"
                      >
                        Kick Member
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
              )
            })}
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
        MODAL 0: POST 24-HOUR EPHEMERAL CLAN STORY (/clan/<name>/story/create/)
        ================================================================
      */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📸</span>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Post 24h Clan Story</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                      Ephemeral
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium font-mono">
                    POST /clan/{clan.name}/story/create/
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClanStory} className="p-5 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Choose Photo Preset or Enter Image URL
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    { name: "⚡ Hackathon War Room", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80" },
                    { name: "🐺 GPU AI Cluster", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" },
                    { name: "🤖 Robotics Bench Test", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80" },
                    { name: "🚀 Pitch Demo Day", url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80" },
                  ].map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setStoryMediaUrl(p.url)}
                      className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                        storyMediaUrl === p.url
                          ? "bg-amber-50 border-amber-400 font-black text-amber-950"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="text-[11px] truncate block font-bold">{p.name}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={storyMediaUrl}
                  onChange={(e) => setStoryMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {storyMediaUrl && (
                <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
                  <img src={storyMediaUrl} alt="Story Preview" className="w-full h-full object-cover opacity-85" />
                  <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-medium truncate drop-shadow">
                    {storyCaption || "Caption preview will appear here..."}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Story Caption</label>
                  <span className="text-[10px] text-slate-400">{storyCaption.length}/180 chars</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={180}
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  placeholder="Share a behind-the-scenes moment or hackathon victory..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-[10px] font-medium leading-relaxed">
                ⏳ <strong>24-Hour Ephemeral Rule:</strong> Story will appear on the Home page Clan Stories Strip with live viewer tracking, likes, and will auto-expire after 24 hours.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStoryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
                >
                  Publish 24h Story →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 1: CREATE CLAN POST MODAL
        ================================================================
      */}
      {/* 
        ================================================================
        MODAL 1: CREATE CLAN POST MODAL (/clan/<name>/post/create/)
        ================================================================
      */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Create Clan Post</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                      Community Feed
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium font-mono">
                    POST /clan/{clan.name}/post/create/
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Author & Announcement Toggle */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center">
                    AK
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {currentMember?.name || clan.leaderName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Posting as {currentUserRole}
                    </span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnnouncementPost}
                    onChange={(e) => setIsAnnouncementPost(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>📢</span>
                    <span>Official Announcement</span>
                  </span>
                </label>
              </div>

              {/* Post Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Post Text Update</label>
                  <span className="text-[10px] text-slate-400">{postContent.length} chars</span>
                </div>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share a sprint milestone, hackathon win, technical release notes, or clan update..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Tag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Categorization Tag</label>
                <div className="flex flex-wrap gap-1.5">
                  {["#Announcement", "#Hackathon", "#ReleaseNotes", "#OpenSource", "#DesignSystem", "#Milestone"].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setPostTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          postTag === tag
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

              {/* Media Attachments & Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Attached Media / Screenshot URL (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    { name: "⚡ Hackathon War Room", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" },
                    { name: "🎨 Glassmorphic UI Kit", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80" },
                    { name: "🤖 Hardware Bench Stress", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80" },
                    { name: "🚀 Campus Incubation Pitch", url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80" },
                  ].map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setPostImage(p.url)}
                      className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                        postImage === p.url
                          ? "bg-amber-50 border-amber-400 font-black text-amber-950"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="text-[11px] truncate block font-bold">{p.name}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Media Preview */}
              {postImage && (
                <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
                  <img src={postImage} alt="Post Media Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-[10px] backdrop-blur-xs">
                    Media Attached: {postTag}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
                >
                  Publish Clan Post →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 1B: CLAN POST LIKERS LIST MODAL (/post/<id>/likes/)
        ================================================================
      */}
      {selectedLikersPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="text-xl">❤️</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Post Likers</h3>
                  <p className="text-xs text-slate-500 font-medium font-mono">
                    GET /post/{selectedLikersPost.id}/likes/
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLikersPost(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 overflow-y-auto">
              {/* Search likers */}
              <input
                type="text"
                value={likerSearch}
                onChange={(e) => setLikerSearch(e.target.value)}
                placeholder="Search students by name or department..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />

              {/* Likers List */}
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {((selectedLikersPost.likers && selectedLikersPost.likers.length > 0)
                  ? selectedLikersPost.likers
                  : [
                      { id: "stu-1", name: "Aarav Khanna", avatar: "AK", branch: "B.Tech CSE · 3rd Year", likedAt: "Just now" },
                      { id: "stu-2", name: "Riya Malhotra", avatar: "RM", branch: "B.Tech IT · 3rd Year", likedAt: "10m ago" },
                      { id: "stu-3", name: "Devansh Sharma", avatar: "DS", branch: "B.Tech CSE · 3rd Year", likedAt: "25m ago" },
                    ]
                )
                  .filter(
                    (l) =>
                      l.name.toLowerCase().includes(likerSearch.toLowerCase()) ||
                      l.branch.toLowerCase().includes(likerSearch.toLowerCase())
                  )
                  .map((liker) => (
                    <div
                      key={liker.id}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between text-xs transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-2xs">
                          {liker.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-slate-900">{liker.name}</strong>
                            {liker.id === currentUserId && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block">{liker.branch}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-right">
                        <span className="text-[10px] text-slate-400 font-medium">{liker.likedAt}</span>
                        <span className="text-rose-500 text-sm">❤️</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">
                Total Reactions: {selectedLikersPost.likesCount} ❤️
              </span>
              <button
                type="button"
                onClick={() => setSelectedLikersPost(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 1C: DELETE CLAN POST CONFIRMATION (/post/<id>/delete/)
        ================================================================
      */}
      {deletePostTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-center">
            <span className="text-4xl block">🗑️</span>
            <div>
              <h3 className="text-base font-black text-slate-900">Delete Clan Post?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                This post will be permanently deleted from the {clan.name} feed and cannot be recovered.
              </p>
              <code className="text-[10px] text-rose-600 font-mono block mt-1.5">
                POST /post/{deletePostTarget.id}/delete/
              </code>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 font-semibold text-[10px]">
                <span>Author: {deletePostTarget.authorName}</span>
                <span>{deletePostTarget.createdAt}</span>
              </div>
              <p className="text-slate-800 line-clamp-2 italic font-normal">
                "{deletePostTarget.content}"
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletePostTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeletePost(deletePostTarget.id)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 2: ADD CLAN PROJECT MODAL (/clan/<name>/project/create/)
        ================================================================
      */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💻</span>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Launch Clan Project</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      Collaborative
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium font-mono">
                    POST /clan/{clan.name}/project/create/
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-5 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Autonomous Telemetry & Distributed WebSocket Node"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Description & Architecture</label>
                <textarea
                  rows={3}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Describe the problem, target users, technical architecture, and expected sprint deliverables..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={projectGithub}
                    onChange={(e) => setProjectGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={projectLive}
                    onChange={(e) => setProjectLive(e.target.value)}
                    placeholder="https://demo.app.campus/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={projectTags}
                  onChange={(e) => setProjectTags(e.target.value)}
                  placeholder="e.g. React 19, Tailwind CSS v4, WebSockets, Python, PyTorch"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Cover Image & Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Project Cover Image / Architecture Screenshot
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    { name: "⚡ Multi-Agent Glass Canvas", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80" },
                    { name: "🎨 UI Component System", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&h=600&q=80" },
                    { name: "🤖 Telemetry Bench Sensor", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&h=600&q=80" },
                    { name: "🚀 Fullstack Seed Showcase", url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&h=600&q=80" },
                  ].map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setProjectCoverImage(p.url)}
                      className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                        projectCoverImage === p.url
                          ? "bg-amber-50 border-amber-400 font-black text-amber-950"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="text-[11px] truncate block font-bold">{p.name}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={projectCoverImage}
                  onChange={(e) => setProjectCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              {projectCoverImage && (
                <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
                  <img src={projectCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-[10px]">
                    Cover Preview
                  </div>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Assigned Squad: <strong>{clan.leaderName}</strong> & <strong>{clan.coLeaderName || "Riya Malhotra"}</strong></span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active Sprint
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
                >
                  Launch Clan Project →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 3: ADD PROJECT MILESTONE UPDATE (/update/)
        ================================================================
      */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Post Sprint Milestone Update</h3>
                  <p className="text-xs text-slate-500 font-medium font-mono">
                    POST /project/{showUpdateModal}/update/
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUpdateModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Development Phase Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Development Phase / Timeline Sprint
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Phase 1: Architecture & Setup",
                    "Sprint 2: WebSocket Integration",
                    "Sprint 3: Stress Testing & Benchmarks",
                    "Phase 4: Production Demo Launch",
                  ].map((ph) => (
                    <button
                      key={ph}
                      type="button"
                      onClick={() => setUpdatePhase(ph)}
                      className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                        updatePhase === ph
                          ? "bg-amber-50 border-amber-400 font-black text-amber-950"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="text-[11px] block">{ph}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Milestone Headline
                </label>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="e.g. WebSocket latency bench passed 60 FPS"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Changelog & Technical Deliverables
                </label>
                <textarea
                  rows={4}
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  placeholder="Describe technical changes made, benchmarks verified, libraries upgraded, and next sprint goals..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddProjectUpdate(showUpdateModal)}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
                >
                  Post Milestone Update →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 4: DIRECT STUDENT INVITATION MODAL (/clan/<name>/invite/)
        ================================================================
      */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">✉️</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Direct Student Invitation</h3>
                  <p className="text-xs text-slate-500 font-medium">Recruit campus talent into {clan.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendDirectInvite} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Student from Campus Directory
                </label>
                <select
                  value={selectedInviteStudentId}
                  onChange={(e) => {
                    setSelectedInviteStudentId(e.target.value)
                    if (e.target.value) setInviteCustomName("")
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Choose from active campus students --</option>
                  {ALL_STUDENT_PROFILES.filter((s) => s.id !== currentUserId).map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.name} ({stu.branch} · {stu.year}) - Clan: {stu.clanName || "None"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Student Card Preview */}
              {selectedInviteStudentId && (() => {
                const stu = ALL_STUDENT_PROFILES.find((s) => s.id === selectedInviteStudentId)
                if (!stu) return null
                return (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/80 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                      {stu.initials}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-black text-slate-900">{stu.name}</strong>
                        <span className="text-[10px] text-slate-500 font-semibold">{stu.department}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{stu.roleTitle}</p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {stu.skills.slice(0, 3).map((sk) => (
                          <span key={sk.id} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-amber-200 text-slate-700">
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Or Enter Custom Student Name / Roll No / Email
                </label>
                <input
                  type="text"
                  value={inviteCustomName}
                  onChange={(e) => {
                    setInviteCustomName(e.target.value)
                    if (e.target.value) setSelectedInviteStudentId("")
                  }}
                  placeholder="e.g. Priyanshu Sharma or 22BCSE102"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Clan Rank & Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-400"
                >
                  <option value="Member">👤 Member (Standard clan contributor)</option>
                  <option value="Elder">🛡️ Elder (Senior member with review privileges)</option>
                  {isLeaderOrCoLeader && <option value="Co-Leader">⭐ Co-Leader (Recruitments, events & announcements)</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Personalized Pitch / Invitation Message
                </label>
                <textarea
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="e.g. We were impressed with your autonomous rover frontend repo and would love to have you anchor our upcoming hackathon team!"
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedInviteStudentId && !inviteCustomName.trim()}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400"
                >
                  Send Clan Invitation →
                </button>
              </div>
            </form>
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
                <button
                  type="button"
                  onClick={() => setShowRecruitmentModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!recTitle.trim()) return
                    const skillsList = recSkills.split(",").map((s) => s.trim()).filter(Boolean)
                    const newRec: ClanRecruitmentItem = {
                      id: `rec-${Date.now()}`,
                      clanId: clan.id,
                      clanName: clan.name,
                      title: recTitle.trim(),
                      description: recDesc.trim(),
                      requiredSkills: skillsList.length > 0 ? skillsList : ["Software Engineering"],
                      deadline: "Open until filled",
                      applicantsCount: 0,
                      status: "open",
                      createdAt: "Just now",
                    }
                    try {
                      await djangoApi.recruitments.createClanRecruitment(clan.name, newRec)
                    } catch {}
                    setRecruitments([newRec, ...recruitments])
                    setShowRecruitmentModal(false)
                    setRecTitle("")
                    setRecDesc("")
                    setRecSkills("")
                    showToast(`✓ New recruitment opening "${newRec.title}" published (/clan/${clan.name}/recruitment/create/)!`)
                  }}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
                >
                  Publish Opening →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 5B: APPLY TO CLAN RECRUITMENT VACANCY (/recruitment/<id>/apply/)
        ================================================================
      */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🤝</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Apply to {clan.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Position: <span className="font-bold text-slate-800">{showApplyModal.title}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitApply} className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/60 space-y-1">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Role Specifications</span>
                <p className="text-xs text-slate-700 font-medium">{showApplyModal.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {showApplyModal.requiredSkills.map((sk) => (
                    <span key={sk} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-amber-200 text-slate-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Pitch & Contribution Note
                </label>
                <textarea
                  rows={4}
                  required
                  value={applyPitch}
                  onChange={(e) => setApplyPitch(e.target.value)}
                  placeholder="Explain why you want to join this clan, your relevant project experience, and what you will deliver in upcoming hackathons..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Verified Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={applySkills}
                  onChange={(e) => setApplySkills(e.target.value)}
                  placeholder="e.g. React 19, TypeScript, Tailwind CSS, WebSockets"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApply || !applyPitch.trim()}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer disabled:opacity-50 border border-amber-400"
                >
                  {isSubmittingApply ? "Submitting..." : "Submit Application (/recruitment/apply/) →"}
                </button>
              </div>
            </form>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Co-Leader Name</label>
                  <input
                    type="text"
                    value={editForm.coLeaderName || ""}
                    onChange={(e) => setEditForm({ ...editForm, coLeaderName: e.target.value })}
                    placeholder="e.g. Riya Malhotra"
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

      {/* 
        ================================================================
        MODAL 7: VIEW RECRUITMENT APPLICANTS MODAL (Backend Feature)
        ================================================================
      */}
      {showApplicantsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-base font-black text-slate-900">
                    Candidate Applications
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Review student pitches for open role: <strong>{recruitments.find((r) => r.id === showApplicantsModal)?.title}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApplicantsModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {(applicantsList[showApplicantsModal] || []).length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-semibold">
                  <span className="text-2xl block mb-2">📋</span>
                  No pending candidate applications for this role yet.
                </div>
              ) : (
                (applicantsList[showApplicantsModal] || []).map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <strong className="text-sm font-black text-slate-900 block">{app.name}</strong>
                        <span className="text-[11px] text-slate-500 font-semibold">{app.branch} · Applied {app.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                        Applicant
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
                      "{app.note}"
                    </p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {app.skills.map((sk) => (
                          <span key={sk} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleRejectApplicant(showApplicantsModal, app.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptApplicant(showApplicantsModal, app.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs cursor-pointer"
                      >
                        ✓ Accept to Clan
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowApplicantsModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white cursor-pointer"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 8: LEADERSHIP TRANSFER SAFEGUARD MODAL
        ================================================================
      */}
      {transferLeaderTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-amber-300 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
                👑
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Transfer Clan Leadership?</h3>
                <p className="text-xs text-slate-500 font-medium">To {transferLeaderTarget.name}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1.5 font-medium">
              <p className="font-bold flex items-center gap-1.5">
                <span>⚠️</span> Irreversible Administrative Transfer
              </p>
              <p className="text-[11px] leading-relaxed">
                Assigning <strong>{transferLeaderTarget.name}</strong> as <strong>Leader</strong> will transfer complete ownership and control of <strong>{clan.name}</strong> (/clan/{clan.name}/change-role/).
                Your personal rank will automatically transition to <strong>Co-Leader</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setTransferLeaderTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLeadershipTransfer}
                style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                className="px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
              >
                Confirm & Transfer Leadership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 9: REMOVE MEMBER (KICK) MODAL (/clan/<name>/remove-member/)
        ================================================================
      */}
      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-rose-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-xl">
                🚪
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Remove Member from Clan</h3>
                <p className="text-xs text-slate-500 font-medium">Kick from {clan.name} roster</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-xs font-black text-slate-900 block">{memberToRemove.name}</strong>
                <span className="text-[11px] text-slate-500 font-medium">{memberToRemove.branch} · {memberToRemove.year}</span>
              </div>
              {getRoleBadge(memberToRemove.role)}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Reason for Removal (/clan/{clan.name}/remove-member/):
              </label>
              <select
                value={removeReason}
                onChange={(e) => setRemoveReason(e.target.value)}
                className="w-full p-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-rose-400"
              >
                <option value="Inactive in clan sprints">Inactive in clan sprints & hackathons</option>
                <option value="Violated code of conduct">Violated team communication conduct</option>
                <option value="Project commitment unmet">Project commitments left incomplete</option>
                <option value="Mutual agreement to transfer">Mutual agreement to switch clans</option>
              </select>
            </div>

            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              This student will be removed from internal clan projects, announcements, and team permissions immediately.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveMember}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-95 cursor-pointer"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 10: LEAVE CLAN CONFIRMATION MODAL (/clan/<name>/request-leave/)
        ================================================================
      */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
                🚪
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Leave {clan.name}?</h3>
                <p className="text-xs text-slate-500 font-medium">Voluntary departure (/clan/{clan.name}/request-leave/)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Are you sure you want to depart from <strong>{clan.name}</strong>? You will lose access to internal sprints, private hackathon boards, and milestone rewards.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLeaveClan}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-95 cursor-pointer"
              >
                Confirm & Leave Clan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 11: LEADER LEAVE RESTRICTION WARNING MODAL
        ================================================================
      */}
      {leaderLeaveWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-amber-300 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
                👑
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Leadership Transfer Required</h3>
                <p className="text-xs text-slate-500 font-medium">Clan Leader Departure Policy</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1.5 font-medium leading-relaxed">
              <p className="font-bold">You are currently the Leader of {clan.name}.</p>
              <p className="text-[11px]">
                To maintain continuity, Clan Leaders cannot abandon a clan without first designating a new Leader. Please promote a Co-Leader or Elder to Leader in the Clan Roster to hand over administrative control.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setLeaderLeaveWarning(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaderLeaveWarning(false)
                  setActiveTab("roster")
                }}
                style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                className="px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400"
              >
                Go to Clan Roster →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL 12: CLAN HIERARCHY & ROLES PERMISSIONS MATRIX MODAL
        ================================================================
      */}
      {showPermissionsMatrix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Clan Hierarchy & Permissions Matrix</h3>
                  <p className="text-xs text-slate-500 font-medium">Role access control across {clan.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPermissionsMatrix(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Leader */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👑</span>
                    <strong className="text-sm font-black text-amber-950">Leader</strong>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Full Administrative Control
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Has complete authority over clan governance, operations, and settings:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                  <li>Edit clan name, banner, description & domain focus speciality</li>
                  <li>Promote or demote members across all tiers (/clan/&lt;name&gt;/change-role/)</li>
                  <li>Transfer clan leadership to any active member</li>
                  <li>Remove / kick any member from clan roster (/clan/&lt;name&gt;/remove-member/)</li>
                  <li>Directly invite students and manage recruitment applications</li>
                  <li>Create and complete clan projects, post milestone updates & publish stories</li>
                </ul>
              </div>

              {/* Co-Leader */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-300/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <strong className="text-sm font-black text-purple-950">Co-Leader</strong>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                    Equal Leadership Authority
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Shares identical administrative, recruitment, project governance, and roster management powers with Leader:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                  <li>Send direct student invitations (/clan/&lt;name&gt;/invite/) & assign ranks</li>
                  <li>Review, accept, or decline incoming join requests and candidate applications</li>
                  <li>Publish new clan recruitment openings (/clan/&lt;name&gt;/recruitment/create/)</li>
                  <li>Create, edit, and complete clan collaborative projects & post sprint milestones</li>
                  <li>Post official clan announcements, social feed updates, and 24-hour clan stories</li>
                  <li>Promote/demote members across roster tiers & remove members from clan</li>
                  <li>Edit clan profile, domain speciality, description, and branding</li>
                </ul>
              </div>

              {/* Elder */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-300/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <strong className="text-sm font-black text-blue-950">Elder</strong>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-200 text-blue-900">
                    Senior Member Permissions
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Experienced contributor driving architectural execution and mentoring:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                  <li>Senior badge status across campus leaderboard and clan roster</li>
                  <li>Review incoming candidate applications and provide evaluation notes</li>
                  <li>Create and push updates to internal clan projects & sprint milestones</li>
                  <li>Eligible for succession to Co-Leader or Leader</li>
                </ul>
              </div>

              {/* Member */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <strong className="text-sm font-black text-slate-900">Member</strong>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                    Standard Clan Contributor
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Dedicated clan engineer contributing to team goals and competitions:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside font-medium">
                  <li>Assigned to hackathon projects and sprint repositories</li>
                  <li>Participate in internal clan discussions and sprint reviews</li>
                  <li>Contribute to team trophies, sprint velocity, and skill rankings</li>
                  <li>Can request voluntary departure (/clan/&lt;name&gt;/request-leave/)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowPermissionsMatrix(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
