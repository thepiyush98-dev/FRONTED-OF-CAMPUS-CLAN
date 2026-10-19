import React, { useState, useEffect, useMemo } from "react"
import { djangoApi } from "@/services/djangoApi"
import { ProjectItem } from "@/types"
import {
  ALL_STUDENT_PROFILES,
  getStudentProfileById,
  StudentProfileData,
  SkillItem,
  CAMPUS_SKILLS_DIRECTORY,
} from "@/data/studentProfilesData"
import SkillsSearchHub from "./SkillsSearchHub"

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

export interface ProfileProps {
  onOpenClan?: (clanName: string) => void
  viewStudentId?: string | null
  onBackToOwnProfile?: () => void
  onOpenStudent?: (studentId: string) => void
}

export default function Profile({
  onOpenClan,
  viewStudentId = null,
  onBackToOwnProfile,
  onOpenStudent,
}: ProfileProps) {
  // Current Student ID state (supports viewing other students: /student/<id>/)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(viewStudentId)

  // Sub-Navigation Tab: "portfolio" (Profile) vs "skills-search" (Skills Directory & Peer Search)
  const [activeTab, setActiveTab] = useState<"portfolio" | "skills-search">("portfolio")

  useEffect(() => {
    setSelectedStudentId(viewStudentId)
    if (viewStudentId) {
      setActiveTab("portfolio")
    }
  }, [viewStudentId])

  // Resolve current student data
  const currentStudentData: StudentProfileData = useMemo(() => {
    if (selectedStudentId) {
      const found = getStudentProfileById(selectedStudentId)
      if (found) return found
    }
    return ALL_STUDENT_PROFILES[0] // Default to Aarav Khanna (Own Profile)
  }, [selectedStudentId])

  const isOwnProfile = !selectedStudentId || selectedStudentId === "stu-1"

  // Profile data states
  const [profile, setProfile] = useState<ProfileData>(currentStudentData)
  const [skills, setSkills] = useState<SkillItem[]>(currentStudentData.skills)
  const [personalProjects, setPersonalProjects] = useState<ProjectItem[]>(currentStudentData.projects)

  // Interactive project stars / appreciations count & user toggles
  const [starredProjects, setStarredProjects] = useState<Record<string, number>>({
    "sp-1": 46,
    "sp-2": 32,
    "cp-1": 89,
    "cp-2": 54,
    "sp-3": 38,
    "sp-4": 21,
    "sp-5": 27,
    "sp-6": 35,
  })
  const [userStarred, setUserStarred] = useState<Record<string, boolean>>({})

  const handleToggleStarProject = (projectId: string | number) => {
    const pId = String(projectId)
    const isAlreadyStarred = !!userStarred[pId]
    setUserStarred((prev) => ({ ...prev, [pId]: !isAlreadyStarred }))
    setStarredProjects((prev) => {
      const current = prev[pId] || 20
      return {
        ...prev,
        [pId]: isAlreadyStarred ? Math.max(0, current - 1) : current + 1,
      }
    })
    if (!isAlreadyStarred) {
      showToast("⭐ Added appreciation star to project!")
    }
  }

  // Whenever selectedStudentData changes, sync local state
  useEffect(() => {
    setProfile(currentStudentData)
    setSkills(currentStudentData.skills)
    setPersonalProjects(currentStudentData.projects)
  }, [currentStudentData])

  // Skills Category Filter in Profile
  const [profileSkillCategory, setProfileSkillCategory] = useState<string>("All")
  const [showAllSkills, setShowAllSkills] = useState(false)
  const TOP_SKILLS_LIMIT = 6

  // Edit Profile Modal State (/profile/edit/)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ProfileData>(currentStudentData)
  const [wordCountWarning, setWordCountWarning] = useState("")

  // Add Categorized Skill Modal State
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem["category"]>("Frontend")
  const [newSkillLevel, setNewSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "Expert">("Advanced")

  // Add Project Modal State (with Image upload & URL support)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProjTitle, setNewProjTitle] = useState("")
  const [newProjDesc, setNewProjDesc] = useState("")
  const [newProjGithub, setNewProjGithub] = useState("")
  const [newProjLive, setNewProjLive] = useState("")
  const [newProjCoverImage, setNewProjCoverImage] = useState("")
  const [newProjTags, setNewProjTags] = useState("")

  // Add Project Update Modal State
  const [showAddProjectUpdate, setShowAddProjectUpdate] = useState<string | null>(null)
  const [newUpdateTitle, setNewUpdateTitle] = useState("")
  const [newUpdateContent, setNewUpdateContent] = useState("")

  // Student Clan Recruitment Availability Toggle & Seeking Profile (/student/recruitment/create/)
  const [isOpenForRecruitment, setIsOpenForRecruitment] = useState(true)
  const [showSeekingModal, setShowSeekingModal] = useState(false)
  const [seekingRole, setSeekingRole] = useState("Full-Stack Systems Engineer")
  const [seekingHours, setSeekingHours] = useState("15-20 hrs/week")
  const [seekingSpeciality, setSeekingSpeciality] = useState("Web & Real-Time Dashboards")
  const [seekingBio, setSeekingBio] = useState(
    "Looking for a competitive hackathon clan targeting national sprints. Can deliver high-velocity React 19 frontends, WebSockets telemetry, and Django microservices."
  )
  const [seekingSkills, setSeekingSkills] = useState("React 19, TypeScript, Tailwind CSS, WebSockets")
  const [isPublishingSeeking, setIsPublishingSeeking] = useState(false)

  const handleSaveSeekingProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPublishingSeeking(true)
    const skillsArray = seekingSkills.split(",").map((s) => s.trim()).filter(Boolean)
    try {
      await djangoApi.recruitments.createStudentRecruitment({
        bio: seekingBio.trim(),
        role: seekingRole.trim(),
        hoursPerWeek: seekingHours,
        skills: skillsArray,
      })
    } catch {}

    setIsOpenForRecruitment(true)
    setIsPublishingSeeking(false)
    setShowSeekingModal(false)
    showToast("✓ Availability & pitch published to Campus Clan Scouts (/student/recruitment/create/)!")
  }

  // Pending Clan Invitations
  const [pendingInvitations, setPendingInvitations] = useState([
    {
      id: 101,
      clanName: "Binary Beasts",
      invitedBy: "Devansh Sharma (Leader)",
      role: "Core Systems Engineer",
      sentAt: "Yesterday",
      message: "We need an experienced React & TypeScript lead for our national hackathon team. We'd love to have you!",
    },
    {
      id: 102,
      clanName: "Circuit Crew",
      invitedBy: "Kabir Singh (Leader)",
      role: "UI & Telemetry Architect",
      sentAt: "3 days ago",
      message: "Looking for someone to design real-time drone telemetry dashboards.",
    },
  ])

  // Email Change OTP Verification Modal State (/send-email-change-otp/, /verify-email-change-otp/)
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false)
  const [emailOtp, setEmailOtp] = useState("")
  const [emailOtpError, setEmailOtpError] = useState("")
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false)
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(60)

  // Peer Direct Message Modal (When viewing another student)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [directMsgText, setDirectMsgText] = useState("")

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // OTP Countdown timer effect
  useEffect(() => {
    let timer: any = null
    if (showEmailOtpModal && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showEmailOtpModal, otpCountdown])

  // Count words helper
  const countWords = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0
  }

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

  // Handle Avatar file selection
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfile((prev) => ({ ...prev, avatarUrl: result }))
        setEditForm((prev) => ({ ...prev, avatarUrl: result }))
        showToast("Profile photo updated successfully!")
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Banner file selection
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfile((prev) => ({ ...prev, bannerUrl: result }))
        setEditForm((prev) => ({ ...prev, bannerUrl: result }))
        showToast("Cover banner updated successfully!")
      }
      reader.readAsDataURL(file)
    }
  }

  // Execute Profile Update with Django backend
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
      showToast("Profile details saved successfully!")
    } catch {
      showToast("Profile details saved locally!")
    }
  }

  // Save Edit Profile (initiates email OTP if campus email changed)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const words = countWords(editForm.aboutMe)
    if (words > 150) {
      alert("About Me exceeds the 150-word maximum. Please trim your bio text.")
      return
    }

    // Check if campus email has been modified — if so, security requires OTP verification
    if (editForm.email.trim().toLowerCase() !== profile.email.trim().toLowerCase()) {
      setIsSendingEmailOtp(true)
      try {
        await djangoApi.profile.sendEmailChangeOtp(editForm.email.trim())
        setOtpCountdown(60)
        setEmailOtp("")
        setEmailOtpError("")
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

  // Resend Email Change OTP
  const handleResendEmailOtp = async () => {
    if (otpCountdown > 0) return
    setIsSendingEmailOtp(true)
    try {
      await djangoApi.profile.sendEmailChangeOtp(editForm.email.trim())
      setOtpCountdown(60)
      setEmailOtpError("")
      showToast(`New OTP dispatched to ${editForm.email}`)
    } catch (err: any) {
      setEmailOtpError(err.message || "Failed to resend OTP.")
    } finally {
      setIsSendingEmailOtp(false)
    }
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
      showToast(`🎉 Campus email successfully verified and changed to ${editForm.email}!`)
    } catch (err: any) {
      setEmailOtpError(err.message || "Invalid OTP entered.")
    } finally {
      setIsVerifyingEmailOtp(false)
    }
  }

  // Add Categorized Skill
  const handleAddCategorizedSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkillName.trim()) return

    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      isTopDisplayed: true,
    }

    setSkills((prev) => [newSkill, ...prev])
    setNewSkillName("")
    setShowAddSkillModal(false)
    showToast(`Added ${newSkill.name} to ${newSkill.category} skills!`)
  }

  // Remove Skill tag
  const handleRemoveSkill = (skillId: string, skillName: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== skillId))
    showToast(`Removed skill "${skillName}"`)
  }

  // Accept Clan Invitation
  const handleAcceptInvitation = async (invId: number) => {
    const inv = pendingInvitations.find((i) => i.id === invId)
    if (!inv) return
    try {
      await djangoApi.clans.acceptInvitation(invId)
    } catch {}
    setProfile((prev) => ({ ...prev, clanName: inv.clanName }))
    setPendingInvitations((prev) => prev.filter((i) => i.id !== invId))
    showToast(`🎉 You have officially accepted the invitation and joined ${inv.clanName}!`)
  }

  // Reject Clan Invitation
  const handleRejectInvitation = async (invId: number) => {
    try {
      await djangoApi.clans.rejectInvitation(invId)
    } catch {}
    setPendingInvitations((prev) => prev.filter((i) => i.id !== invId))
    showToast("Clan invitation declined.")
  }

  // Create Personal Project (with Cover Image & Tags)
  const handleCreatePersonalProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjTitle.trim()) return

    const parsedTags = newProjTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)

    const newProj: ProjectItem = {
      id: `sp-${Date.now()}`,
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      coverImage:
        newProjCoverImage.trim() ||
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80",
      status: "in_progress",
      isClanProject: false,
      ownerName: profile.name,
      githubLink: newProjGithub.trim() || undefined,
      liveLink: newProjLive.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : ["Engineering", "OpenSource"],
      updates: [
        {
          id: `spu-${Date.now()}`,
          title: "Project Initialized & Shipped to Portfolio",
          content: "Initial commit, architecture blueprint, and repository deployed.",
          createdAt: "Just now",
        },
      ],
      createdAt: "October 2026",
    }

    setPersonalProjects([newProj, ...personalProjects])
    djangoApi.projects.createPersonalProject(newProj).catch(() => {})
    setShowAddProject(false)
    setNewProjTitle("")
    setNewProjDesc("")
    setNewProjGithub("")
    setNewProjLive("")
    setNewProjCoverImage("")
    setNewProjTags("")
    showToast(`✨ Project "${newProj.title}" added to your portfolio!`)
  }

  // Add Milestone Update to Project (/update/ or POST /project/<id>/update/)
  const handleAddPersonalProjectUpdate = (projectId: string) => {
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) return
    setPersonalProjects((prev) =>
      prev.map((p) => {
        if (String(p.id) === String(projectId)) {
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
    djangoApi.projects.addMilestoneUpdate(projectId, { title: newUpdateTitle, content: newUpdateContent }).catch(() => {})
    setShowAddProjectUpdate(null)
    setNewUpdateTitle("")
    setNewUpdateContent("")
    showToast("✓ Development milestone update logged (/update/)!")
  }

  // Complete / Reopen Project (/complete/ or POST /project/<id>/complete/)
  const handleCompletePersonalProject = (projectId: string | number) => {
    const target = personalProjects.find((p) => String(p.id) === String(projectId))
    const nextStatus = target?.status === "completed" ? ("in_progress" as const) : ("completed" as const)

    setPersonalProjects((prev) =>
      prev.map((p) => (String(p.id) === String(projectId) ? { ...p, status: nextStatus } : p))
    )
    djangoApi.projects.completeProject(projectId, nextStatus).catch(() => {})
    if (nextStatus === "completed") {
      showToast("🏆 Project marked as 'Completed' (/complete/)!")
    } else {
      showToast("⚡ Project reopened for active development sprint!")
    }
  }

  // Delete Project
  const handleDeletePersonalProject = (projectId: string | number) => {
    setPersonalProjects((prev) => prev.filter((p) => String(p.id) !== String(projectId)))
    djangoApi.projects.deletePersonalProject(projectId).catch(() => {})
    showToast("Project removed.")
  }

  // Send Direct Message to other student
  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!directMsgText.trim()) return
    showToast(`✉️ Message sent to ${currentStudentData.name}!`)
    setShowMessageModal(false)
    setDirectMsgText("")
  }

  // Filter skills by profile category
  const filteredSkills = useMemo(() => {
    let list = skills
    if (profileSkillCategory !== "All") {
      list = list.filter((s) => s.category.toLowerCase() === profileSkillCategory.toLowerCase())
    }
    return showAllSkills ? list : list.slice(0, TOP_SKILLS_LIMIT)
  }, [skills, profileSkillCategory, showAllSkills])

  const skillCategories = [
    "All",
    "Frontend",
    "Backend",
    "AI & ML",
    "Design",
    "DevOps & Cloud",
    "Mobile",
    "Cybersecurity",
    "Data Science",
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "bg-blue-50 text-blue-800 border-blue-200"
      case "Backend":
        return "bg-emerald-50 text-emerald-800 border-emerald-200"
      case "AI & ML":
        return "bg-purple-50 text-purple-800 border-purple-200"
      case "Design":
        return "bg-amber-50 text-amber-800 border-amber-200"
      case "DevOps & Cloud":
        return "bg-cyan-50 text-cyan-800 border-cyan-200"
      case "Mobile":
        return "bg-pink-50 text-pink-800 border-pink-200"
      case "Cybersecurity":
        return "bg-rose-50 text-rose-800 border-rose-200"
      case "Data Science":
        return "bg-indigo-50 text-indigo-800 border-indigo-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const categoryPresets: Record<string, string[]> = {
    Frontend: ["React 19", "Tailwind CSS v4", "TypeScript", "Next.js", "Vue.js", "KaTeX & LaTeX", "Three.js"],
    Backend: ["Python & Django", "Node.js & Express", "PostgreSQL", "FastAPI", "Embedded C & IoT", "Go", "Redis"],
    "AI & ML": ["PyTorch", "LLM Agents & LangChain", "Computer Vision", "NLP & Vector DBs", "TensorFlow"],
    Design: ["Figma & Prototyping", "Design Systems", "UI/UX Architecture", "Micro-interactions", "Wireframing"],
    "DevOps & Cloud": ["Docker & Containers", "Git & GitHub Actions", "Linux & Shell Scripting", "Kubernetes", "AWS"],
    Mobile: ["React Native", "Flutter", "Kotlin", "Swift"],
    Cybersecurity: ["Ethical Hacking & Sec", "Network Auditing", "Cryptography", "Penetration Testing"],
    "Data Science": ["Market Research & Analysis", "Financial Modeling", "Pandas & Python", "SQL & BI"],
  }

  return (
    <div className="profile-container max-w-6xl mx-auto space-y-8 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-400/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in font-bold text-xs">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Hub Navigation Switcher: [ 👤 Profile Portfolio ] vs [ 🔍 Skills Directory & Student Search (/skills/) ] */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "portfolio"
                ? "bg-slate-900 text-amber-400 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>👤</span>
            <span>
              {isOwnProfile
                ? "My Profile Portfolio (/profile/)"
                : `Student Profile: ${currentStudentData.name}`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("skills-search")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "skills-search"
                ? "bg-slate-900 text-amber-400 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>🔍</span>
            <span>Skills Directory & Peer Search (/skills/, /search-students/)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!isOwnProfile && (
            <button
              type="button"
              onClick={() => {
                setSelectedStudentId(null)
                onBackToOwnProfile?.()
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Back to My Profile (/profile/)</span>
            </button>
          )}

          {isOwnProfile && activeTab === "portfolio" && (
            <button
              type="button"
              onClick={() => setActiveTab("skills-search")}
              style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
              className="px-4 py-1.5 rounded-xl font-black text-xs shadow-xs hover:brightness-105 active:scale-95 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span>🔍</span>
              <span>Find Students by Skills</span>
            </button>
          )}
        </div>
      </div>

      {/* When Active Tab is Skills Directory & Student Search Hub */}
      {activeTab === "skills-search" && (
        <SkillsSearchHub
          onSelectStudent={(studentId) => {
            setSelectedStudentId(studentId)
            setActiveTab("portfolio")
            onOpenStudent?.(studentId)
          }}
          onBackToProfile={() => {
            setSelectedStudentId(null)
            setActiveTab("portfolio")
          }}
        />
      )}

      {/* When Active Tab is Profile Portfolio */}
      {activeTab === "portfolio" && (
        <>
          {/* Visiting Other Student Profile Notice Banner */}
          {!isOwnProfile && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-slate-900 rounded-3xl border border-amber-400/40 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 font-black text-xl flex items-center justify-center shadow-md">
                  {currentStudentData.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-md">
                      Visiting Student Profile (/student/{currentStudentData.id}/)
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      @{currentStudentData.username}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 leading-tight">
                    {currentStudentData.name} · {currentStudentData.branch}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                >
                  <span>💬 Message</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentId(null)
                    onBackToOwnProfile?.()
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs cursor-pointer shadow-xs active:scale-95"
                >
                  ← My Profile
                </button>
              </div>
            </div>
          )}

          {/* 
            ================================================================
            1. PROFILE INFORMATION HEADER & HERO
            - Cover Banner (with Change Banner upload for own profile)
            - Profile Picture (with Change PFP upload for own profile)
            - Full Name
            - Social Media Links (GitHub, LinkedIn, Instagram, YouTube)
            - Campus Email, Department, Branch, About Me (150 words)
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
                <span>
                  {isOwnProfile ? "Campus Clans · My Profile (/profile/)" : `Student Profile · /student/${profile.studentId || currentStudentData.id}/`}
                </span>
              </div>

              {/* Top Right Action Buttons */}
              <div className="relative z-10 flex flex-wrap items-center gap-2">
                {/* Enrolled Clan Button */}
                <button
                  type="button"
                  onClick={() => onOpenClan?.(profile.clanName || "Pixel Pirates")}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a", borderColor: "#f5b800" }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border"
                  title="View Clan Profile"
                >
                  <span className="text-sm">🛡️</span>
                  <span style={{ color: "#0f172a", fontWeight: 900 }}>
                    Clan: {profile.clanName || "Pixel Pirates"}
                  </span>
                </button>

                {isOwnProfile && (
                  <>
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

                    {/* Edit Profile Button (/profile/edit/) */}
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
                      <span>Edit Profile (/profile/edit/)</span>
                    </button>
                  </>
                )}

                {!isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href)
                      showToast("Student profile link copied to clipboard!")
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-md shadow transition-all cursor-pointer"
                  >
                    <span>🔗 Copy Link</span>
                  </button>
                )}
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

                    {/* Hover Camera Overlay for own profile */}
                    {isOwnProfile && (
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
                    )}
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

                  {/* Social Media Handle Buttons */}
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

                    {/* Instagram */}
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

                    {/* YouTube */}
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
                {/* Campus Email */}
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
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Official Verified Campus Address
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
                    Campus ID: {profile.studentId}
                  </span>
                </div>

                {/* Branch */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    Branch & Year
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                    {profile.branch}
                  </p>
                  <span className="text-[10px] text-amber-700 font-bold block pt-0.5">
                    {profile.year} · GPA: {profile.gpa}
                  </span>
                </div>
              </div>

              {/* About Me (Bio with 150 Words Constraint) */}
              <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 via-slate-50 to-white border border-amber-400/25 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      About Me & Bio
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shadow-xs">
                      {countWords(profile.aboutMe)} / 150 Words
                    </span>
                    {isOwnProfile && (
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
                    )}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {profile.aboutMe}
                </p>
              </div>

              {/* Clan Invitations Received (Own Profile Only) */}
              {isOwnProfile && pendingInvitations.length > 0 && (
                <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-50 border border-amber-400/40 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        📩 Clan Invitations Received ({pendingInvitations.length})
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Clan leaders have sent you official invites to join their engineering rosters:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {pendingInvitations.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 rounded-xl bg-white border border-amber-300/80 shadow-xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                              Invited to Join Clan
                            </span>
                            <button
                              type="button"
                              onClick={() => onOpenClan?.(inv.clanName)}
                              className="group/clan inline-flex items-center gap-1.5 text-left transition-all cursor-pointer"
                              title={`Open ${inv.clanName} Profile`}
                            >
                              <span className="text-base group-hover/clan:scale-125 transition-transform">🛡️</span>
                              <span className="text-sm sm:text-base font-black text-slate-900 group-hover/clan:text-amber-600 underline decoration-amber-400 decoration-2 underline-offset-2 transition-colors">
                                {inv.clanName}
                              </span>
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 transition-colors">
                                <span>Clan Profile</span>
                                <span>↗</span>
                              </span>
                            </button>
                            <span className="text-[11px] text-slate-500 font-semibold block">
                              From: {inv.invitedBy} · {inv.sentAt}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
                            {inv.role}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg leading-relaxed italic border border-slate-100">
                          "{inv.message}"
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleRejectInvitation(inv.id)}
                            className="px-3 py-1 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptInvitation(inv.id)}
                            className="px-3.5 py-1 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs cursor-pointer"
                          >
                            ✓ Accept Invitation
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 
            ================================================================
            2. CATEGORIZED SKILLS SECTION & TAGGING
            - Tagged skills grouped by Category (Frontend, Backend, AI/ML, Design, etc.)
            - Category filter tabs
            - Add Skill Modal with Category selection & Proficiency levels
            - Direct link to /skills/ (Skills Directory)
            ================================================================
          */}
          <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                    Competencies & Categorized Skills
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-200">
                    {skills.length} Skills Tagged
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
                  Verified Technical & Domain Skills
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Categorized skills tagged to this profile with mastery levels and campus directory mapping.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("skills-search")}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  title="Browse full campus skills directory"
                >
                  <span>📚</span>
                  <span>Explore Skills Directory (/skills/)</span>
                </button>

                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setShowAddSkillModal(true)}
                    style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>+ Tag New Skill</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Skills Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Filter by Category:
              </span>
              {skillCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setProfileSkillCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    profileSkillCategory === cat
                      ? "bg-slate-900 text-amber-400 border-slate-900 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Categorized Skills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 hover:shadow-md relative group flex flex-col justify-between ${getCategoryColor(
                    skill.category
                  )}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-wider opacity-75">
                        {skill.category}
                      </span>
                      {isOwnProfile && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.id, skill.name)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity font-bold text-xs"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {skill.name}
                    </h4>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-[10px]">
                    <span className="font-extrabold opacity-80">
                      {skill.level || "Proficient"}
                    </span>
                    <span
                      onClick={() => {
                        setActiveTab("skills-search")
                      }}
                      className="cursor-pointer hover:underline font-bold opacity-60 hover:opacity-100"
                      title="Search students with this skill"
                    >
                      Search ↗
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More / Show Less Toggle Button */}
            {skills.length > TOP_SKILLS_LIMIT && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-800 hover:text-amber-800 font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  {showAllSkills ? "Show Less Skills ↑" : `Show All Skills (+${skills.length - TOP_SKILLS_LIMIT} more) ↓`}
                </button>
              </div>
            )}
          </section>

          {/* 
            ================================================================
            3. STUDENT RECRUITMENT STATUS ("LOOKING FOR CLAN")
            ================================================================
          */}
          <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#172033] to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isOpenForRecruitment ? "Active: Looking for Clan & Hackathons" : "Recruitment Status Paused"}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white font-heading">
                  {isOwnProfile ? "Your Clan Seeking & Hackathon Availability" : `${profile.name}'s Collaboration Status`}
                </h2>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {isOwnProfile
                    ? "Clan Leaders and Co-Leaders scout your verified skill stack to send direct invitations (/student/recruitment/create/)."
                    : `${profile.name} is currently open for clan recruitment invitations and hackathon teams.`}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {isOwnProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowSeekingModal(true)}
                      style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                      className="px-4 py-2 rounded-xl text-xs font-black shadow-md hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400 transition-all"
                      title="Configure your availability and recruiter pitch (/student/recruitment/create/)"
                    >
                      ✏️ Edit Seeking Pitch
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isOpenForRecruitment
                        setIsOpenForRecruitment(nextState)
                        showToast(nextState ? "Availability set to Open" : "Availability paused")
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        isOpenForRecruitment
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30"
                          : "bg-white/10 text-slate-300 border-white/20 hover:bg-white/20"
                      }`}
                    >
                      {isOpenForRecruitment ? "✓ Open" : "Paused"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(true)}
                    style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                    className="px-5 py-2.5 rounded-xl font-black text-xs shadow-md cursor-pointer hover:brightness-105 active:scale-95"
                  >
                    💬 Connect with {profile.name}
                  </button>
                )}
              </div>
            </div>

            {/* Seeking Details Card when Open */}
            {isOpenForRecruitment && (
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-amber-400 font-bold">🎯 Preferred Role:</span>
                    <strong className="text-white font-extrabold">{seekingRole}</strong>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-300 font-medium">⏱️ {seekingHours}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-amber-300 font-medium">🏷️ {seekingSpeciality}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                    GET /student-recruitments/
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/40">
                  "{seekingBio}"
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                    Scouted Skills:
                  </span>
                  {seekingSkills.split(",").map((s) => s.trim()).filter(Boolean).map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-lg bg-slate-700/70 text-slate-200 text-[10px] font-bold border border-slate-600"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 
            ================================================================
            4. STUDENT PROJECTS & BUILDS SHOWCASE FEED
            - Post-like design displaying large project cover images / architecture screenshots
            - Clan badges with clickable onOpenClan navigation
            - Milestone changelog and sprint updates
            - Interactive star appreciations, GitHub, and Live Demo links
            (Posts are removed from individual student profiles; posts belong solely to clans)
            ================================================================
          */}
          <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                    Engineering Builds & Project Showcase
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-200">
                    {personalProjects.length} Projects Shipped
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
                  Featured Projects & Engineering Portfolio
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Production systems, open-source repositories, and milestone updates shipped by {profile.name}.
                </p>
              </div>

              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setShowAddProject(true)}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400 transition-all"
                >
                  <span className="text-sm">⚡</span>
                  <span>+ Add Project Showcase</span>
                </button>
              )}
            </div>

            {/* Post-like Project Showcase Feed */}
            <div className="space-y-8">
              {personalProjects.map((proj) => (
                <article
                  key={proj.id}
                  className="rounded-3xl border border-slate-200/90 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Post Card Header: Author, Timestamp, Status & Clan Badges */}
                  <div className="p-5 sm:p-6 pb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-sm shrink-0">
                        <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-amber-300 font-black text-sm overflow-hidden">
                          {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{profile.initials}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-black text-slate-900">{profile.name}</strong>
                          <span className="text-[10px] font-bold text-slate-400">·</span>
                          <span className="text-[11px] font-medium text-slate-500">{proj.createdAt || "October 2026"}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {profile.department} · {profile.branch}
                        </p>
                      </div>
                    </div>

                    {/* Top Right Badges & Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Project Status Pill */}
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

                      {/* Clan Project Badge (Clickable: Opens Clan Profile) */}
                      {proj.isClanProject && proj.clanName && (
                        <button
                          type="button"
                          onClick={() => onOpenClan?.(proj.clanName!)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-black transition-colors cursor-pointer group/clanpill"
                          title={`View ${proj.clanName} Clan Profile`}
                        >
                          <span>🛡️</span>
                          <span>Clan: {proj.clanName}</span>
                          <span className="text-[10px] text-blue-700 underline group-hover/clanpill:translate-x-0.5 transition-transform">↗</span>
                        </button>
                      )}

                      {/* Owner Controls */}
                      {isOwnProfile && (
                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleCompletePersonalProject(proj.id)}
                            className={`px-2.5 py-1 text-[11px] font-black rounded-lg cursor-pointer transition-all border flex items-center gap-1 shadow-2xs ${
                              proj.status === "completed"
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
                            }`}
                            title="Toggle project completion status (/complete/)"
                          >
                            <span>{proj.status === "completed" ? "🔄 Reopen" : "✓ Mark Completed"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePersonalProject(proj.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                            title="Delete Project"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Media Section: Project Image / Screenshot Showcase */}
                  {proj.coverImage ? (
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
                          <span>Project Architecture & Live Screenshot</span>
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
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-[#172033] flex items-center justify-center text-slate-400 text-xs font-bold border-y border-slate-100">
                      <div className="text-center space-y-1">
                        <span className="text-3xl">💻</span>
                        <p className="text-slate-300 font-extrabold">{proj.title}</p>
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

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {(proj.tags && proj.tags.length > 0
                        ? proj.tags
                        : ["React19", "TypeScript", "OpenSource", "FullStack"]
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
                        {isOwnProfile && (
                          <button
                            type="button"
                            onClick={() => setShowAddProjectUpdate(String(proj.id))}
                            className="text-xs text-amber-700 hover:text-amber-900 font-black hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>+ Post Sprint Milestone</span>
                          </button>
                        )}
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
                          <p className="text-[11px] text-slate-400 italic">No milestone updates posted yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Post Footer Bar: Star Reaction, GitHub, Live Demo, Share */}
                  <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Star / Upvote Reaction */}
                    <button
                      type="button"
                      onClick={() => handleToggleStarProject(proj.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        userStarred[String(proj.id)]
                          ? "bg-amber-400 text-slate-950 border-amber-400 shadow-sm scale-105"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                      title="Star / Appreciate this project"
                    >
                      <span className="text-sm">{userStarred[String(proj.id)] ? "⭐" : "☆"}</span>
                      <span>{userStarred[String(proj.id)] ? "Starred" : "Star Project"}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-black/10 text-[11px] font-bold">
                        {starredProjects[String(proj.id)] ?? 24}
                      </span>
                    </button>

                    {/* Action Links */}
                    <div className="flex items-center gap-3">
                      {proj.githubLink ? (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-extrabold hover:underline"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          <span>GitHub Repo</span>
                          <span>↗</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium">🔒 Private repo</span>
                      )}

                      {proj.liveLink && (
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-extrabold hover:underline"
                        >
                          <span>Live Demo</span>
                          <span>↗</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href)
                          showToast("Project link copied to clipboard!")
                        }}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold px-2 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                        title="Share project link"
                      >
                        <span>🔗</span>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 
        ================================================================
        MODAL: EDIT PROFILE (/profile/edit/)
        - Bio (150-word max enforcement with live word count)
        - Social media links (GitHub, LinkedIn, Instagram, YouTube)
        - Profile picture upload & URL
        - Cover banner upload & URL
        - Email change triggers OTP verification
        ================================================================
      */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Profile (/profile/edit/)</h3>
                <p className="text-xs text-slate-500">Update your public student details and campus social links</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Photo & Banner Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Profile Photo (PFP)</label>
                  <input
                    type="file"
                    accept="image/*"
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
                    className="text-xs"
                  />
                  <input
                    type="url"
                    placeholder="Or image URL..."
                    value={editForm.avatarUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Cover Banner</label>
                  <input
                    type="file"
                    accept="image/*"
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
                    className="text-xs"
                  />
                  <input
                    type="url"
                    placeholder="Or banner URL..."
                    value={editForm.bannerUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, bannerUrl: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              {/* Social Media Links Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                  Social Media Links (GitHub, LinkedIn, Instagram, YouTube)
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
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
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
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Instagram URL</label>
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
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">YouTube URL</label>
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
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Campus Email with OTP Note */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Campus Email (Editing requires OTP Verification)
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
                {editForm.email.trim().toLowerCase() !== profile.email.trim().toLowerCase() && (
                  <p className="text-[11px] font-bold text-amber-700 mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Modifying your official campus email will require 2-step OTP verification.</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch</label>
                  <input
                    type="text"
                    value={editForm.branch}
                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              {/* About Me (Strict 150 Words Constraint) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Bio / About Me (Max 150 Words)</label>
                  <span
                    className={`text-[10px] font-extrabold ${
                      countWords(editForm.aboutMe) > 150 ? "text-rose-600" : "text-slate-500"
                    }`}
                  >
                    {countWords(editForm.aboutMe)} / 150 Words
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={editForm.aboutMe}
                  onChange={(e) => handleAboutMeChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  placeholder="Share a concise summary of your technical background..."
                  required
                />
                {wordCountWarning && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">{wordCountWarning}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={countWords(editForm.aboutMe) > 150 || isSendingEmailOtp}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl font-black shadow-sm disabled:opacity-50 hover:brightness-105 active:scale-95"
                >
                  {isSendingEmailOtp ? "Dispatching OTP..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL: EMAIL CHANGE OTP VERIFICATION (/verify-email-change-otp/)
        ================================================================
      */}
      {showEmailOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden animate-scale-up p-6 space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-amber-400/20">
                ✉️
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Verify New Campus Email</h3>
              <p className="text-xs text-slate-500 font-medium">
                An official security OTP was sent to <strong>{editForm.email}</strong>. Enter the 6-digit code to finalize your email update.
              </p>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold">
                💡 Campus Demo: Use code <strong>123456</strong> or any 6 digits to verify.
              </div>
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
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {otpCountdown > 0 ? (
                    `Resend code in ${otpCountdown}s`
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendEmailOtp}
                      className="text-amber-600 font-bold hover:underline cursor-pointer"
                    >
                      Resend OTP Code
                    </button>
                  )}
                </span>
                <span>Security verified</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
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
                    <span>Verify & Save Email</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL: ADD CATEGORIZED SKILL
        ================================================================
      */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h3 className="text-base font-black text-slate-900">Tag Categorized Skill</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSkillModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCategorizedSkill} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Skill Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
                >
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend & Systems</option>
                  <option value="AI & ML">AI & Machine Learning</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Mobile">Mobile Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              {/* Suggestions Chips for the category */}
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Popular Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categoryPresets[newSkillCategory]?.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewSkillName(preset)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-amber-100 hover:text-amber-900 transition-colors text-slate-700"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. React 19, KaTeX, PyTorch..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
                >
                  <option value="Beginner">Beginner (Learning & Experimenting)</option>
                  <option value="Intermediate">Intermediate (Built multiple projects)</option>
                  <option value="Advanced">Advanced (Hackathon & Production ready)</option>
                  <option value="Expert">Expert (Mentoring & System Architect)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl font-black shadow-xs hover:brightness-105 active:scale-95"
                >
                  Add Skill Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        MODAL: ADD PERSONAL PROJECT SHOWCASE
        - Title & Description
        - Cover Image / Architecture Screenshot (File upload, URL & Presets)
        - Categorized Tags
        - GitHub & Live Demo URLs
        ================================================================
      */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Personal Project Showcase</h3>
                  <p className="text-[11px] text-slate-500 font-mono">POST /project/personal/create/ · Individual Student Project</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePersonalProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Autonomous Drone Telemetry Dashboard"
                  className="w-full p-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project Description *
                </label>
                <textarea
                  rows={3}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Detail the architecture, system constraints, core stack, and results..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Cover Image / Screenshot Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span>📸</span>
                    <span>Project Cover Image / Screenshot</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Recommended: 16:9 ratio</span>
                </div>

                {/* Upload or URL */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0">
                      <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Upload Screenshot</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setNewProjCoverImage(reader.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>

                    <input
                      type="url"
                      value={newProjCoverImage}
                      onChange={(e) => setNewProjCoverImage(e.target.value)}
                      placeholder="Or paste screenshot image URL..."
                      className="flex-1 p-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Preset Pills */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Quick Preset Themes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        {
                          name: "Web Systems",
                          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80",
                        },
                        {
                          name: "AI & Neural Net",
                          url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=600&q=80",
                        },
                        {
                          name: "Drone Telemetry",
                          url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&h=600&q=80",
                        },
                        {
                          name: "KaTeX Math",
                          url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&h=600&q=80",
                        },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setNewProjCoverImage(preset.url)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            newProjCoverImage === preset.url
                              ? "bg-amber-400 text-slate-950 border-amber-400"
                              : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                          }`}
                        >
                          +{preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Preview */}
                  {newProjCoverImage && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-900 mt-2">
                      <img
                        src={newProjCoverImage}
                        alt="Project Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setNewProjCoverImage("")}
                        className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold hover:bg-rose-600 transition-colors"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Technologies / Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newProjTags}
                  onChange={(e) => setNewProjTags(e.target.value)}
                  placeholder="e.g. React 19, TypeScript, WebSockets, Tailwind v4"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* GitHub & Live Demo Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={newProjGithub}
                    onChange={(e) => setNewProjGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Live Demo / Staging URL
                  </label>
                  <input
                    type="url"
                    value={newProjLive}
                    onChange={(e) => setNewProjLive(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  Save Project Showcase
                </button>
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
              <div>
                <h3 className="text-base font-black text-slate-900">Post Milestone Update</h3>
                <p className="text-[11px] text-slate-500 font-mono">POST /project/{showAddProjectUpdate}/update/ · /update/</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProjectUpdate(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Update Title
                <input
                  type="text"
                  value={newUpdateTitle}
                  onChange={(e) => setNewUpdateTitle(e.target.value)}
                  placeholder="e.g. Added Real-Time Telemetry"
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Update Content
                <textarea
                  rows={3}
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  placeholder="Detail what features were built, tested, and shipped..."
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200"
                />
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectUpdate(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPersonalProjectUpdate(showAddProjectUpdate)}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-4 py-2 rounded-xl text-xs font-black shadow-sm"
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
        MODAL: DIRECT MESSAGE PEER
        ================================================================
      */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <h3 className="text-base font-black text-slate-900">
                  Message {currentStudentData.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendDirectMessage} className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                Send a direct campus notification to <strong>{currentStudentData.name}</strong> ({currentStudentData.email}):
              </p>

              <textarea
                rows={4}
                value={directMsgText}
                onChange={(e) => setDirectMsgText(e.target.value)}
                placeholder="Hey, loved your project and wanted to connect about..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-4 py-2 rounded-xl font-black shadow-xs hover:brightness-105"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 
        ================================================================
        STUDENT RECRUITMENT AVAILABILITY MODAL (/student/recruitment/create/)
        ================================================================
      */}
      {showSeekingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎯</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Configure Seeking Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">Publish your availability to campus clan leaders</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSeekingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSeekingProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Clan Role / Domain
                </label>
                <input
                  type="text"
                  required
                  value={seekingRole}
                  onChange={(e) => setSeekingRole(e.target.value)}
                  placeholder="e.g. Full-Stack Systems Engineer or Lead ML Researcher"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Hours / Week
                  </label>
                  <select
                    value={seekingHours}
                    onChange={(e) => setSeekingHours(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-400"
                  >
                    <option value="5-10 hrs/week">5-10 hrs/week</option>
                    <option value="10-15 hrs/week">10-15 hrs/week</option>
                    <option value="15-20 hrs/week">15-20 hrs/week</option>
                    <option value="20+ hrs/week">20+ hrs/week (Hardcore)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Clan Focus
                  </label>
                  <select
                    value={seekingSpeciality}
                    onChange={(e) => setSeekingSpeciality(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Web & Real-Time Dashboards">Web & Real-Time Dashboards</option>
                    <option value="AI / ML & Systems">AI / ML & Systems</option>
                    <option value="Robotics & Hardware">Robotics & Hardware</option>
                    <option value="Competitive Programming">Competitive Programming</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recruiter Pitch & Project Experience
                </label>
                <textarea
                  rows={3}
                  required
                  value={seekingBio}
                  onChange={(e) => setSeekingBio(e.target.value)}
                  placeholder="Tell Clan Leaders why they should recruit you, your past hackathon wins, and tech stack..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Strengths & Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={seekingSkills}
                  onChange={(e) => setSeekingSkills(e.target.value)}
                  placeholder="e.g. React 19, TypeScript, PyTorch, Docker"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSeekingModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishingSeeking}
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl text-xs font-black shadow-sm hover:brightness-105 active:scale-95 cursor-pointer disabled:opacity-50 border border-amber-400"
                >
                  {isPublishingSeeking ? "Publishing..." : "Publish Availability (/student/recruitment/create/) →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
