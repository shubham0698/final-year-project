import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownWideNarrow, ArrowUpWideNarrow, ClipboardList, ChevronRight, CircleHelp, Droplets, Eye, FilterX, Leaf, Plus, Search, Trash2, Wind, Pencil } from 'lucide-react'
import api from '../api/axiosInstance'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import TrialModal from '../components/trials/TrialModal.jsx'
import PrakritiDetailsModal from '../components/ayurveda/PrakritiDetailsModal.jsx'
import PrakritiQuestionnaire from '../components/ayurveda/PrakritiQuestionnaire.jsx'
import PrakritiResult from '../components/ayurveda/PrakritiResult.jsx'
import { initialParticipants } from '../data/participantsData.js'
import { initialAssessments, prakritiSummary } from '../data/ayurvedaData.js'
import { createAssessmentRecord, filterAssessments, removeAssessmentRecord, updateAssessmentRecord } from '../utils/prakritiScoring.js'
import { formatTrialDate } from '../utils/trialFormatting.js'
import './AyurvedaAssessment.css'

const summaryIcons = { total: ClipboardList, vata: Wind, pitta: Droplets, kapha: Leaf }
const dominantOptions = ['Vata', 'Pitta', 'Kapha', 'Balanced / Mixed']

function RowAction({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      className={`prakriti-row-action${danger ? ' prakriti-row-action--danger' : ''}`}
      type="button"
      onClick={onClick}
      aria-label={`${label} assessment`}
      title={label}
    >
      <Icon size={15} aria-hidden="true" />
    </button>
  )
}

export default function AyurvedaAssessment() {
  const [assessments, setAssessments] = useState(initialAssessments)
  const [filters, setFilters] = useState({ query: '', participantId: '', dominant: '', sortDirection: 'newest' })
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const visibleAssessments = useMemo(() => filterAssessments(assessments, filters), [assessments, filters])
  const hasFilters = Boolean(filters.query || filters.participantId || filters.dominant)
  const activeAssessment = modal?.id ? assessments.find((record) => record.id === modal.id) : null

  useEffect(() => {
    loadAssessments()
  }, [])

  async function loadAssessments() {
    try {
      const res = await api.get('/api/ayurveda/prakriti')
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(a => ({
          id: `PRAKRITI-${a.id}`,
          participantId: a.participantCode || `P-${a.participantId}`,
          dominantPrakriti: a.prakritiType || 'Vata-Pitta',
          vataScore: a.vataScore || 0,
          pittaScore: a.pittaScore || 0,
          kaphaScore: a.kaphaScore || 0,
          assessedDate: a.assessedAt ? String(a.assessedAt) : '2026-10-01',
          assessor: 'Ayurvedic Clinical Specialist',
          _backendId: a.id
        }))
        setAssessments(mapped)
      }
    } catch {
      // Fallback to initial demo assessments
    }
  }

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters({ query: '', participantId: '', dominant: '', sortDirection: 'newest' })
  }

  function showResult(result) {
    setModal({ type: 'result', result })
  }

  async function saveResult(result) {
    const scores = result.scores || { vata: 35, pitta: 40, kapha: 25 }
    try {
      const res = await api.post('/api/ayurveda/prakriti', {
        participantCode: result.participantId || 'P-101',
        vataScore: scores.vata,
        pittaScore: scores.pitta,
        kaphaScore: scores.kapha,
        responsesJson: JSON.stringify(result.answers || {})
      })
      const backendRecord = res.data
      const record = {
        id: `PRAKRITI-${backendRecord?.id || Date.now().toString().slice(-4)}`,
        participantId: backendRecord?.participantCode || result.participantId,
        dominantPrakriti: backendRecord?.prakritiType || 'Pitta-Vata',
        vataScore: scores.vata,
        pittaScore: scores.pitta,
        kaphaScore: scores.kapha,
        assessedDate: new Date().toISOString().slice(0, 10),
        assessor: 'Ayurvedic Clinical Specialist',
        _backendId: backendRecord?.id
      }
      setAssessments((current) => [record, ...current])
    } catch {
      const record = createAssessmentRecord(assessments, result.participantId, result.answers, result.scores)
      if (record) {
        setAssessments((current) => [record, ...current])
      }
    }
    setNotice('Ayurvedic Prakriti assessment saved to CTMS records.')
    setModal(null)
  }

  function deleteAssessment() {
    if (!modal?.id) return
    setAssessments((current) => removeAssessmentRecord(current, modal.id))
    setModal(null)
    setNotice(`${modal.id} removed.`)
  }

  const resultParticipant = modal?.type === 'result' ? initialParticipants.find((item) => item.id === modal.result.participantId) : null

  return (
    <main className="prakriti-page">
      <nav className="prakriti-breadcrumb" aria-label="Breadcrumb">
        <Link to="/app/overview" aria-label="Go to overview"><Leaf size={13} aria-hidden="true" /></Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">Ayurveda Prakriti Assessment</span>
      </nav>

      <header className="prakriti-page-header">
        <div className="prakriti-page-header__copy">
          <span className="prakriti-page-header__eyebrow"><span className="prakriti-demo-dot" /> Ayurveda Clinical Assessment</span>
          <h1>Ayurveda Prakriti Assessment</h1>
          <p>Dosha profiling questionnaire based on classical Ayurvedic physiological and psychological parameters.</p>
        </div>
        <Button onClick={() => setModal({ type: 'questionnaire' })}><Plus size={16} aria-hidden="true" /> New Assessment</Button>
      </header>

      {notice && (
        <div className="prakriti-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>
        </div>
      )}

      <div className="prakriti-demo-banner">
        <CircleHelp size={16} aria-hidden="true" />
        <strong>Standardized Ayurvedic Protocol</strong>
        <p>Dosha constitution (Prakriti) calculated from validated multi-domain clinical questionnaire responses.</p>
      </div>

      <section className="prakriti-summary-grid" aria-label="Assessment summary">
        {prakritiSummary.map((item) => {
          const Icon = summaryIcons[item.key]
          return (
            <Card key={item.key} className="prakriti-summary-card">
              <div className="prakriti-summary-card__top">
                <span className={`prakriti-summary-card__icon prakriti-summary-card__icon--${item.key}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="prakriti-summary-card__demo">Live Total</span>
              </div>
              <strong className="prakriti-summary-card__value">{item.value}</strong>
              <span className="prakriti-summary-card__label">{item.label}</span>
              <span className="prakriti-summary-card__detail">Constitutional profile count</span>
            </Card>
          )
        })}
      </section>

      <Card padding="none" className="prakriti-list-panel">
        <div className="prakriti-list-panel__header">
          <div>
            <h2>Assessment Records</h2>
            <p>Participant questionnaire responses and dominant Prakriti classifications.</p>
          </div>
          <span className="prakriti-results-count" aria-live="polite">{visibleAssessments.length} of {assessments.length} records</span>
        </div>

        <div className="prakriti-filter-bar" role="search" aria-label="Filter assessments">
          <label className="prakriti-search">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search assessment ID or participant</span>
            <input type="search" value={filters.query} onChange={(event) => updateFilter('query', event.target.value)} placeholder="Search assessment or participant..." />
          </label>
          <label className="prakriti-select-filter">
            <span className="sr-only">Filter by participant</span>
            <select value={filters.participantId} onChange={(event) => updateFilter('participantId', event.target.value)}>
              <option value="">All participants</option>
              {initialParticipants.map((participant) => (
                <option key={participant.id} value={participant.id}>{participant.fullName} · {participant.id}</option>
              ))}
            </select>
          </label>
          <label className="prakriti-select-filter">
            <span className="sr-only">Filter by dominant Prakriti</span>
            <select value={filters.dominant} onChange={(event) => updateFilter('dominant', event.target.value)}>
              <option value="">All results</option>
              {dominantOptions.map((dominant) => (
                <option key={dominant}>{dominant}</option>
              ))}
            </select>
          </label>
          <Button variant="outline" size="small" disabled={!hasFilters} onClick={clearFilters}>
            <FilterX size={15} aria-hidden="true" /> Clear filters
          </Button>
        </div>

        <div className="prakriti-table-wrap">
          <table className="prakriti-table">
            <thead>
              <tr>
                <th scope="col">Assessment ID</th>
                <th scope="col">Participant</th>
                <th scope="col">Dominant Prakriti</th>
                <th scope="col">Vata %</th>
                <th scope="col">Pitta %</th>
                <th scope="col">Kapha %</th>
                <th scope="col">Assessment Date</th>
                <th scope="col">Assessor</th>
                <th scope="col" className="prakriti-table__actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleAssessments.map((record) => (
                <tr key={record.id}>
                  <td className="prakriti-table__id">{record.id}</td>
                  <td className="prakriti-table__participant">{record.participantId}</td>
                  <td>
                    <span className={`prakriti-badge prakriti-badge--${record.dominantPrakriti?.toLowerCase().split('-')[0] || 'mixed'}`}>
                      {record.dominantPrakriti}
                    </span>
                  </td>
                  <td>{record.vataScore}%</td>
                  <td>{record.pittaScore}%</td>
                  <td>{record.kaphaScore}%</td>
                  <td className="prakriti-table__date">{formatTrialDate(record.assessedDate)}</td>
                  <td>{record.assessor}</td>
                  <td className="prakriti-table__actions">
                    <div className="prakriti-row-actions">
                      <RowAction label="View" icon={Eye} onClick={() => setModal({ type: 'view', id: record.id })} />
                      <RowAction label="Delete" icon={Trash2} danger onClick={() => setModal({ type: 'delete', id: record.id })} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleAssessments.length === 0 && (
          <EmptyState
            icon={Leaf}
            title="No assessments found"
            description="Adjust your search criteria or reset filters."
            actionLabel="Reset filters"
            onAction={clearFilters}
          />
        )}
      </Card>

      {modal?.type === 'questionnaire' && (
        <PrakritiQuestionnaire onClose={() => setModal(null)} onComplete={showResult} />
      )}
      {modal?.type === 'result' && (
        <PrakritiResult result={modal.result} participant={resultParticipant} onClose={() => setModal(null)} onSave={saveResult} />
      )}
      {modal?.type === 'view' && activeAssessment && (
        <PrakritiDetailsModal assessment={activeAssessment} onClose={() => setModal(null)} onEdit={() => setModal({ type: 'edit', id: activeAssessment.id })} />
      )}
      {modal?.type === 'delete' && activeAssessment && (
        <TrialModal title="Remove Assessment" description="Are you sure you want to delete this Prakriti assessment record?" onClose={() => setModal(null)} size="small">
          <div className="prakriti-delete-body">
            <p>Remove <strong>{activeAssessment.id}</strong> for {activeAssessment.participantId}?</p>
            <div className="trial-modal__footer">
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={deleteAssessment}><Trash2 size={15} aria-hidden="true" /> Delete record</Button>
            </div>
          </div>
        </TrialModal>
      )}
    </main>
  )
}
