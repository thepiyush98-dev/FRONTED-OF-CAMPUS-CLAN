/**
 * Campus Clans — Official Django Backend Unified API Service Layer
 * 
 * Directly interfaces with the Django backend (https://github.com/sudo-aksh/Campus_Clans.git).
 * Maps all endpoints across campus_clans and campus_admin apps:
 * - Email OTP Authentication (send-otp, verify-otp, register-student, forgot-password)
 * - Username & Clan name validation
 * - Student Profile & Skills management
 * - Clan Operations (join requests, invitations, role changes, member removal)
 * - Clan Stories (create, view, like, viewers list, delete)
 * - Clan Posts (create, image upload, edit, delete, toggle like)
 * - Personal & Clan Projects with milestones and updates
 * - Global & Student Recruitments
 * - Event Participation (Individual & Clan roster selection)
 * - Campus Admin Console (Students, Clans, Events, Trophies, Monthly Reports)
 * 
 * Features automatic CSRF token extraction from cookies, credentials inclusion,
 * multipart FormData handling, and reliable fallback handling when offline.
 */

import {
  Student,
  Clan,
  EventItem,
  Trophy,
  CampusMessage,
  AuditLogItem,
  ClanStoryItem,
  ClanPostItem,
  ProjectItem,
  ClanRecruitmentItem,
  StudentRecruitmentItem,
} from "@/types"
import {
  INITIAL_STUDENTS,
  INITIAL_CLANS,
  INITIAL_EVENTS,
  INITIAL_TROPHIES,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
} from "@/data/mockData"

const DJANGO_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "")

/**
 * Retrieve CSRF token from the browser document cookie (Django's csrftoken)
 */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null
  const cookies = document.cookie ? document.cookie.split("; ") : []
  for (const cookie of cookies) {
    const [name, val] = cookie.split("=")
    if (name === "csrftoken") {
      return decodeURIComponent(val)
    }
  }
  return null
}

/**
 * Core Request wrapper for Django endpoints.
 */
async function djangoFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackValue?: () => T | Promise<T>
): Promise<T> {
  const url = `${DJANGO_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  const csrf = getCsrfToken()

  const headers: Record<string, string> = {
    Accept: "application/json, text/html, */*",
    ...(csrf ? { "X-CSRFToken": csrf } : {}),
  }

  // Only set application/json if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const mergedOptions: RequestInit = {
    credentials: "include", // Pass Django sessionid and csrftoken cookies
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  }

  try {
    const res = await fetch(url, mergedOptions)

    if (!res.ok) {
      if (fallbackValue && (res.status === 404 || res.status >= 500)) {
        console.warn(`[Django API] HTTP ${res.status} at ${url}. Using local fallback.`)
        return await fallbackValue()
      }
      const errJson = await res.json().catch(() => ({}))
      throw new Error(errJson.error || errJson.message || `Django API request failed (HTTP ${res.status})`)
    }

    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      return (await res.json()) as T
    }
    // For endpoints that redirect or return plain text/HTML
    return { success: true, redirected: res.redirected } as unknown as T
  } catch (err: any) {
    if (fallbackValue) {
      console.info(
        `%c[Django Fallback] %c${options.method || "GET"} ${url} (${err.message || "Offline"})`,
        "color: #f5b800; font-weight: bold;",
        "color: #64748b;"
      )
      return await fallbackValue()
    }
    throw err
  }
}

// ==========================================
// 1. AUTHENTICATION & OTP SERVICE
// ==========================================
export const DjangoAuth = {
  /** Check if a username is available (GET /check-username/?username=...) */
  async checkUsername(username: string): Promise<{ available: boolean }> {
    return djangoFetch<{ available: boolean }>(
      `/check-username/?username=${encodeURIComponent(username)}`,
      { method: "GET" },
      () => ({ available: !INITIAL_STUDENTS.some((s) => s.username.toLowerCase() === username.toLowerCase()) })
    )
  },

  /** Send 6-digit registration OTP to student email (POST /send-otp/) */
  async sendOtp(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const formData = new FormData()
    formData.append("email", email)
    return djangoFetch(
      "/send-otp/",
      { method: "POST", body: formData },
      () => ({ success: true, message: `OTP sent to ${email} (Demo OTP: 123456)` })
    )
  },

  /** Verify registration OTP (POST /verify-otp/) */
  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("otp", otp)
    return djangoFetch(
      "/verify-otp/",
      { method: "POST", body: formData },
      () => ({ success: otp.trim() === "123456" || otp.length === 6 })
    )
  },

  /** Complete student account creation (POST /register-student/) */
  async registerStudent(data: {
    name: string
    department: string
    branch: string
    email: string
    username: string
    password: string
    confirm_password: string
  }): Promise<{ success: boolean; error?: string }> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, val]) => formData.append(key, val))
    return djangoFetch(
      "/register-student/",
      { method: "POST", body: formData },
      () => ({ success: true })
    )
  },

  /** Send password reset OTP (POST /send-password-reset-otp/) */
  async sendPasswordResetOtp(email: string): Promise<{ success: boolean; error?: string }> {
    const formData = new FormData()
    formData.append("email", email)
    return djangoFetch(
      "/send-password-reset-otp/",
      { method: "POST", body: formData },
      () => ({ success: true })
    )
  },

  /** Verify password reset OTP (POST /verify-password-reset-otp/) */
  async verifyPasswordResetOtp(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("otp", otp)
    return djangoFetch(
      "/verify-password-reset-otp/",
      { method: "POST", body: formData },
      () => ({ success: true })
    )
  },

  /** Reset student password (POST /reset-password/) */
  async resetPassword(password: string, confirmPassword: string): Promise<{ success: boolean; error?: string }> {
    const formData = new FormData()
    formData.append("password", password)
    formData.append("confirm_password", confirmPassword)
    return djangoFetch(
      "/reset-password/",
      { method: "POST", body: formData },
      () => ({ success: true })
    )
  },

  /** Login for Student or Campus Admin (POST /) */
  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; role?: "student" | "admin"; error?: string }> {
    const formData = new FormData()
    formData.append("username", usernameOrEmail)
    formData.append("password", password)
    return djangoFetch(
      "/",
      { method: "POST", body: formData },
      () => {
        const isAdmin = usernameOrEmail.toLowerCase().includes("admin")
        return { success: true, role: isAdmin ? "admin" : "student" }
      }
    )
  },

  /** Logout student or admin (GET /logout/) */
  async logout(): Promise<{ success: boolean }> {
    return djangoFetch("/logout/", { method: "GET" }, () => ({ success: true }))
  },
}

// ==========================================
// 2. STUDENT PROFILE & SKILLS SERVICE
// ==========================================
export const DjangoProfile = {
  /** Get own profile (GET /profile/) */
  async getMyProfile(): Promise<any> {
    return djangoFetch("/profile/", { method: "GET" }, () => INITIAL_STUDENTS[0])
  },

  /** View student profile by ID (GET /profile/<id>/) */
  async getStudent(studentId: number | string): Promise<any> {
    return djangoFetch(`/profile/${studentId}/`, { method: "GET" }, () =>
      INITIAL_STUDENTS.find((s) => s.id === String(studentId)) || INITIAL_STUDENTS[0]
    )
  },

  /** Edit profile (POST /profile/edit/) */
  async editProfile(data: FormData | any): Promise<{ success: boolean }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch("/profile/edit/", { method: "POST", body }, () => ({ success: true }))
  },

  /** Fetch skills for a category/type (GET /skills/<type_id>/) */
  async getSkills(skillTypeId: number): Promise<any[]> {
    return djangoFetch(`/skills/${skillTypeId}/`, { method: "GET" }, () => [
      { id: 1, name: "React 19" },
      { id: 2, name: "Tailwind CSS v4" },
      { id: 3, name: "TypeScript" },
      { id: 4, name: "Python & Django" },
      { id: 5, name: "Figma UI/UX" },
    ])
  },

  /** Real-time student search (GET /student-search/?q=...) */
  async searchStudents(query: string): Promise<Student[]> {
    return djangoFetch<Student[]>(
      `/student-search/?q=${encodeURIComponent(query)}`,
      { method: "GET" },
      () =>
        INITIAL_STUDENTS.filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.skills.some((sk) => sk.toLowerCase().includes(query.toLowerCase()))
        )
    )
  },

  /** Send email change OTP (POST /send-email-change-otp/) */
  async sendEmailChangeOtp(newEmail: string): Promise<{ success: boolean; error?: string }> {
    const formData = new FormData()
    formData.append("email", newEmail)
    return djangoFetch("/send-email-change-otp/", { method: "POST", body: formData }, () => ({ success: true }))
  },

  /** Verify email change OTP (POST /verify-email-change-otp/) */
  async verifyEmailChangeOtp(newEmail: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const formData = new FormData()
    formData.append("email", newEmail)
    formData.append("otp", otp)
    return djangoFetch("/verify-email-change-otp/", { method: "POST", body: formData }, () => ({ success: true }))
  },
}

// ==========================================
// 3. CLANS MANAGEMENT SERVICE
// ==========================================
export const DjangoClans = {
  /** Check if clan name is available (GET /check-clan-name/?name=...) */
  async checkClanName(name: string): Promise<{ available: boolean }> {
    return djangoFetch<{ available: boolean }>(
      `/check-clan-name/?name=${encodeURIComponent(name)}`,
      { method: "GET" },
      () => ({ available: !INITIAL_CLANS.some((c) => c.name.toLowerCase() === name.toLowerCase()) })
    )
  },

  /** Create clan (POST /create-clan/) */
  async createClan(data: FormData | any): Promise<{ success: boolean; clan_id?: number }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch("/create-clan/", { method: "POST", body }, () => ({ success: true, clan_id: Date.now() }))
  },

  /** Fetch clan profile details (GET /clan/<clan_id>/) */
  async getClanProfile(clanId: number | string): Promise<Clan> {
    return djangoFetch<Clan>(
      `/clan/${clanId}/`,
      { method: "GET" },
      () => INITIAL_CLANS.find((c) => c.id === String(clanId) || c.name === String(clanId)) || INITIAL_CLANS[0]
    )
  },

  /** Edit clan details (POST /clan/<clan_id>/edit/) */
  async editClan(clanId: number | string, data: FormData | any): Promise<{ success: boolean }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch(`/clan/${clanId}/edit/`, { method: "POST", body }, () => ({ success: true }))
  },

  /** Change clan member role (POST /clan/<clan_id>/change-role/<member_id>/) */
  async changeRole(clanId: number | string, memberId: number | string, role: string): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("role", role)
    return djangoFetch(`/clan/${clanId}/change-role/${memberId}/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Remove member from clan (POST /clan/<clan_id>/remove-member/<member_id>/) */
  async removeMember(clanId: number | string, memberId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan/${clanId}/remove-member/${memberId}/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Send clan join request (POST /clan/<clan_id>/join/) */
  async sendJoinRequest(clanId: number | string): Promise<{ success: boolean; message?: string }> {
    return djangoFetch(`/clan/${clanId}/join/`, { method: "POST" }, () => ({
      success: true,
      message: "Clan join request submitted to clan leadership.",
    }))
  },

  /** Cancel clan join request (POST /clan-join-request/<request_id>/cancel/) */
  async cancelJoinRequest(requestId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan-join-request/${requestId}/cancel/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Request clan leave (POST /clan/<clan_id>/leave-request/) */
  async requestLeave(clanId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan/${clanId}/leave-request/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Invite student to clan (POST /clan/<student_id>/invite/) */
  async sendInvitation(studentId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan/${studentId}/invite/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Accept clan invitation (POST /clan-invitation/<invitation_id>/accept/) */
  async acceptInvitation(invitationId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan-invitation/${invitationId}/accept/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Reject clan invitation (POST /clan-invitation/<invitation_id>/reject/) */
  async rejectInvitation(invitationId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan-invitation/${invitationId}/reject/`, { method: "POST" }, () => ({ success: true }))
  },
}

// ==========================================
// 4. CLAN STORIES SERVICE (Instagram/Snapchat style)
// ==========================================
export const DjangoStories = {
  /** Create Clan Story (POST /clan/<clan_id>/story/create/save/) */
  async createStory(clanId: number | string, formData: FormData): Promise<{ success: boolean }> {
    return djangoFetch(`/clan/${clanId}/story/create/save/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** View Story (GET /clan-story/<story_id>/) */
  async viewStory(storyId: number | string): Promise<any> {
    return djangoFetch(`/clan-story/${storyId}/`, { method: "GET" }, () => ({
      id: storyId,
      clanName: "Pixel Pirates",
      caption: "Deploying our 36-hour hackathon project!",
      likesCount: 24,
      viewsCount: 110,
    }))
  },

  /** Record story view (POST /story/<story_id>/view/) */
  async recordView(storyId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/story/${storyId}/view/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Like/unlike story (POST /story/<story_id>/like/) */
  async likeStory(storyId: number | string): Promise<{ success: boolean; liked: boolean; like_count: number }> {
    return djangoFetch(`/story/${storyId}/like/`, { method: "POST" }, () => ({
      success: true,
      liked: true,
      like_count: 25,
    }))
  },

  /** Get story viewers (GET /clan-story/<story_id>/viewers/) */
  async getViewers(storyId: number | string): Promise<any[]> {
    return djangoFetch(`/clan-story/${storyId}/viewers/`, { method: "GET" }, () => [
      { id: 1, name: "Aarav Khanna", avatar: "AK" },
      { id: 2, name: "Riya Malhotra", avatar: "RM" },
      { id: 3, name: "Devansh Sharma", avatar: "DS" },
    ])
  },

  /** Delete story (POST /clan-story/<story_id>/delete/) */
  async deleteStory(storyId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan-story/${storyId}/delete/`, { method: "POST" }, () => ({ success: true }))
  },
}

// ==========================================
// 5. CLAN POSTS & FEEDS SERVICE
// ==========================================
export const DjangoPosts = {
  /** Get Clan Posts (GET /clan/<clan_id>/posts/) */
  async getClanPosts(clanId: number | string): Promise<ClanPostItem[]> {
    return djangoFetch<ClanPostItem[]>(`/clan/${clanId}/posts/`, { method: "GET" }, () => [
      {
        id: "post-1",
        clanId,
        clanName: "Pixel Pirates",
        authorId: 1,
        authorName: "Aarav Khanna",
        authorRole: "Clan Lead",
        content: "Released Campus Clans Glassmorphic UI Kit v2 with React 19 and Tailwind CSS v4!",
        images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80"],
        likesCount: 54,
        isLiked: false,
        commentsCount: 12,
        createdAt: "2 hours ago",
      },
    ])
  },

  /** Create Clan Post (POST /clan/<clan_id>/post/create/submit/) */
  async createPost(clanId: number | string, formData: FormData): Promise<{ success: boolean }> {
    return djangoFetch(`/clan/${clanId}/post/create/submit/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Toggle post like (POST /clan/post/<post_id>/like/) */
  async toggleLike(postId: number | string): Promise<{ success: boolean; liked: boolean; like_count: number }> {
    return djangoFetch(`/clan/post/${postId}/like/`, { method: "POST" }, () => ({
      success: true,
      liked: true,
      like_count: 55,
    }))
  },

  /** Get post likes list (GET /clan-post/<post_id>/likes/) */
  async getLikes(postId: number | string): Promise<any[]> {
    return djangoFetch(`/clan-post/${postId}/likes/`, { method: "GET" }, () => [
      { id: 1, name: "Aarav Khanna" },
      { id: 2, name: "Riya Malhotra" },
    ])
  },

  /** Delete clan post (POST /clan-post/<post_id>/delete) */
  async deletePost(postId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan-post/${postId}/delete`, { method: "POST" }, () => ({ success: true }))
  },
}

// ==========================================
// 6. PROJECTS SERVICE (Personal & Clan)
// ==========================================
export const DjangoProjects = {
  /** Create Personal Student Project (POST /project/create/) */
  async createPersonalProject(data: FormData | any): Promise<{ success: boolean; project_id?: number }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch("/project/create/", { method: "POST", body }, () => ({ success: true, project_id: Date.now() }))
  },

  /** Add Milestone Update to Student Project (POST /project/<project_id>/update/create/) */
  async addPersonalProjectUpdate(projectId: number | string, data: any): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("title", data.title || "")
    formData.append("content", data.content || "")
    return djangoFetch(`/project/${projectId}/update/create/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Complete Student Project (POST /project/<project_id>/complete/) */
  async completePersonalProject(projectId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/project/${projectId}/complete/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Create Clan Project (POST /clan/<clan_id>/project/create/) */
  async createClanProject(clanId: number | string, data: FormData | any): Promise<{ success: boolean }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch(`/clan/${clanId}/project/create/`, { method: "POST", body }, () => ({ success: true }))
  },

  /** Add Update to Clan Project (POST /clan-project/<project_id>/update/create/) */
  async addClanProjectUpdate(projectId: number | string, data: any): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("title", data.title || "")
    formData.append("content", data.content || "")
    return djangoFetch(`/clan-project/${projectId}/update/create/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Complete Clan Project (POST /clan-project/<project_id>/complete/) */
  async completeClanProject(projectId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/clan-project/${projectId}/complete/`, { method: "POST" }, () => ({ success: true }))
  },
}

// ==========================================
// 7. RECRUITMENT SERVICE (Global & Student)
// ==========================================
export const DjangoRecruitments = {
  /** Get Global Clan Recruitments (GET /global-recruitments/) */
  async getGlobalRecruitments(): Promise<ClanRecruitmentItem[]> {
    return djangoFetch<ClanRecruitmentItem[]>("/global-recruitments/", { method: "GET" }, () => [
      {
        id: "rec-1",
        clanId: "clan-1",
        clanName: "Pixel Pirates",
        title: "Frontend Architect (React 19 & Tailwind)",
        description: "Looking for 2 ambitious developers to engineer national hackathon interfaces.",
        requiredSkills: ["React 19", "Tailwind CSS", "TypeScript"],
        applicantsCount: 6,
        status: "open",
        createdAt: "2 days ago",
      },
      {
        id: "rec-2",
        clanId: "clan-2",
        clanName: "Binary Beasts",
        title: "Distributed Systems & LLM Specialist",
        description: "Join our core team building high-throughput campus model pipelines.",
        requiredSkills: ["Python", "PyTorch", "Redis", "Docker"],
        applicantsCount: 11,
        status: "open",
        createdAt: "3 days ago",
      },
    ])
  },

  /** Create Clan Recruitment opening (POST /clan/<clan_id>/recruitment/create/) */
  async createClanRecruitment(clanId: number | string, data: any): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("title", data.title || "")
    formData.append("description", data.description || "")
    return djangoFetch(`/clan/${clanId}/recruitment/create/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Apply to a Global Clan Recruitment (POST /global-recruitments/<recruitment_id>/request/) */
  async applyToRecruitment(recruitmentId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/global-recruitments/${recruitmentId}/request/`, { method: "POST" }, () => ({
      success: true,
    }))
  },

  /** Get Student Availability Seekings (GET /student-recruitments/) */
  async getStudentRecruitments(): Promise<StudentRecruitmentItem[]> {
    return djangoFetch<StudentRecruitmentItem[]>("/student-recruitments/", { method: "GET" }, () => [
      {
        id: "srec-1",
        studentId: "stu-1",
        studentName: "Aarav Khanna",
        department: "School of Engineering",
        branch: "B.Tech CSE",
        year: "3rd Year",
        skills: ["React 19", "Tailwind CSS", "UI/UX", "TypeScript"],
        bio: "Looking to collaborate on competitive national hackathon teams.",
        createdAt: "1 day ago",
      },
    ])
  },

  /** Create Student Availability Post (POST /student-recruitment/create/) */
  async createStudentRecruitment(data: any): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("bio", data.bio || "")
    return djangoFetch("/student-recruitment/create/", { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },
}

// ==========================================
// 8. EVENTS & PARTICIPATION SERVICE
// ==========================================
export const DjangoEvents = {
  /** Fetch campus events (GET /events/) */
  async getAll(): Promise<EventItem[]> {
    return djangoFetch<EventItem[]>("/events/", { method: "GET" }, () => [...INITIAL_EVENTS])
  },

  /**
   * Participate in Event (POST /event/<event_id>/participate/<type>/)
   * type: 'student' (individual) or 'clan'
   */
  async participate(eventId: number | string, participationType: "student" | "clan"): Promise<{ success: boolean; message?: string }> {
    return djangoFetch(`/event/${eventId}/participate/${participationType}/`, { method: "POST" }, () => ({
      success: true,
      message: `Registered for event as ${participationType === "clan" ? "Clan Team" : "Individual"}.`,
    }))
  },

  /** Cancel event participation (POST /event/<event_id>/cancel/) */
  async cancelParticipation(eventId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/event/${eventId}/cancel/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Fetch clan members selected to represent clan in event (GET /event/<event_id>/clan-members/) */
  async getEventClanMembers(eventId: number | string): Promise<any[]> {
    return djangoFetch(`/event/${eventId}/clan-members/`, { method: "GET" }, () => [
      { id: 1, name: "Aarav Khanna", role: "Leader" },
      { id: 2, name: "Riya Malhotra", role: "Co-Leader" },
    ])
  },

  /** Save selected clan representatives (POST /event/<event_id>/clan-members/save/) */
  async saveEventClanMembers(eventId: number | string, memberIds: (number | string)[]): Promise<{ success: boolean }> {
    const formData = new FormData()
    memberIds.forEach((id) => formData.append("member_ids", String(id)))
    return djangoFetch(`/event/${eventId}/clan-members/save/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },
}

// ==========================================
// 9. CAMPUS ADMIN CONSOLE SERVICE
// ==========================================
export const DjangoAdmin = {
  /** Fetch Admin Dashboard Statistics (GET /campus-admin/) */
  async getDashboard(): Promise<any> {
    return djangoFetch("/campus-admin/", { method: "GET" }, () => ({
      totalStudents: INITIAL_STUDENTS.length,
      totalClans: INITIAL_CLANS.length,
      activeEvents: INITIAL_EVENTS.length,
      trophiesAwarded: INITIAL_TROPHIES.length,
    }))
  },

  /** Student Suspension (POST /campus-admin/students/<id>/suspend/) */
  async suspendStudent(studentId: number | string, reason: string): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("reason", reason)
    return djangoFetch(`/campus-admin/students/${studentId}/suspend/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Unsuspend Student (POST /campus-admin/students/<id>/unsuspend/) */
  async unsuspendStudent(studentId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/campus-admin/students/${studentId}/unsuspend/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Clan Suspension (POST /campus-admin/clans/<id>/suspend/) */
  async suspendClan(clanId: number | string, reason: string): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("reason", reason)
    return djangoFetch(`/campus-admin/clans/${clanId}/suspend/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Unsuspend Clan (POST /campus-admin/clans/<id>/unsuspend/) */
  async unsuspendClan(clanId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/campus-admin/clans/${clanId}/unsuspend/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Allocate Trophy to Student or Clan (POST /campus-admin/events/<id>/trophies/) */
  async allocateTrophy(eventId: number | string, data: any): Promise<{ success: boolean }> {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)))
    return djangoFetch(`/campus-admin/events/${eventId}/trophies/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Delete Trophy (POST /campus-admin/events/<id>/trophies/<trophy_id>/delete/) */
  async deleteTrophy(eventId: number | string, trophyId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/campus-admin/events/${eventId}/trophies/${trophyId}/delete/`, { method: "POST" }, () => ({
      success: true,
    }))
  },

  /** Send Administrative Message to Student or Clan */
  async sendMessage(targetType: "student" | "clan", id: number | string, message: string): Promise<{ success: boolean }> {
    const endpoint =
      targetType === "student"
        ? `/campus-admin/students/${id}/message/`
        : `/campus-admin/clans/${id}/message/`
    const formData = new FormData()
    formData.append("message", message)
    return djangoFetch(endpoint, { method: "POST", body: formData }, () => ({ success: true }))
  },

  /** Download institutional monthly reports (PDF, CSV, Excel, JSON) */
  getReportDownloadUrl(format: "pdf" | "csv" | "xlsx" | "json"): string {
    return `${DJANGO_URL}/campus-admin/reports/monthly.${format}`
  },
}

// Unified export
export const djangoApi = {
  auth: DjangoAuth,
  profile: DjangoProfile,
  clans: DjangoClans,
  stories: DjangoStories,
  posts: DjangoPosts,
  projects: DjangoProjects,
  recruitments: DjangoRecruitments,
  events: DjangoEvents,
  admin: DjangoAdmin,
}

export default djangoApi
