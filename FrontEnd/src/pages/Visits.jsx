import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, CalendarCheck2, CalendarClock, CalendarDays, CalendarX2, ChevronRight, Eye, FilterX, List, Pencil, Plus, Search, Trash2, Users } from 'lucide-react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import TrialModal from '../components/trials/TrialModal.jsx'
import VisitCalendar from '../components/visits/VisitCalendar.jsx'
import VisitDetailsModal from '../components/visits/VisitDetailsModal.jsx'
import VisitFormModal from '../components/visits/VisitFormModal.jsx'
import { initialTrials } from '../data/trialsData.js'
import { initialVisits, visitStatuses, visitSummary, visitTypes } from '../data/visitsData.js'
import { createVisitRecord, filterVisits, formatVisitTime, removeVisitRecord, updateVisitRecord, updateVisitStatus } from '../utils/visitManagement.js'
import { formatTrialDate } from '../utils/trialFormatting.js'
import './Visits.css'

const summaryIcons = { total: CalendarDays, scheduled: CalendarClock, completed: CalendarCheck2, missed: CalendarX2 }
const firstVisitDate = initialVisits[0]?.visitDate ?? '2026-10-01'
const initialMonth = { year: Number(firstVisitDate.slice(0, 4)), month: Number(firstVisitDate.slice(5, 7)) }

function ActionButton({ label, icon: Icon, onClick, danger = false }) {
  return <button className={`visit-action${danger ? ' visit-action--danger' : ''}`} type="button" onClick={onClick} aria-label={`${label} visit`} title={label}><Icon size={15} aria-hidden="true" /></button>
}

export default function Visits() {
  const [visits, setVisits] = useState(initialVisits)
  const [filters, setFilters] = useState({ query: '', trialId: '', status: '', visitType: '' })
  const [view, setView] = useState('list')
  const [month, setMonth] = useState(initialMonth)
  const [selectedDate, setSelectedDate] = useState(firstVisitDate)
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const visibleVisits = useMemo(() => filterVisits(visits, filters), [visits, filters])
  const hasFilters = Boolean(filters.query || filters.trialId || filters.status || filters.visitType)
  const modalVisit = modal?.id ? visits.find((visit) => visit.id === modal.id) : null

  function setFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters({ query: '', trialId: '', status: '', visitType: '' })
  }

  function saveVisit(values) {
    if (modal?.type === 'edit') {
      setVisits((current) => updateVisitRecord(current, modal.id, values))
      setNotice('Visit updated in this local demo session. The change is temporary.')
    } else {
      const record = createVisitRecord(visits, values)
      setVisits((current) => [record, ...current])
      setSelectedDate(record.visitDate)
      setMonth({ year: Number(record.visitDate.slice(0, 4)), month: Number(record.visitDate.slice(5, 7)) })
      setNotice('Visit added to this local demo session. The record is temporary.')
    }
    setModal(null)
  }

  function changeStatus(visit, status) {
    setVisits((current) => updateVisitStatus(current, visit.id, status))
    setNotice(`${visit.id} status changed to ${status} in this local demo session.`)
  }

  function deleteVisit() {
    if (!modal?.id) return
    setVisits((current) => removeVisitRecord(current, modal.id))
    setModal(null)
    setNotice(`${modal.id} removed from this local demo session. The change is temporary.`)
  }

  function changeCalendarMonth(nextMonth) {
    setMonth(nextMonth)
    setSelectedDate(`${nextMonth.year}-${String(nextMonth.month).padStart(2, '0')}-01`)
  }

  return (
    <main className="visits-page">
      <nav className="visits-breadcrumb" aria-label="Breadcrumb"><Link to="/app/overview" aria-label="Go to overview"><Activity size={13} aria-hidden="true" /></Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Visit Management</span></nav>

      <header className="visits-page-header">
        <div className="visits-page-header__copy"><span className="visits-page-header__eyebrow"><span className="visits-demo-dot" /> Visit coordination</span><h1>Visit Management</h1><p>Schedule, track, and manage participant visits across clinical trials.</p></div>
        <Button onClick={() => setModal({ type: 'add' })}><Plus size={16} aria-hidden="true" /> Schedule Visit</Button>
      </header>

      {notice && <div className="visits-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
      <div className="visits-demo-banner"><span className="visits-demo-banner__dot" /><strong>Demo data</strong><p>All visits and participant information shown here are fictional examples.</p></div>

      <section className="visits-summary-grid" aria-label="Visit summary">
        {visitSummary.map((item) => {
          const Icon = summaryIcons[item.icon]
          return <Card className="visits-summary-card" key={item.icon}><div className="visits-summary-card__top"><span className={`visits-summary-card__icon visits-summary-card__icon--${item.icon}`}><Icon size={18} aria-hidden="true" /></span><span className="visits-summary-card__demo">Demo total</span></div><strong className="visits-summary-card__value">{item.value}</strong><span className="visits-summary-card__label">{item.label}</span><span className="visits-summary-card__detail">{item.detail}</span></Card>
        })}
      </section>

      <Card padding="none" className="visits-list-panel">
        <div className="visits-panel-header"><div><h2>Visit Schedule <span className="visits-demo-pill">FICTIONAL</span></h2><p>Browse sample visit activity and manage temporary demo records.</p></div><span className="visits-results-count" aria-live="polite">{visibleVisits.length} of {visits.length} visits</span></div>

        <div className="visits-toolbar">
          <div className="visits-view-toggle" role="tablist" aria-label="Visit schedule view">
            <button type="button" role="tab" aria-selected={view === 'list'} className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')}><List size={15} aria-hidden="true" /> List</button>
            <button type="button" role="tab" aria-selected={view === 'calendar'} className={view === 'calendar' ? 'is-active' : ''} onClick={() => setView('calendar')}><CalendarDays size={15} aria-hidden="true" /> Calendar</button>
          </div>
          <div className="visits-filter-bar" role="search" aria-label="Filter visits">
            <label className="visits-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search visit ID or participant</span><input type="search" value={filters.query} onChange={(event) => setFilter('query', event.target.value)} placeholder="Search visit or participant..." /></label>
            <label className="visits-select-filter"><span className="sr-only">Filter by trial</span><select value={filters.trialId} onChange={(event) => setFilter('trialId', event.target.value)}><option value="">All trials</option>{initialTrials.map((trial) => <option key={trial.id} value={trial.id}>{trial.id} · {trial.name}</option>)}</select></label>
            <label className="visits-select-filter"><span className="sr-only">Filter by visit status</span><select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">All statuses</option>{visitStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            <label className="visits-select-filter"><span className="sr-only">Filter by visit type</span><select value={filters.visitType} onChange={(event) => setFilter('visitType', event.target.value)}><option value="">All visit types</option>{visitTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <Button variant="outline" size="small" onClick={clearFilters} disabled={!hasFilters}><FilterX size={15} aria-hidden="true" /> Clear filters</Button>
          </div>
        </div>

        {view === 'list' ? visibleVisits.length ? <>
          <p className="visits-table-hint">Swipe or scroll horizontally to view all visit fields.</p>
          <div className="visits-table-scroll" tabIndex="0" role="region" aria-label="Visit schedule table, horizontally scrollable"><table className="visits-table">
            <thead><tr><th scope="col">Visit ID</th><th scope="col">Participant</th><th scope="col">Trial</th><th scope="col">Visit Type</th><th scope="col">Visit Date</th><th scope="col">Visit Time</th><th scope="col">Assigned Researcher</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
            <tbody>{visibleVisits.map((visit) => <tr key={visit.id}>
              <td className="visits-table__id">{visit.id}<small>DEMO</small></td>
              <td className="visits-table__participant"><span>{visit.participantName}</span><small>{visit.participantId}</small></td>
              <td className="visits-table__trial"><span>{visit.trialName}</span><small>{visit.trialId}</small></td>
              <td>{visit.visitType}</td><td className="visits-table__date">{formatTrialDate(visit.visitDate)}</td><td>{formatVisitTime(visit.visitTime)}</td><td>{visit.researcher}</td>
              <td><StatusBadge status={visit.status} /></td>
              <td><div className="visits-row-actions"><ActionButton label="View" icon={Eye} onClick={() => setModal({ type: 'view', id: visit.id })} /><ActionButton label="Edit" icon={Pencil} onClick={() => setModal({ type: 'edit', id: visit.id })} /><ActionButton label="Delete" icon={Trash2} danger onClick={() => setModal({ type: 'delete', id: visit.id })} /><label className="visits-inline-status"><span className="sr-only">Update status for {visit.id}</span><select value={visit.status} onChange={(event) => changeStatus(visit, event.target.value)} aria-label={`Update status for ${visit.id}`}>{visitStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></div></td>
            </tr>)}</tbody>
          </table></div>
        </> : <EmptyState className="visits-empty-state" title="No visits found" description="Try another search or adjust the selected filters." icon={Users} action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>} /> : (
          <VisitCalendar visits={visibleVisits} selectedDate={selectedDate} onSelectDate={setSelectedDate} month={month} onMonthChange={changeCalendarMonth} onView={(visit) => setModal({ type: 'view', id: visit.id })} onStatusChange={changeStatus} />
        )}
      </Card>

      {modal?.type === 'add' && <VisitFormModal onClose={() => setModal(null)} onSave={saveVisit} />}
      {(modal?.type === 'edit' || modal?.type === 'view') && modalVisit && (modal.type === 'edit'
        ? <VisitFormModal visit={modalVisit} onClose={() => setModal(null)} onSave={saveVisit} />
        : <VisitDetailsModal visit={modalVisit} onClose={() => setModal(null)} onEdit={(visit) => setModal({ type: 'edit', id: visit.id })} onStatusChange={changeStatus} />)}
      {modal?.type === 'delete' && modalVisit && <TrialModal title="Delete Demo Visit?" description="This action only changes the current page's local demo state." onClose={() => setModal(null)} size="small"><div className="visit-delete-confirm"><p>Remove <strong>{modalVisit.id}</strong> for {modalVisit.participantName} from the visible demo schedule?</p><p>This fictional visit will be removed from this page session only.</p><div className="trial-modal__footer"><Button variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button variant="danger" onClick={deleteVisit}><Trash2 size={15} aria-hidden="true" /> Delete visit</Button></div></div></TrialModal>}
    </main>
  )
}
