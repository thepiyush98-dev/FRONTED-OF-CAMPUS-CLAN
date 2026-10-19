import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { djangoApi } from "@/services/djangoApi"

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
  login: (usernameOrEmail: string, role?: UserRole, password?: string) => Promise<boolean>
  register: (name: string, email: string, role: UserRole, password?: string) => Promise<boolean>
  sendOtp: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
  registerStudent: (data: {
    name: string
    department: string
    branch: string
    email: string
    username: string
    password: string
    confirm_password: string
  }) => Promise<{ success: boolean; error?: string }>
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

  const login = async (usernameOrEmail: string, role?: UserRole, password = "••••••••"): Promise<boolean> => {
    setIsLoading(true)
    const isAdmin = usernameOrEmail.toLowerCase().includes("admin") || role === "admin"
    const targetRole: UserRole = role || (isAdmin ? "admin" : "student")
    try {
      const res = await djangoApi.auth.login(usernameOrEmail, password)
      if (res && res.success) {
        const detectedRole: UserRole = res.role || targetRole
        const authUser: AuthUser = {
          id: detectedRole === "admin" ? "admin-1" : "stu-1",
          name: detectedRole === "admin" ? "Maya Kapoor" : usernameOrEmail.split("@")[0].replace(".", " "),
          email: usernameOrEmail.includes("@") ? usernameOrEmail : `${usernameOrEmail}@campus.edu`,
          role: detectedRole,
          avatar: detectedRole === "admin" ? "MK" : "AK",
          clanName: detectedRole === "admin" ? undefined : "Pixel Pirates",
          skills: detectedRole === "admin" ? ["Administration", "Governance"] : ["React", "Tailwind", "Python"],
        }
        const sessionToken = `django_session_${Date.now()}`
        setToken(sessionToken)
        setUser(authUser)
        localStorage.setItem(TOKEN_KEY, sessionToken)
        localStorage.setItem(USER_KEY, JSON.stringify(authUser))
        return true
      }
    } catch (err) {
      console.warn("[Auth] Django backend offline, using simulated local session:", err)
    } finally {
      setIsLoading(false)
    }

    // Offline / Mock Fallback
    const fallbackUser: AuthUser = {
      id: targetRole === "admin" ? "admin-1" : "stu-1",
      name: targetRole === "admin" ? "Maya Kapoor" : (usernameOrEmail.includes("@") ? usernameOrEmail.split("@")[0].replace(".", " ") : (usernameOrEmail || "Aarav Khanna")),
      email: usernameOrEmail.trim() || (targetRole === "admin" ? "admin@campus.edu" : "aarav.k@campus.edu"),
      role: targetRole,
      avatar: targetRole === "admin" ? "MK" : "AK",
      clanName: targetRole === "admin" ? undefined : "Pixel Pirates",
      skills: targetRole === "admin" ? ["Administration", "Audit", "Governance"] : ["React", "UI/UX", "Tailwind", "Figma"],
    }
    const simulatedToken = `jwt_sim_${Date.now()}_${targetRole}`

    setToken(simulatedToken)
    setUser(fallbackUser)
    localStorage.setItem(TOKEN_KEY, simulatedToken)
    localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser))
    return true
  }

  const sendOtp = async (email: string) => {
    return await djangoApi.auth.sendOtp(email)
  }

  const verifyOtp = async (email: string, otp: string) => {
    return await djangoApi.auth.verifyOtp(email, otp)
  }

  const registerStudent = async (data: {
    name: string
    department: string
    branch: string
    email: string
    username: string
    password: string
    confirm_password: string
  }) => {
    setIsLoading(true)
    try {
      const res = await djangoApi.auth.registerStudent(data)
      if (res && res.success) {
        const newUser: AuthUser = {
          id: `stu-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: "student",
          avatar: data.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
          clanName: "Pixel Pirates",
          skills: ["React", "Tailwind CSS"],
        }
        const sessionToken = `django_session_${Date.now()}`
        setToken(sessionToken)
        setUser(newUser)
        localStorage.setItem(TOKEN_KEY, sessionToken)
        localStorage.setItem(USER_KEY, JSON.stringify(newUser))
        return { success: true }
      }
      return { success: false, error: res?.error || "Registration failed" }
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to connect to backend" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, role: UserRole, password = "••••••••"): Promise<boolean> => {
    return (await registerStudent({
      name,
      department: "School of Engineering",
      branch: "CSE",
      email,
      username: email.split("@")[0],
      password,
      confirm_password: password,
    })).success
  }

  const logout = () => {
    djangoApi.auth.logout().catch(() => {})
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
        sendOtp,
        verifyOtp,
        registerStudent,
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
