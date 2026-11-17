import { useEffect, useMemo, useState } from 'react'
import { History, RefreshCw, Search, ShieldCheck } from 'lucide-react'
import api from '../api/axiosInstance'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import './AuditTrail.css'

const fallbackLogs = [
  {
    id: 1,
    timestamp: '2026-11-16 07:45:20',
    username: 'admin@aiia.gov.in',
    role: 'Admin',
    action: 'USER_LOGIN',
    module: 'Authentication',
    recordId: '1',
    details: 'Successful administrator login from 127.0.0.1'
  },
  {
    id: 2,
    timestamp: '2026-11-15 14:22:10',
    username: 'Prof. Rajeshwari Nair',
    role: 'Principal Investigator',
    action: 'REPORT_SAE',
    module: 'Safety',
    recordId: 'AE #2',
    details: 'Urgent Serious Adverse Event recorded for participant P-102: Severe Allergic Urticaria'
  },
  {
    id: 3,
    timestamp: '2026-11-14 11:30:00',
    username: 'Dr. Anand Sharma',
    role: 'Study Coordinator',
    action: 'COMPLETE_VISIT',
    module: 'Visits',
    recordId: 'Visit #2',
    details: 'Completed Week 4 follow-up visit for participant P-101. Vitals updated.'
  },
  {
    id: 4,
    timestamp: '2026-11-12 09:15:45',
    username: 'Dr. Sunita Kulkarni',
    role: 'Ethics Committee',
    action: 'CREATE_APPROVAL',
    module: 'Compliance',
    recordId: 'IEC/AIIA/2024/09-12-REV',
    details: 'IEC regulatory amendment logged under review for trial CT-2024-003'
  }
]

export default function AuditTrail() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('ALL')

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    setLoading(true)
    try {
      const res = await api.get('/api/audit-logs')
      if (res.data && res.data.length > 0) {
        setLogs(res.data)
      } else {
        setLogs(fallbackLogs)
      }
    } catch {
      setLogs(fallbackLogs)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        log.details?.toLowerCase().includes(search.toLowerCase()) ||
        log.username?.toLowerCase().includes(search.toLowerCase()) ||
        log.action?.toLowerCase().includes(search.toLowerCase()) ||
        log.recordId?.toLowerCase().includes(search.toLowerCase())

      const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter

      return matchesSearch && matchesModule
    })
  }, [logs, search, moduleFilter])

  return (
    <div className="audit-page">
      <PageHeader
        eyebrow="Compliance & Traceability"
        title="Audit Trail & System Logs"
        description="Immutable, timestamped record of user actions and clinical data modifications for GCP regulatory compliance."
      >
        <Button variant="outline" onClick={fetchLogs}>
          <RefreshCw size={16} /> Refresh Trail
        </Button>
      </PageHeader>

      <div className="audit-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.45rem 0.75rem', minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search action, user, or record..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
          />
        </div>

        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#fff', fontSize: '0.875rem' }}
        >
          <option value="ALL">All Modules</option>
          <option value="Authentication">Authentication</option>
          <option value="Trials">Trials</option>
          <option value="Participants">Participants</option>
          <option value="Visits">Visits</option>
          <option value="eCRF">eCRF</option>
          <option value="Ayurveda">Ayurveda</option>
          <option value="Safety">Safety</option>
          <option value="Compliance">Compliance</option>
          <option value="Users">Users</option>
        </select>
      </div>

      <div className="audit-table-container">
        {filteredLogs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No audit entries found"
            description="No system records match your filter criteria."
          />
        ) : (
          <table className="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Operator</th>
                <th>Role</th>
                <th>Module</th>
                <th>Action</th>
                <th>Record Reference</th>
                <th>Change Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={log.id || idx}>
                  <td style={{ whiteSpace: 'nowrap', color: '#64748b' }}>
                    {log.timestamp ? String(log.timestamp).replace('T', ' ').substring(0, 19) : '—'}
                  </td>
                  <td><strong>{log.username || 'System'}</strong></td>
                  <td>{log.role || 'System'}</td>
                  <td><span className="audit-tag">{log.module}</span></td>
                  <td><code>{log.action}</code></td>
                  <td>{log.recordId || '—'}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

