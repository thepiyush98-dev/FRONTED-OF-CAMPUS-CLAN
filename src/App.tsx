import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import AdvancedAdminPortal from "@/components/administration/AdvancedAdminPortal"
import GrapeVineBackground from "@/components/common/GrapeVineBackground"
import MobileBottomBar, { MobileNavItem } from "@/components/layout/MobileBottomBar"
import ForwardCurvedEventSlider from "@/components/events/ForwardCurvedEventSlider"
import ClanCard from "@/components/community/ClanCard"
import Profile from "@/components/profile/Profile"
import PostsView from "@/components/community/PostsView"
import ClanProfile from "@/components/community/ClanProfile"
import EventSearchModal from "@/components/events/EventSearchModal"
import AdminNotifications from "@/components/notifications/notification.jsx"
import { AboutUsModal, ContactUsModal } from "@/components/common/FooterModals"
import { useAuth } from "@/context/AuthContext"
import EventDetailsModal, { DetailedEvent } from "@/components/events/EventDetailsModal"
import CreateClanModal from "@/components/community/CreateClanModal"
import { djangoApi } from "@/services/djangoApi"
import { ALL_STUDENT_PROFILES } from "@/data/studentProfilesData"
import ClanStoriesStrip from "@/components/community/ClanStoriesStrip"

type AdminPage = "overview" | "community" | "events" | "trophies" | "reports"
type StudentPage = "home" | "clans" | "events" | "posts" | "profile" | "messages" | "clan-profile"
type UserRole = "student" | "admin"
type Status = "Active" | "Suspended" | "Ended"

const workshopPhoto =
  "https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHdvcmtzaG9wfGVufDF8fHx8MTc5MjAwMzI1OXww&ixlib=rb-4.1.0&q=80&w=1080"

const events: DetailedEvent[] = [
  {
    id: 1,
    month: "OCT",
    day: "12",
    title: "North India Hackfest",
    type: "Hackathon",
    location: "Campus Innovation Hub",
    venueDetails: "3rd Floor, Software Engineering Wing",
    time: "9:00 AM",
    startingDate: "October 12, 2026 · 09:00 AM (36-Hour Sprint)",
    people: 248,
    accent: "amber",
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1280&h=720&q=80",
    tagline: "36-Hour National Code Sprint & AI Hackathon",
    hasRegistration: true,
    registrationLink: "https://hackfest.campusclans.edu/register",
    hostClan: "Pixel Pirates & Binary Beasts",
    organizer: "Campus Tech Council",
    description: "North India Hackfest is an intensive 36-hour code sprint & AI hackathon bringing together over 250 top student developers, designers, and innovators. Compete for prizes across Web3, Local LLMs, and Sustainable Tech tracks. Free food, mentor guidance, and hardware kits provided.",
  },
  {
    id: 2,
    month: "OCT",
    day: "16",
    title: "Designing for Impact",
    type: "Workshop",
    location: "Design Studio 2B",
    venueDetails: "School of Creative Arts, Studio Hall 2",
    time: "2:30 PM",
    startingDate: "October 16, 2026 · 02:30 PM - 05:30 PM",
    people: 84,
    accent: "indigo",
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1280&h=720&q=80",
    tagline: "Master Design Systems, Figma Prototyping & UX Psychology",
    hasRegistration: true,
    registrationLink: "https://design.campusclans.edu/workshops/register",
    hostClan: "Pixel Pirates",
    organizer: "Figma Campus Community",
    description: "Hands-on UI/UX design masterclass focusing on Design Systems, advanced Figma component architecture, micro-interactions, and cognitive psychology in interface design. Bring your laptops with Figma installed.",
  },
  {
    id: 3,
    month: "OCT",
    day: "20",
    title: "Founders' Fireside",
    type: "Talk",
    location: "Main University Auditorium",
    venueDetails: "Hall A, Ground Floor",
    time: "5:00 PM",
    startingDate: "October 20, 2026 · 05:00 PM - 07:30 PM",
    people: 172,
    accent: "rose",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1280&h=720&q=80",
    tagline: "From Dorm Room to Series A: Stories of 4 Student Founders",
    hasRegistration: false,
    interestedLink: "https://campusclans.edu/events/founders-fireside/interested",
    hostClan: "Venture Verse",
    organizer: "Campus Entrepreneurship Cell",
    description: "An exclusive fireside chat featuring 4 prominent alumni founders who built startups from college dorms and scaled to Series A. Topics include finding initial co-founders, pitching to angel investors, balancing coursework with startup execution, and avoiding early legal pitfalls.",
  },
  {
    id: 4,
    month: "OCT",
    day: "26",
    title: "AI Builders Night",
    type: "Build Night",
    location: "CS Block Labs",
    venueDetails: "Advanced AI & GPU Lab 104",
    time: "7:00 PM",
    startingDate: "October 26, 2026 · 07:00 PM - Midnight",
    people: 116,
    accent: "emerald",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&h=720&q=80",
    tagline: "Hands-on LLM Agents, PyTorch & Vector Database Lab",
    hasRegistration: true,
    registrationLink: "https://binarybeasts.campusclans.edu/ai-night",
    hostClan: "Binary Beasts",
    organizer: "AI & Distributed Systems Club",
    description: "A late-night collaborative build session diving deep into open-source LLM agents, LangChain/LlamaIndex pipelines, and PyTorch fine-tuning on campus GPU clusters. Ideal for students with basic Python knowledge looking to build real-world AI applications.",
  },
  {
    id: 5,
    month: "NOV",
    day: "02",
    title: "Campus Creator Meet",
    type: "Networking",
    location: "Central Lawn",
    venueDetails: "Open-Air Media Amphitheatre",
    time: "4:00 PM",
    startingDate: "November 02, 2026 · 04:00 PM - 06:30 PM",
    people: 96,
    accent: "sky",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&h=720&q=80",
    tagline: "Connect with Designers, Videographers & Community Leads",
    hasRegistration: false,
    interestedLink: "https://campusclans.edu/events/creator-meet/interested",
    hostClan: "Pixel Pirates",
    organizer: "Media & Arts Collective",
    description: "An informal open-air mixer for student creators, videographers, 3D artists, technical writers, and community leaders. Share your portfolio, find creative collaborators for your clan, and learn how to produce viral technical content.",
  },
  {
    id: 6,
    month: "NOV",
    day: "08",
    title: "Robotics Open House",
    type: "Exhibition",
    location: "Maker Lab",
    venueDetails: "Engineering Workshop Block, Arena 1",
    time: "11:00 AM",
    startingDate: "November 08, 2026 · 11:00 AM - 03:00 PM",
    people: 132,
    accent: "orange",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1280&h=720&q=80",
    tagline: "Live Demos of Autonomous Drones & Robotic Arms",
    hasRegistration: false,
    interestedLink: "https://campusclans.edu/events/robotics-open-house/interested",
    hostClan: "Circuit Crew",
    organizer: "RoboCon Technical Guild",
    description: "Experience live demonstrations of autonomous quadruped rovers, swarm drones, and computer-vision robotic arms built by Circuit Crew. Try piloting the robots in our obstacle arena and learn about upcoming hardware clan recruitment.",
  },
]

const students = [
  {
    name: "Aarav Khanna",
    email: "aarav.k@campus.edu",
    course: "B.Tech CSE",
    year: "3rd year",
    clans: 2,
    status: "Active" as Status,
    initials: "AK",
  },
  {
    name: "Riya Malhotra",
    email: "riya.m@campus.edu",
    course: "B.Des",
    year: "2nd year",
    clans: 1,
    status: "Active" as Status,
    initials: "RM",
  },
  {
    name: "Kabir Singh",
    email: "kabir.s@campus.edu",
    course: "B.Tech ECE",
    year: "4th year",
    clans: 3,
    status: "Suspended" as Status,
    initials: "KS",
  },
  {
    name: "Naina Kapoor",
    email: "naina.k@campus.edu",
    course: "BBA",
    year: "2nd year",
    clans: 1,
    status: "Active" as Status,
    initials: "NK",
  },
]

const clans = [
  {
    name: "Pixel Pirates",
    focus: "Design & Frontend",
    members: 18,
    projects: 6,
    status: "Active" as Status,
    initials: "PP",
    leaderName: "Aarav Khanna",
    tierBadge: "Tier 1: Elite",
    xp: "2,450 XP",
    trophies: 3,
  },
  {
    name: "Binary Beasts",
    focus: "AI & Backend Systems",
    members: 24,
    projects: 9,
    status: "Active" as Status,
    initials: "BB",
    leaderName: "Devansh Sharma",
    tierBadge: "Rank #1 Campus",
    xp: "3,120 XP",
    trophies: 5,
  },
  {
    name: "Venture Verse",
    focus: "Product & Strategy",
    members: 12,
    projects: 4,
    status: "Suspended" as Status,
    initials: "VV",
    leaderName: "Naina Kapoor",
    tierBadge: "Incubated",
    xp: "1,200 XP",
    trophies: 2,
  },
  {
    name: "Circuit Crew",
    focus: "Robotics & Embedded",
    members: 16,
    projects: 7,
    status: "Active" as Status,
    initials: "CC",
    leaderName: "Kabir Singh",
    tierBadge: "Hardware Lab",
    xp: "1,980 XP",
    trophies: 4,
  },
]

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    calendar: (
      <>
        <path d="M6 2v3M18 2v3M3 9h18" />
        <rect x="3" y="4" width="18" height="17" rx="3" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 21h8M12 17v4M6 4h12v5a6 6 0 0 1-12 0V4Z" />
        <path d="M6 6H3v2a4 4 0 0 0 4 4M18 6h3v2a4 4 0 0 1-4 4" />
      </>
    ),
    chat: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-9" />
        <path d="M15 6h6v6" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Logo({
  subtitle = "Connect · Collaborate · Grow",
  size = 38,
  isDark = false,
}: {
  subtitle?: string
  size?: number
  isDark?: boolean
}) {
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer transition-transform hover:scale-[1.02]">
      <div
        className="relative flex items-center justify-center rounded-xl bg-white p-1 border border-amber-400/40 shadow-[0_4px_14px_rgba(245,184,0,0.2)] overflow-hidden transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-[0_6px_20px_rgba(245,184,0,0.35)]"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.jpg"
          alt="Campus Clans"
          className="w-full h-full object-contain rounded-lg"
          loading="eager"
        />
      </div>
      <div className="flex flex-col text-left">
        <strong
          className={`text-base font-extrabold tracking-tight group-hover:text-amber-400 transition-colors leading-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Campus<span className="text-amber-500">Clans</span>
        </strong>
        {subtitle && (
          <span
            className={`text-[9px] font-bold tracking-wider uppercase leading-tight mt-0.5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: Status | "Open" | "Pending" | "Approved"
}) {
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  )
}

function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="search-field">
      <Icon name="search" size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

function PublicEvents({ onLogin }: { onLogin: () => void }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All events")
  const [activeMobileTab, setActiveMobileTab] = useState("events")
  const [selectedPublicEvent, setSelectedPublicEvent] = useState<DetailedEvent | null>(null)

  const visibleEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          (filter === "All events" || event.type === filter) &&
          `${event.title} ${event.location} ${event.type}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, filter],
  )

  const publicMobileNav: MobileNavItem[] = [
    { id: "events", label: "Events", icon: "calendar" },
    { id: "explore", label: "Explore", icon: "grid" },
    { id: "campuses", label: "Campuses", icon: "pin" },
    { id: "login", label: "Sign in", isAvatar: true, avatarText: "Log" },
  ]

  function handleMobileSelect(id: string) {
    setActiveMobileTab(id)
    if (id === "login") {
      onLogin()
    } else if (id === "events") {
      document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" })
    } else {
      document.getElementById("join-section")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <main className="public-site">
      {/* PC Navbar Header with Growing Grape Vine Background */}
      <header className="public-nav-wrapper relative overflow-hidden">
        {/* Growing Grape Vine Background (PC Only) */}
        <GrapeVineBackground orientation="horizontal" opacity={0.38} className="hidden md:block" />

        <nav className="public-nav relative z-10">
          <Logo />
          <div className="public-links">
            <button
              type="button"
              className="active"
              onClick={() => document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("join-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("join-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              For campuses
            </button>
          </div>
          <button
            className="primary-button login-button"
            type="button"
            onClick={onLogin}
          >
            Login / Register <Icon name="arrow" size={17} />
          </button>
        </nav>
      </header>
      <section className="public-hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <span className="announcement">
            <i />
            Connect · Collaborate · Grow
          </span>
          <h1>
            Discover what&apos;s
            <br />
            <em>happening next.</em>
          </h1>
          <p>
            Connect with ambitious peers, collaborate on real-world projects, and grow your career — all in one unified campus network.
          </p>
        </div>
        <div className="hero-stat">
          <span>THIS WEEK</span>
          <strong>14</strong>
          <small>events across 6 campuses</small>
        </div>
      </section>
      <section className="events-section" id="events-section">
        <div className="section-intro">
          <div>
            <span className="kicker">CONNECT · COLLABORATE · GROW</span>
            <h2>Upcoming campus events</h2>
            <p>Find your next opportunity to learn, build and connect.</p>
          </div>
          <div className="public-search">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search events, colleges..."
            />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-pills">
            {["All events", "Hackathon", "Workshop", "Talk", "Networking"].map(
              (item) => (
                <button
                  type="button"
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                  key={item}
                >
                  {item}
                </button>
              ),
            )}
          </div>
          <button type="button" className="outline-button">
            <Icon name="calendar" size={17} />
            This month
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleEvents.map((event) => (
            <article
              key={event.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              onClick={() => setSelectedPublicEvent(event)}
            >
              <div>
                {/* 16:9 YouTube Thumbnail Artwork Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={event.thumbnail || workshopPhoto}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top-Left Category Pill */}
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
                    {event.type}
                  </span>

                  {/* Top-Right Date Badge */}
                  <div className="absolute top-3 right-3 z-10 w-11 h-12 rounded-xl bg-white/95 backdrop-blur-md flex flex-col items-center justify-center shadow-lg border border-white/40">
                    <span className="text-[9px] font-black text-amber-600 uppercase leading-none">
                      {event.month}
                    </span>
                    <strong className="text-base font-black text-slate-900 leading-tight">
                      {event.day}
                    </strong>
                  </div>

                  {/* Bottom attendees indicator */}
                  <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5 text-white text-[11px] font-bold drop-shadow">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{event.people} attending</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                    {event.tagline || "Join fellow students for an immersive campus learning and networking experience."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Icon name="pin" size={13} />
                      {event.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Icon name="clock" size={13} />
                      {event.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Details Modal & RSVP / Interested */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPublicEvent(event)
                  }}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  title="View Venue, Schedule & Registration"
                >
                  <span>Details</span>
                  <Icon name="arrowRight" size={13} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onLogin()
                  }}
                  className="flex-1 py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer primary-button !w-full"
                >
                  <Icon name="calendar" size={14} />
                  <span>{event.hasRegistration ? "Register" : "Interested"}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
        {visibleEvents.length === 0 && (
          <div className="empty-state">
            <Icon name="calendar" size={32} />
            <h3>No events found</h3>
            <p>Try a different keyword or event type.</p>
          </div>
        )}
      </section>
      <section className="join-banner" id="join-section">
        <div>
          <span className="kicker">CONNECT · COLLABORATE · GROW</span>
          <h2>Find your people. Build your thing.</h2>
          <p>
            Join clans, showcase projects and grow with students who share your ambition.
          </p>
        </div>
        <button className="dark-button" type="button" onClick={onLogin}>
          Join Campus Clans <Icon name="arrow" size={17} />
        </button>
      </section>
      <footer className="public-footer">
        <Logo subtitle="Connect · Collaborate · Grow" />
        <span className="text-amber-500 font-bold tracking-wider text-xs">Connect · Collaborate · Grow</span>
        <span>© 2026 Campus Clans. Built for ambitious student communities.</span>
      </footer>

      {/* Instagram-style Mobile Bottom Navigation Bar (Mobile Phone Only) */}
      <MobileBottomBar
        items={publicMobileNav}
        activeId={activeMobileTab}
        onSelect={handleMobileSelect}
        theme="light"
      />

      {/* Event Details Modal (Venue, Starting Date, Registration/Interested link, Description) */}
      <EventDetailsModal
        event={selectedPublicEvent}
        isOpen={!!selectedPublicEvent}
        onClose={() => setSelectedPublicEvent(null)}
        onToggleInterested={() => onLogin()}
      />
    </main>
  )
}

function LoginModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (role: UserRole, email?: string) => void
  initialRole?: UserRole
}) {
  const { sendOtp, verifyOtp, registerStudent } = useAuth()
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login")
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("••••••••")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  // Register State
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regDept, setRegDept] = useState("School of Engineering")
  const [regBranch, setRegBranch] = useState("B.Tech CSE")
  const [regUsername, setRegUsername] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [regOtp, setRegOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [regStatusMsg, setRegStatusMsg] = useState("")
  const [regError, setRegError] = useState("")
  const [regLoading, setRegLoading] = useState(false)

  // Real-time Username Check State (/check-username/)
  const [usernameCheck, setUsernameCheck] = useState<{
    checking: boolean
    available: boolean | null
    message: string
  }>({
    checking: false,
    available: null,
    message: "",
  })

  // Debounced Live Username Validator
  useEffect(() => {
    const trimmed = regUsername.trim().toLowerCase()
    if (!trimmed || trimmed.length < 3) {
      setUsernameCheck({ checking: false, available: null, message: "" })
      return
    }

    setUsernameCheck({ checking: true, available: null, message: "Checking availability..." })
    const timer = setTimeout(async () => {
      try {
        const res = await djangoApi.auth.checkUsername(trimmed)
        if (res.available) {
          setUsernameCheck({
            checking: false,
            available: true,
            message: `✓ @${trimmed} is available!`,
          })
        } else {
          setUsernameCheck({
            checking: false,
            available: false,
            message: `✗ @${trimmed} is taken. Try another.`,
          })
        }
      } catch {
        setUsernameCheck({ checking: false, available: null, message: "" })
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [regUsername])

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotOtp, setForgotOtp] = useState("")
  const [forgotPassword, setForgotPassword] = useState("")
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("")
  const [forgotOtpSent, setForgotOtpSent] = useState(false)
  const [forgotOtpVerified, setForgotOtpVerified] = useState(false)
  const [forgotSending, setForgotSending] = useState(false)
  const [forgotVerifying, setForgotVerifying] = useState(false)
  const [forgotResetting, setForgotResetting] = useState(false)
  const [forgotStatusMsg, setForgotStatusMsg] = useState("")
  const [forgotError, setForgotError] = useState("")

  // Handle Login Submit (/login/)
  // Auto-detects admin vs student role automatically based on credentials!
  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError("")
    const inputVal = loginEmail.trim()
    if (!inputVal) {
      setLoginError("Please enter your campus username or email.")
      return
    }

    setLoginLoading(true)
    try {
      // Auto-detect: if username/email contains "admin", log in directly as admin!
      const detectedRole: UserRole = inputVal.toLowerCase().includes("admin") ? "admin" : "student"
      await onSubmit(detectedRole, inputVal)
    } catch (e: any) {
      setLoginError(e.message || "Failed to sign in. Please verify your credentials.")
    } finally {
      setLoginLoading(false)
    }
  }

  // Handle Send Registration OTP (/send-otp/)
  async function handleSendOtp() {
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setRegError("Please enter a valid email address first.")
      return
    }
    setOtpSending(true)
    setRegError("")
    setRegStatusMsg("")
    try {
      const res = await sendOtp(regEmail.trim())
      if (res.success) {
        setOtpSent(true)
        setRegStatusMsg(res.message || `OTP sent to ${regEmail}. (Demo OTP: 123456)`)
      } else {
        setRegError(res.error || "Failed to send OTP to email.")
      }
    } catch (e: any) {
      setRegError(e.message || "Could not connect to authentication service.")
    } finally {
      setOtpSending(false)
    }
  }

  // Handle Verify Registration OTP (/verify-otp/)
  async function handleVerifyOtp() {
    if (!regOtp.trim() || regOtp.trim().length !== 6) {
      setRegError("Please enter the 6-digit OTP received on your email.")
      return
    }
    setOtpVerifying(true)
    setRegError("")
    try {
      const res = await verifyOtp(regEmail.trim(), regOtp.trim())
      if (res.success) {
        setOtpVerified(true)
        setRegStatusMsg("✓ Email verified successfully! Now complete your credentials.")
      } else {
        setRegError(res.error || "Invalid or expired OTP. Use demo OTP: 123456")
      }
    } catch (e: any) {
      setRegError(e.message || "Verification failed.")
    } finally {
      setOtpVerifying(false)
    }
  }

  // Handle Complete Student Registration (/register-student/)
  async function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!otpVerified) {
      setRegError("Please verify your email address with OTP first.")
      return
    }
    if (!regName.trim() || !regUsername.trim() || !regPassword) {
      setRegError("Please fill in all required registration fields.")
      return
    }
    if (usernameCheck.available === false) {
      setRegError("Desired username is taken. Please select an available username.")
      return
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.")
      return
    }
    if (regPassword.length < 8) {
      setRegError("Password must be at least 8 characters long.")
      return
    }

    setRegLoading(true)
    setRegError("")
    try {
      const res = await registerStudent({
        name: regName.trim(),
        department: regDept.trim(),
        branch: regBranch.trim(),
        email: regEmail.trim(),
        username: regUsername.trim(),
        password: regPassword,
        confirm_password: regConfirmPassword,
      })

      if (res.success) {
        onSubmit("student", regEmail.trim())
      } else {
        setRegError(res.error || "Student registration failed. Please try again.")
      }
    } catch (err: any) {
      setRegError(err.message || "Registration connection failed.")
    } finally {
      setRegLoading(false)
    }
  }

  // Handle Send Password Reset OTP (/send-password-reset-otp/)
  async function handleForgotSendOtp() {
    if (!forgotEmail.trim() || !forgotEmail.includes("@")) {
      setForgotError("Please enter your registered email.")
      return
    }
    setForgotSending(true)
    setForgotError("")
    setForgotStatusMsg("")
    try {
      const res = await djangoApi.auth.sendPasswordResetOtp(forgotEmail.trim())
      if (res.success) {
        setForgotOtpSent(true)
        setForgotStatusMsg(`Password reset OTP sent to ${forgotEmail}. (Demo OTP: 123456)`)
      } else {
        setForgotError(res.error || "Could not send password reset OTP.")
      }
    } catch (e: any) {
      setForgotError(e.message || "Failed to send reset OTP.")
    } finally {
      setForgotSending(false)
    }
  }

  // Handle Verify Password Reset OTP (/verify-password-reset-otp/)
  async function handleForgotVerifyOtp() {
    if (!forgotOtp.trim() || forgotOtp.trim().length !== 6) {
      setForgotError("Please enter the 6-digit OTP.")
      return
    }
    setForgotVerifying(true)
    setForgotError("")
    try {
      const res = await djangoApi.auth.verifyPasswordResetOtp(forgotEmail.trim(), forgotOtp.trim())
      if (res.success) {
        setForgotOtpVerified(true)
        setForgotStatusMsg("✓ Reset OTP verified! Please enter your new password below.")
      } else {
        setForgotError(res.error || "Invalid reset OTP. Use demo OTP: 123456")
      }
    } catch (e: any) {
      setForgotError(e.message || "Verification failed.")
    } finally {
      setForgotVerifying(false)
    }
  }

  // Handle Reset Password (/reset-password/)
  async function submitForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!forgotOtpVerified) {
      setForgotError("Please verify your reset OTP first.")
      return
    }
    if (!forgotPassword || forgotPassword.length < 8) {
      setForgotError("New password must be at least 8 characters long.")
      return
    }
    if (forgotPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match.")
      return
    }

    setForgotResetting(true)
    setForgotError("")
    try {
      const res = await djangoApi.auth.resetPassword(forgotPassword, forgotConfirmPassword)
      if (res.success) {
        setForgotStatusMsg("✓ Password reset successfully! Redirecting to sign in...")
        setTimeout(() => {
          setAuthMode("login")
          setLoginEmail(forgotEmail)
          setLoginPassword(forgotPassword)
          setForgotStatusMsg("")
        }, 1200)
      } else {
        setForgotError(res.error || "Failed to reset password.")
      }
    } catch (e: any) {
      setForgotError(e.message || "Failed to reset password.")
    } finally {
      setForgotResetting(false)
    }
  }

  return (
    <div className="modal-backdrop backdrop-blur-md bg-slate-950/75 flex flex-col items-center justify-center p-4 overflow-y-auto" onMouseDown={onClose}>
      <div
        className={`relative w-full ${
          authMode === "register" ? "max-w-lg" : "max-w-[420px]"
        } my-auto animate-modal-up`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <section className="relative w-full bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-200/90 text-left max-h-[88vh] overflow-y-auto">
          {/* Top Brand Header with Campus Clans Logo */}
          <div className="flex items-center justify-between mb-5">
            <div className="logo !text-lg select-none">
              <span className="logo-mark !w-7 !h-7 !pb-1 shadow-sm">
                <i /><i /><i />
              </span>
              <strong className="!text-lg font-heading">
                Campus <span className="text-amber-500">Clans</span>
              </strong>
            </div>

            <button
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              type="button"
              onClick={onClose}
              aria-label="Close"
            >
              <Icon name="close" size={15} />
            </button>
          </div>

          {/* 1. SIGN IN VIEW (CAMPUS CLAN BRAND THEME & FEATURES) */}
          {authMode === "login" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  Sign In
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Welcome back! Enter your username or email.
                </p>
              </div>

              <form onSubmit={submitLogin} className="space-y-3.5 pt-1">
                {loginError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    {loginError}
                  </div>
                )}

                {/* Email / Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Username or Email
                  </label>
                  <input
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value)
                      setLoginError("")
                    }}
                    placeholder="e.g. aaravk or user@gmail.com"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                    autoFocus
                    required
                  />
                </div>

                {/* Password field with right-aligned Forgot password? and eye toggle inside */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("forgot")
                        setForgotEmail(loginEmail)
                      }}
                      className="text-xs text-amber-600 hover:text-amber-700 font-bold cursor-pointer transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-3 pr-10 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <Icon name={showPassword ? "eyeOff" : "eye"} size={16} />
                    </button>
                  </div>
                </div>

                {/* Signature Campus Clans Golden Primary Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="primary-button w-full !py-3.5 !rounded-xl !text-xs !font-black !shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{loginLoading ? "Signing in..." : "Sign In to Campus Clans"}</span>
                  <Icon name="arrow" size={15} />
                </button>
              </form>

              {/* Divider & Quick Demo Testing Access */}
              <div className="relative my-3 pt-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/80" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white/95 px-2">
                  Quick Demo Access
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSubmit("student", "aarav.k@campus.edu")}
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 font-bold text-xs text-slate-700 hover:text-amber-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  title="Instant Login as Student (User)"
                >
                  <span>🎓 Student Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSubmit("admin", "admin@campus.edu")}
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 font-bold text-xs text-slate-700 hover:text-amber-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  title="Instant Login as Campus Admin"
                >
                  <span>🛡️ Admin Demo</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. SIGN UP / REGISTRATION VIEW (CAMPUS CLAN BRAND THEME & BACKEND MODULES) */}
          {authMode === "register" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  Student Registration
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Verify your email with OTP & set your campus credentials.
                </p>
              </div>

              <form onSubmit={submitRegister} className="space-y-3">
                {regError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    {regError}
                  </div>
                )}
                {regStatusMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {regStatusMsg}
                  </div>
                )}

                {/* Email OTP Verification Row */}
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-amber-950 uppercase tracking-wider block">
                      Email Verification (OTP)
                    </label>
                    {otpVerified && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value)
                        setOtpSent(false)
                        setOtpVerified(false)
                      }}
                      placeholder="your.email@gmail.com"
                      disabled={otpVerified}
                      className="flex-1 text-xs p-2 rounded-xl border border-slate-200 bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending || otpVerified}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {otpSending ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="flex gap-2 pt-1 animate-fadeIn">
                      <input
                        type="text"
                        maxLength={6}
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP (e.g. 123456)"
                        className="flex-1 text-xs p-2 tracking-widest font-mono font-bold rounded-xl border border-slate-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpVerifying}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        {otpVerifying ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  )}
                </div>

                {/* 2-Column Student Profile Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">Full Name</label>
                    <input
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Aarav Khanna"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">Department</label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:border-amber-400 outline-none"
                    >
                      <option value="School of Engineering">School of Engineering</option>
                      <option value="School of Computer Applications">School of Computer Applications</option>
                      <option value="School of Management">School of Management</option>
                      <option value="School of Design & Arts">School of Design & Arts</option>
                      <option value="School of Applied Sciences">School of Applied Sciences</option>
                    </select>
                  </div>
                </div>

                {/* Branch / Major & Desired Username with live check */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">Branch / Major</label>
                    <input
                      value={regBranch}
                      onChange={(e) => setRegBranch(e.target.value)}
                      placeholder="B.Tech CSE"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 block">Desired Username</label>
                      {usernameCheck.checking && (
                        <span className="text-[10px] text-slate-400 font-semibold animate-pulse">Checking...</span>
                      )}
                    </div>
                    <input
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                      placeholder="aaravkhanna"
                      className={`w-full p-2.5 rounded-xl border text-xs outline-none transition-all ${
                        usernameCheck.available === true
                          ? "border-emerald-500 bg-emerald-50/20"
                          : usernameCheck.available === false
                          ? "border-rose-500 bg-rose-50/20"
                          : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      }`}
                      required
                    />
                    {usernameCheck.message && (
                      <span
                        className={`text-[10px] font-bold block ${
                          usernameCheck.available ? "text-emerald-700" : "text-rose-600"
                        }`}
                      >
                        {usernameCheck.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">Password (min 8 chars)</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-xl border-2 border-amber-300 bg-amber-50/15 text-xs focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">Confirm Password</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button in Campus Clan Primary Golden Theme */}
                <button
                  type="submit"
                  disabled={!otpVerified || regLoading || usernameCheck.available === false}
                  className="primary-button w-full !py-3.5 !rounded-xl !text-xs !font-black !shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{regLoading ? "Creating Account..." : "Create Account & Sign In"}</span>
                  <Icon name="arrow" size={15} />
                </button>
              </form>
            </div>
          )}

          {/* 3. FORGOT PASSWORD VIEW (OTP BASED) */}
          {authMode === "forgot" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  Reset Password
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Enter your registered email to verify OTP and set a new password.
                </p>
              </div>

              <form onSubmit={submitForgot} className="space-y-3.5">
                {forgotError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    {forgotError}
                  </div>
                )}
                {forgotStatusMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {forgotStatusMsg}
                  </div>
                )}

                {/* Step 1: Registered Email Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">Registered Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      disabled={forgotOtpVerified}
                      className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleForgotSendOtp}
                      disabled={forgotSending || forgotOtpVerified}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {forgotSending ? "Sending..." : forgotOtpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                </div>

                {/* Step 2: OTP Verification Input */}
                {forgotOtpSent && !forgotOtpVerified && (
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <label className="text-xs font-bold text-amber-950 block">
                      Enter 6-Digit Reset OTP (Demo: 123456)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="123456"
                        className="flex-1 text-xs p-2 font-mono tracking-widest font-bold rounded-xl border border-slate-200 bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleForgotVerifyOtp}
                        disabled={forgotVerifying}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        {forgotVerifying ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: New Password Inputs */}
                {forgotOtpVerified && (
                  <div className="space-y-3 pt-1">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      ✓ OTP Verified! Set your new password below.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800 block">New Password (min 8 chars)</label>
                        <input
                          type="password"
                          value={forgotPassword}
                          onChange={(e) => setForgotPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800 block">Confirm New Password</label>
                        <input
                          type="password"
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotResetting}
                      className="primary-button w-full !py-3.5 !rounded-xl !text-xs !font-black !shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <span>{forgotResetting ? "Updating..." : "Reset Password & Sign In"}</span>
                      <Icon name="arrow" size={15} />
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </section>

        {/* Minimal Instagram-style Switcher box */}
        <div className="mt-3.5 p-3.5 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md text-center text-xs text-slate-300 font-medium shadow-lg">
          {authMode === "login" && (
            <>
              Don't have a campus account?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register")
                  setRegEmail(loginEmail)
                }}
                className="text-amber-400 hover:text-amber-300 font-black hover:underline cursor-pointer ml-1"
              >
                Register as Student
              </button>
            </>
          )}
          {authMode === "register" && (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-amber-400 hover:text-amber-300 font-black hover:underline cursor-pointer ml-1"
              >
                Sign in
              </button>
            </>
          )}
          {authMode === "forgot" && (
            <>
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-amber-400 hover:text-amber-300 font-black hover:underline cursor-pointer ml-1"
              >
                Back to Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const pageDetails: Record<AdminPage, {
  eyebrow: string
  title: string
  copy: string
}> = {
  overview: {
    eyebrow: "MONDAY, 12 OCTOBER",
    title: "Good morning, Maya.",
    copy: "Here’s what’s happening across your campus today.",
  },
  community: {
    eyebrow: "COMMUNITY MANAGEMENT",
    title: "Students & clans",
    copy: "Review members, manage access and keep your community healthy.",
  },
  events: {
    eyebrow: "CAMPUS PROGRAMMING",
    title: "Events management",
    copy: "Create experiences, review registrations and track attendance.",
  },
  trophies: {
    eyebrow: "RECOGNITION",
    title: "Trophies & achievements",
    copy: "Review nominations and celebrate exceptional student work.",
  },
  reports: {
    eyebrow: "MONTHLY REPORTING",
    title: "Campus reports",
    copy: "Review monthly performance and prepare a PDF summary.",
  },
}

function AdminHeader({
  page,
  onLogout,
  onSwitchAdvanced,
  onOpenSearch,
  onOpenNotifications,
}: {
  page: AdminPage
  onLogout: () => void
  onSwitchAdvanced?: () => void
  onOpenSearch?: () => void
  onOpenNotifications?: () => void
}) {
  const detail = pageDetails[page]
  return (
    <>
      <header className="admin-topbar">
        <button className="campus-selector" type="button">
          <span>CC</span>
          <div>
            <small>ADMINISTERING</small>
            <strong>Campus Community</strong>
          </div>
          <span>⌄</span>
        </button>
        <div className="topbar-actions">
          {onSwitchAdvanced && (
            <button
              type="button"
              className="outline-button"
              style={{
                minHeight: "36px",
                fontSize: "11px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 12px",
                borderRadius: "9px",
                borderColor: "#f5b800",
                background: "rgba(245,184,0,0.08)",
                color: "#926800",
                fontWeight: 700
              }}
              onClick={onSwitchAdvanced}
            >
              <Icon name="shield" size={14} /> Full NAAC/Audit Console
            </button>
          )}
          <button
            className="icon-button"
            type="button"
            onClick={onOpenSearch}
            title="Search campus events"
            aria-label="Search"
          >
            <Icon name="search" />
          </button>
          <button
            className="icon-button notification"
            type="button"
            onClick={onOpenNotifications}
            title="Admin Notifications"
            aria-label="Notifications"
          >
            <Icon name="bell" />
            <i />
          </button>
          <div className="admin-person">
            <span>MK</span>
            <div>
              <strong>Maya Kapoor</strong>
              <small>Campus admin</small>
            </div>
          </div>
        </div>
      </header>
      <div className="page-title">
        <div>
          <span className="kicker">{detail.eyebrow}</span>
          <h1>{detail.title}</h1>
          <p>{detail.copy}</p>
        </div>
        <button className="logout-button" type="button" onClick={onLogout}>
          <Icon name="logout" size={17} />
          Sign out
        </button>
      </div>
    </>
  )
}

function OverviewPage({
  onNavigate,
}: {
  onNavigate: (page: AdminPage) => void
}) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850)
    return () => window.clearTimeout(timer)
  }, [])
  if (loading)
    return (
      <div className="skeleton-page">
        <div className="skeleton-row">
          {[1, 2, 3, 4].map((item) => (
            <span key={item} />
          ))}
        </div>
        <div className="skeleton-main">
          <span />
          <span />
        </div>
      </div>
    )
  const metrics = [
    {
      label: "Registered students",
      value: "2,486",
      delta: "+12.4%",
      icon: "users",
    },
    {
      label: "Active clans",
      value: "48",
      delta: "+6 this month",
      icon: "grid",
    },
    {
      label: "Upcoming events",
      value: "14",
      delta: "4 this week",
      icon: "calendar",
    },
    {
      label: "Trophies awarded",
      value: "312",
      delta: "+24 pending",
      icon: "trophy",
    },
  ]
  return (
    <div className="overview-page">
      <div className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div>
              <span className="metric-icon">
                <Icon name={metric.icon} />
              </span>
              <span className="metric-delta">
                <Icon name="trend" size={13} />
                {metric.delta}
              </span>
            </div>
            <strong>{metric.value}</strong>
            <p>{metric.label}</p>
          </article>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="surface activity-chart">
          <div className="surface-heading">
            <div>
              <span className="kicker">ENGAGEMENT</span>
              <h2>Campus activity</h2>
            </div>
            <select defaultValue="6 months">
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>
          <div className="chart">
            <div className="chart-labels">
              <span>3k</span>
              <span>2k</span>
              <span>1k</span>
              <span>0</span>
            </div>
            <div className="chart-area">
              <svg viewBox="0 0 600 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f59e0b" stopOpacity=".28" />
                    <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="chart-fill"
                  d="M0 185 C70 175 82 132 140 144 S240 192 292 118 S380 94 420 118 S510 52 600 62 L600 220 L0 220Z"
                />
                <path
                  className="chart-line"
                  d="M0 185 C70 175 82 132 140 144 S240 192 292 118 S380 94 420 118 S510 52 600 62"
                />
              </svg>
              <div className="chart-months">
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
              </div>
            </div>
          </div>
        </section>
        <section className="surface quick-actions">
          <div className="surface-heading">
            <div>
              <span className="kicker">SHORTCUTS</span>
              <h2>Quick actions</h2>
            </div>
          </div>
          {[
            {
              label: "Create an event",
              copy: "Publish a new campus event",
              icon: "calendar",
              page: "events" as AdminPage,
            },
            {
              label: "Review trophies",
              copy: "8 nominations awaiting review",
              icon: "trophy",
              page: "trophies" as AdminPage,
            },
            {
              label: "Manage students",
              copy: "View and update student access",
              icon: "users",
              page: "community" as AdminPage,
            },
          ].map((action) => (
            <button
              type="button"
              onClick={() => onNavigate(action.page)}
              key={action.label}
            >
              <span>
                <Icon name={action.icon} />
              </span>
              <div>
                <strong>{action.label}</strong>
                <small>{action.copy}</small>
              </div>
              <Icon name="arrow" size={17} />
            </button>
          ))}
        </section>
      </div>
      <div className="dashboard-grid lower">
        <section className="surface upcoming">
          <div className="surface-heading">
            <div>
              <span className="kicker">NEXT UP</span>
              <h2>Upcoming events</h2>
            </div>
            <button type="button" onClick={() => onNavigate("events")}>
              View all <Icon name="arrow" size={14} />
            </button>
          </div>
          {events.slice(0, 3).map((event) => (
            <div className="compact-event" key={event.id}>
              <div className={`compact-date ${event.accent}`}>
                <small>{event.month}</small>
                <strong>{event.day}</strong>
              </div>
              <div>
                <strong>{event.title}</strong>
                <small>
                  <Icon name="clock" size={13} />
                  {event.time} · {event.location}
                </small>
              </div>
              <StatusBadge status="Open" />
              <button type="button">
                <Icon name="more" />
              </button>
            </div>
          ))}
        </section>
        <section className="surface campus-health">
          <div className="surface-heading">
            <div>
              <span className="kicker">CAMPUS HEALTH</span>
              <h2>Strong engagement</h2>
            </div>
          </div>
          <div className="score-ring">
            <div>
              <strong>89</strong>
              <span>/100</span>
            </div>
          </div>
          <p>Participation is 14% higher than similar campuses.</p>
          <div className="health-line">
            <span>Clan activity</span>
            <strong>94%</strong>
          </div>
          <div className="health-line">
            <span>Event attendance</span>
            <strong>87%</strong>
          </div>
        </section>
      </div>
    </div>
  )
}

function CommunityPage() {
  const [tab, setTab] = useState<"Students" | "Clans">("Students")
  const [query, setQuery] = useState("")
  const [studentStatuses, setStudentStatuses] =
    useState<Record<string, Status>>({})
  const source = tab === "Students" ? students : clans
  const visible = source.filter((item) =>
    `${item.name} ${"email" in item ? item.email : item.focus}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  return (
    <section className="surface management-page">
      <div className="management-toolbar">
        <div className="segmented">
          <button
            className={tab === "Students" ? "active" : ""}
            onClick={() => setTab("Students")}
            type="button"
          >
            Students <span>2,486</span>
          </button>
          <button
            className={tab === "Clans" ? "active" : ""}
            onClick={() => setTab("Clans")}
            type="button"
          >
            Clans <span>48</span>
          </button>
        </div>
        <div className="toolbar-right">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={`Search ${tab.toLowerCase()}...`}
          />
          <select>
            <option>All statuses</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
          <button className="outline-button" type="button">
            Export CSV
          </button>
        </div>
      </div>
      <div className="data-table">
        <div className={`table-row table-head ${tab.toLowerCase()}`}>
          <span>{tab === "Students" ? "Student" : "Clan"}</span>
          <span>{tab === "Students" ? "Program" : "Members"}</span>
          <span>{tab === "Students" ? "Clans" : "Projects"}</span>
          <span>Status</span>
          <span />
        </div>
        {visible.map((item) => {
          const currentStatus =
            "email" in item
              ? studentStatuses[item.name] || item.status
              : item.status
          return (
            <div className={`table-row ${tab.toLowerCase()}`} key={item.name}>
              <div className="identity">
                <span>{item.initials}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{"email" in item ? item.email : item.focus}</small>
                </div>
              </div>
              <span>
                {"course" in item ? (
                  <>
                    {item.course}
                    <small>{item.year}</small>
                  </>
                ) : (
                  item.members
                )}
              </span>
              <span>{"clans" in item ? item.clans : item.projects}</span>
              <StatusBadge status={currentStatus} />
              <button
                className="row-menu"
                type="button"
                onClick={() =>
                  "email" in item &&
                  setStudentStatuses((all) => ({
                    ...all,
                    [item.name]:
                      currentStatus === "Active" ? "Suspended" : "Active",
                  }))
                }
              >
                <Icon name="more" />
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function EventModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (title: string) => void
}) {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) {
      setError("Event title is required.")
      return
    }
    onCreate(title)
  }
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="form-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <span className="kicker">NEW EVENT</span>
            <h2>Create campus event</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={submit}>
          <label>
            Event title
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError("")
              }}
              placeholder="e.g. Product Design Sprint"
            />
          </label>
          {error && <span className="field-error">{error}</span>}
          <div className="form-grid">
            <label>
              Event type
              <select>
                <option>Workshop</option>
                <option>Hackathon</option>
                <option>Talk</option>
              </select>
            </label>
            <label>
              Date
              <input type="date" />
            </label>
          </div>
          <label>
            Description
            <textarea placeholder="Tell students what to expect..." />
          </label>
          <label className="media-upload">
            <input type="file" accept="image/*" />
            <span>
              <Icon name="upload" />
              <strong>Add cover media</strong>
              <small>PNG or JPG, up to 8 MB</small>
            </span>
            <img
              src={workshopPhoto}
              alt="Students collaborating around a workshop table"
            />
          </label>
          <div className="modal-actions">
            <button className="outline-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Publish event
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function EventsManagementPage() {
  const [showModal, setShowModal] = useState(false)
  const [created, setCreated] = useState<string[]>([])
  return (
    <>
      <div className="page-action-row">
        <div className="segmented">
          <button className="active" type="button">
            Upcoming
          </button>
          <button type="button">Past</button>
          <button type="button">Drafts</button>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => setShowModal(true)}
        >
          <Icon name="plus" size={17} />
          Create event
        </button>
      </div>
      <section className="surface event-management-list">
        {created.map((title) => (
          <div className="managed-event new" key={title}>
            <div className="managed-art amber">NEW</div>
            <div>
              <StatusBadge status="Open" />
              <h3>{title}</h3>
              <p>Just published · Campus wide</p>
            </div>
            <strong>0</strong>
            <span>registrations</span>
            <button className="row-menu" type="button">
              <Icon name="more" />
            </button>
          </div>
        ))}
        {events.slice(0, 5).map((event, index) => (
          <div className="managed-event" key={event.id}>
            <div className={`managed-art ${event.accent}`}>{event.day}</div>
            <div>
              <span className="event-type-inline">{event.type}</span>
              <h3>{event.title}</h3>
              <p>
                {event.month} {event.day} · {event.time} · {event.location}
              </p>
            </div>
            <strong>{event.people}</strong>
            <span>registrations</span>
            <StatusBadge status={index === 4 ? "Ended" : "Open"} />
            <button className="row-menu" type="button">
              <Icon name="more" />
            </button>
          </div>
        ))}
      </section>
      {showModal && (
        <EventModal
          onClose={() => setShowModal(false)}
          onCreate={(title) => {
            setCreated((all) => [title, ...all])
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}

function TrophiesPage() {
  const [reviews, setReviews] =
    useState<Record<string, "Approved" | "Pending">>({
      "Project Nova": "Pending",
      EcoRoute: "Pending",
      "Campus Lens": "Pending",
    })
  const nominees = [
    {
      project: "Project Nova",
      clan: "Pixel Pirates",
      award: "Best Product Design",
      initials: "PP",
    },
    {
      project: "EcoRoute",
      clan: "Binary Beasts",
      award: "Social Impact Award",
      initials: "BB",
    },
    {
      project: "Campus Lens",
      clan: "Venture Verse",
      award: "Community Choice",
      initials: "VV",
    },
  ]
  return (
    <div className="trophy-layout">
      <section className="surface trophy-review">
        <div className="surface-heading">
          <div>
            <span className="kicker">PARTICIPANT REVIEW</span>
            <h2>Pending nominations</h2>
          </div>
          <span className="count-badge">
            {
              Object.values(reviews).filter((value) => value === "Pending")
                .length
            }{" "}
            to review
          </span>
        </div>
        {nominees.map((nominee) => (
          <article className="nominee" key={nominee.project}>
            <span className="nominee-avatar">{nominee.initials}</span>
            <div>
              <span className="kicker">{nominee.award}</span>
              <h3>{nominee.project}</h3>
              <p>Submitted by {nominee.clan}</p>
            </div>
            <StatusBadge status={reviews[nominee.project]} />
            <div className="review-actions">
              <button className="outline-button" type="button">
                View work
              </button>
              {reviews[nominee.project] === "Pending" && (
                <button
                  className="primary-button"
                  type="button"
                  onClick={() =>
                    setReviews((all) => ({
                      ...all,
                      [nominee.project]: "Approved",
                    }))
                  }
                >
                  <Icon name="check" size={16} />
                  Approve
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
      <aside className="surface trophy-preview">
        <span className="kicker">AWARD PREVIEW</span>
        <div className="trophy-medal">
          <Icon name="trophy" size={38} />
        </div>
        <h2>Campus Excellence</h2>
        <p>Awarded for outstanding craft, impact and collaboration.</p>
        <div>
          <span>Issued this semester</span>
          <strong>42</strong>
        </div>
        <button className="outline-button" type="button">
          Manage trophy types
        </button>
      </aside>
    </div>
  )
}

function ReportsPage() {
  const [generating, setGenerating] = useState(false)
  const [ready, setReady] = useState(false)
  function generateReport() {
    setGenerating(true)
    setReady(false)
    window.setTimeout(() => {
      setGenerating(false)
      setReady(true)
    }, 900)
  }
  return (
    <div className="reports-layout">
      <section className="surface report-builder">
        <div className="surface-heading">
          <div>
            <span className="kicker">REPORTING PERIOD</span>
            <h2>October 2026 summary</h2>
          </div>
          <div className="report-period">
            <select defaultValue="October">
              <option>October</option>
              <option>September</option>
              <option>August</option>
            </select>
            <select defaultValue="2026">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
        </div>
        <div className="report-preview">
          <div className="report-cover">
            <Logo />
            <span>MONTHLY CAMPUS REPORT</span>
            <h3>Campus Clans Community</h3>
            <p>October 2026</p>
          </div>
          <div className="report-metrics">
            {[
              ["Total students", "2,486"],
              ["Active clans", "48"],
              ["Students without a clan", "312"],
              ["Upcoming events", "14"],
              ["Monthly applications", "186"],
              ["Active projects", "126"],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <aside className="surface report-actions">
        <span className="kicker">PDF EXPORT</span>
        <h2>Monthly report</h2>
        <p>
          Generate a campus activity report for the selected period. The
          prototype keeps your selected period while processing.
        </p>
        <div className={`report-state ${ready ? "ready" : ""}`}>
          <span>
            <Icon name={ready ? "check" : "calendar"} />
          </span>
          <div>
            <strong>{ready ? "Report is ready" : "Ready to generate"}</strong>
            <small>
              {ready ? "Generated just now" : "Last generated 01 October 2026"}
            </small>
          </div>
        </div>
        <button
          className="primary-button"
          type="button"
          disabled={generating}
          onClick={generateReport}
        >
          {generating
            ? "Generating report..."
            : ready
              ? "Download PDF"
              : "Generate PDF report"}
        </button>
      </aside>
    </div>
  )
}

function StudentHome({
  onNavigate,
  onOpenClan,
  onOpenEvent,
  onLogout,
}: {
  onNavigate: (page: StudentPage) => void
  onOpenClan?: (clanName: string) => void
  onOpenEvent?: (event: DetailedEvent) => void
  onLogout?: () => void
}) {
  const [requestedClans, setRequestedClans] = useState<string[]>([])

  return (
    <div className="student-home space-y-10 pb-16">
      {/* 1. UPPER SECTION: Greeting & Slogan */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#172033] via-[#1f2b44] to-[#172033] p-6 md:p-10 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f5b800]" />
              <span>Connect · Collaborate · Grow</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-heading">
              Hi, Aarav! <span className="inline-block animate-bounce">👋</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
              Welcome back to your campus launchpad. Connect with ambitious peers, collaborate in active clans, and grow with top hackathons.
            </p>
          </div>

          {/* Action Buttons on the Right Side (Replacing Profile Strength & Events Count) */}
          <div className="flex flex-col gap-2.5 min-w-[260px] sm:min-w-[280px] w-full md:w-auto">
            {/* 1. Explore Clans Button */}
            <button
              type="button"
              onClick={() => onNavigate("clans")}
              style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
              className="w-full py-3 px-5 rounded-xl font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-amber-400 flex items-center justify-between gap-3 group"
            >
              <span className="flex items-center gap-2">
                <Icon name="users" size={16} />
                <span>Explore Clans</span>
              </span>
              <span className="group-hover:translate-x-1 transition-transform">
                <Icon name="arrow" size={15} />
              </span>
            </button>

            {/* 2. My Clan Button */}
            <button
              type="button"
              onClick={() => onOpenClan?.("Pixel Pirates")}
              style={{ backgroundColor: "#1e293b", color: "#fbbf24", borderColor: "rgba(245, 184, 0, 0.35)" }}
              className="w-full py-3 px-5 rounded-xl font-black text-xs shadow-md hover:bg-slate-800/90 active:scale-95 transition-all cursor-pointer border flex items-center justify-between gap-3 group"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span>My Clan: Pixel Pirates</span>
              </span>
              <span className="text-[11px] font-extrabold text-amber-400 group-hover:translate-x-1 transition-transform">
                View →
              </span>
            </button>

            {/* 3. Browse Events Button */}
            <button
              type="button"
              onClick={() => onNavigate("events")}
              className="w-full py-3 px-5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-between gap-3 group backdrop-blur-md"
            >
              <span className="flex items-center gap-2">
                <Icon name="calendar" size={16} />
                <span>Browse Events</span>
              </span>
              <span className="group-hover:translate-x-1 transition-transform">
                <Icon name="arrow" size={15} />
              </span>
            </button>
          </div>
        </div>

        {/* Ambient Decorative Orbit */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* 2. 3D FORWARD-CURVED PANORAMIC EVENT SLIDER (CONVEX CYLINDER & 16:9 YOUTUBE THUMBNAILS) */}
      <ForwardCurvedEventSlider
        events={events}
        onSelectEvent={(evt) => {
          const matched = events.find((e) => e.id === evt.id) || (evt as any)
          if (onOpenEvent) {
            onOpenEvent(matched)
          } else {
            onNavigate("events")
          }
        }}
        onExploreAll={() => onNavigate("events")}
        title="Featured Events & Hackathons"
        subtitle="Connect · Collaborate · Grow with top campus initiatives"
      />

      {/* CLAN STORIES (24H SPRINT STORIES & BEHIND-THE-SCENES) */}
      <ClanStoriesStrip onOpenClan={onOpenClan} />

      {/* 3. CLANS SECTION (CAMPUS CLANS SHOWCASE) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f5b800]" />
              <span className="text-xs font-black tracking-wider text-amber-600 uppercase">
                Find Your Squad
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Active Campus Clans
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Join specialized student teams to build real-world products and win hackathons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenClan?.("Pixel Pirates")}
              style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-amber-400"
            >
              <span>🛡️ My Clan: Pixel Pirates</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("clans")}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Explore all clans <Icon name="arrow" size={13} />
            </button>
          </div>
        </div>

        {/* Modern Web3/Trading Card Clan Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {clans.map((clan) => (
            <ClanCard
              key={clan.name}
              clan={clan as any}
              isRequested={requestedClans.includes(clan.name)}
              onOpen={() => onOpenClan?.(clan.name)}
              onJoin={() =>
                setRequestedClans((all) =>
                  all.includes(clan.name) ? all.filter((n) => n !== clan.name) : [...all, clan.name]
                )
              }
            />
          ))}
        </div>
      </section>

    </div>
  )
}

function CampusFooter({
  subtitle = "Official Student Community Portal",
  onLogout,
}: {
  subtitle?: string
  currentPage?: any
  onNavigate?: any
  onLogout?: () => void
}) {
  const [showAbout, setShowAbout] = useState(false)
  const [showContact, setShowContact] = useState(false)

  return (
    <>
      <footer className="mt-14 mb-16 md:mb-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Campus Clan Branding & Slogan */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <Logo subtitle="Connect · Collaborate · Grow" size={44} />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-900 text-[11px] font-black uppercase tracking-wider shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Connect · Collaborate · Grow</span>
              </div>
              <p className="text-xs text-slate-500 font-medium max-w-md">
                The launchpad for ambitious student builders, active clans, and competitive campus hackathons.
              </p>
            </div>
          </div>

          {/* Right: About Us, Contact Us, and Sign out buttons (No Nav Bar items!) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowAbout(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/90 border border-slate-200/80 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Icon name="shield" size={14} />
              <span>About Us</span>
            </button>

            <button
              type="button"
              onClick={() => setShowContact(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/90 border border-slate-200/80 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Icon name="chat" size={14} />
              <span>Contact Us</span>
            </button>

            {onLogout && (
              <>
                <span className="w-px h-5 bg-slate-200 hidden sm:inline-block" />
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/90 border border-rose-200/90 transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95 group"
                  title="Sign out of Campus Clans"
                >
                  <Icon name="logout" size={14} />
                  <span>Sign out</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Row: Tagline, Status & Copyright */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 font-bold text-amber-600 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Campus Clan · Connect · Collaborate · Grow</span>
          </div>
          <span>© 2026 Campus Clans. Built for ambitious student communities.</span>
        </div>
      </footer>

      {/* About Us & Contact Us Interactive Modals */}
      <AboutUsModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <ContactUsModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </>
  )
}

function StudentFooter({
  currentPage,
  onNavigate,
  onLogout,
}: {
  currentPage?: any
  onNavigate?: any
  onLogout?: () => void
}) {
  return <CampusFooter subtitle="Campus Clans Community Portal" onLogout={onLogout} />
}

function AdminFooter({
  currentPage,
  onNavigate,
  onLogout,
}: {
  currentPage?: any
  onNavigate?: any
  onLogout?: () => void
}) {
  return <CampusFooter subtitle="Campus Clans Administration" onLogout={onLogout} />
}

function StudentClans({
  onOpenClan,
}: {
  onOpenClan?: (clanName: string) => void
}) {
  const [query, setQuery] = useState("")
  const [clanList, setClanList] = useState(clans)
  const [requested, setRequested] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [joinFeedback, setJoinFeedback] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"clans" | "recruits">("clans")

  // Backend StudentRecruitment model: Students who posted availability for clan scouting
  const [recruits, setRecruits] = useState([
    {
      id: "rec-1",
      name: "Vikram Mehta",
      department: "School of Design",
      branch: "B.Des · 3rd Year",
      initials: "VM",
      preferredRole: "UI/UX & Design Systems Lead",
      skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
      bio: "Looking to join a hackathon clan that needs a dedicated product and interface designer. Top 10 at Figma Design Jam 2025.",
      invited: false,
    },
    {
      id: "rec-2",
      name: "Ananya Roy",
      department: "Dept of Computer Science",
      branch: "B.Tech CSE · 3rd Year",
      initials: "AR",
      preferredRole: "Frontend Architecture & React Specialist",
      skills: ["React 19", "Tailwind CSS", "TypeScript", "Next.js"],
      bio: "Full-stack developer with intense focus on React performance and Web3 interfaces. Aiming for National Hackfest 2026.",
      invited: false,
    },
    {
      id: "rec-3",
      name: "Devansh Sharma",
      department: "Dept of Computer Science",
      branch: "B.Tech CSE · 3rd Year",
      initials: "DS",
      preferredRole: "AI / ML & PyTorch Engineer",
      skills: ["Python", "PyTorch", "FastAPI", "Vector DB", "Docker"],
      bio: "Authored two campus papers on local LLM quantization. Looking for a clan building deep learning products.",
      invited: false,
    },
    {
      id: "rec-4",
      name: "Rohit Verma",
      department: "Electronics & Communication",
      branch: "B.Tech ECE · 4th Year",
      initials: "RV",
      preferredRole: "Embedded Systems & Hardware Telemetry",
      skills: ["C++", "RTOS", "ESP32", "ROS2", "IoT"],
      bio: "Autonomous rover pilot. Can interface microcontrollers with web telemetry dashboards.",
      invited: false,
    },
  ])

  const visibleClans = clanList.filter((clan) =>
    `${clan.name} ${clan.focus}`.toLowerCase().includes(query.toLowerCase()),
  )

  const visibleRecruits = recruits.filter((r) =>
    `${r.name} ${r.preferredRole} ${r.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  )

  const handleToggleJoinClan = async (clanName: string) => {
    const isAlreadyRequested = requested.includes(clanName)
    try {
      if (isAlreadyRequested) {
        await djangoApi.clans.cancelJoinRequest(clanName)
        setRequested((all) => all.filter((n) => n !== clanName))
        setJoinFeedback(`Cancelled join request for ${clanName}`)
      } else {
        await djangoApi.clans.sendJoinRequest(clanName)
        setRequested((all) => [...all, clanName])
        setJoinFeedback(`Join request submitted to ${clanName}! Leader notified.`)
      }
      setTimeout(() => setJoinFeedback(null), 3500)
    } catch {
      // Graceful fallback
      if (isAlreadyRequested) {
        setRequested((all) => all.filter((n) => n !== clanName))
      } else {
        setRequested((all) => [...all, clanName])
      }
    }
  }

  const handleClanCreated = (newClan: any) => {
    setClanList((prev) => [newClan, ...prev])
    setJoinFeedback(`Clan "${newClan.name}" created successfully!`)
    setTimeout(() => setJoinFeedback(null), 4000)
    onOpenClan?.(newClan.name)
  }

  const handleInviteRecruit = (recruitId: string, name: string) => {
    djangoApi.clans.sendInvitation(Date.now()).catch(() => {})
    setRecruits((prev) =>
      prev.map((r) => (r.id === recruitId ? { ...r, invited: true } : r))
    )
    setJoinFeedback(`Official clan invitation dispatched to ${name}!`)
    setTimeout(() => setJoinFeedback(null), 4000)
  }

  return (
    <div className="student-page space-y-6">
      {/* Join Request / Action Notification Banner */}
      {joinFeedback && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade shadow-sm">
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>{joinFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setJoinFeedback(null)}
            className="text-amber-700 hover:text-amber-950 font-black cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 block mb-1">
            Skill-Based Discovery & Scouting
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
            {activeSection === "clans" ? "Find your clan." : "Scout student talent."}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium mt-1">
            {activeSection === "clans"
              ? "Meet ambitious students who are serious about building, competing, and growing together."
              : "Browse students actively seeking clans for hackathons, engineering sprints, and competitions."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-95 transition-all cursor-pointer border border-slate-700"
          >
            <span>+ Create Clan</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenClan?.("Pixel Pirates")}
            style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-amber-400"
          >
            <span>🛡️ My Clan: Pixel Pirates</span>
          </button>
          <label className="student-search">
            <Icon name="search" size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={activeSection === "clans" ? "Search clans or skills" : "Search candidate skills..."}
            />
          </label>
        </div>
      </div>

      {/* Segmented Control: Browse Clans vs Scout Recruits */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSection("clans")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSection === "clans"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          🛡️ Campus Clans ({clanList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("recruits")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === "recruits"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>🎯 Scout Recruits</span>
          <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-md text-[10px] font-black">
            {recruits.length} Seeking
          </span>
        </button>
      </div>

      {/* Section A: Clans Grid */}
      {activeSection === "clans" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {visibleClans.map((clan) => (
            <ClanCard
              key={clan.name}
              clan={clan as any}
              isRequested={requested.includes(clan.name)}
              onOpen={() => onOpenClan?.(clan.name)}
              onJoin={() => handleToggleJoinClan(clan.name)}
            />
          ))}
        </div>
      )}

      {/* Section B: Recruits Seeking Clan Directory (Backend StudentRecruitment feature) */}
      {activeSection === "recruits" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 items-stretch">
          {visibleRecruits.map((recruit) => (
            <div
              key={recruit.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400/60 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                      {recruit.initials}
                    </div>
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">{recruit.name}</strong>
                      <span className="text-[11px] font-semibold text-slate-500">{recruit.branch}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase">
                    Looking for Clan
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                    Preferred Role
                  </span>
                  <p className="text-xs font-black text-slate-900">{recruit.preferredRole}</p>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                  "{recruit.bio}"
                </p>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Strengths</span>
                  <div className="flex flex-wrap gap-1.5">
                    {recruit.skills.map((sk) => (
                      <span key={sk} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">Available for sprints</span>
                <button
                  type="button"
                  disabled={recruit.invited}
                  onClick={() => handleInviteRecruit(recruit.id, recruit.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    recruit.invited
                      ? "bg-emerald-100 text-emerald-900 cursor-not-allowed"
                      : "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs"
                  }`}
                >
                  {recruit.invited ? (
                    <span>✓ Invitation Dispatched</span>
                  ) : (
                    <span>✉️ Invite to Clan</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Found a New Clan Modal */}
      <CreateClanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onClanCreated={handleClanCreated}
      />
    </div>
  )
}

function StudentEvents({
  onSelectEvent,
  joined = [],
  onToggleJoin,
}: {
  onSelectEvent?: (event: DetailedEvent) => void
  joined?: number[]
  onToggleJoin?: (id: number) => void
}) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [localJoined, setLocalJoined] = useState<number[]>(joined)
  const [localModalEvent, setLocalModalEvent] = useState<DetailedEvent | null>(null)

  const activeJoinedList = onToggleJoin ? joined : localJoined

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      activeCategory === "All" ||
      event.type.toLowerCase() === activeCategory.toLowerCase()
    const matchesQuery =
      query.trim() === "" ||
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase()) ||
      event.type.toLowerCase().includes(query.toLowerCase()) ||
      (event.tagline && event.tagline.toLowerCase().includes(query.toLowerCase()))
    return matchesCategory && matchesQuery
  })

  const handleCardClick = (event: DetailedEvent) => {
    if (onSelectEvent) {
      onSelectEvent(event)
    } else {
      setLocalModalEvent(event)
    }
  }

  const handleToggleEvent = (id: number) => {
    if (onToggleJoin) {
      onToggleJoin(id)
    } else {
      setLocalJoined((all) =>
        all.includes(id) ? all.filter((x) => x !== id) : [...all, id]
      )
    }
  }

  return (
    <div className="student-page space-y-6">
      {/* Header and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-200/80">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 block mb-1">
            DISCOVER OPPORTUNITIES
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Campus events.
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium mt-1">
            Hackathons, workshops and meetups curated for ambitious students.
          </p>
        </div>

        {/* Dedicated Search Input & Search Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search event, location, topic..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-xs transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer border border-amber-400 shrink-0"
          >
            <Icon name="search" size={14} />
            <span>Search Events</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Hackathon", "Workshop", "Talk", "Networking"].map((category) => {
            const isSelected = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Showing <strong>{filteredEvents.length}</strong> of {events.length} events
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredEvents.map((event) => {
          const isGoing = activeJoinedList.includes(event.id as number)
          return (
            <article
              className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              key={event.id}
              onClick={() => handleCardClick(event)}
            >
              <div>
                {/* 16:9 YouTube Thumbnail Artwork Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={event.thumbnail || workshopPhoto}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top-Left Category Pill */}
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
                    {event.type}
                  </span>

                  {/* Top-Right Date Badge */}
                  <div className="absolute top-3 right-3 z-10 w-11 h-12 rounded-xl bg-white/95 backdrop-blur-md flex flex-col items-center justify-center shadow-lg border border-white/40">
                    <span className="text-[9px] font-black text-amber-600 uppercase leading-none">
                      {event.month}
                    </span>
                    <strong className="text-base font-black text-slate-900 leading-tight">
                      {event.day}
                    </strong>
                  </div>

                  {/* Bottom attendees indicator */}
                  <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5 text-white text-[11px] font-bold drop-shadow">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{event.people} attending</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2.5">
                  <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                    {event.tagline || "Join fellow students for an immersive campus learning and networking experience."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Icon name="pin" size={13} />
                      {event.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Icon name="clock" size={13} />
                      {event.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Details Modal & RSVP / Interested */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(event)
                  }}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  title="View Venue, Schedule & Registration"
                >
                  <span>Details</span>
                  <Icon name="arrowRight" size={13} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(event)
                  }}
                  className={`flex-1 py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isGoing
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                      : "primary-button !w-full"
                  }`}
                >
                  <Icon name={isGoing ? "check" : "calendar"} size={14} />
                  <span>{isGoing ? "✓ Registered (Manage / Cancel)" : event.hasRegistration ? "Register / Enter" : "Interested"}</span>
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {/* Internal Modal fallback if parent handler not used */}
      <EventDetailsModal
        event={localModalEvent}
        isOpen={!!localModalEvent}
        onClose={() => setLocalModalEvent(null)}
        isInterested={localModalEvent ? activeJoinedList.includes(localModalEvent.id as number) : false}
        onToggleInterested={(id) => handleToggleEvent(Number(id))}
        userClanName="Pixel Pirates"
        currentUserRole="Leader"
        onRegistrationChange={(id, isReg) => {
          const numId = Number(id)
          if (onToggleJoin) {
            if (isReg && !joined.includes(numId)) onToggleJoin(numId)
            else if (!isReg && joined.includes(numId)) onToggleJoin(numId)
          } else {
            setLocalJoined((prev) =>
              isReg ? (prev.includes(numId) ? prev : [...prev, numId]) : prev.filter((x) => x !== numId)
            )
          }
        }}
      />

      {filteredEvents.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-black">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No events found matching your search
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or reset category filters to view all upcoming campus hackathons and workshops.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setActiveCategory("All")
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer mt-1"
          >
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  )
}

function StudentMessages() {
  const [selectedChat, setSelectedChat] = useState(0)
  const [conversations, setConversations] = useState<Record<number, string[]>>({
    0: [],
    1: [],
    2: [],
  })
  const [draft, setDraft] = useState("")

  const chats = [
    {
      initials: "PP",
      name: "Pixel Pirates",
      subtitle: "Clan channel · 8 members online",
      prompt: "Hey Aarav, we reviewed your portfolio. Great work on Nova.",
      reply: "Thanks! I'd love to contribute to the next sprint.",
    },
    {
      initials: "AM",
      name: "Aryan Mehta",
      subtitle: "Binary Beasts · Lead ML",
      prompt: "Your frontend work looks great. Want to team up for North India Hackfest?",
      reply: "Hey Aryan, sounds great! What tech stack are you aiming for?",
    },
    {
      initials: "CC",
      name: "Circuit Crew",
      subtitle: "Robotics Club · Hardware Team",
      prompt: "We need a UI designer for the RoboCon telemetry dashboard. Interested?",
      reply: "Count me in! I can build the telemetry dashboard in React.",
    },
  ]

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return
    setConversations((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), draft],
    }))
    setDraft("")
  }

  const current = chats[selectedChat]
  const currentMessages = conversations[selectedChat] || []

  return (
    <div className="student-page space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 block mb-1">
            COLLABORATE & NETWORK
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Messages.
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium mt-1">
            Your accepted connections, teammate requests, and clan discussions.
          </p>
        </div>
      </div>
      <section className="student-glass student-chat">
        <aside>
          {chats.map((chat, index) => (
            <button
              className={selectedChat === index ? "active" : ""}
              type="button"
              key={chat.name}
              onClick={() => setSelectedChat(index)}
            >
              <span>{chat.initials}</span>
              <div>
                <strong>{chat.name}</strong>
                <small>{chat.prompt}</small>
              </div>
            </button>
          ))}
        </aside>
        <div>
          <header>
            <span>{current.initials}</span>
            <div>
              <strong>{current.name}</strong>
              <small>{current.subtitle}</small>
            </div>
          </header>
          <div className="student-chat-body">
            <p>{current.prompt}</p>
            <p className="mine">{current.reply}</p>
            {currentMessages.map((message, index) => (
              <p className="mine" key={`${message}-${index}`}>
                {message}
              </p>
            ))}
          </div>
          <form onSubmit={send}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Reply to ${current.name}...`}
            />
            <button type="submit">
              Send <Icon name="arrow" size={15} />
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

function StudentProfile({
  onOpenClan,
  studentId,
  onBackToOwnProfile,
  onOpenStudent,
}: {
  onOpenClan?: (clanName: string) => void
  studentId?: string | null
  onBackToOwnProfile?: () => void
  onOpenStudent?: (studentId: string) => void
}) {
  return (
    <Profile
      onOpenClan={onOpenClan}
      viewStudentId={studentId}
      onBackToOwnProfile={onBackToOwnProfile}
      onOpenStudent={onOpenStudent}
    />
  )
}

function StudentApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<StudentPage>("home")
  const [selectedClan, setSelectedClan] = useState<string>("Pixel Pirates")
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedEventModal, setSelectedEventModal] = useState<DetailedEvent | null>(null)
  const [joinedEventIds, setJoinedEventIds] = useState<number[]>([1])

  const handleToggleJoin = (id: number) => {
    setJoinedEventIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleOpenClan = (clanName: string) => {
    setSelectedClan(clanName)
    setPage("clan-profile")
  }

  const handleOpenStudent = (studentId: string) => {
    setSelectedStudentId(studentId)
    setPage("profile")
  }

  const items: { page: StudentPage; label: string; icon: string }[] = [
    { page: "home", label: "Home", icon: "grid" },
    { page: "clans", label: "Clans", icon: "users" },
    { page: "events", label: "Events", icon: "calendar" },
    { page: "posts", label: "Posts", icon: "chat" },
    { page: "profile", label: "Profile", icon: "users" },
  ]
  return (
    <main className="student-app">
      <div className="student-aurora one" />
      <div className="student-aurora two" />
      <aside className="student-sidebar student-glass relative overflow-hidden hidden md:flex">
        {/* Growing Grape Vine Background (PC Only) */}
        <GrapeVineBackground orientation="vertical" opacity={0.32} className="hidden md:block" />

        <div className="relative z-10 flex flex-col h-full w-full">
          <Logo isDark />
          <nav>
            {items.map((item) => (
              <button
                className={
                  page === item.page || (item.page === "clans" && page === "clan-profile")
                    ? "active"
                    : ""
                }
                type="button"
                onClick={() => {
                  if (item.page === "profile") {
                    setSelectedStudentId(null)
                  }
                  setPage(item.page)
                }}
                key={item.page}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {item.page === "posts" && <small>6</small>}
              </button>
            ))}
          </nav>
          <div className="student-account">
            <span>AK</span>
            <div>
              <strong>Aarav Khanna</strong>
              <small>Student · CSE</small>
            </div>
            <button type="button" onClick={onLogout} aria-label="Sign out">
              <Icon name="logout" size={17} />
            </button>
          </div>
        </div>
      </aside>
      <section className="student-workspace">
        <header className="student-topbar">
          <div>
            <small>COMMUNITY PORTAL</small>
            <strong>Campus Clans</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              aria-label="Search campus events"
              title="Search campus events"
              onClick={() => setShowSearchModal(true)}
              className="cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <Icon name="search" />
            </button>
            <button
              type="button"
              aria-label="Admin Notifications"
              title="Admin Notifications"
              onClick={() => setShowNotifications(true)}
              className="cursor-pointer relative hover:bg-slate-100 transition-colors"
            >
              <Icon name="bell" />
              <i />
            </button>
          </div>
        </header>
        {page === "home" && (
          <StudentHome
            onNavigate={setPage}
            onOpenClan={handleOpenClan}
            onOpenEvent={(evt) => setSelectedEventModal(evt)}
            onLogout={onLogout}
          />
        )}
        {page === "clans" && <StudentClans onOpenClan={handleOpenClan} />}
        {page === "events" && (
          <StudentEvents
            onSelectEvent={(evt) => setSelectedEventModal(evt)}
            joined={joinedEventIds}
            onToggleJoin={handleToggleJoin}
          />
        )}
        {(page === "posts" || page === "messages") && <PostsView />}
        {page === "profile" && (
          <StudentProfile
            onOpenClan={handleOpenClan}
            studentId={selectedStudentId}
            onBackToOwnProfile={() => setSelectedStudentId(null)}
            onOpenStudent={handleOpenStudent}
          />
        )}
        {page === "clan-profile" && (
          <ClanProfile
            clanName={selectedClan}
            onBack={() => setPage("clans")}
            onNavigateMember={(memberName) => {
              const found = ALL_STUDENT_PROFILES.find(
                (s) => s.name.toLowerCase() === memberName.toLowerCase() || s.id === memberName
              )
              if (found) {
                handleOpenStudent(found.id)
              }
            }}
          />
        )}
        <StudentFooter
          currentPage={page}
          onNavigate={setPage}
          onLogout={onLogout}
        />
      </section>

      {/* Instagram-style Mobile Bottom Navigation Bar (Phone Only) */}
      <MobileBottomBar
        items={[
          { id: "home", label: "Home", icon: "grid" },
          { id: "clans", label: "Clans", icon: "users" },
          { id: "events", label: "Events", icon: "calendar" },
          { id: "posts", label: "Posts", icon: "chat", badge: "6" },
          { id: "profile", label: "Profile", isAvatar: true, avatarText: "AK" },
        ]}
        activeId={
          page === "messages" ? "posts" : page === "clan-profile" ? "clans" : page
        }
        onSelect={(id) => {
          if (id === "profile") {
            setSelectedStudentId(null)
          }
          setPage(id as StudentPage)
        }}
        theme="dark"
      />

      {/* Global Event Search Modal */}
      <EventSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        events={events}
        joinedEvents={joinedEventIds}
        onToggleJoin={handleToggleJoin}
        onSelectEvent={(evt) => {
          const matched = events.find((e) => e.id === evt.id) || (evt as any)
          setSelectedEventModal(matched)
          setShowSearchModal(false)
        }}
      />

      {/* Admin Notifications Modal */}
      <AdminNotifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onAction={(item: any) => {
          if (item.category === "Event Reminder") setPage("events")
          else if (
            item.category === "Trophy Allocated" ||
            item.category === "Weekly Leaderboard" ||
            item.category === "Recruitment Update"
          )
            setPage("clans")
          else if (item.category === "Achievement Published") setPage("home")
          setShowNotifications(false)
        }}
      />

      {/* Rich Event Details Modal (Venue, Starting Date, Registration / Interested link, Description) */}
      <EventDetailsModal
        event={selectedEventModal}
        isOpen={!!selectedEventModal}
        onClose={() => setSelectedEventModal(null)}
        isInterested={selectedEventModal ? joinedEventIds.includes(Number(selectedEventModal.id)) : false}
        onToggleInterested={(id) => handleToggleJoin(Number(id))}
        userClanName={selectedClan}
        currentUserRole="Leader"
        onRegistrationChange={(id, isReg) => {
          const numId = Number(id)
          setJoinedEventIds((prev) =>
            isReg ? (prev.includes(numId) ? prev : [...prev, numId]) : prev.filter((x) => x !== numId)
          )
        }}
      />
    </main>
  )
}

function AdminApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<AdminPage>("overview")
  const [useAdvanced, setUseAdvanced] = useState(true)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  if (useAdvanced) {
    return (
      <AdvancedAdminPortal
        onLogout={onLogout}
        onSwitchToStandard={() => setUseAdvanced(false)}
      />
    )
  }

  const navItems: { page: AdminPage; label: string; icon: string }[] = [
    { page: "overview", label: "Overview", icon: "grid" },
    { page: "community", label: "Community", icon: "users" },
    { page: "events", label: "Events", icon: "calendar" },
    { page: "trophies", label: "Trophies", icon: "trophy" },
    { page: "reports", label: "Reports", icon: "trend" },
  ]
  return (
    <main className="admin-app">
      <aside className="admin-sidebar relative overflow-hidden hidden md:flex">
        {/* Growing Grape Vine Background (PC Only) */}
        <GrapeVineBackground orientation="vertical" opacity={0.32} className="hidden md:block" />

        <div className="relative z-10 flex flex-col h-full w-full">
          <Logo isDark />
          <span className="nav-label">WORKSPACE</span>
          <nav>
            {navItems.map((item) => (
              <button
                className={page === item.page ? "active" : ""}
                type="button"
                onClick={() => setPage(item.page)}
                key={item.page}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-foot">
            <button
              type="button"
              onClick={() => setUseAdvanced(true)}
              style={{
                marginBottom: "12px",
                padding: "10px",
                borderRadius: "9px",
                background: "rgba(245,184,0,0.12)",
                color: "#f5b800",
                border: "1px dashed rgba(245,184,0,0.35)",
                fontSize: "11px",
                fontWeight: 700,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer"
              }}
            >
              <Icon name="shield" size={15} />
              <span>NAAC & Audit Console ↗</span>
            </button>
            <div className="capacity">
              <div>
                <span>Campus capacity</span>
                <strong>72%</strong>
              </div>
              <i>
                <span />
              </i>
              <small>2,486 of 3,500 student seats</small>
            </div>
            <button type="button" onClick={onLogout}>
              <Icon name="logout" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>
      <section className="admin-workspace">
        <AdminHeader
          page={page}
          onLogout={onLogout}
          onSwitchAdvanced={() => setUseAdvanced(true)}
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenNotifications={() => setShowNotifications(true)}
        />
        {page === "overview" && <OverviewPage onNavigate={setPage} />}
        {page === "community" && <CommunityPage />}
        {page === "events" && <EventsManagementPage />}
        {page === "trophies" && <TrophiesPage />}
        {page === "reports" && <ReportsPage />}
        <AdminFooter
          currentPage={page}
          onNavigate={setPage}
          onLogout={onLogout}
        />
      </section>

      {/* Instagram-style Mobile Bottom Navigation Bar (Phone Only) */}
      <MobileBottomBar
        items={[
          { id: "overview", label: "Overview", icon: "grid" },
          { id: "community", label: "Clans", icon: "users" },
          { id: "events", label: "Events", icon: "calendar" },
          { id: "trophies", label: "Awards", icon: "trophy" },
          { id: "reports", label: "Reports", icon: "trend" },
        ]}
        activeId={page}
        onSelect={(id) => setPage(id as AdminPage)}
        theme="dark"
      />

      {/* Global Event Search Modal */}
      <EventSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        events={events}
        onSelectEvent={() => {
          setPage("events")
          setShowSearchModal(false)
        }}
      />

      {/* Admin Notifications Modal */}
      <AdminNotifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onAction={(item: any) => {
          if (item.category === "Event Reminder") setPage("events")
          else if (item.category === "Trophy Allocated") setPage("trophies")
          else if (
            item.category === "Weekly Leaderboard" ||
            item.category === "Recruitment Update" ||
            item.category === "New Candidate Application"
          )
            setPage("community")
          else if (item.category === "Achievement Published") setPage("reports")
          setShowNotifications(false)
        }}
      />
    </main>
  )
}

export default function App() {
  const { role, login, logout, isLoading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f19", color: "#f8fafc" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid #f5b800", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>Connecting to Campus Network...</span>
        </div>
      </div>
    )
  }

  if (role === "admin")
    return <AdminApp onLogout={logout} />
  if (role === "student")
    return <StudentApp onLogout={logout} />

  return (
    <>
      <PublicEvents onLogin={() => setShowLogin(true)} />
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSubmit={async (selectedRole, targetEmail) => {
            const email = targetEmail || (selectedRole === "admin" ? "admin@campus.edu" : "student@campus.edu")
            await login(email, selectedRole)
            setShowLogin(false)
          }}
        />
      )}
    </>
  )
}
