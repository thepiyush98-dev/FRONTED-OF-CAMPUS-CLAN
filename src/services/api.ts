/**
 * Campus Admin & Campus Clans — Unified AJAX API Service Layer
 * 
 * Provides asynchronous HTTP methods (GET, POST, PUT, DELETE) using standard browser fetch.
 * Designed for plug-and-play backend integration (Django REST Framework, Node.js, FastAPI, etc.).
 * Includes automatic JSON serialization, CSRF tokens, timeout protection, and mock fallback.
 */

import {
  Student,
  Clan,
  EventItem,
  EventParticipant,
  Trophy,
  CampusMessage,
  AuditLogItem,
  MonthlyReportSummary,
} from "@/types"
import {
  INITIAL_STUDENTS,
  INITIAL_CLANS,
  INITIAL_EVENTS,
  INITIAL_TROPHIES,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_PARTICIPANTS,
} from "@/data/mockData"

// Configurable API root endpoint (defaults to /api or Vite environment variable)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "")

// Local persistent in-memory store for seamless offline/prototype operation
const localDB = {
  students: [...INITIAL_STUDENTS],
  clans: [...INITIAL_CLANS],
  events: [...INITIAL_EVENTS],
  trophies: [...INITIAL_TROPHIES],
  messages: [...INITIAL_MESSAGES],
  auditLogs: [...INITIAL_AUDIT_LOGS],
  participants: { ...INITIAL_PARTICIPANTS } as Record<string, EventParticipant[]>,
}

/**
 * Standard AJAX Request Helper
 * Executes real browser fetch() with timeout, JSON headers, and fallback.
 */
async function ajaxRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackHandler?: () => Promise<T> | T
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  // Retrieve CSRF token from cookie if available (Standard Django / Rails convention)
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1]

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    ...(options.headers || {}),
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // If backend responded with 404 or 500 and a fallback is provided, use fallback
      if (fallbackHandler && (response.status === 404 || response.status >= 500)) {
        console.warn(`[AJAX] Server returned ${response.status} at ${url}. Falling back to local data store.`)
        return await fallbackHandler()
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `AJAX request failed with HTTP ${response.status}`)
    }

    return (await response.json()) as T
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    const error = err as Error

    // Gracefully handle backend offline / connection refused
    if (fallbackHandler) {
      console.info(
        `%c[AJAX Fallback] %c${options.method || "GET"} ${url} (${error.message || "Server unreachable"})`,
        "color: #f5b800; font-weight: bold;",
        "color: #64748b;"
      )
      // Simulate authentic 250ms network latency
      await new Promise((resolve) => setTimeout(resolve, 250))
      return await fallbackHandler()
    }

    throw error
  }
}

// ==========================================
// 1. STUDENTS API SERVICE
// ==========================================
export const StudentsAPI = {
  /** GET /api/students — Fetch full student directory */
  async getAll(): Promise<Student[]> {
    return ajaxRequest<Student[]>("/students", { method: "GET" }, () => [...localDB.students])
  },

  /** PUT /api/students/:id — Update permitted student profile fields */
  async update(id: string, updates: Partial<Student>): Promise<Student> {
    return ajaxRequest<Student>(
      `/students/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      },
      () => {
        const index = localDB.students.findIndex((s) => s.id === id)
        if (index === -1) throw new Error("Student not found")
        localDB.students[index] = { ...localDB.students[index], ...updates }
        return localDB.students[index]
      }
    )
  },

  /** POST /campus-admin/student/:id/suspend/ — Suspend student per Django backend */
  async suspend(id: string, reason: string, durationDays: number): Promise<Student> {
    const end = new Date()
    end.setDate(end.getDate() + durationDays)
    const endDateStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    return ajaxRequest<Student>(
      `/campus-admin/student/${id}/suspend/`,
      {
        method: "POST",
        body: JSON.stringify({ reason, durationDays, endDate: endDateStr }),
      },
      () => {
        const index = localDB.students.findIndex((s) => s.id === id)
        if (index === -1) throw new Error("Student not found")
        localDB.students[index] = {
          ...localDB.students[index],
          status: "Suspended",
          suspensionDetails: {
            reason,
            durationDays,
            startDate: new Date().toISOString().split("T")[0],
            endDate: endDateStr,
          },
        }
        return localDB.students[index]
      }
    )
  },

  /** POST /campus-admin/student/:id/unsuspend/ — Lift suspension and restore access */
  async restore(id: string): Promise<Student> {
    return ajaxRequest<Student>(
      `/campus-admin/student/${id}/unsuspend/`,
      { method: "POST" },
      () => {
        const index = localDB.students.findIndex((s) => s.id === id)
        if (index === -1) throw new Error("Student not found")
        localDB.students[index] = {
          ...localDB.students[index],
          status: "Active",
          suspensionDetails: undefined,
        }
        return localDB.students[index]
      }
    )
  },
}

// ==========================================
// 2. CLANS API SERVICE
// ==========================================
export const ClansAPI = {
  /** GET /api/clans — Fetch active clans directory */
  async getAll(): Promise<Clan[]> {
    return ajaxRequest<Clan[]>("/clans", { method: "GET" }, () => [...localDB.clans])
  },

  /** POST /campus-admin/clan/:id/suspend/ — Suspend clan */
  async suspend(id: string, reason: string, durationDays: number): Promise<Clan> {
    const end = new Date()
    end.setDate(end.getDate() + durationDays)
    const endDateStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    return ajaxRequest<Clan>(
      `/campus-admin/clan/${id}/suspend/`,
      {
        method: "POST",
        body: JSON.stringify({ reason, durationDays }),
      },
      () => {
        const index = localDB.clans.findIndex((c) => c.id === id)
        if (index === -1) throw new Error("Clan not found")
        localDB.clans[index] = {
          ...localDB.clans[index],
          status: "Suspended",
          suspensionDetails: {
            reason,
            durationDays,
            startDate: new Date().toISOString().split("T")[0],
            endDate: endDateStr,
          },
        }
        return localDB.clans[index]
      }
    )
  },

  /** POST /campus-admin/clan/:id/unsuspend/ — Restore clan */
  async restore(id: string): Promise<Clan> {
    return ajaxRequest<Clan>(
      `/campus-admin/clan/${id}/unsuspend/`,
      { method: "POST" },
      () => {
        const index = localDB.clans.findIndex((c) => c.id === id)
        if (index === -1) throw new Error("Clan not found")
        localDB.clans[index] = {
          ...localDB.clans[index],
          status: "Active",
          suspensionDetails: undefined,
        }
        return localDB.clans[index]
      }
    )
  },

  /** POST /clan/:clanId/remove-member/ — Remove student from clan */
  async removeMember(clanId: string, memberId: string): Promise<Clan> {
    return ajaxRequest<Clan>(
      `/clan/${clanId}/remove-member/`,
      {
        method: "POST",
        body: JSON.stringify({ student_id: memberId }),
      },
      () => {
        const clan = localDB.clans.find((c) => c.id === clanId)
        if (!clan) throw new Error("Clan not found")
        clan.members = clan.members.filter((m) => m.id !== memberId)
        clan.memberCount = clan.members.length
        return clan
      }
    )
  },
}

// ==========================================
// 3. EVENTS API SERVICE
// ==========================================
export const EventsAPI = {
  /** GET /api/events — Fetch campus events */
  async getAll(): Promise<EventItem[]> {
    return ajaxRequest<EventItem[]>("/events", { method: "GET" }, () => [...localDB.events])
  },

  /** POST /api/events — Create new event */
  async create(data: Omit<EventItem, "id" | "registeredCount">): Promise<EventItem> {
    return ajaxRequest<EventItem>(
      "/events",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      () => {
        const newEvent: EventItem = {
          ...data,
          id: `ev-${Date.now()}`,
          registeredCount: 0,
        }
        localDB.events.unshift(newEvent)
        return newEvent
      }
    )
  },

  /** PUT /api/events/:id — Update existing event */
  async update(id: string, updates: Partial<EventItem>): Promise<EventItem> {
    return ajaxRequest<EventItem>(
      `/events/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      },
      () => {
        const index = localDB.events.findIndex((e) => e.id === id)
        if (index === -1) throw new Error("Event not found")
        localDB.events[index] = { ...localDB.events[index], ...updates }
        return localDB.events[index]
      }
    )
  },

  /** GET /api/events/:id/participants — Fetch participant list with lock states */
  async getParticipants(eventId: string): Promise<EventParticipant[]> {
    return ajaxRequest<EventParticipant[]>(
      `/events/${eventId}/participants`,
      { method: "GET" },
      () => localDB.participants[eventId] || []
    )
  },
}

// ==========================================
// 4. TROPHIES & RECOGNITION API
// ==========================================
export const TrophiesAPI = {
  /** GET /api/trophies — Fetch awarded trophies */
  async getAll(): Promise<Trophy[]> {
    return ajaxRequest<Trophy[]>("/trophies", { method: "GET" }, () => [...localDB.trophies])
  },

  /** POST /campus-admin/clan/:clanId/trophy/allocate/ — Award trophy with Django backend */
  async award(trophy: Omit<Trophy, "id">): Promise<Trophy> {
    const clanId = trophy.clanId || "1"
    return ajaxRequest<Trophy>(
      `/campus-admin/clan/${clanId}/trophy/allocate/`,
      {
        method: "POST",
        body: JSON.stringify(trophy),
      },
      () => {
        const newTrophy: Trophy = {
          ...trophy,
          id: `tr-${Date.now()}`,
          awardDate: trophy.awardDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        }
        localDB.trophies.unshift(newTrophy)
        return newTrophy
      }
    )
  },

  /** POST /campus-admin/trophy/:id/delete/ — Delete trophy */
  async delete(id: string): Promise<{ success: boolean }> {
    return ajaxRequest<{ success: boolean }>(
      `/campus-admin/trophy/${id}/delete/`,
      { method: "POST" },
      () => {
        const idx = localDB.trophies.findIndex((t) => t.id === id)
        if (idx !== -1) localDB.trophies.splice(idx, 1)
        return { success: true }
      }
    )
  },
}

// ==========================================
// 5. CAMPUS MESSAGES API (Section 7 AJAX)
// ==========================================
export const MessagesAPI = {
  /** GET /api/messages — Fetch sent message history */
  async getAll(): Promise<CampusMessage[]> {
    return ajaxRequest<CampusMessage[]>("/messages", { method: "GET" }, () => [...localDB.messages])
  },

  /** POST /api/messages — Dispatch broadcast message */
  async send(data: Omit<CampusMessage, "id" | "sentAt" | "deliveryStatus">): Promise<CampusMessage> {
    return ajaxRequest<CampusMessage>(
      "/messages",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      () => {
        const newMessage: CampusMessage = {
          ...data,
          id: `msg-${Date.now()}`,
          sentAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          deliveryStatus: "delivered",
        }
        localDB.messages.unshift(newMessage)
        return newMessage
      }
    )
  },
}

// ==========================================
// 6. REPORTS API (Section 11 AJAX)
// ==========================================
export const ReportsAPI = {
  /** POST /api/reports/monthly — Asynchronously generate institutional monthly PDF */
  async generateMonthly(month: string, year: number): Promise<MonthlyReportSummary> {
    return ajaxRequest<MonthlyReportSummary>(
      "/reports/monthly",
      {
        method: "POST",
        body: JSON.stringify({ month, year }),
      },
      () => ({
        periodMonth: month,
        periodYear: year,
        generatedAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        totalStudents: localDB.students.length,
        totalClans: localDB.clans.length,
        studentsWithoutClan: localDB.students.filter((s) => !s.clan).length,
        clanProjects: 26,
        studentProjects: 48,
        upcomingEvents: localDB.events.filter((e) => e.status === "upcoming").length,
        monthlyClanApplications: 28,
      })
    )
  },
}

// ==========================================
// 7. AUDIT LOGS API (Section 12)
// ==========================================
export const AuditAPI = {
  /** GET /api/audit-logs — Traceable administrative action logs */
  async getAll(): Promise<AuditLogItem[]> {
    return ajaxRequest<AuditLogItem[]>("/audit-logs", { method: "GET" }, () => [...localDB.auditLogs])
  },

  /** POST /api/audit-logs — Log new administrative event */
  async log(entry: Omit<AuditLogItem, "id" | "timestamp">): Promise<AuditLogItem> {
    return ajaxRequest<AuditLogItem>(
      "/audit-logs",
      {
        method: "POST",
        body: JSON.stringify(entry),
      },
      () => {
        const item: AuditLogItem = {
          ...entry,
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
        localDB.auditLogs.unshift(item)
        return item
      }
    )
  },
}

// Unified default export
const api = {
  students: StudentsAPI,
  clans: ClansAPI,
  events: EventsAPI,
  trophies: TrophiesAPI,
  messages: MessagesAPI,
  reports: ReportsAPI,
  audit: AuditAPI,
}

export default api
