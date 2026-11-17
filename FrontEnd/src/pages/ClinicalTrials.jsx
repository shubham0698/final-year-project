import { useEffect, useMemo, useState } from 'react'
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
import api from '../api/axiosInstance'
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
  { key: 'total', label: 'Total Trials', icon: FlaskConical, tone: 'navy', detail: 'Across the clinical portfolio' },
  { key: 'active', label: 'Active Trials', icon: CircleCheck, tone: 'teal', detail: 'Currently in progress' },
  { key: 'completed', label: 'Completed Trials', icon: CalendarDays, tone: 'green', detail: 'Marked complete' },
  { key: 'pending', label: 'Pending Approval', icon: Clock3, tone: 'gold', detail: 'Awaiting review' },
]

function SummaryCard({ definition, value }) {
  const Icon = definition.icon
  return (
    <Card as="article" className="trials-summary-card" padding="medium">
      <div className="trials-summary-card__top">
        <span className={`trials-summary-card__icon trials-summary-card__icon--${definition.tone}`}>
          <Icon size={19} aria-hidden="true" />
        </span>
        <span className="trials-summary-card__demo">Live CTMS</span>
      </div>
      <strong className="trials-summary-card__value">{value}</strong>
      <span className="trials-summary-card__label">{definition.label}</span>
      <span className="trials-summary-card__detail">{definition.detail}</span>
    </Card>
  )
}

function TrialAction({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      className={`trial-action${danger ? ' trial-action--danger' : ''}`}
      type="button"
      onClick={onClick}
      aria-label={`${label} trial`}
      title={`${label} trial`}
    >
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

  useEffect(() => {
    loadTrials()
  }, [])

  async function loadTrials() {
    try {
      const res = await api.get('/api/trials')
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(t => ({
          id: t.trialCode || `CT-${t.id}`,
          name: t.title,
          researchArea: t.phase || 'Ayurveda Research',
          phase: t.phase || 'Phase II',
          status: t.status || 'Active',
          targetParticipants: t.targetEnrollment || 100,
          currentParticipants: t.currentEnrollment || 0,
          startDate: t.startDate || '2026-01-01',
          endDate: t.endDate || '2027-01-01',
          principalInvestigator: t.principalInvestigator || 'Dr. Sharma',
          siteLocation: t.siteLocation || 'AIIA Hospital',
          _backendId: t.id
        }))
        setTrials(mapped)
      }
    } catch {
      // Keep initial fallback trials
    }
  }

  const filteredTrials = useMemo(() => {
    return filterTrials(trials, { query, status: statusFilter, phase: phaseFilter })
  }, [trials, query, statusFilter, phaseFilter])

  const summaryValues = getTrialSummary(trials)

  function clearFilters() {
    setQuery('')
    setStatusFilter('All')
    setPhaseFilter('All')
  }

  async function saveTrial(values) {
    if (modal?.type === 'edit') {
      const targetId = modal.trial.id
      try {
        await api.post('/api/trials', {
          id: modal.trial._backendId,
          trialCode: targetId,
          title: values.name || modal.trial.name,
          phase: values.phase || modal.trial.phase,
          status: values.status || modal.trial.status,
          targetEnrollment: values.targetParticipants || modal.trial.targetParticipants,
          principalInvestigator: values.principalInvestigator || modal.trial.principalInvestigator,
          siteLocation: values.siteLocation || modal.trial.siteLocation
        })
      } catch {}
      setTrials((current) => updateTrialRecord(current, targetId, values, currentISODate()))
      setNotice(`${targetId} updated successfully.`)
    } else {
      const id = `CT-2024-${String(nextId).padStart(3, '0')}`
      try {
        const res = await api.post('/api/trials', {
          trialCode: id,
          title: values.name || 'Ayurveda Trial',
          phase: values.phase || 'Phase II',
          status: values.status || 'Active',
          targetEnrollment: values.targetParticipants || 100,
          currentEnrollment: 0,
          principalInvestigator: values.principalInvestigator || 'Principal Investigator',
          siteLocation: values.siteLocation || 'AIIA New Delhi'
        })
        const backendTrial = res.data
        const newRecord = {
          ...createTrialRecord(values, id, currentISODate()),
          _backendId: backendTrial?.id
        }
        setTrials((current) => [newRecord, ...current])
      } catch {
        setTrials((current) => [createTrialRecord(values, id, currentISODate()), ...current])
      }
      setNextId((current) => current + 1)
      setNotice(`${id} added to the clinical trial registry.`)
    }
    setModal(null)
  }

  async function confirmDelete() {
    const deletedTrial = modal.trial
    if (deletedTrial._backendId) {
      try {
        await api.delete(`/api/trials/${deletedTrial._backendId}`)
      } catch {}
    }
    setTrials((current) => removeTrialRecord(current, deletedTrial.id))
    setNotice(`${deletedTrial.id} removed from study registry.`)
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
          <div className="trials-page-header__eyebrow"><span className="trials-demo-dot" /> AIIA Registry</div>
          <h1>Clinical Trials</h1>
          <p>Create, organize, and monitor clinical research trials across institutional sites.</p>
        </div>
        <Button variant="primary" size="large" onClick={() => setModal({ type: 'add' })}><Plus size={17} aria-hidden="true" /> Add New Trial</Button>
      </header>

      {notice && (
        <aside className="trials-session-banner" role="status" aria-live="polite">
          <p>{notice}</p>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">
            <X size={15} aria-hidden="true" />
          </button>
        </aside>
      )}

      <section className="trials-summary-grid" aria-label="Trial portfolio metrics">
        {summaryDefinitions.map((definition) => (
          <SummaryCard key={definition.key} definition={definition} value={summaryValues[definition.key]} />
        ))}
      </section>

      <section className="trials-toolbar" aria-label="Filter and search trials">
        <div className="trials-search-box">
          <Search className="trials-search-box__icon" size={17} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by trial name, ID, or investigator…"
            aria-label="Search trials"
          />
          {query && (
            <button className="trials-search-box__clear" type="button" onClick={() => setQuery('')} aria-label="Clear search input">
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="trials-filter-controls">
          <label className="trials-filter-control">
            <span className="trials-filter-control__label">Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {trialStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="trials-filter-control">
            <span className="trials-filter-control__label">Phase</span>
            <select value={phaseFilter} onChange={(event) => setPhaseFilter(event.target.value)}>
              {trialPhases.map((phase) => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
          </label>

          {(query || statusFilter !== 'All' || phaseFilter !== 'All') && (
            <button className="trials-filter-reset" type="button" onClick={clearFilters}>
              <SlidersHorizontal size={14} aria-hidden="true" /> Reset filters
            </button>
          )}
        </div>
      </section>

      <section className="trials-table-panel" aria-label="Trials list">
        <div className="trials-table-panel__header">
          <div>
            <h2>Registered Clinical Trials</h2>
            <p className="trials-table-panel__count">
              Showing <strong>{filteredTrials.length}</strong> of {trials.length} trials
            </p>
          </div>
        </div>

        <div className="trials-table-wrap">
          <table className="trials-table">
            <thead>
              <tr>
                <th scope="col">Trial Details</th>
                <th scope="col">Phase</th>
                <th scope="col">Status</th>
                <th scope="col">Enrollment Progress</th>
                <th scope="col">Start Date</th>
                <th scope="col">Principal Investigator</th>
                <th scope="col" className="trials-table__th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrials.map((trial) => {
                const target = trial.targetParticipants || 1
                const enrolled = trial.currentParticipants || 0
                const percent = Math.min(100, Math.round((enrolled / target) * 100))
                return (
                  <tr key={trial.id}>
                    <td>
                      <div className="trial-primary-cell">
                        <span className="trial-primary-cell__id">{trial.id}</span>
                        <strong className="trial-primary-cell__name">{trial.name}</strong>
                        <span className="trial-primary-cell__area">{trial.researchArea}</span>
                      </div>
                    </td>
                    <td><span className="trial-phase-badge">{trial.phase}</span></td>
                    <td><StatusBadge status={trial.status} /></td>
                    <td>
                      <div className="trial-enrollment-cell">
                        <div className="trial-enrollment-cell__copy">
                          <span>{enrolled} of {target}</span>
                          <strong>{percent}%</strong>
                        </div>
                        <div className="trial-progress-bar" aria-hidden="true">
                          <div className="trial-progress-bar__fill" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </td>
                    <td><span className="trial-date-cell">{formatTrialDate(trial.startDate)}</span></td>
                    <td>
                      <div className="trial-investigator-cell">
                        <span>{trial.principalInvestigator}</span>
                        <small>{trial.siteLocation}</small>
                      </div>
                    </td>
                    <td className="trials-table__td-actions">
                      <div className="trials-row-actions">
                        <TrialAction label="View details for" icon={Eye} onClick={() => setModal({ type: 'view', trial })} />
                        <TrialAction label="Edit" icon={PencilLine} onClick={() => openEdit(trial)} />
                        <TrialAction label="Delete" icon={Trash2} onClick={() => setModal({ type: 'delete', trial })} danger />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredTrials.length === 0 && (
          <EmptyState
            icon={FlaskConical}
            title="No trials match your search"
            description="Try modifying search keywords or clearing active filters."
            actionLabel="Reset search filters"
            onAction={clearFilters}
          />
        )}
      </section>

      {modal?.type === 'view' && (
        <TrialDetailsModal trial={modal.trial} onClose={() => setModal(null)} onEdit={() => openEdit(modal.trial)} />
      )}

      {(modal?.type === 'add' || modal?.type === 'edit') && (
        <TrialFormModal
          mode={modal.type}
          initialValues={modal.trial}
          onClose={() => setModal(null)}
          onSubmit={saveTrial}
        />
      )}

      {modal?.type === 'delete' && (
        <TrialModal title="Remove Trial Record" description="Are you sure you want to delete this trial record?" onClose={() => setModal(null)}>
          <div className="trial-delete-body">
            <p>You are about to remove <strong>{modal.trial.name}</strong> ({modal.trial.id}).</p>
            <div className="trial-modal__footer">
              <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Confirm Delete</Button>
            </div>
          </div>
        </TrialModal>
      )}
    </div>
  )
}
