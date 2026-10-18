import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { mernApi } from "@/services/mernApi"

export type UserRole = "student" | "admin"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  clanName?: string
  skills?: string[]
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, role: UserRole, password?: string) => Promise<boolean>
  register: (name: string, email: string, role: UserRole, password?: string) => Promise<boolean>
  logout: () => void
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "campus_clans_jwt"
const USER_KEY = "campus_clans_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Hydrate session from localStorage on startup
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY)
      const savedUser = localStorage.getItem(USER_KEY)

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch (e) {
      console.warn("[Auth] Failed to load saved session:", e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, role: UserRole, password = "••••••••"): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await mernApi.auth.login(email, password, role)
      if (res && res.token && res.user) {
        setToken(res.token)
        setUser(res.user)
        localStorage.setItem(TOKEN_KEY, res.token)
        localStorage.setItem(USER_KEY, JSON.stringify(res.user))
        return true
      }
    } catch (err) {
      console.warn("[Auth] MERN Backend offline, using local simulated login:", err)
    } finally {
      setIsLoading(false)
    }

    // Offline / Mock Fallback
    const fallbackUser: AuthUser = {
      id: role === "admin" ? "admin-1" : "stu-1",
      name: role === "admin" ? "Maya Kapoor" : "Aarav Khanna",
      email: email.trim() || (role === "admin" ? "admin@campus.edu" : "aarav.k@campus.edu"),
      role,
      avatar: role === "admin" ? "MK" : "AK",
      clanName: role === "admin" ? undefined : "Pixel Pirates",
      skills: role === "admin" ? ["Administration", "Audit", "Governance"] : ["React", "UI/UX", "Tailwind", "Figma"],
    }
    const simulatedToken = `jwt_sim_${Date.now()}_${role}`

    setToken(simulatedToken)
    setUser(fallbackUser)
    localStorage.setItem(TOKEN_KEY, simulatedToken)
    localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser))
    return true
  }

  const register = async (name: string, email: string, role: UserRole, password = "••••••••"): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await mernApi.auth.register(name, email, password, role)
      if (res && res.token && res.user) {
        setToken(res.token)
        setUser(res.user)
        localStorage.setItem(TOKEN_KEY, res.token)
        localStorage.setItem(USER_KEY, JSON.stringify(res.user))
        return true
      }
    } catch (err) {
      console.warn("[Auth] MERN Backend offline, using local simulated register:", err)
    } finally {
      setIsLoading(false)
    }

    const fallbackUser: AuthUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      clanName: role === "student" ? "Pixel Pirates" : undefined,
    }
    const simulatedToken = `jwt_sim_${Date.now()}_${role}`

    setToken(simulatedToken)
    setUser(fallbackUser)
    localStorage.setItem(TOKEN_KEY, simulatedToken)
    localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser))
    return true
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
