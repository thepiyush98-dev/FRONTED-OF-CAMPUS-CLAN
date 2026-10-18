import React, { useState } from "react"
import { AuditLogItem } from "@/types"
import GlassCard from "@/components/common/GlassCard"
import Icon from "@/components/common/Icon"

interface AuditLogViewProps {
  logs: AuditLogItem[]
}

/**
 * AuditLogView: Section 12 History Retention & Administrative Audit Records
 * Ensures accountability and preserves historical references for deleted students or disbanded clans.
 */
export default function AuditLogView({ logs }: AuditLogViewProps) {
  const [filterAction, setFilterAction] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = logs.filter((log) => {
    const matchAction = filterAction === "all" || log.action.toLowerCase().includes(filterAction.toLowerCase())
    const matchSearch =
      `${log.targetName} ${log.performedBy} ${log.details}`.toLowerCase().includes(searchQuery.toLowerCase())
    return matchAction && matchSearch
  })

  return (
    <div className="space-y-6 animate-fade pb-10">
      {/* Header Toolbar */}
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-0.5">
              Accountability & Historical Evidence
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Administrative History & Audit Log
            </h2>
            <p className="text-xs text-slate-500">
              Immutable trail of suspensions, deletions, member removals, and award grants
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Icon name="search" size={14} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit records..."
                className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Administrative Actions</option>
              <option value="Suspend">Suspensions</option>
              <option value="Delete">Permanent Deletions</option>
              <option value="Member">Member Removals</option>
              <option value="Trophy">Trophy Grants</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Section 12 Historical Retention Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <Icon name="history" size={16} />
        </div>
        <div>
          <strong className="block text-slate-900 font-bold mb-0.5">
            Section 12 Historical Record Continuity Rule:
          </strong>
          When an entity is deleted from the active directory, project participation and award history are permanently retained in this log under labels such as <em>&quot;Deleted student&quot;</em>, <em>&quot;Deleted clan&quot;</em>, or <em>&quot;Former member&quot;</em> to maintain institutional integrity.
        </div>
      </div>

      {/* Audit Log Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Action Performed</th>
                <th className="py-3.5 px-6">Target Entity</th>
                <th className="py-3.5 px-6">Administrator</th>
                <th className="py-3.5 px-6">Details / Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    No administrative audit records match your query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 block">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-semibold">
                          {log.targetName}
                        </strong>
                        {log.historicalLabel && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {log.historicalLabel}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-6 font-medium text-slate-600">
                      {log.performedBy}
                    </td>

                    <td className="py-3.5 px-6 text-slate-500 max-w-xs">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
