import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, CheckCircle2, ChevronRight, Eye, FilterX, Plus, Search, Trash2, UserCheck, UserMinus, Users, Pencil } from 'lucide-react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import TrialModal from '../components/trials/TrialModal.jsx'
import ParticipantDetailsModal from '../components/participants/ParticipantDetailsModal.jsx'
import ParticipantFormModal from '../components/participants/ParticipantFormModal.jsx'
import { initialParticipants, participantGenders, participantStatuses, participantSummary, participantTrials } from '../data/participantsData.js'
import { createParticipantRecord, filterParticipants, removeParticipantRecord, updateParticipantRecord } from '../utils/participantManagement.js'
import { formatTrialDate } from '../utils/trialFormatting.js'
import './Participants.css'

const summaryIcons = { total: Users, active: UserCheck, completed: CheckCircle2, withdrawn: UserMinus }

function ActionButton({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button className={`participant-action${danger ? ' participant-action--danger' : ''}`} type="button" onClick={onClick} aria-label={`${label} participant`} title={label}>
      <Icon size={15} aria-hidden="true" />
    </button>
  )
}

export default function Participants() {
  const [participants, setParticipants] = useState(initialParticipants)
  const [filters, setFilters] = useState({ query: '', trialId: '', status: '', gender: '' })
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const visibleParticipants = useMemo(() => filterParticipants(participants, filters), [participants, filters])
  const hasFilters = Boolean(filters.query || filters.trialId || filters.status || filters.gender)

  function setFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters({ query: '', trialId: '', status: '', gender: '' })
  }

  function saveParticipant(values) {
    if (modal?.type === 'edit') {
      setParticipants((current) => updateParticipantRecord(current, modal.participant.id, values))
      setNotice('Participant updated in this local demo session. The change is temporary.')
    } else {
      setParticipants((current) => [createParticipantRecord(current, values), ...current])
      setNotice('Participant added to this local demo session. The record is temporary.')
    }
    setModal(null)
  }

  function deleteParticipant() {
    if (!modal?.participant) return
    const { id } = modal.participant
    setParticipants((current) => removeParticipantRecord(current, id))
    setModal(null)
    setNotice(`${id} removed from this local demo session. The change is temporary.`)
  }

  function editParticipant(participant) {
    setModal({ type: 'edit', participant })
  }

  return (
    <main className="participants-page">
      <nav className="participants-breadcrumb" aria-label="Breadcrumb">
        <Link to="/app/overview" aria-label="Go to overview"><Activity size={13} aria-hidden="true" /></Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">Participants</span>
      </nav>

      <header className="participants-page-header">
        <div className="participants-page-header__copy">
          <span className="participants-page-header__eyebrow"><span className="participants-demo-dot" /> Participant registry</span>
          <h1>Participants</h1>
          <p>Manage participant records and monitor enrollment across clinical trials.</p>
        </div>
        <Button onClick={() => setModal({ type: 'add' })}><Plus size={16} aria-hidden="true" /> Add Participant</Button>
      </header>

      {notice && <div className="participants-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}

      <div className="participants-demo-banner"><span className="participants-demo-banner__dot" /><span>Demo data</span><p>Every participant record on this page is fictional and shown for interface demonstration only.</p></div>

      <section className="participants-summary-grid" aria-label="Participant summary">
        {participantSummary.map((item) => {
          const Icon = summaryIcons[item.key]
          return (
            <Card key={item.key} className="participants-summary-card">
              <div className="participants-summary-card__top"><span className={`participants-summary-card__icon participants-summary-card__icon--${item.key}`}><Icon size={18} aria-hidden="true" /></span><span className="participants-summary-card__demo">Demo total</span></div>
              <strong className="participants-summary-card__value">{item.value.toLocaleString()}</strong>
              <span className="participants-summary-card__label">{item.label}</span>
              <span className="participants-summary-card__detail">{item.detail}</span>
            </Card>
          )
        })}
      </section>

      <Card padding="none" className="participants-list-panel">
        <div className="participants-list-panel__header">
          <div><h2>Participant Records <span className="participants-demo-pill">FICTIONAL</span></h2><p>Sample participant records across the demo trial portfolio.</p></div>
          <span className="participants-results-count" aria-live="polite">{visibleParticipants.length} of {participants.length} records</span>
        </div>

        <div className="participants-filter-bar" role="search" aria-label="Filter participants">
          <label className="participants-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search participant ID or name</span><input type="search" value={filters.query} onChange={(event) => setFilter('query', event.target.value)} placeholder="Search ID or name..." /></label>
          <label className="participants-select-filter"><span className="sr-only">Filter by clinical trial</span><select value={filters.trialId} onChange={(event) => setFilter('trialId', event.target.value)}><option value="">All trials</option>{participantTrials.map((trial) => <option key={trial.id} value={trial.id}>{trial.id} · {trial.name}</option>)}</select></label>
          <label className="participants-select-filter"><span className="sr-only">Filter by status</span><select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">All statuses</option>{participantStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="participants-select-filter"><span className="sr-only">Filter by gender</span><select value={filters.gender} onChange={(event) => setFilter('gender', event.target.value)}><option value="">All genders</option>{participantGenders.map((gender) => <option key={gender}>{gender}</option>)}</select></label>
          <Button variant="outline" size="small" onClick={clearFilters} disabled={!hasFilters}><FilterX size={15} aria-hidden="true" /> Clear filters</Button>
        </div>

        {visibleParticipants.length ? (
          <>
            <p className="participants-table-hint">Swipe or scroll horizontally to view all participant fields.</p>
            <div className="participants-table-scroll" tabIndex="0" role="region" aria-label="Participant records table, horizontally scrollable">
              <table className="participants-table">
                <thead><tr><th scope="col">Participant ID</th><th scope="col">Participant Name</th><th scope="col">Age</th><th scope="col">Gender</th><th scope="col">Associated Trial</th><th scope="col">Enrollment Date</th><th scope="col">Contact</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
                <tbody>
                  {visibleParticipants.map((participant) => (
                    <tr key={participant.id}>
                      <td className="participants-table__id">{participant.id}<small>DEMO</small></td>
                      <td className="participants-table__name">{participant.fullName}</td>
                      <td>{participant.age}</td>
                      <td>{participant.gender}</td>
                      <td className="participants-table__trial"><span>{participant.trialName}</span><small>{participant.trialId}</small></td>
                      <td className="participants-table__date">{formatTrialDate(participant.enrollmentDate)}</td>
                      <td className="participants-table__contact"><span>{participant.phone}</span><small>{participant.email || 'Email not provided'}</small></td>
                      <td><StatusBadge status={participant.status} /></td>
                      <td><div className="participants-row-actions"><ActionButton label="View" icon={Eye} onClick={() => setModal({ type: 'view', participant })} /><ActionButton label="Edit" icon={Pencil} onClick={() => editParticipant(participant)} /><ActionButton label="Delete" icon={Trash2} danger onClick={() => setModal({ type: 'delete', participant })} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState className="participants-empty-state" title="No participants found" description="Try a different search or adjust the selected filters." icon={Users} action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>} />
        )}
      </Card>

      {modal?.type === 'add' && <ParticipantFormModal onClose={() => setModal(null)} onSave={saveParticipant} />}
      {modal?.type === 'edit' && <ParticipantFormModal participant={modal.participant} onClose={() => setModal(null)} onSave={saveParticipant} />}
      {modal?.type === 'view' && <ParticipantDetailsModal participant={modal.participant} onClose={() => setModal(null)} onEdit={() => editParticipant(modal.participant)} />}
      {modal?.type === 'delete' && (
        <TrialModal title="Remove Demo Participant?" description="This action only changes the current page's local demo state." onClose={() => setModal(null)} size="small">
          <div className="participant-delete-confirm"><p>Remove <strong>{modal.participant.fullName}</strong> ({modal.participant.id}) from the visible demo records?</p><p>This fictional record will be removed from this page session. It will not affect any saved data.</p><div className="trial-modal__footer"><Button variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button variant="danger" onClick={deleteParticipant}><Trash2 size={15} aria-hidden="true" /> Remove record</Button></div></div>
        </TrialModal>
      )}
    </main>
  )
}
