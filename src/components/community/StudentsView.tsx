import React, { useState, useMemo } from "react"
import { Student } from "@/types"
import GlassCard from "@/components/common/GlassCard"
import StatusBadge from "@/components/common/StatusBadge"
import Icon from "@/components/common/Icon"

interface StudentsViewProps {
  students: Student[]
  onViewStudent: (student: Student) => void
  onSuspendStudent: (student: Student) => void
  onUnsuspendStudent: (student: Student) => void
  onDeleteStudent: (student: Student) => void
  onSendMessageToStudent: (student: Student) => void
}

/**
 * StudentsView: Student Management Directory
 * Implements Section 4 (Student list screen, controls, filters, pagination, and actions).
 */
export default function StudentsView({
  students,
  onViewStudent,
  onSuspendStudent,
  onUnsuspendStudent,
  onDeleteStudent,
  onSendMessageToStudent,
}: StudentsViewProps) {
  // Controls required by Section 4
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterClanMembership, setFilterClanMembership] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const matchSearch =
        `${stu.name} ${stu.username} ${stu.email}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchDept = filterDepartment === "all" || stu.department === filterDepartment
      const matchClan =
        filterClanMembership === "all"
          ? true
          : filterClanMembership === "member"
          ? !!stu.clanName
          : !stu.clanName
      const matchStatus = filterStatus === "all" || stu.status === filterStatus

      return matchSearch && matchDept && matchClan && matchStatus
    })
  }, [students, searchQuery, filterDepartment, filterClanMembership, filterStatus])

  // Reset filters helper (Section 4 Requirement)
  function handleResetFilters() {
    setSearchQuery("")
    setFilterDepartment("all")
    setFilterClanMembership("all")
    setFilterStatus("all")
    setCurrentPage(1)
  }

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6 animate-fade pb-10">
      {/* Search & Filter Toolbar (Section 4 Recommended Controls) */}
      <GlassCard className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by student name, username, or email..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium text-slate-900 bg-white/90 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Department */}
            <select
              value={filterDepartment}
              onChange={(e) => {
                setFilterDepartment(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
            </select>

            {/* Clan Membership */}
            <select
              value={filterClanMembership}
              onChange={(e) => {
                setFilterClanMembership(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Clan Status</option>
              <option value="member">In a Clan</option>
              <option value="noclan">Without Clan</option>
            </select>

            {/* Account Status */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Account Status</option>
              <option value="Active">Active Only</option>
              <option value="Suspended">Suspended Only</option>
            </select>

            {/* Clear Button */}
            {(searchQuery || filterDepartment !== "all" || filterClanMembership !== "all" || filterStatus !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 rounded-xl border border-amber-200 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Student List Table (Section 4 Recommended Information) */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Student & Username</th>
                <th className="py-3.5 px-6">Department & Branch</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Current Clan</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    No student records match the specified filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    {/* Student name & username */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-900 font-extrabold flex items-center justify-center text-xs shrink-0">
                          {student.avatar}
                        </div>
                        <div>
                          <strong className="block text-slate-900 font-bold text-xs">
                            {student.name}
                          </strong>
                          <span className="text-[11px] text-slate-400 font-mono">
                            @{student.username}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department & Branch */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800 block">
                        {student.branch}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {student.department} · {student.year}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-600">
                      {student.email}
                    </td>

                    {/* Clan membership */}
                    <td className="py-4 px-6">
                      {student.clanName ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-800 text-[11px]">
                          <Icon name="clans" size={13} className="text-amber-600" />
                          {student.clanName}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Not in a clan
                        </span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      <StatusBadge status={student.status} size="sm" />
                      {student.status === "Suspended" && student.suspensionDetails && (
                        <span className="block text-[10px] text-rose-600 mt-1 font-semibold">
                          Until {student.suspensionDetails.endDate}
                        </span>
                      )}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => onViewStudent(student)}
                          title="Inspect Details"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Icon name="edit" size={15} />
                        </button>

                        {/* Send Direct Message (Section 4 administrative capability) */}
                        <button
                          type="button"
                          onClick={() => onSendMessageToStudent(student)}
                          title="Send Direct Message"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          <Icon name="send" size={15} />
                        </button>

                        {/* Suspend or Unsuspend */}
                        {student.status === "Active" ? (
                          <button
                            type="button"
                            onClick={() => onSuspendStudent(student)}
                            title="Suspend Student"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Icon name="shield" size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onUnsuspendStudent(student)}
                            title="Unsuspend / Restore Student"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Icon name="check" size={15} />
                          </button>
                        )}

                        {/* Delete Student */}
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(student)}
                          title="Permanently Delete Student"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{paginatedStudents.length}</strong> of <strong>{filteredStudents.length}</strong> students
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
