import React, { useState, useEffect } from "react"
import {
  ActiveScreen,
  Student,
  Clan,
  EventItem,
  Trophy,
  CampusMessage,
  AuditLogItem,
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
import api from "@/services/api"

// Layout Components
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"

// Area 1: Overview
import DashboardView from "@/components/overview/DashboardView"
import ReportsView from "@/components/overview/ReportsView"

// Area 2: Community
import StudentsView from "@/components/community/StudentsView"
import StudentDetailModal from "@/components/community/StudentDetailModal"
import ClansView from "@/components/community/ClansView"
import ClanDetailModal from "@/components/community/ClanDetailModal"
import MessagesView from "@/components/community/MessagesView"

// Area 3: Events & Awards
import EventsView from "@/components/events/EventsView"
import EventModal from "@/components/events/EventModal"
import ParticipantsModal from "@/components/events/ParticipantsModal"
import TrophiesView from "@/components/events/TrophiesView"
import TrophyModal from "@/components/events/TrophyModal"

// Area 4: Administration
import SuspensionView from "@/components/administration/SuspensionView"
import SuspendModal from "@/components/administration/SuspendModal"
import AuditLogView from "@/components/administration/AuditLogView"

// Common Dialogs & Feedback
import ConfirmModal from "@/components/common/ConfirmModal"

/**
 * Campus Admin (Campus Clans) — Main Application Controller
 * Strictly based on "Campus Admin — Complete Product & UI/UX Handoff Document"
 *
 * Implements:
 * 1. Overview (Dashboard, Monthly Reports with PDF download)
 * 2. Community (Students, Clans, Targeted Messages)
 * 3. Events (Events, 24h Participant Lock, Trophies & 48h Deadline)
 * 4. Administration (Suspension Management, History & Audit Logs)
 */
export default function AdvancedAdminPortal({
  onLogout,
  onSwitchToStandard,
}: {
  onLogout?: () => void
  onSwitchToStandard?: () => void
}) {
  // Navigation State (defaults to Section 3 Dashboard)
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("dashboard")

  // Core Entity State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS)
  const [clans, setClans] = useState<Clan[]>(INITIAL_CLANS)
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS)
  const [trophies, setTrophies] = useState<Trophy[]>(INITIAL_TROPHIES)
  const [messages, setMessages] = useState<CampusMessage[]>(INITIAL_MESSAGES)
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS)
  const [participantsByEvent, setParticipantsByEvent] = useState<Record<string, EventParticipant[]>>(INITIAL_PARTICIPANTS)

  // Asynchronous AJAX Initial Hydration via api service
  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const [loadedStudents, loadedClans, loadedEvents, loadedTrophies, loadedMessages, loadedAudit] =
          await Promise.all([
            api.students.getAll(),
            api.clans.getAll(),
            api.events.getAll(),
            api.trophies.getAll(),
            api.messages.getAll(),
            api.audit.getAll(),
          ])
        if (isMounted) {
          setStudents(loadedStudents)
          setClans(loadedClans)
          setEvents(loadedEvents)
          setTrophies(loadedTrophies)
          setMessages(loadedMessages)
          setAuditLogs(loadedAudit)
        }
      } catch (err) {
        console.warn("[AJAX Portal] Background sync using local store:", err)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Modals & Active Inspector State
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null)
  const [inspectedClan, setInspectedClan] = useState<Clan | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null)
  const [participantReviewEvent, setParticipantReviewEvent] = useState<EventItem | null>(null)
  const [isTrophyModalOpen, setIsTrophyModalOpen] = useState(false)
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
  const [suspendTargetEntity, setSuspendTargetEntity] = useState<{
    type: "student" | "clan"
    id: string
  } | null>(null)

  // Destructive Confirmation Dialog State (Section 6 & 8)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    target: string
    impact: string
    reversibility: "reversible" | "permanent"
    confirmText?: string
    isDestructive?: boolean
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    target: "",
    impact: "",
    reversibility: "permanent",
    onConfirm: () => {},
  })

  // Toast Notification Feedback (Section 14)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // --- Student Management Handlers (Section 4) ---

  async function handleSaveStudent(updated: Student) {
    try {
      await api.students.update(updated.id, updated)
    } catch (e) {
      console.warn("AJAX student update fallback:", e)
    }
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    showToast(`Student profile for "${updated.name}" updated successfully.`)
  }

  function handleSuspendStudent(student: Student) {
    setSuspendTargetEntity({ type: "student", id: student.id })
    setIsSuspendModalOpen(true)
  }

  function handleUnsuspendStudent(student: Student) {
    setConfirmDialog({
      isOpen: true,
      title: "Restore Student Permissions",
      target: student.name,
      impact: "Restores normal campus access, team creation, and event eligibility.",
      reversibility: "reversible",
      confirmText: "Restore Access",
      isDestructive: false,
      onConfirm: async () => {
        try {
          await api.students.restore(student.id)
          await api.audit.log({
            action: "Unsuspend Student",
            targetType: "student",
            targetName: student.name,
            performedBy: "Dr. Jayant Das (Local Admin)",
            details: "Restored full platform access following compliance verification.",
          })
        } catch (e) {
          console.warn("AJAX unsuspend student fallback:", e)
        }
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? { ...s, status: "Active", suspensionDetails: undefined } : s))
        )
        setAuditLogs((prev) => [
          {
            id: `aud-${Date.now()}`,
            action: "Unsuspend Student",
            targetType: "student",
            targetName: student.name,
            performedBy: "Dr. Jayant Das (Local Admin)",
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            details: "Restored full platform access following compliance verification.",
          },
          ...prev,
        ])
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        showToast(`Access restored for student ${student.name}.`)
      },
    })
  }

  function handleDeleteStudent(student: Student) {
    setConfirmDialog({
      isOpen: true,
      title: "Permanently Delete Student Account",
      target: `${student.name} (@${student.username})`,
      impact:
        "Student credentials will be revoked immediately. To comply with Section 12, historical hackathon participation and trophy records will be retained under 'Deleted student'.",
      reversibility: "permanent",
      confirmText: "Permanently Delete",
      isDestructive: true,
      onConfirm: () => {
        setStudents((prev) => prev.filter((s) => s.id !== student.id))
        setAuditLogs((prev) => [
          {
            id: `aud-${Date.now()}`,
            action: "Permanent Delete",
            targetType: "student",
            targetName: student.name,
            performedBy: "Dr. Jayant Das (Local Admin)",
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            details: "Student account permanently deleted upon administrative order.",
            historicalLabel: "Deleted student",
          },
          ...prev,
        ])
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        showToast(`Student ${student.name} deleted. Historical records preserved.`)
      },
    })
  }

  // --- Clan Management Handlers (Section 5) ---

  function handleSuspendClan(clan: Clan) {
    setSuspendTargetEntity({ type: "clan", id: clan.id })
    setIsSuspendModalOpen(true)
  }

  function handleUnsuspendClan(clan: Clan) {
    setConfirmDialog({
      isOpen: true,
      title: "Restore Clan Eligibility",
      target: clan.name,
      impact: "Restores clan ability to enter competitions and award ceremonies.",
      reversibility: "reversible",
      confirmText: "Restore Clan",
      isDestructive: false,
      onConfirm: async () => {
        try {
          await api.clans.restore(clan.id)
          await api.audit.log({
            action: "Unsuspend Clan",
            targetType: "clan",
            targetName: clan.name,
            performedBy: "Dr. Jayant Das (Local Admin)",
            details: "Clan eligibility reinstated across all campus events.",
          })
        } catch (e) {
          console.warn("AJAX unsuspend clan fallback:", e)
        }
        setClans((prev) =>
          prev.map((c) => (c.id === clan.id ? { ...c, status: "Active", suspensionDetails: undefined } : c))
        )
        setAuditLogs((prev) => [
          {
            id: `aud-${Date.now()}`,
            action: "Unsuspend Clan",
            targetType: "clan",
            targetName: clan.name,
            performedBy: "Dr. Jayant Das (Local Admin)",
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            details: "Clan eligibility reinstated across all campus events.",
          },
          ...prev,
        ])
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        showToast(`Clan ${clan.name} reinstated to active status.`)
      },
    })
  }

  function handleDeleteClan(clan: Clan) {
    setConfirmDialog({
      isOpen: true,
      title: "Permanently Disband Clan Team",
      target: clan.name,
      impact:
        "Clan will be removed from the active directory. Past project deliverables and event trophies will remain in the institutional archive under 'Deleted clan'.",
      reversibility: "permanent",
      confirmText: "Disband Clan",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.audit.log({
            action: "Disband Clan",
            targetType: "clan",
            targetName: clan.name,
            performedBy: "Dr. Jayant Das (Local Admin)",
            details: "Clan permanently disbanded and removed from student directory.",
            historicalLabel: "Deleted clan",
          })
        } catch (e) {
          console.warn("AJAX disband clan audit fallback:", e)
        }
        setClans((prev) => prev.filter((c) => c.id !== clan.id))
        setAuditLogs((prev) => [
          {
            id: `aud-${Date.now()}`,
            action: "Disband Clan",
            targetType: "clan",
            targetName: clan.name,
            performedBy: "Dr. Jayant Das (Local Admin)",
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            details: "Clan permanently disbanded and removed from student directory.",
            historicalLabel: "Deleted clan",
          },
          ...prev,
        ])
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        showToast(`Clan ${clan.name} permanently disbanded.`)
      },
    })
  }

  function handleRemoveMemberFromClan(clanId: string, studentId: string, memberName: string) {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Clan Member",
      target: `${memberName} from clan roster`,
      impact: "Student will be removed from this clan's active roster and private clan chat channel.",
      reversibility: "permanent",
      confirmText: "Remove Member",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.clans.removeMember(clanId, studentId)
          await api.audit.log({
            action: "Remove Clan Member",
            targetType: "student",
            targetName: memberName,
            performedBy: "Dr. Jayant Das (Local Admin)",
            details: `Removed from clan roster.`,
            historicalLabel: "Removed from clan",
          })
        } catch (e) {
          console.warn("AJAX remove clan member fallback:", e)
        }
        setClans((prev) =>
          prev.map((c) =>
            c.id === clanId
              ? {
                  ...c,
                  memberCount: Math.max(1, c.memberCount - 1),
                  members: c.members.filter((m) => m.studentId !== studentId),
                }
              : c
          )
        )
        setAuditLogs((prev) => [
          {
            id: `aud-${Date.now()}`,
            action: "Remove Clan Member",
            targetType: "student",
            targetName: memberName,
            performedBy: "Dr. Jayant Das (Local Admin)",
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            details: `Removed from clan roster.`,
            historicalLabel: "Removed from clan",
          },
          ...prev,
        ])
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        showToast(`${memberName} removed from clan roster.`)
      },
    })
  }

  // --- Suspension Dialog Confirmation (Section 6) ---

  async function handleConfirmSuspension(
    type: "student" | "clan",
    id: string,
    reason: string,
    durationDays: number,
    endDate: string
  ) {
    const startDate = new Date().toISOString().split("T")[0]

    if (type === "student") {
      const student = students.find((s) => s.id === id)
      try {
        await api.students.suspend(id, reason, durationDays)
        await api.audit.log({
          action: "Suspend Student",
          targetType: "student",
          targetName: student?.name || "Student",
          performedBy: "Dr. Jayant Das (Local Admin)",
          details: `${durationDays} days hold: ${reason}`,
        })
      } catch (e) {
        console.warn("AJAX suspend student fallback:", e)
      }
      setStudents((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "Suspended",
                suspensionDetails: { reason, durationDays, startDate, endDate },
              }
            : s
        )
      )
      setAuditLogs((prev) => [
        {
          id: `aud-${Date.now()}`,
          action: "Suspend Student",
          targetType: "student",
          targetName: student?.name || "Student",
          performedBy: "Dr. Jayant Das (Local Admin)",
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          details: `${durationDays} days hold: ${reason}`,
        },
        ...prev,
      ])
      showToast(`Student ${student?.name} placed on ${durationDays}-day suspension hold.`)
    } else {
      const clan = clans.find((c) => c.id === id)
      try {
        await api.clans.suspend(id, reason, durationDays)
        await api.audit.log({
          action: "Suspend Clan",
          targetType: "clan",
          targetName: clan?.name || "Clan",
          performedBy: "Dr. Jayant Das (Local Admin)",
          details: `${durationDays} days hold: ${reason}`,
        })
      } catch (e) {
        console.warn("AJAX suspend clan fallback:", e)
      }
      setClans((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "Suspended",
                suspensionDetails: { reason, durationDays, startDate, endDate },
              }
            : c
        )
      )
      setAuditLogs((prev) => [
        {
          id: `aud-${Date.now()}`,
          action: "Suspend Clan",
          targetType: "clan",
          targetName: clan?.name || "Clan",
          performedBy: "Dr. Jayant Das (Local Admin)",
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          details: `${durationDays} days hold: ${reason}`,
        },
        ...prev,
      ])
      showToast(`Clan ${clan?.name} marked as suspended for ${durationDays} days.`)
    }
  }

  // --- Events & Trophies Handlers (Section 8 & 10) ---

  async function handleSaveEvent(eventData: Partial<EventItem>) {
    if (eventToEdit) {
      try {
        await api.events.update(eventToEdit.id, eventData)
      } catch (e) {
        console.warn("AJAX update event fallback:", e)
      }
      setEvents((prev) =>
        prev.map((e) => (e.id === eventToEdit.id ? ({ ...e, ...eventData } as EventItem) : e))
      )
      showToast(`Event "${eventData.title}" updated successfully.`)
    } else {
      const newEvent: EventItem = {
        id: `evt-${Date.now()}`,
        title: eventData.title || "Untitled Event",
        type: eventData.type || "Hackathon",
        description: eventData.description || "",
        location: eventData.location || "Campus Hub",
        startDate: eventData.startDate || "2026-11-01",
        endDate: eventData.endDate || "2026-11-02",
        time: eventData.time || "10:00 AM",
        status: "Upcoming",
        participationMode: eventData.participationMode || "both",
        accentColor: "amber",
        participantsCount: 0,
        trophiesAwarded: false,
        externalLink: eventData.externalLink,
        mediaUrl: eventData.mediaUrl,
      }
      try {
        await api.events.create(newEvent)
      } catch (e) {
        console.warn("AJAX create event fallback:", e)
      }
      setEvents((prev) => [newEvent, ...prev])
      showToast(`New event "${newEvent.title}" published to campus schedule.`)
    }
    setEventToEdit(null)
  }

  function handleDeleteEvent(event: EventItem) {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Event Record",
      target: event.title,
      impact:
        "Will remove this event and associated timeline milestones. Registered participant records will be archived.",
      reversibility: "permanent",
      confirmText: "Delete Event",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.audit.log({
            action: "Delete Event",
            targetType: "event",
            targetName: event.title,
            performedBy: "Dr. Jayant Das (Local Admin)",
            details: `Event deleted.`,
          })
        } catch (e) {
          console.warn("AJAX delete event audit fallback:", e)
        }
        setEvents((prev) => prev.filter((e) => e.id !== event.id))
        setAuditLogs((prev) => [
          {
            id: `aud-${Date.now()}`,
            action: "Delete Event",
            targetType: "event",
            targetName: event.title,
            performedBy: "Dr. Jayant Das (Local Admin)",
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            details: `Event deleted.`,
          },
          ...prev,
        ])
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        showToast(`Event "${event.title}" removed.`)
      },
    })
  }

  async function handleSaveTrophy(trophyData: Omit<Trophy, "id">) {
    try {
      const awarded = await api.trophies.award(trophyData)
      setTrophies((prev) => [awarded, ...prev])
    } catch (e) {
      console.warn("AJAX trophy award fallback:", e)
      const newTrophy: Trophy = {
        id: `trophy-${Date.now()}`,
        ...trophyData,
      }
      setTrophies((prev) => [newTrophy, ...prev])
    }

    try {
      await api.audit.log({
        action: "Award Trophy",
        targetType: "trophy",
        targetName: trophyData.name,
        performedBy: "Dr. Jayant Das (Local Admin)",
        details: `Granted to ${trophyData.recipientName} for ${trophyData.eventName}.`,
      })
    } catch (e) {
      console.warn("AJAX trophy audit fallback:", e)
    }

    // Mark event as trophies awarded
    setEvents((prev) =>
      prev.map((e) => (e.id === trophyData.eventId ? { ...e, trophiesAwarded: true } : e))
    )

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        action: "Award Trophy",
        targetType: "trophy",
        targetName: trophyData.name,
        performedBy: "Dr. Jayant Das (Local Admin)",
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        details: `Granted to ${trophyData.recipientName} for ${trophyData.eventName}.`,
      },
      ...prev,
    ])

    showToast(`Trophy "${trophyData.name}" awarded to ${trophyData.recipientName}!`)
  }

  function handleDeleteTrophy(trophy: Trophy) {
    setConfirmDialog({
      isOpen: true,
      title: "Revoke / Delete Awarded Trophy",
      target: trophy.name,
      impact:
        "The verified achievement will be removed from the recipient's public profile and institutional transcripts.",
      reversibility: "permanent",
      confirmText: "Delete Trophy",
      isDestructive: true,
      onConfirm: () => {
        setTrophies((prev) => prev.filter((t) => t.id !== trophy.id))
        setAuditLogs((prev) => [
          {
            id: `aud-${Date.now()}`,
            action: "Revoke Trophy",
            targetType: "trophy",
            targetName: trophy.name,
            performedBy: "Dr. Jayant Das (Local Admin)",
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            details: `Revoked from ${trophy.recipientName}.`,
          },
          ...prev,
        ])
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
        showToast(`Trophy "${trophy.name}" removed.`)
      },
    })
  }

  // --- Messages Handler (Section 7) ---

  function handleSendMessage(msgData: Omit<CampusMessage, "id" | "sentAt" | "deliveryStatus">) {
    const newMsg: CampusMessage = {
      id: `msg-${Date.now()}`,
      ...msgData,
      sentAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      deliveryStatus: "Delivered",
    }
    setMessages((prev) => [newMsg, ...prev])
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        action: "Broadcast Message",
        targetType: "message",
        targetName: newMsg.subject,
        performedBy: "Dr. Jayant Das (Local Admin)",
        timestamp: newMsg.sentAt,
        details: `Sent to ${newMsg.recipientName} (${newMsg.audienceType}).`,
      },
      ...prev,
    ])
    showToast(`Broadcast sent to ${newMsg.recipientName}.`)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col md:flex-row relative">
      {/* Background radial ambient lighting for glassmorphic depth */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-400/8 blur-[100px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-slate-400/10 blur-[120px]" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-amber-500/8 blur-[100px]" />
      </div>

      {/* Section 2 Grouped Sidebar Navigation */}
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onLogout={onLogout || (() => showToast("Admin Session active."))}
      />

      {/* Main Administrative Workspace */}
      <div className="relative z-10 flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header activeScreen={activeScreen} />

        {/* View Switcher & Landing Page Link Bar */}
        <div className="px-8 py-2.5 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Advanced NAAC & Audit Administration Console</span>
          </div>
          <div className="flex items-center gap-3">
            {onSwitchToStandard && (
              <button
                type="button"
                onClick={onSwitchToStandard}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-xs transition-colors"
              >
                Switch to Standard Overview
              </button>
            )}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold transition-colors"
              >
                Sign Out to Landing Page
              </button>
            )}
          </div>
        </div>

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {/* AREA 1: OVERVIEW */}
          {activeScreen === "dashboard" && (
            <DashboardView
              students={students}
              clans={clans}
              events={events}
              trophies={trophies}
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === "reports" && (
            <ReportsView
              totalStudents={students.length}
              totalClans={clans.length}
              studentsWithoutClan={students.filter((s) => !s.clanName).length}
              clanProjects={clans.reduce((sum, c) => sum + c.projectsCount, 0)}
              studentProjects={students.reduce((sum, s) => sum + s.projectsCount, 0)}
              upcomingEvents={events.filter((e) => e.status !== "Ended").length}
              students={students}
              clans={clans}
              events={events}
              trophies={trophies}
              auditLogs={auditLogs}
            />
          )}

          {/* AREA 2: COMMUNITY */}
          {activeScreen === "students" && (
            <StudentsView
              students={students}
              onViewStudent={setInspectedStudent}
              onSuspendStudent={handleSuspendStudent}
              onUnsuspendStudent={handleUnsuspendStudent}
              onDeleteStudent={handleDeleteStudent}
              onSendMessageToStudent={(stu) => {
                showToast(`Direct message sent to ${stu.name}.`)
              }}
            />
          )}

          {activeScreen === "clans" && (
            <ClansView
              clans={clans}
              onViewClan={setInspectedClan}
              onSuspendClan={handleSuspendClan}
              onUnsuspendClan={handleUnsuspendClan}
              onDeleteClan={handleDeleteClan}
              onSendMessageToClan={(clan) => {
                showToast(`Broadcast message sent to clan ${clan.name}.`)
              }}
            />
          )}

          {/* AREA 3: EVENTS & AWARDS */}
          {activeScreen === "events" && (
            <EventsView
              events={events}
              onCreateEvent={() => {
                setEventToEdit(null)
                setIsEventModalOpen(true)
              }}
              onEditEvent={(evt) => {
                setEventToEdit(evt)
                setIsEventModalOpen(true)
              }}
              onDeleteEvent={handleDeleteEvent}
              onReviewParticipants={(evt) => setParticipantReviewEvent(evt)}
              onManageTrophies={() => setActiveScreen("trophies")}
            />
          )}

          {activeScreen === "trophies" && (
            <TrophiesView
              trophies={trophies}
              events={events}
              onAwardTrophy={() => setIsTrophyModalOpen(true)}
              onDeleteTrophy={handleDeleteTrophy}
            />
          )}

          {/* AREA 4: ADMINISTRATION */}
          {activeScreen === "suspensions" && (
            <SuspensionView
              students={students}
              clans={clans}
              onOpenSuspendModal={() => {
                setSuspendTargetEntity(null)
                setIsSuspendModalOpen(true)
              }}
              onUnsuspendStudent={handleUnsuspendStudent}
              onUnsuspendClan={handleUnsuspendClan}
            />
          )}

          {activeScreen === "audit-log" && <AuditLogView logs={auditLogs} />}
        </main>
      </div>

      {/* --- Modals & Interaction Overlays --- */}

      {/* Section 4 Student Detail Inspection Modal */}
      <StudentDetailModal
        isOpen={!!inspectedStudent}
        student={inspectedStudent}
        onClose={() => setInspectedStudent(null)}
        onSave={handleSaveStudent}
        onSuspend={handleSuspendStudent}
        onUnsuspend={handleUnsuspendStudent}
        onDelete={handleDeleteStudent}
        onSendMessage={(stu) => {
          showToast(`Direct message sent to ${stu.name}.`)
        }}
      />

      {/* Section 5 Clan Inspection Modal */}
      <ClanDetailModal
        isOpen={!!inspectedClan}
        clan={inspectedClan}
        onClose={() => setInspectedClan(null)}
        onRemoveMember={handleRemoveMemberFromClan}
        onSuspendClan={handleSuspendClan}
        onUnsuspendClan={handleUnsuspendClan}
        onDeleteClan={handleDeleteClan}
      />

      {/* Section 8 Create / Edit Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        eventToEdit={eventToEdit}
        onClose={() => {
          setIsEventModalOpen(false)
          setEventToEdit(null)
        }}
        onSave={handleSaveEvent}
      />

      {/* Section 9 Event Participation & 24h Lock Modal */}
      <ParticipantsModal
        isOpen={!!participantReviewEvent}
        event={participantReviewEvent}
        participants={participantsByEvent[participantReviewEvent?.id || ""] || []}
        students={students}
        clans={clans}
        onClose={() => setParticipantReviewEvent(null)}
        onAddParticipant={(newPart) => {
          if (!participantReviewEvent) return
          const eventId = participantReviewEvent.id
          setParticipantsByEvent((prev) => ({
            ...prev,
            [eventId]: [newPart, ...(prev[eventId] || [])],
          }))
          setEvents((prev) =>
            prev.map((e) =>
              e.id === eventId ? { ...e, participantsCount: e.participantsCount + 1 } : e
            )
          )
          showToast(`Participant "${newPart.name}" added to ${participantReviewEvent.title}.`)
        }}
        onCancelParticipation={(participantId) => {
          if (!participantReviewEvent) return
          const eventId = participantReviewEvent.id
          setParticipantsByEvent((prev) => ({
            ...prev,
            [eventId]: (prev[eventId] || []).filter((p) => p.id !== participantId),
          }))
          setEvents((prev) =>
            prev.map((e) =>
              e.id === eventId ? { ...e, participantsCount: Math.max(0, e.participantsCount - 1) } : e
            )
          )
          showToast(`Participation entry removed.`)
        }}
      />

      {/* Section 10 Award Trophy Modal */}
      <TrophyModal
        isOpen={isTrophyModalOpen}
        events={events}
        students={students}
        clans={clans}
        onClose={() => setIsTrophyModalOpen(false)}
        onSave={handleSaveTrophy}
      />

      {/* Section 6 Suspend Modal with Duration & Calculated End Date */}
      <SuspendModal
        isOpen={isSuspendModalOpen}
        students={students}
        clans={clans}
        targetEntity={suspendTargetEntity}
        onClose={() => {
          setIsSuspendModalOpen(false)
          setSuspendTargetEntity(null)
        }}
        onConfirmSuspend={handleConfirmSuspension}
      />

      {/* Section 6 & 8 Destructive Action Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        target={confirmDialog.target}
        impact={confirmDialog.impact}
        reversibility={confirmDialog.reversibility}
        confirmButtonText={confirmDialog.confirmText}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Glass Toast Notification (Section 14 Feedback) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="px-5 py-3 rounded-2xl bg-[#172033]/90 text-white border border-white/20 shadow-2xl backdrop-blur-xl text-xs font-semibold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
