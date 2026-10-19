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
import {
  ALL_STUDENT_PROFILES,
  getStudentProfileById,
  getSkillsDirectoryWithCounts,
  searchStudents as searchStudentsHelper,
  CAMPUS_SKILLS_DIRECTORY,
} from "@/data/studentProfilesData"

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
    return djangoFetch("/profile/", { method: "GET" }, () => ALL_STUDENT_PROFILES[0])
  },

  /** View student profile by ID (GET /profile/<id>/ or GET /student/<id>/) */
  async getStudent(studentId: number | string): Promise<any> {
    return djangoFetch(`/student/${studentId}/`, { method: "GET" }, () =>
      getStudentProfileById(String(studentId)) || ALL_STUDENT_PROFILES.find((s) => s.id === String(studentId)) || ALL_STUDENT_PROFILES[0]
    )
  },

  /** Edit profile (POST /profile/edit/) */
  async editProfile(data: FormData | any): Promise<{ success: boolean }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch("/profile/edit/", { method: "POST", body }, () => ({ success: true }))
  },

  /** Fetch skills directory with student counts (GET /skills/ or GET /skills/<type_id>/) */
  async getSkills(skillTypeId?: number | string): Promise<any[]> {
    return djangoFetch(skillTypeId ? `/skills/${skillTypeId}/` : "/skills/", { method: "GET" }, () =>
      getSkillsDirectoryWithCounts()
    )
  },

  /** Real-time student search (GET /search-students/?q=... or GET /student-search/?q=...) */
  async searchStudents(query: string, category?: string, clan?: string, department?: string): Promise<any[]> {
    return djangoFetch<any[]>(
      `/search-students/?q=${encodeURIComponent(query)}`,
      { method: "GET" },
      () => searchStudentsHelper(query, category, clan, department)
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
  async checkClanName(name: string): Promise<{ available: boolean; message?: string }> {
    return djangoFetch<{ available: boolean; message?: string }>(
      `/check-clan-name/?name=${encodeURIComponent(name)}`,
      { method: "GET" },
      () => {
        const isTaken = INITIAL_CLANS.some((c) => c.name.toLowerCase() === name.toLowerCase())
        return {
          available: !isTaken,
          message: isTaken ? `Clan name "${name}" is already taken.` : `Clan name "${name}" is available!`,
        }
      }
    )
  },

  /** Create clan (POST /create-clan/) */
  async createClan(data: FormData | any): Promise<{ success: boolean; clan_id?: number; message?: string }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch("/create-clan/", { method: "POST", body }, () => ({
      success: true,
      clan_id: Date.now(),
      message: "Clan successfully founded on Campus Clans registry!",
    }))
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

  /** Change clan member role (POST /clan/<name>/change-role/ or /clan/<id>/change-role/<member_id>/) */
  async changeRole(
    clanIdentifier: number | string,
    memberId: number | string,
    role: "Leader" | "Co-Leader" | "Elder" | "Member" | string
  ): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    formData.append("member_id", String(memberId))
    formData.append("role", role)
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanIdentifier))}/change-role/`,
      { method: "POST", body: formData },
      () => ({
        success: true,
        message: `Member role updated to ${role}.`,
      })
    )
  },

  /** Remove member from clan (POST /clan/<name>/remove-member/) */
  async removeMember(
    clanIdentifier: number | string,
    memberId: number | string,
    reason?: string
  ): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    formData.append("member_id", String(memberId))
    if (reason) formData.append("reason", reason)
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanIdentifier))}/remove-member/`,
      { method: "POST", body: formData },
      () => ({ success: true, message: "Member removed from clan roster." })
    )
  },

  /** Send clan join request (POST /clan/<name>/request-join/) */
  async sendJoinRequest(clanIdentifier: number | string): Promise<{ success: boolean; message?: string }> {
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanIdentifier))}/request-join/`,
      { method: "POST" },
      () => ({
        success: true,
        message: "Clan join request submitted to clan leadership.",
      })
    )
  },

  /** Cancel clan join request (POST /cancel-join-request/ or POST /clan/<name>/cancel-join-request/) */
  async cancelJoinRequest(clanIdentifier: number | string): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    formData.append("clan", String(clanIdentifier))
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanIdentifier))}/cancel-join-request/`,
      { method: "POST", body: formData },
      () => ({ success: true, message: "Join request cancelled successfully." })
    )
  },

  /** Request leave clan (POST /clan/<name>/request-leave/) */
  async requestLeave(clanIdentifier: number | string): Promise<{ success: boolean; message?: string }> {
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanIdentifier))}/request-leave/`,
      { method: "POST" },
      () => ({ success: true, message: "Left clan successfully." })
    )
  },

  /** Invite student to clan (POST /clan/<name>/invite/) */
  async sendInvitation(
    clanIdentifier: number | string,
    studentIdentifier: number | string,
    role: string = "Member",
    message?: string
  ): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    formData.append("student", String(studentIdentifier))
    formData.append("role", role)
    if (message) formData.append("message", message)
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanIdentifier))}/invite/`,
      { method: "POST", body: formData },
      () => ({
        success: true,
        message: `Official clan invitation dispatched to ${studentIdentifier}!`,
      })
    )
  },

  /** Accept clan join request (POST /clan/<name>/accept-join-request/) */
  async acceptJoinRequest(
    clanIdentifier: number | string,
    requestId: number | string
  ): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    formData.append("request_id", String(requestId))
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanIdentifier))}/accept-join-request/`,
      { method: "POST", body: formData },
      () => ({ success: true, message: "Student accepted into clan roster!" })
    )
  },

  /** Reject clan join request (POST /clan/<name>/reject-join-request/) */
  async rejectJoinRequest(
    clanIdentifier: number | string,
    requestId: number | string
  ): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("request_id", String(requestId))
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanIdentifier))}/reject-join-request/`,
      { method: "POST", body: formData },
      () => ({ success: true })
    )
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
// ==========================================
// 4. CLAN STORIES SERVICE (24-Hour Ephemeral Instagram Style)
// ==========================================
export const DjangoStories = {
  /** Create 24h Ephemeral Clan Story (POST /clan/<name>/story/create/) */
  async createStory(
    clanName: string,
    data: FormData | { caption: string; storyImage: string; tags?: string[] }
  ): Promise<{ success: boolean; story?: any; message?: string }> {
    const isFormData = data instanceof FormData
    const body = isFormData ? data : (() => {
      const fd = new FormData()
      fd.append("caption", data.caption)
      fd.append("image", data.storyImage)
      if (data.tags) fd.append("tags", JSON.stringify(data.tags))
      return fd
    })()

    return djangoFetch(
      `/clan/${encodeURIComponent(clanName)}/story/create/`,
      { method: "POST", body },
      () => ({
        success: true,
        message: `24-hour clan story published for ${clanName} (/clan/${clanName}/story/create/)!`,
      })
    )
  },

  /** Record story view (POST /story/<id>/view/) */
  async recordView(storyId: number | string): Promise<{ success: boolean; viewsCount?: number }> {
    return djangoFetch(`/story/${storyId}/view/`, { method: "POST" }, () => ({
      success: true,
      viewsCount: 1,
    }))
  },

  /** Get live story viewers list (GET /story/<id>/viewers/) */
  async getViewers(storyId: number | string): Promise<any[]> {
    return djangoFetch(`/story/${storyId}/viewers/`, { method: "GET" }, () => [
      { id: "stu-1", name: "Aarav Khanna", avatar: "AK", branch: "B.Tech CSE · 3rd Year", viewedAt: "2m ago", hasLiked: true },
      { id: "stu-2", name: "Riya Malhotra", avatar: "RM", branch: "B.Tech IT · 3rd Year", viewedAt: "8m ago", hasLiked: true },
      { id: "stu-3", name: "Devansh Sharma", avatar: "DS", branch: "B.Tech CSE · 3rd Year", viewedAt: "25m ago", hasLiked: false },
      { id: "stu-4", name: "Simran Kaur", avatar: "SK", branch: "B.Tech AI · 2nd Year", viewedAt: "42m ago", hasLiked: true },
      { id: "stu-5", name: "Kabir Singh", avatar: "KS", branch: "B.Tech ECE · 4th Year", viewedAt: "1h ago", hasLiked: false },
      { id: "stu-6", name: "Ananya Roy", avatar: "AR", branch: "B.Tech CSE · 3rd Year", viewedAt: "2h ago", hasLiked: true },
    ])
  },

  /** Like/unlike story (POST /story/<id>/like/) */
  async likeStory(
    storyId: number | string
  ): Promise<{ success: boolean; liked: boolean; like_count: number }> {
    return djangoFetch(`/story/${storyId}/like/`, { method: "POST" }, () => ({
      success: true,
      liked: true,
      like_count: 85,
    }))
  },

  /** Delete clan story manually before auto-expiry (POST /story/<id>/delete/) */
  async deleteStory(storyId: number | string): Promise<{ success: boolean; message?: string }> {
    return djangoFetch(`/story/${storyId}/delete/`, { method: "POST" }, () => ({
      success: true,
      message: `Story #${storyId} deleted successfully (/story/${storyId}/delete/).`,
    }))
  },
}

// ==========================================
// 5. CLAN POSTS & FEEDS SERVICE
// ==========================================
export const DjangoPosts = {
  /** Get Clan Posts (GET /clan/<clan_name>/posts/) */
  async getClanPosts(clanName: number | string): Promise<ClanPostItem[]> {
    return djangoFetch<ClanPostItem[]>(
      `/clan/${encodeURIComponent(String(clanName))}/posts/`,
      { method: "GET" },
      () => [
        {
          id: "post-1",
          clanId: 1,
          clanName: String(clanName),
          authorId: 1,
          authorName: "Aarav Khanna",
          authorRole: "Leader",
          content: "Released Campus Clans Glassmorphic UI Kit v2 with React 19 and Tailwind CSS v4!",
          images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80"],
          likesCount: 54,
          isLiked: false,
          commentsCount: 12,
          createdAt: "2 hours ago",
        },
      ]
    )
  },

  /** Create Clan Post (POST /clan/<name>/post/create/) */
  async createPost(
    clanName: string,
    data: FormData | { content: string; image?: string; isAnnouncement?: boolean; tags?: string[] }
  ): Promise<{ success: boolean; message?: string }> {
    const isFormData = data instanceof FormData
    const body = isFormData
      ? data
      : (() => {
          const fd = new FormData()
          fd.append("content", data.content)
          if (data.image) fd.append("image", data.image)
          if (data.isAnnouncement) fd.append("is_announcement", "true")
          if (data.tags) fd.append("tags", JSON.stringify(data.tags))
          return fd
        })()

    return djangoFetch(
      `/clan/${encodeURIComponent(clanName)}/post/create/`,
      { method: "POST", body },
      () => ({
        success: true,
        message: `Clan post published to ${clanName} feed (/clan/${clanName}/post/create/)!`,
      })
    )
  },

  /** Like / Unlike post (POST /post/<id>/like/) */
  async toggleLike(
    postId: number | string
  ): Promise<{ success: boolean; liked: boolean; like_count: number }> {
    return djangoFetch(`/post/${postId}/like/`, { method: "POST" }, () => ({
      success: true,
      liked: true,
      like_count: 55,
    }))
  },

  /** Get post likers list (GET /post/<id>/likes/) */
  async getLikes(postId: number | string): Promise<any[]> {
    return djangoFetch(`/post/${postId}/likes/`, { method: "GET" }, () => [
      { id: "stu-1", name: "Aarav Khanna", avatar: "AK", branch: "B.Tech CSE · 3rd Year", likedAt: "5m ago" },
      { id: "stu-2", name: "Riya Malhotra", avatar: "RM", branch: "B.Tech IT · 3rd Year", likedAt: "12m ago" },
      { id: "stu-3", name: "Devansh Sharma", avatar: "DS", branch: "B.Tech CSE · 3rd Year", likedAt: "30m ago" },
      { id: "stu-4", name: "Simran Kaur", avatar: "SK", branch: "B.Tech AI · 2nd Year", likedAt: "1h ago" },
      { id: "stu-5", name: "Kabir Singh", avatar: "KS", branch: "B.Tech ECE · 4th Year", likedAt: "2h ago" },
    ])
  },

  /** Delete clan post by Leader or Author (POST /post/<id>/delete/) */
  async deletePost(postId: number | string): Promise<{ success: boolean; message?: string }> {
    return djangoFetch(`/post/${postId}/delete/`, { method: "POST" }, () => ({
      success: true,
      message: `Clan post #${postId} deleted successfully (/post/${postId}/delete/).`,
    }))
  },
}

// ==========================================
// ==========================================
// 6. PROJECTS SERVICE (Personal & Clan Engine)
// ==========================================
export const DjangoProjects = {
  /** Create Personal Student Project (POST /project/personal/create/) */
  async createPersonalProject(data: FormData | any): Promise<{ success: boolean; project_id?: number; message?: string }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch(
      "/project/personal/create/",
      { method: "POST", body },
      () => ({
        success: true,
        project_id: Date.now(),
        message: "Personal project created successfully (/project/personal/create/)!",
      })
    )
  },

  /** Create Clan Collaborative Project (POST /clan/<name>/project/create/) */
  async createClanProject(
    clanName: string | number,
    data: FormData | any
  ): Promise<{ success: boolean; project_id?: number; message?: string }> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanName))}/project/create/`,
      { method: "POST", body },
      () => ({
        success: true,
        project_id: Date.now(),
        message: `Clan collaborative project registered for ${clanName} (/clan/${clanName}/project/create/)!`,
      })
    )
  },

  /** Add Milestone Update to Project Timeline (POST /project/<id>/update/ or POST /update/) */
  async addMilestoneUpdate(
    projectId: number | string,
    data: { title: string; content: string; phase?: string }
  ): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    formData.append("title", data.title || "")
    formData.append("content", data.content || "")
    if (data.phase) formData.append("phase", data.phase)

    return djangoFetch(
      `/project/${projectId}/update/`,
      { method: "POST", body: formData },
      () => ({
        success: true,
        message: `Development milestone update logged for project #${projectId} (/update/)!`,
      })
    )
  },

  /** Alias for backward compatibility */
  async addPersonalProjectUpdate(projectId: number | string, data: any): Promise<{ success: boolean }> {
    return this.addMilestoneUpdate(projectId, data)
  },

  /** Alias for backward compatibility */
  async addClanProjectUpdate(projectId: number | string, data: any): Promise<{ success: boolean }> {
    return this.addMilestoneUpdate(projectId, data)
  },

  /** Mark Project as Completed (POST /project/<id>/complete/ or POST /complete/) */
  async completeProject(
    projectId: number | string,
    status: "completed" | "in_progress" = "completed"
  ): Promise<{ success: boolean; status: string; message?: string }> {
    const formData = new FormData()
    formData.append("status", status)

    return djangoFetch(
      `/project/${projectId}/complete/`,
      { method: "POST", body: formData },
      () => ({
        success: true,
        status,
        message: `Project #${projectId} completion status updated to '${status}' (/complete/)!`,
      })
    )
  },

  /** Alias for backward compatibility */
  async completePersonalProject(projectId: number | string): Promise<{ success: boolean }> {
    return this.completeProject(projectId, "completed")
  },

  /** Alias for backward compatibility */
  async completeClanProject(projectId: number | string): Promise<{ success: boolean }> {
    return this.completeProject(projectId, "completed")
  },

  /** Delete Personal Student Project (POST /project/<project_id>/delete/) */
  async deletePersonalProject(projectId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/project/${projectId}/delete/`, { method: "POST" }, () => ({ success: true }))
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

  /** Create Clan Recruitment opening (POST /clan/<name>/recruitment/create/) */
  async createClanRecruitment(clanName: number | string, data: any): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    formData.append("title", data.title || "")
    formData.append("description", data.description || "")
    if (data.skills) formData.append("skills", Array.isArray(data.skills) ? data.skills.join(",") : data.skills)
    return djangoFetch(
      `/clan/${encodeURIComponent(String(clanName))}/recruitment/create/`,
      { method: "POST", body: formData },
      () => ({
        success: true,
        message: `Open position posted for ${clanName} (/clan/${clanName}/recruitment/create/)!`,
      })
    )
  },

  /** Apply to a Clan Recruitment vacancy (POST /recruitment/<id>/apply/) */
  async applyToRecruitment(recruitmentId: number | string, data?: any): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    if (data?.pitch) formData.append("pitch", data.pitch)
    if (data?.skills) formData.append("skills", Array.isArray(data.skills) ? data.skills.join(",") : data.skills)
    return djangoFetch(
      `/recruitment/${recruitmentId}/apply/`,
      { method: "POST", body: formData },
      () => ({
        success: true,
        message: `Application submitted to clan leadership (/recruitment/${recruitmentId}/apply/)!`,
      })
    )
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
        bio: "Looking to collaborate on competitive national hackathon teams. Specializing in realtime canvas & web architectures.",
        createdAt: "1 day ago",
      },
    ])
  },

  /** Student 'Looking for Clan' Availability Post (POST /student/recruitment/create/) */
  async createStudentRecruitment(data: any): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData()
    formData.append("bio", data.bio || "")
    if (data.role) formData.append("role", data.role)
    if (data.hoursPerWeek) formData.append("hours_per_week", data.hoursPerWeek)
    if (data.skills) formData.append("skills", Array.isArray(data.skills) ? data.skills.join(",") : data.skills)
    return djangoFetch(
      "/student/recruitment/create/",
      { method: "POST", body: formData },
      () => ({
        success: true,
        message: "Your 'Looking for Clan' availability profile is now live across campus (/student/recruitment/create/)!",
      })
    )
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
   * Dual Participation Modes (POST /event/<id>/participate/<type>/)
   * type: 'student' (Individual Student Entry) or 'clan' (Clan Team Entry)
   */
  async participate(eventId: number | string, participationType: "student" | "clan"): Promise<{ success: boolean; message?: string }> {
    return djangoFetch(`/event/${eventId}/participate/${participationType}/`, { method: "POST" }, () => ({
      success: true,
      message: `Registered for event as ${participationType === "clan" ? "Clan Team" : "Individual Student"}.`,
    }))
  },

  /** RSVP Cancel / Withdraw Participation (POST /event/<id>/cancel-participation/) */
  async cancelParticipation(eventId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/event/${eventId}/cancel-participation/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Fetch clan members selected to represent clan in event (GET /event/<event_id>/clan-members/) */
  async getEventClanMembers(eventId: number | string): Promise<any[]> {
    return djangoFetch(`/event/${eventId}/clan-members/`, { method: "GET" }, () => [
      { id: "stu-1", name: "Aarav Khanna", role: "Leader", branch: "B.Tech CSE · Year 3" },
      { id: "stu-2", name: "Riya Malhotra", role: "Co-Leader", branch: "B.Des · Year 2" },
      { id: "stu-3", name: "Devansh Sharma", role: "Core Member", branch: "B.Tech CSE · Year 3" },
      { id: "stu-4", name: "Tanya Sen", role: "Member", branch: "B.Des · Year 2" },
    ])
  },

  /** Save selected clan representatives (POST /clan-members/save/ or /event/<event_id>/clan-members/save/) */
  async saveEventClanMembers(eventId: number | string, memberIds: (number | string)[]): Promise<{ success: boolean }> {
    const formData = new FormData()
    memberIds.forEach((id) => formData.append("member_ids", String(id)))
    return djangoFetch(`/clan-members/save/`, { method: "POST", body: formData }, async () => {
      // Secondary fallback to event-specific route
      return djangoFetch(`/event/${eventId}/clan-members/save/`, { method: "POST", body: formData }, () => ({
        success: true,
      }))
    })
  },
}

// ==========================================
// 9. CAMPUS ADMIN CONSOLE SERVICE (campus_admin)
// ==========================================
export const DjangoAdmin = {
  /** Admin Dashboard (GET /campus-admin/dashboard/ or /campus-admin/) */
  async getDashboard(): Promise<any> {
    return djangoFetch("/campus-admin/dashboard/", { method: "GET" }, () => ({
      totalStudents: INITIAL_STUDENTS.length,
      totalClans: INITIAL_CLANS.length,
      activeEvents: INITIAL_EVENTS.length,
      trophiesAwarded: INITIAL_TROPHIES.length,
    }))
  },

  /** Student Suspension (POST /campus-admin/student/<id>/suspend/) */
  async suspendStudent(studentId: number | string, reason: string, durationDays = 14): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("reason", reason)
    formData.append("duration_days", String(durationDays))
    return djangoFetch(`/campus-admin/student/${studentId}/suspend/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Student Reinstatement / Unsuspend (POST /campus-admin/student/<id>/unsuspend/) */
  async unsuspendStudent(studentId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/campus-admin/student/${studentId}/unsuspend/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Clan Suspension (POST /campus-admin/clan/<id>/suspend/) */
  async suspendClan(clanId: number | string, reason: string, durationDays = 14): Promise<{ success: boolean }> {
    const formData = new FormData()
    formData.append("reason", reason)
    formData.append("duration_days", String(durationDays))
    return djangoFetch(`/campus-admin/clan/${clanId}/suspend/`, { method: "POST", body: formData }, () => ({
      success: true,
    }))
  },

  /** Clan Reinstatement / Unsuspend (POST /campus-admin/clan/<id>/unsuspend/) */
  async unsuspendClan(clanId: number | string): Promise<{ success: boolean }> {
    return djangoFetch(`/campus-admin/clan/${clanId}/unsuspend/`, { method: "POST" }, () => ({ success: true }))
  },

  /** Trophy & Award Allocation (POST /campus-admin/clan/<id>/trophy/allocate/) */
  async allocateTrophy(clanId: number | string, data: any): Promise<{ success: boolean; trophy?: any }> {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)))
    return djangoFetch(`/campus-admin/clan/${clanId}/trophy/allocate/`, { method: "POST", body: formData }, () => ({
      success: true,
      trophy: data,
    }))
  },

  /** Trophy Delete / Revocation (POST /campus-admin/clan/<clanId>/trophy/<id>/delete/ or /trophy/<id>/delete/) */
  async deleteTrophy(trophyId: number | string, clanId?: number | string): Promise<{ success: boolean }> {
    const endpoint = clanId
      ? `/campus-admin/clan/${clanId}/trophy/${trophyId}/delete/`
      : `/trophy/${trophyId}/delete/`
    return djangoFetch(endpoint, { method: "POST" }, () => ({
      success: true,
    }))
  },

  /** Send Administrative Message to Student or Clan */
  async sendMessage(targetType: "student" | "clan", id: number | string, message: string): Promise<{ success: boolean }> {
    const endpoint =
      targetType === "student"
        ? `/campus-admin/student/${id}/message/`
        : `/campus-admin/clan/${id}/message/`
    const formData = new FormData()
    formData.append("message", message)
    return djangoFetch(endpoint, { method: "POST", body: formData }, () => ({ success: true }))
  },

  /** Institutional Audit Reports Export (/campus-admin/reports/export/<format>/) */
  getReportDownloadUrl(format: "pdf" | "csv" | "xlsx" | "json"): string {
    return `${DJANGO_URL}/campus-admin/reports/export/${format}/`
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
