/**
 * MERN Architecture Unified API Service Client
 * Connects frontend React components to the Express.js + MongoDB backend.
 */

import { INITIAL_STUDENTS, INITIAL_CLANS, INITIAL_EVENTS, INITIAL_TROPHIES } from "@/data/mockData"
import { INITIAL_NOTIFICATIONS } from "@/components/notifications/notification.jsx"

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("campus_clans_jwt")
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}: Request failed`)
  }

  return response.json()
}

export const mernApi = {
  // --- AUTHENTICATION ---
  auth: {
    login: async (email: string, password = "password", role = "student") => {
      return request<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      })
    },
    register: async (name: string, email: string, password = "password", role = "student") => {
      return request<{ token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      })
    },
    getMe: async () => {
      return request<{ user: any }>("/auth/me")
    },
  },

  // --- STUDENTS ---
  students: {
    getAll: async () => {
      try {
        return await request<any[]>("/students")
      } catch {
        return [...INITIAL_STUDENTS]
      }
    },
    getById: async (id: string) => {
      try {
        return await request<any>(`/students/${id}`)
      } catch {
        return INITIAL_STUDENTS.find((s) => s.id === id)
      }
    },
    update: async (id: string, updates: any) => {
      return request<any>(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      })
    },
  },

  // --- CLANS ---
  clans: {
    getAll: async () => {
      try {
        return await request<any[]>("/clans")
      } catch {
        return [...INITIAL_CLANS]
      }
    },
    getByName: async (name: string) => {
      try {
        return await request<any>(`/clans/${encodeURIComponent(name)}`)
      } catch {
        return INITIAL_CLANS.find((c) => c.name === name)
      }
    },
    join: async (clanId: string, studentId: string) => {
      return request<any>(`/clans/${clanId}/join`, {
        method: "POST",
        body: JSON.stringify({ studentId }),
      })
    },
    update: async (clanId: string, updates: any) => {
      return request<any>(`/clans/${clanId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      })
    },
  },

  // --- EVENTS ---
  events: {
    getAll: async () => {
      try {
        return await request<any[]>("/events")
      } catch {
        return [...INITIAL_EVENTS]
      }
    },
    rsvp: async (eventId: string | number, studentId: string) => {
      return request<any>(`/events/${eventId}/rsvp`, {
        method: "POST",
        body: JSON.stringify({ studentId }),
      })
    },
    create: async (eventData: any) => {
      return request<any>("/events", {
        method: "POST",
        body: JSON.stringify(eventData),
      })
    },
  },

  // --- POSTS ---
  posts: {
    getAll: async () => {
      return request<any[]>("/posts")
    },
    create: async (postData: any) => {
      return request<any>("/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      })
    },
    like: async (postId: string) => {
      return request<any>(`/posts/${postId}/like`, { method: "POST" })
    },
    comment: async (postId: string, text: string) => {
      return request<any>(`/posts/${postId}/comment`, {
        method: "POST",
        body: JSON.stringify({ text }),
      })
    },
  },

  // --- NOTIFICATIONS ---
  notifications: {
    getAll: async () => {
      try {
        return await request<any[]>("/notifications")
      } catch {
        return [...INITIAL_NOTIFICATIONS]
      }
    },
    markRead: async (id: string) => {
      return request<any>(`/notifications/${id}/read`, { method: "PUT" })
    },
    markAllRead: async () => {
      return request<any>("/notifications/read-all", { method: "PUT" })
    },
    delete: async (id: string) => {
      return request<any>(`/notifications/${id}`, { method: "DELETE" })
    },
  },

  // --- TROPHIES ---
  trophies: {
    getAll: async () => {
      try {
        return await request<any[]>("/trophies")
      } catch {
        return [...INITIAL_TROPHIES]
      }
    },
    allocate: async (trophyData: any) => {
      return request<any>("/trophies", {
        method: "POST",
        body: JSON.stringify(trophyData),
      })
    },
  },
}

export default mernApi
