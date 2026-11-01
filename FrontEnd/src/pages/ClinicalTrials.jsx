import { useMemo, useState } from 'react'
import {
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  Eye,
  FlaskConical,
  House,
  PencilLine,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import TrialDetailsModal from '../components/trials/TrialDetailsModal.jsx'
import TrialFormModal from '../components/trials/TrialFormModal.jsx'
import TrialModal from '../components/trials/TrialModal.jsx'
import { initialTrials, trialPhases, trialStatuses } from '../data/trialsData.js'
import { createTrialRecord, filterTrials, getTrialSummary, removeTrialRecord, updateTrialRecord } from '../utils/trialManagement.js'
import { currentISODate, formatTrialDate } from '../utils/trialFormatting.js'
import './ClinicalTrials.css'

const summaryDefinitions = [
  { key: 'total', label: 'Total Trials', icon: FlaskConical, tone: 'navy', detail: 'Across the demo portfolio' },
  { key: 'active', label: 'Active Trials', icon: CircleCheck, tone: 'teal', detail: 'Currently in progress' },
  { key: 'completed', label: 'Completed Trials', icon: CalendarDays, tone: 'green', detail: 'Marked complete' },
  { key: 'pending', label: 'Pending Approval', icon: Clock3, tone: 'gold', detail: 'Awaiting review' },
]

function SummaryCard({ definition, value }) {
  const Icon = definition.icon
  return (
    <Card as="article" className="trials-summary-card" padding="medium">
      <div className="trials-summary-card__top"><span className={`trials-summary-card__icon trials-summary-card__icon--${definition.tone}`}><Icon size={19} aria-hidden="true" /></span><span className="trials-summary-card__demo">Demo</span></div>
      <strong className="trials-summary-card__value">{value}</strong>
      <span className="trials-summary-card__label">{definition.label}</span>
      <span className="trials-summary-card__detail">{definition.detail}</span>
    </Card>
  )
}

function TrialAction({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button className={`trial-action${danger ? ' trial-action--danger' : ''}`} type="button" onClick={onClick} aria-label={`${label} trial`} title={`${label} trial`}>
      <Icon size={15} aria-hidden="true" />
    </button>
  )
}

export default function ClinicalTrials() {
  const [trials, setTrials] = useState(initialTrials)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [phaseFilter, setPhaseFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const [nextId, setNextId] = useState(initialTrials.length + 1)

  const filteredTrials = useMemo(() => {
    return filterTrials(trials, { query, status: statusFilter, phase: phaseFilter })
  }, [trials, query, statusFilter, phaseFilter])

  const summaryValues = getTrialSummary(trials)

  function clearFilters() {
    setQuery('')
    setStatusFilter('All')
    setPhaseFilter('All')
  }

  function saveTrial(values) {
    if (modal?.type === 'edit') {
      const targetId = modal.trial.id
      setTrials((current) => updateTrialRecord(current, targetId, values, currentISODate()))
      setNotice(`${targetId} updated in this demo session. Changes are local only.`)
    } else {
      const id = `DEMO-CT-${String(nextId).padStart(3, '0')}`
      setTrials((current) => [createTrialRecord(values, id, currentISODate()), ...current])
      setNextId((current) => current + 1)
      setNotice(`${id} added to this demo session. Changes are local only.`)
    }
    setModal(null)
  }

  function confirmDelete() {
    const deletedTrial = modal.trial
    setTrials((current) => removeTrialRecord(current, deletedTrial.id))
    setNotice(`${deletedTrial.id} removed from this demo session. Changes are local only.`)
    setModal(null)
  }

  function openEdit(trial) {
    setModal({ type: 'edit', trial })
  }

  return (
    <div className="clinical-trials-page">
      <nav className="trials-breadcrumb" aria-label="Breadcrumb">
        <Link to="/app/overview" aria-label="Overview"><House size={14} aria-hidden="true" /></Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">Clinical Trials</span>
      </nav>

      <header className="trials-page-header">
        <div className="trials-page-header__copy">
          <div className="trials-page-header__eyebrow"><span className="trials-demo-dot" /> Demo workspace</div>
          <h1>Clinical Trials</h1>
          <p>Create, organize, and monitor clinical research trials.</p>
        </div>
        <Button variant="primary" size="large" onClick={() => setModal({ type: 'add' })}><Plus size={17} aria-hidden="true" /> Add New Trial</Button>
      </header>

      {notice && (
        <div className="trials-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message"><X size={16} aria-hidden="true" /></button>
        </div>
      )}

      <section className="trials-summary-grid" aria-label="Clinical trial summary">
        {summaryDefinitions.map((definition) => <SummaryCard key={definition.key} definition={definition} value={summaryValues[definition.key]} />)}
      </section>

      <Card className="trials-list-panel" padding="small">
        <div className="trials-list-panel__header">
          <div>
            <h2>Trial Portfolio <span className="trials-demo-pill">Sample data</span></h2>
            <p>Review and organize the trial records in this local demo view.</p>
          </div>
          <span className="trials-results-count">{filteredTrials.length} of {trials.length} trials</span>
        </div>

        <div className="trials-filter-bar" aria-label="Search and filter trials">
          <label className="trials-search">
            <Search size={17} aria-hidden="true" />
            <span className="visually-hidden">Search by trial ID or name</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search trial ID or name" aria-label="Search by trial ID or name" />
          </label>
          <label className="trials-select-filter">
            <span className="visually-hidden">Filter by status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
              <option>All</option>
              {trialStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="trials-select-filter">
            <span className="visually-hidden">Filter by trial phase</span>
            <select value={phaseFilter} onChange={(event) => setPhaseFilter(event.target.value)} aria-label="Filter by trial phase">
              <option>All</option>
              {trialPhases.map((phase) => <option key={phase}>{phase}</option>)}
            </select>
          </label>
          <Button variant="outline" size="small" onClick={clearFilters} disabled={!query && statusFilter === 'All' && phaseFilter === 'All'}><SlidersHorizontal size={15} aria-hidden="true" /> Clear filters</Button>
        </div>

        {filteredTrials.length ? (
          <div className="trials-table-scroll" tabIndex="0" aria-label="Scrollable clinical trials table">
            <table className="trials-table">
              <caption className="visually-hidden">Clinical trial demo records</caption>
              <thead>
                <tr>
                  <th scope="col">Trial ID</th>
                  <th scope="col">Trial Name</th>
                  <th scope="col">Research Area</th>
                  <th scope="col">Phase</th>
                  <th scope="col">Principal Investigator</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">Participants</th>
                  <th scope="col">Status</th>
                  <th scope="col"><span className="visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredTrials.map((trial) => (
                  <tr key={trial.id}>
                    <td className="trials-table__id">{trial.id}</td>
                    <td className="trials-table__name">{trial.name}</td>
                    <td>{trial.researchArea}</td>
                    <td><span className="trials-phase">{trial.phase}</span></td>
                    <td>{trial.investigator}</td>
                    <td className="trials-table__date">{formatTrialDate(trial.startDate)}</td>
                    <td><span className="trials-participant-count"><UsersRound size={14} aria-hidden="true" />{trial.participants}<span> / {trial.targetParticipants}</span></span></td>
                    <td><StatusBadge status={trial.status.toLowerCase()} label={trial.status} /></td>
                    <td>
                      <div className="trials-row-actions">
                        <TrialAction label="View" icon={Eye} onClick={() => setModal({ type: 'view', trial })} />
                        <TrialAction label="Edit" icon={PencilLine} onClick={() => openEdit(trial)} />
                        <TrialAction label="Delete" icon={Trash2} onClick={() => setModal({ type: 'delete', trial })} danger />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            className="trials-empty-state"
            icon={Search}
            title="No trials match these filters"
            description="Try a different search term or clear the filters to see the demo trial records."
            action={<Button variant="outline" size="small" onClick={clearFilters}>Clear filters</Button>}
          />
        )}
        {filteredTrials.length > 0 && <p className="trials-table-hint">Scroll horizontally to view all columns on smaller screens.</p>}
      </Card>

      {modal?.type === 'add' && <TrialFormModal onClose={() => setModal(null)} onSave={saveTrial} />}
      {modal?.type === 'edit' && <TrialFormModal key={modal.trial.id} trial={modal.trial} onClose={() => setModal(null)} onSave={saveTrial} />}
      {modal?.type === 'view' && <TrialDetailsModal trial={modal.trial} onClose={() => setModal(null)} onEdit={() => openEdit(modal.trial)} />}
      {modal?.type === 'delete' && (
        <TrialModal title="Delete demo trial?" description={`This will remove ${modal.trial.id} from the current local demo view.`} onClose={() => setModal(null)} size="small">
          <div className="trial-delete-confirm">
            <p><strong>{modal.trial.name}</strong></p>
            <p>This action only changes the current page session and cannot be undone after confirmation.</p>
            <div className="trial-modal__footer">
              <Button variant="outline" type="button" onClick={() => setModal(null)}>Cancel</Button>
              <Button variant="danger" type="button" onClick={confirmDelete}><Trash2 size={15} aria-hidden="true" /> Delete Trial</Button>
            </div>
          </div>
        </TrialModal>
      )}
    </div>
  )
}
