import React, { useState, useMemo } from "react"
import {
  ALL_STUDENT_PROFILES,
  CAMPUS_SKILLS_DIRECTORY,
  getSkillsDirectoryWithCounts,
  searchStudents,
  StudentProfileData,
  SkillDirectoryItem,
} from "@/data/studentProfilesData"
import Icon from "@/components/common/Icon"

interface SkillsSearchHubProps {
  onSelectStudent: (studentId: string) => void
  onBackToProfile?: () => void
  initialSkillFilter?: string
}

export default function SkillsSearchHub({
  onSelectStudent,
  onBackToProfile,
  initialSkillFilter = "",
}: SkillsSearchHubProps) {
  const [activeTab, setActiveTab] = useState<"directory" | "search">("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedClan, setSelectedClan] = useState<string>("All Clans")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments")
  const [activeSkillTag, setActiveSkillTag] = useState<string>(initialSkillFilter)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Direct Clan invitation modal state
  const [inviteModalStudent, setInviteModalStudent] = useState<StudentProfileData | null>(null)
  const [inviteRole, setInviteRole] = useState("Frontend Engineer")
  const [inviteMessage, setInviteMessage] = useState("We'd love to have you collaborate with Pixel Pirates on upcoming hackathons!")

  // Direct campus message modal state
  const [messageModalStudent, setMessageModalStudent] = useState<StudentProfileData | null>(null)
  const [messageText, setMessageText] = useState("")

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Skills directory data with real student counts
  const skillsWithCounts = useMemo(() => {
    return getSkillsDirectoryWithCounts()
  }, [])

  // Filter skills directory by category and search
  const filteredSkillsDirectory = useMemo(() => {
    return skillsWithCounts.filter((item) => {
      const matchesCat = selectedCategory === "All" || item.category === selectedCategory
      const matchesQ =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesQ
    })
  }, [skillsWithCounts, selectedCategory, searchQuery])

  // Filtered student search results
  const filteredStudents = useMemo(() => {
    let effectiveQuery = searchQuery
    if (activeSkillTag) {
      effectiveQuery = effectiveQuery ? `${effectiveQuery} ${activeSkillTag}` : activeSkillTag
    }
    return searchStudents(effectiveQuery, selectedCategory, selectedClan, selectedDepartment)
  }, [searchQuery, activeSkillTag, selectedCategory, selectedClan, selectedDepartment])

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "AI & ML",
    "Design",
    "DevOps & Cloud",
    "Mobile",
    "Cybersecurity",
    "Data Science",
  ]

  const clans = [
    "All Clans",
    "Pixel Pirates",
    "Binary Beasts",
    "Circuit Crew",
    "Venture Verse",
    "Seeking Clan",
  ]

  const departments = [
    "All Departments",
    "School of Engineering",
    "Faculty of Design",
    "Faculty of Management",
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "bg-blue-50 text-blue-800 border-blue-200"
      case "Backend":
        return "bg-emerald-50 text-emerald-800 border-emerald-200"
      case "AI & ML":
        return "bg-purple-50 text-purple-800 border-purple-200"
      case "Design":
        return "bg-amber-50 text-amber-800 border-amber-200"
      case "DevOps & Cloud":
        return "bg-cyan-50 text-cyan-800 border-cyan-200"
      case "Mobile":
        return "bg-pink-50 text-pink-800 border-pink-200"
      case "Cybersecurity":
        return "bg-rose-50 text-rose-800 border-rose-200"
      case "Data Science":
        return "bg-indigo-50 text-indigo-800 border-indigo-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const handleSkillCardClick = (skillName: string) => {
    setActiveSkillTag(skillName)
    setActiveTab("search")
    showToast(`Filtering students with verified skill: "${skillName}"`)
  }

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteModalStudent) return
    showToast(`🎉 Official Clan Invitation sent to ${inviteModalStudent.name}!`)
    setInviteModalStudent(null)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageModalStudent || !messageText.trim()) return
    showToast(`✉️ Campus message delivered to ${messageModalStudent.name} (${messageModalStudent.email})`)
    setMessageModalStudent(null)
    setMessageText("")
  }

  return (
    <div className="skills-search-hub max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-400/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in font-bold text-xs">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c1017] via-[#172033] to-[#1e293b] p-6 sm:p-8 border border-slate-800 text-white shadow-xl">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#f5b800 1px, transparent 1px), linear-gradient(90deg, #f5b800 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Campus Clans · Skills Directory & Peer Search Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-heading">
              Student Skills Directory & Talent Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Explore categorized technical stacks, discover top campus talent, and view complete student portfolios across clans and engineering branches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onBackToProfile && (
              <button
                type="button"
                onClick={onBackToProfile}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-md active:scale-95 flex items-center gap-1.5"
              >
                <span>←</span>
                <span>My Profile (/profile/)</span>
              </button>
            )}

            <div className="p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("search")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "search"
                    ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                🔍 Search Students
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("directory")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "directory"
                    ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                📚 Skills Directory (/skills/)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-6 space-y-4">
        {/* Search Bar + Active Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={
                activeTab === "search"
                  ? "Search students by name, skill (e.g. React, PyTorch, Figma), branch, or clan..."
                  : "Search campus skills catalog (e.g. Django, Next.js, KaTeX, Embedded C)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs font-medium rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Active Skill Filter Badge if selected */}
          {activeSkillTag && (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-extrabold shadow-xs shrink-0 animate-scale-up">
              <span>Skill: {activeSkillTag}</span>
              <button
                type="button"
                onClick={() => setActiveSkillTag("")}
                className="text-amber-800 hover:text-rose-600 font-black cursor-pointer ml-1"
                title="Clear skill filter"
              >
                ✕
              </button>
            </div>
          )}

          {/* Dropdown Filters (Clan & Department) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedClan}
              onChange={(e) => setSelectedClan(e.target.value)}
              aria-label="Filter students by clan"
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none w-full sm:w-auto cursor-pointer"
            >
              {clans.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              aria-label="Filter students by department"
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none w-full sm:w-auto cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: REAL-TIME STUDENT SEARCH RESULTS (/search-students/)    */}
      {/* ============================================================== */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Search Results
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold border border-amber-200">
                {filteredStudents.length} Students Found
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Click student card or "View Profile" to open full student page (/student/&lt;id&gt;/)
            </span>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-black text-slate-900">No matching students found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No students match your query "{searchQuery || activeSkillTag}". Try selecting another category or clearing filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setActiveSkillTag("")
                  setSelectedCategory("All")
                  setSelectedClan("All Clans")
                  setSelectedDepartment("All Departments")
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-300"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group hover:border-amber-400/80"
                >
                  <div className="space-y-4">
                    {/* Student Card Top Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-[#172033] text-amber-300 font-black text-lg flex items-center justify-center border-2 border-slate-900 shadow-md overflow-hidden">
                            {student.avatarUrl ? (
                              <img
                                src={student.avatarUrl}
                                alt={student.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{student.initials}</span>
                            )}
                          </div>
                          <span
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                            title="Active Campus Student"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              onClick={() => onSelectStudent(student.id)}
                              className="text-base font-black text-slate-900 hover:text-amber-600 cursor-pointer transition-colors"
                            >
                              {student.name}
                            </h3>
                            <span className="text-[10px] text-slate-400 font-mono">
                              @{student.username}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold line-clamp-1">
                            {student.branch} · {student.year}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {student.department}
                          </span>
                        </div>
                      </div>

                      {/* Clan Badge */}
                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-black border ${
                            student.clanName === "Seeking Clan"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : "bg-amber-50 text-amber-900 border-amber-200"
                          }`}
                        >
                          🛡️ {student.clanName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                          {student.clanTier}
                        </span>
                      </div>
                    </div>

                    {/* Bio snippet */}
                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                      {student.aboutMe}
                    </p>

                    {/* Categorized Skills Tagged */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Verified Skills:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {student.skills.slice(0, 5).map((sk) => (
                          <span
                            key={sk.id}
                            onClick={() => handleSkillCardClick(sk.name)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer hover:scale-105 active:scale-95 ${getCategoryColor(
                              sk.category
                            )}`}
                            title={`Click to filter students by ${sk.name}`}
                          >
                            {sk.name}
                            {sk.level && (
                              <span className="opacity-70 ml-1 text-[9px]">({sk.level})</span>
                            )}
                          </span>
                        ))}
                        {student.skills.length > 5 && (
                          <span className="text-[10px] font-bold text-slate-400 px-1">
                            +{student.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Portfolio Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <div>
                        <strong className="text-xs font-black text-slate-900 block">
                          {student.projects.length}
                        </strong>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase">
                          Projects
                        </span>
                      </div>
                      <div>
                        <strong className="text-xs font-black text-slate-900 block">
                          {student.trophiesCount}
                        </strong>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase">
                          Trophies
                        </span>
                      </div>
                      <div>
                        <strong className="text-xs font-black text-slate-900 block">
                          {student.gpa}
                        </strong>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase">
                          GPA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setMessageModalStudent(student)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all active:scale-95"
                        title="Send campus direct message"
                      >
                        💬 Message
                      </button>
                      <button
                        type="button"
                        onClick={() => setInviteModalStudent(student)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold cursor-pointer transition-all active:scale-95"
                        title="Invite student to your clan"
                      >
                        🛡️ Invite
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectStudent(student.id)}
                      style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                      className="px-4 py-1.5 rounded-xl font-black text-xs shadow-xs hover:brightness-105 active:scale-95 cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <span>View Full Profile</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CAMPUS SKILLS DIRECTORY (/skills/)                      */}
      {/* ============================================================== */}
      {activeTab === "directory" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Skills Catalog ({filteredSkillsDirectory.length} Skills Listed)
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Click on any skill to discover and connect with campus students who have verified mastery in that domain.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSkillsDirectory.map((skill) => (
              <div
                key={skill.id}
                onClick={() => handleSkillCardClick(skill.name)}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl p-2 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors">
                      {skill.icon}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryColor(
                        skill.category
                      )}`}
                    >
                      {skill.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-snug font-normal line-clamp-2 mt-1">
                      {skill.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {skill.students.slice(0, 3).map((st) => (
                        <div
                          key={st.id}
                          className="w-5 h-5 rounded-full bg-slate-800 text-amber-300 font-bold text-[8px] flex items-center justify-center ring-2 ring-white"
                          title={st.name}
                        >
                          {st.avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-700">
                      {skill.studentCount} {skill.studentCount === 1 ? "student" : "students"}
                    </span>
                  </div>

                  <span className="text-[11px] font-black text-amber-600 group-hover:translate-x-1 transition-transform">
                    Find →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clan Invitation Modal */}
      {inviteModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h3 className="text-base font-black text-slate-900">
                  Invite {inviteModalStudent.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInviteModalStudent(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                Invite <strong>{inviteModalStudent.name}</strong> (@{inviteModalStudent.username}) to join your clan roster:
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Engineering Role</label>
                <input
                  type="text"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Personal Invitation Note</label>
                <textarea
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalStudent(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-4 py-2 rounded-xl font-black shadow-xs hover:brightness-105"
                >
                  Send Clan Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campus Message Modal */}
      {messageModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <h3 className="text-base font-black text-slate-900">
                  Message {messageModalStudent.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMessageModalStudent(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                Send a peer message to <strong>{messageModalStudent.name}</strong> ({messageModalStudent.email}):
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Hey, saw your project on KaTeX / PyTorch and wanted to ask about..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMessageModalStudent(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
                  className="px-4 py-2 rounded-xl font-black shadow-xs hover:brightness-105"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
