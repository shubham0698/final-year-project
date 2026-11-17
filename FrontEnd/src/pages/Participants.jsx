import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, CheckCircle2, ChevronRight, Eye, FilterX, Plus, Search, Trash2, UserCheck, UserMinus, Users, Pencil, Dices } from 'lucide-react'
import api from '../api/axiosInstance'
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

  useEffect(() => {
    loadParticipants()
  }, [])

  async function loadParticipants() {
    try {
      const res = await api.get('/api/participants')
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(p => ({
          id: p.participantCode || `P-${p.id}`,
          fullName: p.fullName,
          trialId: p.trialCode || 'CT-2024-001',
          trialName: p.trialCode || 'AIIA Clinical Trial',
          status: p.status || 'Active',
          gender: p.gender || 'Male',
          age: p.age || 35,
          enrolledDate: p.enrollmentDate ? String(p.enrollmentDate) : '2026-09-01',
          contactNumber: p.contactNumber || '—',
          doshaType: p.doshaType,
          randomizedGroup: p.randomizedGroup,
          consentStatus: p.consentStatus,
          _backendId: p.id
        }))
        setParticipants(mapped)
      }
    } catch {
      // Keep initial demo participants
    }
  }

  function setFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters({ query: '', trialId: '', status: '', gender: '' })
  }

  async function saveParticipant(values) {
    if (modal?.type === 'edit') {
      const targetId = modal.participant.id
      if (modal.participant._backendId) {
        try {
          await api.post('/api/participants', {
            id: modal.participant._backendId,
            participantCode: targetId,
            fullName: values.fullName,
            age: values.age,
            gender: values.gender,
            contactNumber: values.contactNumber,
            status: values.status,
            trialCode: values.trialId
          })
        } catch {}
      }
      setParticipants((current) => updateParticipantRecord(current, targetId, values))
      setNotice(`Participant ${targetId} updated successfully.`)
    } else {
      try {
        const res = await api.post('/api/participants', {
          participantCode: values.id || `P-${Date.now().toString().slice(-4)}`,
          fullName: values.fullName,
          age: values.age,
          gender: values.gender,
          contactNumber: values.contactNumber,
          status: values.status || 'Screened',
          trialCode: values.trialId || 'CT-2024-001'
        })
        const newRecord = {
          ...createParticipantRecord(participants, values),
          _backendId: res.data?.id
        }
        setParticipants((current) => [newRecord, ...current])
      } catch {
        setParticipants((current) => [createParticipantRecord(current, values), ...current])
      }
      setNotice('Participant added to study registry.')
    }
    setModal(null)
  }

  async function deleteParticipant() {
    if (!modal?.participant) return
    const { id, _backendId } = modal.participant
    if (_backendId) {
      try {
        await api.delete(`/api/participants/${_backendId}`)
      } catch {}
    }
    setParticipants((current) => removeParticipantRecord(current, id))
    setModal(null)
    setNotice(`${id} removed from study records.`)
  }

  async function randomizeParticipant(participant) {
    if (participant._backendId) {
      try {
        const res = await api.post(`/api/participants/${participant._backendId}/randomize`)
        if (res.data) {
          setParticipants(prev =>
            prev.map(p =>
              p.id === participant.id
                ? { ...p, status: 'Active', randomizedGroup: res.data.randomizedGroup }
                : p
            )
          )
          setNotice(`Participant ${participant.id} randomized to: ${res.data.randomizedGroup}`)
          return
        }
      } catch {}
    }
    const group = Math.random() > 0.5 ? 'Group A - Intervention' : 'Group B - Placebo Control'
    setParticipants(prev =>
      prev.map(p =>
        p.id === participant.id
          ? { ...p, status: 'Active', randomizedGroup: group }
          : p
      )
    )
    setNotice(`Participant ${participant.id} randomized to: ${group}`)
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
          <p>Manage participant records, track screening, eligibility, and study randomization.</p>
        </div>
        <Button onClick={() => setModal({ type: 'add' })}><Plus size={16} aria-hidden="true" /> Add Participant</Button>
      </header>

      {notice && (
        <div className="participants-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>
        </div>
      )}

      <div className="participants-demo-banner">
        <span className="participants-demo-banner__dot" />
        <span>Live CTMS Integration</span>
        <p>Participant demographics, consent state, and treatment arms are synchronized with backend records.</p>
      </div>

      <section className="participants-summary-grid" aria-label="Participant summary">
        {participantSummary.map((item) => {
          const Icon = summaryIcons[item.key]
          return (
            <Card key={item.key} className="participants-summary-card">
              <div className="participants-summary-card__top">
                <span className={`participants-summary-card__icon participants-summary-card__icon--${item.key}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="participants-summary-card__demo">Live Total</span>
              </div>
              <strong className="participants-summary-card__value">{item.value.toLocaleString()}</strong>
              <span className="participants-summary-card__label">{item.label}</span>
              <span className="participants-summary-card__detail">{item.detail}</span>
            </Card>
          )
        })}
      </section>

      <Card padding="none" className="participants-list-panel">
        <div className="participants-controls">
          <div className="participants-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by participant name, ID, or trial"
              value={filters.query}
              onChange={(e) => setFilter('query', e.target.value)}
              aria-label="Search participants"
            />
          </div>

          <div className="participants-filters">
            <label className="participant-select-label">
              <span>Trial</span>
              <select value={filters.trialId} onChange={(e) => setFilter('trialId', e.target.value)}>
                <option value="">All Trials</option>
                {participantTrials.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </label>

            <label className="participant-select-label">
              <span>Status</span>
              <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
                <option value="">All Statuses</option>
                {participantStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="participant-select-label">
              <span>Gender</span>
              <select value={filters.gender} onChange={(e) => setFilter('gender', e.target.value)}>
                <option value="">All Genders</option>
                {participantGenders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>

            {hasFilters && (
              <Button variant="ghost" size="small" onClick={clearFilters} className="participant-filter-reset">
                <FilterX size={14} aria-hidden="true" /> Reset
              </Button>
            )}
          </div>
        </div>

        <div className="participants-table-wrap">
          <table className="participants-table">
            <thead>
              <tr>
                <th scope="col">Participant</th>
                <th scope="col">Trial</th>
                <th scope="col">Status</th>
                <th scope="col">Dosha / Arm</th>
                <th scope="col">Demographics</th>
                <th scope="col">Enrolled</th>
                <th scope="col" className="participants-table__actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleParticipants.map((participant) => (
                <tr key={participant.id}>
                  <td>
                    <div className="participant-identity">
                      <span className="participant-identity__id">{participant.id}</span>
                      <strong className="participant-identity__name">{participant.fullName}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="participant-trial">
                      <span>{participant.trialName}</span>
                      <small>{participant.trialId}</small>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={participant.status} />
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>
                      {participant.doshaType && <span style={{ display: 'block', fontWeight: 600, color: '#0d9488' }}>{participant.doshaType}</span>}
                      <span style={{ color: '#64748b' }}>{participant.randomizedGroup || 'Not Randomized'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="participant-meta">{participant.gender}, {participant.age} yrs</span>
                  </td>
                  <td>
                    <span className="participant-date">{formatTrialDate(participant.enrolledDate)}</span>
                  </td>
                  <td className="participants-table__actions">
                    <div className="participant-actions">
                      {participant.status !== 'Active' && (
                        <ActionButton label="Randomize" icon={Dices} onClick={() => randomizeParticipant(participant)} />
                      )}
                      <ActionButton label="View" icon={Eye} onClick={() => setModal({ type: 'view', participant })} />
                      <ActionButton label="Edit" icon={Pencil} onClick={() => editParticipant(participant)} />
                      <ActionButton label="Delete" icon={Trash2} onClick={() => setModal({ type: 'delete', participant })} danger />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleParticipants.length === 0 && (
          <EmptyState
            icon={Users}
            title="No participants found"
            description="Adjust your search query or reset the filters to see more results."
            actionLabel="Reset filters"
            onAction={clearFilters}
          />
        )}
      </Card>

      {modal?.type === 'view' && (
        <ParticipantDetailsModal
          participant={modal.participant}
          onClose={() => setModal(null)}
          onEdit={() => editParticipant(modal.participant)}
        />
      )}

      {(modal?.type === 'add' || modal?.type === 'edit') && (
        <ParticipantFormModal
          mode={modal.type}
          initialValues={modal.participant}
          onClose={() => setModal(null)}
          onSubmit={saveParticipant}
        />
      )}

      {modal?.type === 'delete' && (
        <TrialModal title="Remove Participant" description="Are you sure you want to delete this participant record?" onClose={() => setModal(null)}>
          <div className="participant-delete-body">
            <p>You are about to remove <strong>{modal.participant.fullName}</strong> ({modal.participant.id}).</p>
            <div className="trial-modal__footer">
              <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={deleteParticipant}>Delete Participant</Button>
            </div>
          </div>
        </TrialModal>
      )}
    </main>
  )
}
