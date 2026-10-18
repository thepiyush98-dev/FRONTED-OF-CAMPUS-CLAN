import React, { useState } from "react"

export interface ClanMember {
  id: string
  name: string
  role: string
  branch: string
  year: string
  initials: string
  skills: string[]
  isLeader?: boolean
}

export interface ClanTrophy {
  id: string
  title: string
  eventName: string
  awardDate: string
  description: string
  recipientName: string
}

export interface ClanProfileData {
  id: string
  name: string
  initials: string
  speciality: string
  status: "Active" | "Suspended" | "Ended"
  leaderName: string
  memberCount: number
  tier: string
  sprintVelocity: string
  shortDescription: string
  fullDescription: string
  activeProjects: string[]
  accentColor: "blue" | "emerald" | "purple" | "amber"
  members: ClanMember[]
  trophies: ClanTrophy[]
}

const DEFAULT_CLAN_PROFILES: Record<string, ClanProfileData> = {
  "Pixel Pirates": {
    id: "clan-1",
    name: "Pixel Pirates",
    initials: "PP",
    speciality: "Design & Frontend Engineering",
    status: "Active",
    leaderName: "Aarav Khanna",
    memberCount: 18,
    tier: "Tier 1: Elite",
    sprintVelocity: "96% Velocity",
    shortDescription: "Crafting delightful web applications, 3D interfaces, and high-fidelity design systems.",
    fullDescription:
      "Pixel Pirates is our campus premier frontend architecture and design clan. We build open-source web tooling, compete in national UI/UX hackathons, and engineer real-time telemetry frontends for autonomous hardware teams. Our members specialize in React 19, Tailwind CSS v4, TypeScript, and micro-interactions.",
    activeProjects: ["Campus Clans UI Kit v2", "Nova Real-Time Feed", "Autonomous Telemetry Dashboard", "Event Registration Engine"],
    accentColor: "amber",
    members: [
      {
        id: "stu-1",
        name: "Aarav Khanna",
        role: "Clan Leader · Lead Frontend Architect",
        branch: "B.Tech CSE",
        year: "3rd Year",
        initials: "AK",
        skills: ["React 19", "Tailwind CSS", "TypeScript", "UI/UX Architecture"],
        isLeader: true,
      },
      {
        id: "stu-2",
        name: "Riya Malhotra",
        role: "Co-Leader · Design Strategist",
        branch: "B.Des",
        year: "2nd Year",
        initials: "RM",
        skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
      },
      {
        id: "stu-m3",
        name: "Rohan Verma",
        role: "Senior React Developer",
        branch: "B.Tech CSE",
        year: "3rd Year",
        initials: "RV",
        skills: ["React.js", "Next.js", "WebSockets"],
      },
      {
        id: "stu-m4",
        name: "Tanya Sen",
        role: "UI/UX & Motion Designer",
        branch: "B.Des",
        year: "2nd Year",
        initials: "TS",
        skills: ["Figma", "After Effects", "CSS Animations"],
      },
      {
        id: "stu-m5",
        name: "Aditya Joshi",
        role: "Frontend Engineer",
        branch: "B.Tech IT",
        year: "2nd Year",
        initials: "AJ",
        skills: ["TypeScript", "Tailwind CSS", "KaTeX"],
      },
    ],
    trophies: [
      {
        id: "tr-1",
        title: "1st Place · North India Hackfest 2026",
        eventName: "North India Hackfest 2026",
        awardDate: "October 2026",
        description: "Deployed a zero-latency real-time autonomous routing and telemetry dashboard in 36 hours.",
        recipientName: "Pixel Pirates & Binary Beasts",
      },
      {
        id: "tr-2",
        title: "Excellence in Human-Centered Design",
        eventName: "Open Source Sprint Night 2026",
        awardDate: "October 2026",
        description: "Recognizing outstanding WCAG accessible design systems and glassmorphic micro-interactions.",
        recipientName: "Pixel Pirates Team",
      },
      {
        id: "tr-3",
        title: "Best Campus Open Source Tool",
        eventName: "Annual Campus Tech Symposium 2025",
        awardDate: "November 2025",
        description: "Created the open-source Campus Clans UI scaffold adopted by 12 student teams.",
        recipientName: "Aarav Khanna & Team",
      },
    ],
  },

  "Binary Beasts": {
    id: "clan-2",
    name: "Binary Beasts",
    initials: "BB",
    speciality: "AI & Distributed Systems",
    status: "Active",
    leaderName: "Devansh Sharma",
    memberCount: 24,
    tier: "Rank #1 Campus",
    sprintVelocity: "98% Top 3",
    shortDescription: "Distributed computing, microservices, local LLM fine-tuning, and scalable backend pipelines.",
    fullDescription:
      "A collective of backend engineers, systems hackers, and machine learning practitioners. We train domain models on campus GPU servers, optimize database clusters, and engineer resilient APIs for campus products.",
    activeProjects: ["Campus RAG Search", "Campus Bus Fleet Tracker", "GPU Cluster Scheduler", "Telemetry Broker"],
    accentColor: "blue",
    members: [
      {
        id: "stu-5",
        name: "Devansh Sharma",
        role: "Clan Leader · ML Systems Architect",
        branch: "B.Tech CSE",
        year: "3rd Year",
        initials: "DS",
        skills: ["Python", "PyTorch", "FastAPI", "Distributed Systems"],
        isLeader: true,
      },
      {
        id: "stu-bb2",
        name: "Aryan Mehta",
        role: "Lead Machine Learning Engineer",
        branch: "B.Tech CSE",
        year: "4th Year",
        initials: "AM",
        skills: ["LLMs", "RAG Pipelines", "Transformers", "CUDA"],
      },
      {
        id: "stu-bb3",
        name: "Simran Kaur",
        role: "Cloud & DevOps Specialist",
        branch: "B.Tech IT",
        year: "3rd Year",
        initials: "SK",
        skills: ["Docker", "Kubernetes", "PostgreSQL", "GitHub Actions"],
      },
      {
        id: "stu-bb4",
        name: "Kunal Deshmukh",
        role: "Backend Engineer",
        branch: "B.Tech CSE",
        year: "2nd Year",
        initials: "KD",
        skills: ["Node.js", "Redis", "WebSockets"],
      },
    ],
    trophies: [
      {
        id: "tr-bb1",
        title: "1st Place: Best System Architecture",
        eventName: "Open Source Sprint Night 2026",
        awardDate: "October 2026",
        description: "Awarded for exceptional microservice resilience and telemetry integration.",
        recipientName: "Binary Beasts",
      },
      {
        id: "tr-bb2",
        title: "Champion: North India Hackfest 2026",
        eventName: "North India Hackfest 2026",
        awardDate: "October 2026",
        description: "36-hour sprint deploying distributed emergency routing models with sub-second latency.",
        recipientName: "Devansh Sharma & Team",
      },
    ],
  },

  "Circuit Crew": {
    id: "clan-4",
    name: "Circuit Crew",
    initials: "CC",
    speciality: "Robotics & Embedded Systems",
    status: "Active",
    leaderName: "Kabir Singh",
    memberCount: 16,
    tier: "Hardware Lab Verified",
    sprintVelocity: "Full Lab Access",
    shortDescription: "Autonomous rovers, custom PCB designs, sensory telemetry, and drone swarms.",
    fullDescription:
      "Hardware hackers representing our campus at national RoboCon competitions and maker expos. We bridge real-world hardware sensors with cloud telemetry dashboards.",
    activeProjects: ["Autonomous Rover Telemetry", "Quadruped Bot", "Smart Campus Greenhouse", "5.8GHz Radio Mesh"],
    accentColor: "emerald",
    members: [
      {
        id: "stu-3",
        name: "Kabir Singh",
        role: "Clan Leader · Robotics Lead",
        branch: "B.Tech ECE",
        year: "4th Year",
        initials: "KS",
        skills: ["Embedded C", "Robotics", "ROS", "Telemetry"],
        isLeader: true,
      },
      {
        id: "stu-cc2",
        name: "Neha Chopra",
        role: "Hardware & PCB Designer",
        branch: "B.Tech ECE",
        year: "3rd Year",
        initials: "NC",
        skills: ["Altium", "Eagle", "Microcontrollers"],
      },
      {
        id: "stu-cc3",
        name: "Tarun Saxena",
        role: "Firmware Specialist",
        branch: "B.Tech ECE",
        year: "2nd Year",
        initials: "TS",
        skills: ["C++", "RTOS", "Sensor Calibration"],
      },
    ],
    trophies: [
      {
        id: "tr-cc1",
        title: "2nd Place: National RoboCon 2025",
        eventName: "National RoboCon Arena",
        awardDate: "December 2025",
        description: "Fastest autonomous obstacle traversal using stereoscopic vision and 5.8GHz telemetry.",
        recipientName: "Circuit Crew Roster",
      },
    ],
  },

  "Venture Verse": {
    id: "clan-3",
    name: "Venture Verse",
    initials: "VV",
    speciality: "Product Strategy & Startup Incubation",
    status: "Suspended",
    leaderName: "Naina Kapoor",
    memberCount: 12,
    tier: "Incubated Clan",
    sprintVelocity: "Seed Ready",
    shortDescription: "Business models, customer discovery, pitch decks, and student venture incubation.",
    fullDescription:
      "Venture Verse transforms technical breakthroughs built by campus clans into viable venture-backed student startups. We mentor student founders on pitching, go-to-market strategies, and seed funding.",
    activeProjects: ["Campus Commerce Protocol", "Pitch Incubator 2026", "Student Founder Network"],
    accentColor: "purple",
    members: [
      {
        id: "stu-4",
        name: "Naina Kapoor",
        role: "Clan Leader · Strategy Lead",
        branch: "BBA",
        year: "2nd Year",
        initials: "NK",
        skills: ["Market Research", "Financial Modeling", "Pitching"],
        isLeader: true,
      },
      {
        id: "stu-vv2",
        name: "Siddharth Malhotra",
        role: "Venture Associate",
        branch: "B.Tech CSE + MBA",
        year: "4th Year",
        initials: "SM",
        skills: ["Growth Marketing", "Metrics", "User Acquisition"],
      },
    ],
    trophies: [
      {
        id: "tr-vv1",
        title: "Top Student Startup Pitch 2025",
        eventName: "National E-Summit",
        awardDate: "November 2025",
        description: "Awarded for the most compelling campus circular economy platform pitch.",
        recipientName: "Venture Verse Founders",
      },
    ],
  },
}

interface ClanProfileProps {
  clanName: string
  onBack: () => void
  onNavigateMember?: (memberName: string) => void
}

/**
 * ClanProfile Component
 * Strictly implements the requested structure:
 * Clan Profile (Editable)
 * ├── Clan Name (Header, banner, emblems, tier, edit button)
 * ├── Overview (Short desc, full description, active projects, stats)
 * ├── Clan Roster (All clan members, roles, skills, year)
 * └── Trophies (Verified hackathon trophies & awards)
 */
export default function ClanProfile({ clanName, onBack }: ClanProfileProps) {
  const initialData = DEFAULT_CLAN_PROFILES[clanName] || DEFAULT_CLAN_PROFILES["Pixel Pirates"]
  const [clan, setClan] = useState<ClanProfileData>(initialData)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ClanProfileData>(initialData)
  const [searchMember, setSearchMember] = useState("")

  // Save Clan Edits
  const handleSaveClan = (e: React.FormEvent) => {
    e.preventDefault()
    setClan(editForm)
    setIsEditing(false)
  }

  // Filter Roster
  const filteredMembers = clan.members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.role.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(searchMember.toLowerCase()))
  )

  return (
    <div className="clan-profile-container max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Clans</span>
        </button>

        {/* Edit Clan Button (Fulfills Editable Clan requirement) */}
        <button
          type="button"
          onClick={() => {
            setEditForm(clan)
            setIsEditing(true)
          }}
          style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs shadow-sm hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span style={{ color: "#0f172a", fontWeight: 900 }}>Edit Clan Profile</span>
        </button>
      </div>

      {/* 
        ================================================================
        1. CLAN NAME & HEADER SECTION
        ================================================================
      */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl transition-all">
        {/* Cover Banner Graphic with Ambient Navy/Gold Gradients */}
        <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-[#0c1017] via-[#172033] to-[#1e293b] p-6 flex items-start justify-between overflow-hidden">
          {/* Ambient Glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#f5b800 1px, transparent 1px), linear-gradient(90deg, #f5b800 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f5b800]" />
            <span>Official Campus Clan Profile</span>
          </div>

          <span
            className={`relative z-10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md ${
              clan.status === "Active"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                : "bg-rose-500/20 text-rose-300 border-rose-400/40"
            }`}
          >
            {clan.status}
          </span>
        </div>

        {/* Clan Main Info Row */}
        <div className="relative px-6 sm:px-10 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Clan Mascot / Logo Emblem */}
              <div className="relative -mt-16 sm:-mt-20 z-20 shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 p-1.5 shadow-2xl shadow-amber-500/20 ring-4 ring-white">
                  <div className="w-full h-full rounded-[14px] bg-[#172033] flex flex-col items-center justify-center text-amber-300 font-black text-2xl sm:text-3xl tracking-tighter shadow-inner border-2 border-slate-900">
                    <span className="text-3xl sm:text-4xl">🛡️</span>
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-black mt-1">
                      {clan.initials}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clan Name Title & Subtitle */}
              <div className="space-y-1.5 pt-2 sm:pt-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {clan.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300 shadow-xs">
                    {clan.tier}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-amber-600">
                  {clan.speciality}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 pt-0.5 font-medium">
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    Leader: {clan.leaderName}
                  </span>
                  <span className="inline-flex items-center font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Velocity: {clan.sprintVelocity}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Clan Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200/80 p-2.5 rounded-2xl w-full sm:w-auto text-center shadow-inner">
              <div className="px-3 py-1">
                <strong className="block text-lg font-black text-slate-900">{clan.memberCount}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Members</span>
              </div>
              <div className="px-3 py-1 border-x border-slate-200">
                <strong className="block text-lg font-black text-amber-600">{clan.activeProjects.length}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Projects</span>
              </div>
              <div className="px-3 py-1">
                <strong className="block text-lg font-black text-slate-900">{clan.trophies.length}</strong>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trophies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ================================================================
        2. OVERVIEW SECTION
        ================================================================
      */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
              Clan Mission & Core Projects
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
            Overview
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Learn about {clan.name}'s ongoing initiatives, technology stack, and engineering philosophy.
          </p>
        </div>

        {/* Short & Full Description */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950 font-bold text-sm leading-relaxed">
            "{clan.shortDescription}"
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {clan.fullDescription}
          </p>
        </div>

        {/* Active Projects Grid */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Active Projects ({clan.activeProjects.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {clan.activeProjects.map((project, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400/60 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">In Progress</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 leading-snug">
                  {project}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ================================================================
        3. CLAN ROSTER SECTION
        ================================================================
      */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                Team Members & Contributors
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold border border-slate-200">
                {clan.members.length} Members
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
              Clan Roster
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Active student engineers, architects, and product leads within {clan.name}.
            </p>
          </div>

          {/* Search Member Filter */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search roster by name, skill..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 shadow-2xs"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-amber-400/60 hover:bg-white hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-xs border ${
                      member.isLeader
                        ? "bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 border-amber-300"
                        : "bg-slate-200 text-slate-800 border-slate-300"
                    }`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      {member.name}
                      {member.isLeader && (
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-extrabold">
                          Lead
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] font-bold text-amber-700 leading-tight">
                      {member.role}
                    </p>
                    <small className="text-[10px] text-slate-500 font-medium">
                      {member.branch} · {member.year}
                    </small>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/60">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ================================================================
        4. TROPHIES SECTION
        ================================================================
      */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
              Verified Achievements & Hackathon Wins
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-200">
              {clan.trophies.length} Trophies
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
            Trophies & Awards
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Official institutional accolades won by {clan.name} in competitions and symposia.
          </p>
        </div>

        {/* Trophies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clan.trophies.map((trophy) => (
            <div
              key={trophy.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 via-slate-50 to-white border border-amber-300/60 hover:border-amber-400 hover:shadow-md transition-all space-y-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {trophy.title}
                  </h4>
                  <span className="text-[10px] font-extrabold text-amber-700 block mt-0.5">
                    {trophy.eventName} · {trophy.awardDate}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                {trophy.description}
              </p>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Conferred to: <strong className="text-slate-800">{trophy.recipientName}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ================================================================
        EDIT CLAN MODAL (Allows Clan Profile to be Editable)
        ================================================================
      */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Clan Profile</h3>
                <p className="text-xs text-slate-500 font-medium">Update {clan.name} information and projects</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClan} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clan Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Speciality / Focus Domain</label>
                <input
                  type="text"
                  value={editForm.speciality}
                  onChange={(e) => setEditForm({ ...editForm, speciality: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tier Badge</label>
                  <input
                    type="text"
                    value={editForm.tier}
                    onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sprint Velocity</label>
                  <input
                    type="text"
                    value={editForm.sprintVelocity}
                    onChange={(e) => setEditForm({ ...editForm, sprintVelocity: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Mission Slogan</label>
                <input
                  type="text"
                  value={editForm.shortDescription}
                  onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Overview Description</label>
                <textarea
                  rows={4}
                  value={editForm.fullDescription}
                  onChange={(e) => setEditForm({ ...editForm, fullDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-5 py-2 rounded-xl font-black text-xs cursor-pointer shadow-sm hover:brightness-105 active:scale-95"
                >
                  Save Clan Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
