import React, { useState } from "react"
import { djangoApi } from "@/services/djangoApi"
import { ProjectItem } from "@/types"

export interface SocialLinks {
  instagram: string
  youtube: string
  github: string
  linkedin: string
}

export interface ProfileData {
  name: string
  email: string
  department: string
  branch: string
  aboutMe: string
  avatarUrl?: string
  bannerUrl?: string
  initials: string
  roleTitle: string
  clanName: string
  clanTier: string
  year: string
  studentId: string
  gpa: string
  location: string
  joinedDate: string
  socialLinks: SocialLinks
}

export interface SkillItem {
  id: string
  name: string
  category: "Frontend" | "Backend" | "Design" | "Tools & DevOps"
  isTopDisplayed: boolean
}

const INITIAL_PERSONAL_PROJECTS: ProjectItem[] = [
  {
    id: "sp-1",
    title: "DevMatch - Peer Mentorship Network",
    description: "An intelligent student pairing platform matching senior engineers with 1st-year developers based on programming interests and hackathon tracks.",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    status: "in_progress",
    isClanProject: false,
    ownerName: "Aarav Khanna",
    githubLink: "https://github.com/aaravkhanna/devmatch",
    liveLink: "https://devmatch.campusclans.edu",
    updates: [
      { id: "spu-1", title: "Version 1.0 Release", content: "Shipped core pairing algorithm and interactive mentor cards.", createdAt: "3 days ago" },
    ],
    createdAt: "October 2026",
  },
  {
    id: "sp-2",
    title: "KaTeX Math Equation Playground",
    description: "Real-time LaTeX formula renderer and live math editor built with React and Tailwind CSS v4.",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    status: "completed",
    isClanProject: false,
    ownerName: "Aarav Khanna",
    githubLink: "https://github.com/aaravkhanna/katex-playground",
    updates: [
      { id: "spu-2", title: "Passed Full Unit Tests", content: "Benchmarked rendering speed across 200 simultaneous complex KaTeX formulas.", createdAt: "Last week" },
    ],
    createdAt: "September 2026",
  },
]

export interface PostItem {
  id: string
  authorName: string
  authorAvatar: string
  authorInitials: string
  authorRole: string
  clanName: string
  timestamp: string
  content: string
  imageUrl?: string
  tags: string[]
  likesCount: number
  isLiked: boolean
  commentsCount: number
  sharesCount: number
}

// Initial Mock Profile Data
const initialProfile: ProfileData = {
  name: "Aarav Khanna",
  email: "aarav.k@campus.edu",
  department: "School of Engineering & Applied Sciences",
  branch: "B.Tech - Computer Science & Engineering",
  aboutMe:
    "Passionate full-stack engineer and UI/UX architect obsessed with crafting intuitive, lightning-fast digital experiences. Currently leading frontend architecture for campus clan projects and competing in national hackathons across India. When I'm not designing responsive interfaces in React and Tailwind CSS, you'll find me experimenting with generative AI agents, mentoring junior developers in campus workshops, and engineering real-time telemetry dashboards for autonomous robotics. Always looking to connect with ambitious designers, systems hackers, and visionary student founders to build products that solve real campus and industry problems.",
  avatarUrl: "",
  bannerUrl: "",
  initials: "AK",
  roleTitle: "Lead Frontend Architect & UI/UX Designer",
  clanName: "Pixel Pirates",
  clanTier: "Tier 1: Elite",
  year: "3rd Year (Class of 2027)",
  studentId: "CC-2023-CS-0842",
  gpa: "9.2 / 10.0",
  location: "Main Campus, Block C",
  joinedDate: "August 2023",
  socialLinks: {
    github: "https://github.com/aaravkhanna",
    instagram: "https://instagram.com/aarav.khanna",
    youtube: "https://youtube.com/@aaravkhanna",
    linkedin: "https://linkedin.com/in/aaravkhanna",
  },
}

const initialSkills: SkillItem[] = [
  { id: "1", name: "React.js", category: "Frontend", isTopDisplayed: true },
  { id: "2", name: "TypeScript", category: "Frontend", isTopDisplayed: true },
  { id: "3", name: "Tailwind CSS v4", category: "Frontend", isTopDisplayed: true },
  { id: "4", name: "Figma & Prototyping", category: "Design", isTopDisplayed: true },
  { id: "5", name: "UI/UX Architecture", category: "Design", isTopDisplayed: true },
  { id: "6", name: "Next.js", category: "Frontend", isTopDisplayed: true },
  { id: "7", name: "Design Systems", category: "Design", isTopDisplayed: false },
  { id: "8", name: "Node.js & Express", category: "Backend", isTopDisplayed: false },
  { id: "9", name: "Python & PyTorch", category: "Backend", isTopDisplayed: false },
  { id: "10", name: "PostgreSQL", category: "Backend", isTopDisplayed: false },
  { id: "11", name: "Git & GitHub Actions", category: "Tools & DevOps", isTopDisplayed: false },
  { id: "12", name: "Docker & Containers", category: "Tools & DevOps", isTopDisplayed: false },
  { id: "13", name: "REST & WebSockets", category: "Backend", isTopDisplayed: false },
]

// Posts authored specifically by Aarav Khanna (User's own posts)
const initialPosts: PostItem[] = [
  {
    id: "post-1",
    authorName: "Aarav Khanna",
    authorAvatar: "",
    authorInitials: "AK",
    authorRole: "Lead Frontend · Pixel Pirates",
    clanName: "Pixel Pirates",
    timestamp: "Yesterday at 4:30 PM",
    content:
      "🎨 Proud to announce our new open-source project: Campus Clans Glassmorphic UI Kit v2! Built with React 19, Tailwind CSS v4, and KaTeX math rendering. Includes 3D convex card carousels, responsive bottom sheets, and dark executive palettes. Documentation is live on GitHub.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80",
    tags: ["DesignSystems", "React19", "TailwindCSS", "OpenSource"],
    likesCount: 84,
    isLiked: false,
    commentsCount: 22,
    sharesCount: 19,
  },
  {
    id: "post-2",
    authorName: "Aarav Khanna",
    authorAvatar: "",
    authorInitials: "AK",
    authorRole: "Lead Frontend · Pixel Pirates",
    clanName: "Pixel Pirates",
    timestamp: "3 days ago",
    content:
      "🏆 Huge milestone for our clan! Our autonomous telemetry dashboard secured 1st Place at North India Hackfest 2026. Zero latency websocket streaming with 60 FPS real-time telemetry graphs. Massive shoutout to the entire team for the 36-hour sprint!",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=600&q=80",
    tags: ["Hackfest2026", "WebSockets", "Telemetry", "PixelPirates"],
    likesCount: 67,
    isLiked: false,
    commentsCount: 18,
    sharesCount: 11,
  },
  {
    id: "post-3",
    authorName: "Aarav Khanna",
    authorAvatar: "",
    authorInitials: "AK",
    authorRole: "Lead Frontend · Pixel Pirates",
    clanName: "Pixel Pirates",
    timestamp: "5 days ago",
    content:
      "💡 Mentoring 40+ junior developers this Saturday on campus in Block C! We'll cover building modern component libraries with Tailwind CSS v4, TypeScript generics, and glassmorphic micro-interactions. Bring your laptops!",
    tags: ["Workshop", "Mentorship", "Frontend", "CampusTech"],
    likesCount: 45,
    isLiked: false,
    commentsCount: 12,
    sharesCount: 7,
  },
]

interface ProfileProps {
  onOpenClan?: (clanName: string) => void
}

export default function Profile({ onOpenClan }: ProfileProps = {}) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills)
  const [posts, setPosts] = useState<PostItem[]>(initialPosts)

  // Show More / Show Less for Skills: show top 6 by default
  const [showAllSkills, setShowAllSkills] = useState(false)
  const TOP_SKILLS_LIMIT = 6

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ProfileData>(initialProfile)
  const [wordCountWarning, setWordCountWarning] = useState("")

  // New Skill Input State
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem["category"]>("Frontend")

  // Create Post Modal State
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostTags, setNewPostTags] = useState("")
  const [newPostImageUrl, setNewPostImageUrl] = useState("")

  // Personal Projects State (from Django backend: StudentProject & StudentProjectUpdate)
  const [personalProjects, setPersonalProjects] = useState<ProjectItem[]>(INITIAL_PERSONAL_PROJECTS)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProjTitle, setNewProjTitle] = useState("")
  const [newProjDesc, setNewProjDesc] = useState("")
  const [newProjGithub, setNewProjGithub] = useState("")
  const [newProjLive, setNewProjLive] = useState("")

  const [showAddProjectUpdate, setShowAddProjectUpdate] = useState<string | null>(null)
  const [newUpdateTitle, setNewUpdateTitle] = useState("")
  const [newUpdateContent, setNewUpdateContent] = useState("")

  // Student Clan Seeking State (from Django backend: StudentClanRecruitment)
  const [isOpenForRecruitment, setIsOpenForRecruitment] = useState(true)

  const handleCreatePersonalProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjTitle.trim()) return
    const newProj: ProjectItem = {
      id: `sp-${Date.now()}`,
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      status: "in_progress",
      isClanProject: false,
      ownerName: profile.name,
      githubLink: newProjGithub.trim() || undefined,
      liveLink: newProjLive.trim() || undefined,
      updates: [{ id: `spu-${Date.now()}`, title: "Project Initialized", content: "Architecture draft and repo established.", createdAt: "Just now" }],
      createdAt: "October 2026",
    }
    setPersonalProjects([newProj, ...personalProjects])
    djangoApi.projects.createPersonalProject(newProj).catch(() => {})
    setShowAddProject(false)
    setNewProjTitle("")
    setNewProjDesc("")
    setNewProjGithub("")
    setNewProjLive("")
  }

  const handleAddPersonalProjectUpdate = (projectId: string) => {
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) return
    setPersonalProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            updates: [
              {
                id: `spu-${Date.now()}`,
                title: newUpdateTitle.trim(),
                content: newUpdateContent.trim(),
                createdAt: "Just now",
              },
              ...p.updates,
            ],
          }
        }
        return p
      })
    )
    djangoApi.projects.addPersonalProjectUpdate(projectId, { title: newUpdateTitle, content: newUpdateContent }).catch(() => {})
    setShowAddProjectUpdate(null)
    setNewUpdateTitle("")
    setNewUpdateContent("")
  }

  const handleCompletePersonalProject = (projectId: string | number) => {
    setPersonalProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: "completed" } : p))
    )
    djangoApi.projects.completePersonalProject(projectId).catch(() => {})
  }

  const handleDeletePersonalProject = (projectId: string | number) => {
    setPersonalProjects((prev) => prev.filter((p) => p.id !== projectId))
    djangoApi.projects.deletePersonalProject(projectId).catch(() => {})
  }

  // Calculate Word Count for About Me
  const countWords = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0
  }

  // Handle Avatar file selection from computer
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfile((prev) => ({ ...prev, avatarUrl: result }))
        setEditForm((prev) => ({ ...prev, avatarUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Banner file selection from computer
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfile((prev) => ({ ...prev, bannerUrl: result }))
        setEditForm((prev) => ({ ...prev, bannerUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Django Email Change OTP State
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false)
  const [emailOtp, setEmailOtp] = useState("")
  const [emailOtpError, setEmailOtpError] = useState("")
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false)
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false)

  // Handle Edit Form Change with 150-word validation
  const handleAboutMeChange = (text: string) => {
    const words = countWords(text)
    if (words > 150) {
      setWordCountWarning(`Word limit exceeded: ${words} / 150 words. Please shorten your bio.`)
    } else {
      setWordCountWarning("")
    }
    setEditForm((prev) => ({ ...prev, aboutMe: text }))
  }

  // Execute actual profile update with Django backend
  const executeProfileUpdate = async (updatedData: ProfileData) => {
    const computedInitials = updatedData.name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase()

    const finalProfile = {
      ...updatedData,
      initials: computedInitials || updatedData.initials,
    }

    setProfile(finalProfile)
    setIsEditing(false)

    try {
      const formData = new FormData()
      formData.append("name", finalProfile.name)
      formData.append("email", finalProfile.email)
      formData.append("department", finalProfile.department)
      formData.append("branch", finalProfile.branch)
      formData.append("about_me", finalProfile.aboutMe)
      formData.append("github", finalProfile.socialLinks.github)
      formData.append("linkedin", finalProfile.socialLinks.linkedin)
      formData.append("instagram", finalProfile.socialLinks.instagram)
      formData.append("youtube", finalProfile.socialLinks.youtube)
      if (finalProfile.avatarUrl) formData.append("avatar_url", finalProfile.avatarUrl)
      if (finalProfile.bannerUrl) formData.append("banner_url", finalProfile.bannerUrl)

      await djangoApi.profile.editProfile(formData)
    } catch {
      // Offline fallback already updated local state
    }
  }

  // Save Edit Profile (initiates email OTP if email changed)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const words = countWords(editForm.aboutMe)
    if (words > 150) {
      alert("About Me exceeds the 150-word maximum. Please trim your text.")
      return
    }

    // Check if campus email has been modified — if so, Django requires OTP verification
    if (editForm.email.trim().toLowerCase() !== profile.email.trim().toLowerCase()) {
      setIsSendingEmailOtp(true)
      try {
        await djangoApi.profile.sendEmailChangeOtp(editForm.email.trim())
        setShowEmailOtpModal(true)
        return
      } catch (err: any) {
        alert(err.message || "Failed to dispatch email verification OTP.")
        return
      } finally {
        setIsSendingEmailOtp(false)
      }
    }

    await executeProfileUpdate(editForm)
  }

  // Verify Email Change OTP & Commit Profile
  const handleVerifyEmailChangeOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailOtp.trim() || emailOtp.trim().length < 6) {
      setEmailOtpError("Please enter the 6-digit OTP sent to your new email.")
      return
    }

    setIsVerifyingEmailOtp(true)
    setEmailOtpError("")
    try {
      const res = await djangoApi.profile.verifyEmailChangeOtp(editForm.email.trim(), emailOtp.trim())
      if (res.error) {
        setEmailOtpError(res.error)
        setIsVerifyingEmailOtp(false)
        return
      }
      setShowEmailOtpModal(false)
      setEmailOtp("")
      await executeProfileUpdate(editForm)
    } catch (err: any) {
      setEmailOtpError(err.message || "Invalid OTP entered.")
    } finally {
      setIsVerifyingEmailOtp(false)
    }
  }

  // Add a New Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkillName.trim()) return

    const newSkill: SkillItem = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory,
      isTopDisplayed: true,
    }

    setSkills((prev) => [newSkill, ...prev])
    setNewSkillName("")
    setShowAddSkill(false)
  }

  // Toggle Like / Unlike on a post (Interactivity at the bottom of the post)
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1,
          }
        }
        return p
      })
    )
  }

  // Delete Post handler
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  // Handle Create Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim()) return

    const tagsArray = newPostTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)

    const createdPost: PostItem = {
      id: `post-${Date.now()}`,
      authorName: profile.name,
      authorAvatar: profile.avatarUrl || "",
      authorInitials: profile.initials,
      authorRole: profile.roleTitle,
      clanName: profile.clanName,
      timestamp: "Just now",
      content: newPostContent.trim(),
      imageUrl: newPostImageUrl.trim() || undefined,
      tags: tagsArray,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
    }

    setPosts((prev) => [createdPost, ...prev])
    setNewPostContent("")
    setNewPostTags("")
    setNewPostImageUrl("")
    setShowCreatePost(false)
  }

  // Profile shows ONLY user's own posts
  const userPosts = posts.filter((p) => p.authorName === profile.name)

  // Skills to display: top 6 by default, or all if expanded
  const displayedSkills = showAllSkills ? skills : skills.slice(0, TOP_SKILLS_LIMIT)

  return (
    <div className="profile-container max-w-6xl mx-auto space-y-8 pb-16">
      {/* 
        ================================================================
        1. PROFILE INFORMATION
        - Cover Banner (with Change Banner upload)
        - Profile Picture (with Change PFP upload)
        - Full Name
        - Minimal Social Media Handle Buttons
        - Email, Department, Branch, About Me
        ================================================================
      */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl transition-all duration-300">
        {/* Cover Header Graphic with Navy & Amber Ambient Gradients or Custom Banner */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-gradient-to-r from-[#0c1017] via-[#172033] to-[#1e293b] p-6 flex items-start justify-between">
          {/* Custom Banner Image if set */}
          {profile.bannerUrl && (
            <img
              src={profile.bannerUrl}
              alt="Profile Cover Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

          {/* Subtle Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#f5b800 1px, transparent 1px), linear-gradient(90deg, #f5b800 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Top Left Slogan Pill */}
          <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f5b800]" />
            <span>Campus Clans · Student Profile</span>
          </div>

          {/* Top Right Action Buttons: My Clan + Change Banner + Edit Profile */}
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            {/* My Clan Button */}
            <button
              type="button"
              onClick={() => onOpenClan?.(profile.clanName || "Pixel Pirates")}
              style={{ backgroundColor: "#f5b800", color: "#0f172a", borderColor: "#f5b800" }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border"
              title="View your official Clan Profile"
            >
              <span className="text-sm">🛡️</span>
              <span style={{ color: "#0f172a", fontWeight: 900 }}>
                My Clan: {profile.clanName || "Pixel Pirates"}
              </span>
            </button>

            {/* Change Banner Button */}
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>Change Banner</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerFileUpload}
              />
            </label>

            {/* Edit Profile Button */}
            <button
              type="button"
              onClick={() => {
                setEditForm(profile)
                setIsEditing(true)
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-md shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Card Main Body */}
        <div className="relative px-6 sm:px-10 pb-8 pt-0">
          {/* Avatar, Name, and Minimal Social Media Handles */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 mb-6">
            {/* Profile Picture (PFP) with Change Photo capability */}
            <div className="relative -mt-16 sm:-mt-20 z-20 shrink-0 group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 p-1.5 shadow-2xl shadow-amber-500/20 ring-4 ring-white relative overflow-hidden">
                <div className="w-full h-full rounded-[14px] bg-[#172033] flex items-center justify-center text-amber-300 font-black text-3xl sm:text-4xl tracking-tighter shadow-inner border-2 border-slate-900 overflow-hidden relative">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{profile.initials}</span>
                  )}
                </div>

                {/* Hover Camera Overlay to Change Profile Picture */}
                <label
                  className="absolute inset-1.5 rounded-[14px] bg-slate-950/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-bold cursor-pointer transition-opacity duration-200 backdrop-blur-xs text-center p-1"
                  title="Upload Profile Picture"
                >
                  <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Upload PFP</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileUpload}
                  />
                </label>
              </div>

              {/* Online Status Dot */}
              <div
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-md flex items-center justify-center z-10"
                title="Online on campus network"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* User Name & Minimal Social Media Handles */}
            <div className="pt-2 sm:pt-4 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {profile.name}
                </h1>
                <button
                  type="button"
                  onClick={() => onOpenClan?.(profile.clanName || "Pixel Pirates")}
                  style={{ backgroundColor: "#fef3c7", borderColor: "#f59e0b" }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-amber-900 text-xs font-black hover:bg-amber-100 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="View Clan Profile"
                >
                  <span className="text-sm">🛡️</span>
                  <span>{profile.clanName || "Pixel Pirates"}</span>
                  <span className="text-[10px] text-amber-700 underline font-bold">Clan Profile →</span>
                </button>
              </div>

              {/* Minimal Social Media Handle Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* GitHub */}
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 border border-slate-200 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                    title="GitHub Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}

                {/* Instagram (IG) */}
                {profile.socialLinks?.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 border border-slate-200 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                    title="Instagram Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                )}

                {/* YouTube (YT) */}
                {profile.socialLinks?.youtube && (
                  <a
                    href={profile.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 border border-slate-200 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                    title="YouTube Channel"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>YouTube</span>
                  </a>
                )}

                {/* LinkedIn */}
                {profile.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 border border-slate-200 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                    title="LinkedIn Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Academic & Contact Attributes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            {/* Email */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Campus Email
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="text-xs sm:text-sm font-extrabold text-slate-800 hover:text-amber-600 transition-colors block truncate"
              >
                {profile.email}
              </a>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Official Academic Address
              </span>
            </div>

            {/* Department */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                </svg>
                Department
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                {profile.department}
              </p>
              <span className="text-[10px] text-slate-500 font-medium block pt-0.5">
                Faculty of Engineering
              </span>
            </div>

            {/* Branch */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Branch
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                {profile.branch}
              </p>
              <span className="text-[10px] text-amber-700 font-bold block pt-0.5">
                {profile.year}
              </span>
            </div>
          </div>

          {/* About Me (150 Words) */}
          <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 via-slate-50 to-white border border-amber-400/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  About Me
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shadow-xs">
                  {countWords(profile.aboutMe)} / 150 Words
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditForm(profile)
                    setIsEditing(true)
                  }}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-800 hover:underline cursor-pointer"
                >
                  Edit Bio
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {profile.aboutMe}
            </p>
          </div>
        </div>
      </section>

      {/* 
        ================================================================
        2. SKILLS SECTION
        - Clean minimal display: ONLY Skill Name & Category
        - Top skills displayed initially with Show More / Show Less toggle
        - Add Skill capability
        ================================================================
      */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Section Heading & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                Competencies & Stack
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-200">
                Total Skills: {skills.length}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
              Technical & Creative Skills
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Verified skills and technical tools in your workflow.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Add Skill Button */}
            <button
              type="button"
              onClick={() => setShowAddSkill(!showAddSkill)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Add Skill Inline Form */}
        {showAddSkill && (
          <form
            onSubmit={handleAddSkill}
            className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300/60 flex flex-wrap items-center gap-3 animate-fade-in"
          >
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Enter skill name (e.g. Next.js, Rust, Docker)..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 text-slate-800"
                autoFocus
              />
            </div>

            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
              <option value="Tools & DevOps">Tools & DevOps</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
            >
              Save Skill
            </button>
            <button
              type="button"
              onClick={() => setShowAddSkill(false)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Displayed Skills Grid: Minimal Card with ONLY Skill Name & Category */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {displayedSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-amber-400/60 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <h4 className="text-sm font-black text-slate-900 leading-snug">
                {skill.name}
              </h4>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1">
                {skill.category}
              </span>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Toggle Button */}
        {skills.length > TOP_SKILLS_LIMIT && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowAllSkills(!showAllSkills)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-800 hover:text-amber-800 font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              {showAllSkills ? (
                <>
                  <span>Show Less Skills</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Show More Skills (+{skills.length - TOP_SKILLS_LIMIT} more)</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* 
        ================================================================
        3. CLAN RECRUITMENT STATUS & AVAILABILITY
        (From Django Backend: StudentClanRecruitment model)
        ================================================================
      */}
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#172033] to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for Clan Recruitments & Hackathon Teams</span>
          </div>
          <h2 className="text-xl font-black text-white font-heading">
            Student Availability & Seeking Profile
          </h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Other campus clan leaders can view your portfolio, send clan invitations, or request to recruit you for upcoming competitive hackathons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const nextState = !isOpenForRecruitment
              setIsOpenForRecruitment(nextState)
              djangoApi.recruitments.createStudentRecruitment({ bio: profile.aboutMe }).catch(() => {})
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              isOpenForRecruitment
                ? "bg-emerald-500 text-white border-emerald-400 shadow-md"
                : "bg-white/10 text-slate-300 border-white/20"
            }`}
          >
            {isOpenForRecruitment ? "✓ Open for Recruits" : "Paused"}
          </button>
        </div>
      </section>

      {/* 
        ================================================================
        4. STUDENT PERSONAL PROJECTS & UPDATES
        (From Django Backend: StudentProject & StudentProjectUpdate models)
        ================================================================
      */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                Personal Engineering Portfolio
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-200">
                {personalProjects.length} Projects
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
              Personal Projects
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Independent builds, research prototypes, and open-source tooling created by you.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddProject(true)}
            style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400 transition-all"
          >
            <span>+ Add Personal Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalProjects.map((proj) => (
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

                <div className="flex items-center gap-1.5">
                  {proj.status !== "completed" && (
                    <button
                      type="button"
                      onClick={() => handleCompletePersonalProject(proj.id)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeletePersonalProject(proj.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Delete Project"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">{proj.description}</p>

              {/* Milestone Updates Timeline */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Milestone Updates ({proj.updates.length})
                  </strong>
                  <button
                    type="button"
                    onClick={() => setShowAddProjectUpdate(String(proj.id))}
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

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                {proj.githubLink ? (
                  <a
                    href={proj.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>GitHub Code</span> ↗
                  </a>
                ) : (
                  <span className="text-slate-400">Private repository</span>
                )}
                {proj.liveLink && (
                  <a
                    href={proj.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Live Demo</span> ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 
        ================================================================
        MODAL: ADD PERSONAL PROJECT
        ================================================================
      */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add Personal Project</h3>
              <button type="button" onClick={() => setShowAddProject(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreatePersonalProject} className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Project Title
                <input
                  type="text"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Queue"
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                  required
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Description
                <textarea
                  rows={3}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Goals, architecture, libraries used..."
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200"
                  required
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-xs font-bold text-slate-700 block">
                  GitHub URL
                  <input
                    type="url"
                    value={newProjGithub}
                    onChange={(e) => setNewProjGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                  />
                </label>
                <label className="text-xs font-bold text-slate-700 block">
                  Live Demo URL
                  <input
                    type="url"
                    value={newProjLive}
                    onChange={(e) => setNewProjLive(e.target.value)}
                    placeholder="https://..."
                    className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddProject(false)} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-sm">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL: ADD PERSONAL PROJECT UPDATE
        ================================================================
      */}
      {showAddProjectUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Post Milestone Update</h3>
              <button type="button" onClick={() => setShowAddProjectUpdate(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Update Title
                <input
                  type="text"
                  value={newUpdateTitle}
                  onChange={(e) => setNewUpdateTitle(e.target.value)}
                  placeholder="e.g. Added JWT Authentication"
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Update Content
                <textarea
                  rows={3}
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  placeholder="Detail what changes were tested and deployed..."
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddProjectUpdate(null)} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100">Cancel</button>
                <button
                  type="button"
                  onClick={() => handleAddPersonalProjectUpdate(showAddProjectUpdate)}
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
        5. USER'S OWN POSTS SECTION
        - Displays ONLY the current user's posts
        - NO likes displayed at the top
        - Top right has clearly legible, high-contrast "+ Create Post" button
        - Like action and count displayed ONLY at the bottom of each post
        - Allows publishing a new post
        ================================================================
      */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header with High-Contrast, Clearly Legible Create Post Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                My Campus Wall
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold border border-slate-200">
                {userPosts.length} Posts
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
              My Posts
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Projects, hackathon highlights, and articles authored by you.
            </p>
          </div>

          {/* New Post Button - Forced High Contrast Amber Button so text is 100% visible */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreatePost(!showCreatePost)}
              style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span style={{ color: "#0f172a", fontWeight: 900 }}>+ Create Post</span>
            </button>
          </div>
        </div>

        {/* Create Post Inline Box */}
        {showCreatePost && (
          <form
            onSubmit={handleCreatePost}
            className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3 animate-fade-in"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Share an update or project showcase with your clan</span>
            </div>
            <textarea
              rows={3}
              placeholder="What are you building or working on? Share project links, updates, or hackathon news..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full p-3 text-xs font-medium rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-amber-500 text-slate-800"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Optional tags (e.g. React, Hackathon, AI)..."
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-amber-500 text-slate-800"
              />
              <input
                type="url"
                placeholder="Optional image URL (https://...)..."
                value={newPostImageUrl}
                onChange={(e) => setNewPostImageUrl(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-amber-500 text-slate-800"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreatePost(false)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                className="px-5 py-2 rounded-xl font-black text-xs cursor-pointer shadow-sm hover:brightness-105 active:scale-95"
              >
                Publish Post
              </button>
            </div>
          </form>
        )}

        {/* User's Posts Feed */}
        <div className="space-y-5">
          {userPosts.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span className="text-3xl block mb-2">📝</span>
              <h3 className="text-sm font-bold text-slate-800">You haven't published any posts yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Click "+ Create Post" above to share your projects and updates with campus members!
              </p>
            </div>
          ) : (
            userPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Author Header (Always Current User) with clear Delete action on top right */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs border border-white">
                      {post.authorInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-slate-900">
                          {post.authorName}
                        </strong>
                        {post.clanName && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            {post.clanName}
                          </span>
                        )}
                      </div>
                      <small className="text-[11px] text-slate-500 font-medium">
                        {post.authorRole} · {post.timestamp}
                      </small>
                    </div>
                  </div>

                  {/* Clearly visible Delete Post button */}
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    title="Delete this post"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {post.content}
                </p>

                {/* Optional Media Image */}
                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden aspect-[21/9] sm:aspect-[2/1] bg-slate-900 border border-slate-100">
                    <img
                      src={post.imageUrl}
                      alt="Post visual"
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Footer Action Bar: LIKES DISPLAYED EXCLUSIVELY HERE AT THE BOTTOM OF THE POST */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-4">
                    {/* Like Button & Counter (At the bottom of post) */}
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer active:scale-95 ${
                        post.isLiked
                          ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 bg-white"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          post.isLiked ? "fill-rose-500 text-rose-500 scale-110" : "fill-none stroke-current"
                        }`}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{post.likesCount} {post.isLiked ? "Liked" : "Like"}</span>
                    </button>

                    {/* Comments Button */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>{post.commentsCount} Comments</span>
                    </button>
                  </div>

                  {/* Share Button */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* 
        ================================================================
        EDIT PROFILE MODAL
        Allows user to edit PFP, Banner, Name, Social Links, Email, Department, Branch, About Me
        ================================================================
      */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Profile Information</h3>
                <p className="text-xs text-slate-500 font-medium">Update your student profile, banner, and social handles</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4">
              {/* Profile Picture & Cover Banner Section */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block">
                  Profile Images (Upload or URL)
                </span>
                
                {/* Avatar / PFP upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Profile Picture (PFP)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-300 font-black flex items-center justify-center overflow-hidden border border-amber-300 shrink-0">
                      {editForm.avatarUrl ? (
                        <img src={editForm.avatarUrl} alt="PFP Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span>{editForm.initials}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                        <span>Choose PFP File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setEditForm((prev) => ({ ...prev, avatarUrl: reader.result as string }))
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Or paste PFP image URL..."
                        value={editForm.avatarUrl || ""}
                        onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                        className="w-full px-3 py-1 text-xs rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Banner upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cover Banner
                  </label>
                  <div className="space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      <span>Choose Banner File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setEditForm((prev) => ({ ...prev, bannerUrl: reader.result as string }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or paste banner image URL..."
                      value={editForm.bannerUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, bannerUrl: e.target.value })}
                      className="w-full px-3 py-1 text-xs rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Minimal Social Media Links Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                  Social Media Links
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">GitHub URL</label>
                    <input
                      type="url"
                      value={editForm.socialLinks?.github || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          socialLinks: { ...editForm.socialLinks, github: e.target.value },
                        })
                      }
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-1.5 text-xs font-medium rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Instagram (IG) URL</label>
                    <input
                      type="url"
                      value={editForm.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          socialLinks: { ...editForm.socialLinks, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/username"
                      className="w-full px-3 py-1.5 text-xs font-medium rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">YouTube (YT) URL</label>
                    <input
                      type="url"
                      value={editForm.socialLinks?.youtube || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          socialLinks: { ...editForm.socialLinks, youtube: e.target.value },
                        })
                      }
                      placeholder="https://youtube.com/@channel"
                      className="w-full px-3 py-1.5 text-xs font-medium rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editForm.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          socialLinks: { ...editForm.socialLinks, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-1.5 text-xs font-medium rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Branch</label>
                  <input
                    type="text"
                    value={editForm.branch}
                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">About Me (Max 150 Words)</label>
                  <span
                    className={`text-[10px] font-extrabold ${
                      countWords(editForm.aboutMe) > 150 ? "text-rose-600" : "text-slate-500"
                    }`}
                  >
                    {countWords(editForm.aboutMe)} / 150 Words
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={editForm.aboutMe}
                  onChange={(e) => handleAboutMeChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  placeholder="Write a concise overview of your ambitions, technical passions, and campus contributions..."
                  required
                />
                {wordCountWarning && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">{wordCountWarning}</p>
                )}
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
                  disabled={countWords(editForm.aboutMe) > 150}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl disabled:opacity-50 font-black text-xs cursor-pointer shadow-sm hover:brightness-105 active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Change OTP Verification Modal (Django Requirement) */}
      {showEmailOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden animate-scale-up p-6 space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-amber-400/20">
                ✉️
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Verify New Campus Email</h3>
              <p className="text-xs text-slate-500 font-medium">
                An OTP was dispatched to <strong>{editForm.email}</strong> by the Django auth server. Please enter the 6-digit code.
              </p>
            </div>

            {emailOtpError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold text-center">
                {emailOtpError}
              </div>
            )}

            <form onSubmit={handleVerifyEmailChangeOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-widest text-2xl font-black py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEmailOtpModal(false)}
                  disabled={isVerifyingEmailOtp}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingEmailOtp || emailOtp.length < 6}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2.5 rounded-xl disabled:opacity-50 font-black text-xs cursor-pointer shadow-sm hover:brightness-105 active:scale-95 flex items-center gap-1.5"
                >
                  {isVerifyingEmailOtp ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify & Save</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
