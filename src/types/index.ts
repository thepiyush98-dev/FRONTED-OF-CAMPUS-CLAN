/**
 * Campus Admin — Types & Data Contracts
 * Based on "Campus Admin — Complete Product & UI/UX Handoff Document"
 */

// Navigation sections grouped into 4 core areas as per Section 2
export type NavigationArea = "overview" | "community" | "events" | "administration"

export type ActiveScreen =
  // Area 1: Overview
  | "dashboard"
  | "reports"
  // Area 2: Community
  | "students"
  | "clans"
  | "messages"
  // Area 3: Events
  | "events"
  | "trophies"
  // Area 4: Administration
  | "suspensions"
  | "audit-log"

export type AccountStatus = "Active" | "Suspended"
export type EventStatus = "Upcoming" | "Active" | "Ended"
export type ParticipationMode = "individual" | "clan" | "both"

/**
 * Student entity
 * Detailed in Section 4 (Student Management)
 */
export interface Student {
  id: string
  name: string
  username: string
  department: string
  branch: string
  year: string
  email: string
  avatar: string
  clanName?: string
  status: AccountStatus
  skills: string[]
  about: string
  socialLinks?: {
    github?: string
    linkedin?: string
    portfolio?: string
  }
  projectsCount: number
  trophiesCount: number
  suspensionDetails?: {
    reason: string
    startDate: string
    endDate: string
    durationDays: number
  }
}

/**
 * Clan member inside a clan roster
 */
export interface ClanMember {
  studentId: string
  name: string
  role: "Leader" | "Co-Leader" | "Core Member" | "Contributor"
  branch: string
}

/**
 * Clan entity
 * Detailed in Section 5 (Clan Management)
 */
export interface Clan {
  id: string
  name: string
  initials: string
  speciality: string
  bannerColor: string
  memberCount: number
  leaderName: string
  status: AccountStatus
  shortDescription: string
  fullDescription: string
  projectsCount: number
  activeProjects: string[]
  recruitmentOpenings: string[]
  trophiesCount: number
  members: ClanMember[]
  suspensionDetails?: {
    reason: string
    startDate: string
    endDate: string
    durationDays: number
  }
}

/**
 * Event Participant
 * Detailed in Section 9 (Event participation and application review)
 */
export interface EventParticipant {
  id: string
  type: "individual" | "clan"
  name: string
  registeredAt: string
  status: "Confirmed" | "Pending Approval"
  representatives?: string[] // Clan reps (locked 24h before event ends)
  isSuspendedClan?: boolean
}

/**
 * Event entity
 * Detailed in Section 8 & 10
 */
export interface EventItem {
  id: string
  title: string
  type: "Hackathon" | "Workshop" | "Talk" | "Build Night" | "Competition"
  description: string
  location: string
  startDate: string
  endDate: string
  time: string
  status: EventStatus
  participationMode: ParticipationMode
  accentColor: string
  externalLink?: string
  mediaUrl?: string
  participantsCount: number
  trophiesAwarded: boolean
  endedHoursAgo?: number // Used for 48h trophy deadline reminder
}

/**
 * Trophy entity
 * Detailed in Section 10 (Trophy Management)
 */
export interface Trophy {
  id: string
  name: string
  description: string
  eventId: string
  eventName: string
  recipientType: "student" | "clan"
  recipientName: string
  clanRepresentatives?: string[]
  awardDate: string
}

/**
 * Campus Message / Announcement
 * Detailed in Section 7 (Campus messages and announcements)
 */
export interface CampusMessage {
  id: string
  audienceType: "individual" | "clan"
  recipientId: string
  recipientName: string
  subject: string
  body: string
  sentAt: string
  deliveryStatus: "Delivered" | "Read" | "Sending"
}

/**
 * Administrative Audit Log item
 * Detailed in Section 12 (History retention and administrative records)
 */
export interface AuditLogItem {
  id: string
  action: string
  targetType: "student" | "clan" | "event" | "trophy" | "message"
  targetName: string
  performedBy: string
  timestamp: string
  details: string
  historicalLabel?: "Deleted student" | "Deleted clan" | "Former member" | "Removed from clan"
}

/**
 * Monthly Institutional Report Data
 * Detailed in Section 11 (Monthly reports)
 */
export interface MonthlyReportSummary {
  periodMonth: string
  periodYear: number
  generatedAt: string
  totalStudents: number
  totalClans: number
  studentsWithoutClan: number
  clanProjects: number
  studentProjects: number
  upcomingEvents: number
  monthlyClanApplications: number
}

// ==========================================
// DJANGO BACKEND MODELS & DATA CONTRACTS
// ==========================================

export interface ClanStoryItem {
  id: string | number
  clanId: string | number
  clanName: string
  clanLogo?: string
  mediaUrl: string
  mediaType: "image" | "video"
  caption: string
  viewsCount: number
  likesCount: number
  isLiked: boolean
  createdAt: string
  expiresAt?: string
}

export interface PostLiker {
  id: string
  name: string
  avatar: string
  branch: string
  likedAt: string
}

export interface ClanPostItem {
  id: string | number
  clanId: string | number
  clanName: string
  authorId: string | number
  authorName: string
  authorAvatar?: string
  authorRole: string
  content: string
  images: string[]
  videoUrl?: string
  likesCount: number
  isLiked: boolean
  commentsCount: number
  createdAt: string
  isAnnouncement?: boolean
  tags?: string[]
  likers?: PostLiker[]
}

export interface ProjectUpdateItem {
  id: string | number
  title: string
  content: string
  createdAt: string
  participants?: string[]
}

export interface ProjectItem {
  id: string | number
  title: string
  description: string
  coverImage?: string
  status: "in_progress" | "completed"
  isClanProject: boolean
  clanId?: string | number
  clanName?: string
  ownerId?: string | number
  ownerName?: string
  githubLink?: string
  liveLink?: string
  assignedMembers?: string[]
  updates: ProjectUpdateItem[]
  createdAt: string
  tags?: string[]
}

export interface ClanRecruitmentItem {
  id: string | number
  clanId: string | number
  clanName: string
  clanInitials?: string
  title: string
  description: string
  requiredSkills: string[]
  deadline?: string
  applicantsCount: number
  status: "open" | "closed"
  createdAt: string
}

export interface StudentRecruitmentItem {
  id: string | number
  studentId: string | number
  studentName: string
  studentAvatar?: string
  department: string
  branch: string
  year: string
  skills: string[]
  bio: string
  portfolioUrl?: string
  createdAt: string
}

export interface ClanInvitationItem {
  id: string | number
  clanId: string | number
  clanName: string
  studentId: string | number
  studentName: string
  role: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  createdAt: string
}

export interface ClanJoinRequestItem {
  id: string | number
  clanId: string | number
  clanName: string
  studentId: string | number
  studentName: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  createdAt: string
}
