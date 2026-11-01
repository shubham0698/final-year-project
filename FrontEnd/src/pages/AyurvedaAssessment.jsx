import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownWideNarrow, ArrowUpWideNarrow, ClipboardList, ChevronRight, CircleHelp, Droplets, Eye, FilterX, Leaf, Plus, Search, Trash2, Wind, Pencil } from 'lucide-react'
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
  return <button className={`prakriti-row-action${danger ? ' prakriti-row-action--danger' : ''}`} type="button" onClick={onClick} aria-label={`${label} assessment`} title={label}><Icon size={15} aria-hidden="true" /></button>
}

export default function AyurvedaAssessment() {
  const [assessments, setAssessments] = useState(initialAssessments)
  const [filters, setFilters] = useState({ query: '', participantId: '', dominant: '', sortDirection: 'newest' })
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const visibleAssessments = useMemo(() => filterAssessments(assessments, filters), [assessments, filters])
  const hasFilters = Boolean(filters.query || filters.participantId || filters.dominant)
  const activeAssessment = modal?.id ? assessments.find((record) => record.id === modal.id) : null

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters({ query: '', participantId: '', dominant: '', sortDirection: 'newest' })
  }

  function showResult(result) {
    setModal({ type: 'result', result })
  }

  function saveResult(result) {
    if (result.editId) {
      setAssessments((current) => updateAssessmentRecord(current, result.editId, result.participantId, result.answers, result.scores))
      setNotice('Assessment result updated in this local demo session. No permanent data was saved.')
    } else {
      const record = createAssessmentRecord(assessments, result.participantId, result.answers, result.scores)
      if (!record) return
      setAssessments((current) => [record, ...current])
      setNotice('Illustrative assessment saved to this local demo session only.')
    }
    setModal(null)
  }

  function deleteAssessment() {
    if (!modal?.id) return
    setAssessments((current) => removeAssessmentRecord(current, modal.id))
    setModal(null)
    setNotice(`${modal.id} removed from this local demo session. The change is temporary.`)
  }

  const resultParticipant = modal?.type === 'result' ? initialParticipants.find((item) => item.id === modal.result.participantId) : null

  return (
    <main className="prakriti-page">
      <nav className="prakriti-breadcrumb" aria-label="Breadcrumb"><Link to="/app/overview" aria-label="Go to overview"><Leaf size={13} aria-hidden="true" /></Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Ayurveda Prakriti Assessment</span></nav>

      <header className="prakriti-page-header"><div className="prakriti-page-header__copy"><span className="prakriti-page-header__eyebrow"><span className="prakriti-demo-dot" /> Educational assessment workspace</span><h1>Ayurveda Prakriti Assessment</h1><p>Explore a fictional, educational questionnaire and illustrative score summary.</p></div><Button onClick={() => setModal({ type: 'questionnaire' })}><Plus size={16} aria-hidden="true" /> New Assessment</Button></header>

      {notice && <div className="prakriti-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
      <div className="prakriti-demo-banner"><CircleHelp size={16} aria-hidden="true" /><strong>Educational demo data</strong><p>Questionnaire results are illustrative only, not diagnostic, validated, or recommendations.</p></div>

      <section className="prakriti-summary-grid" aria-label="Assessment summary">
        {prakritiSummary.map((item) => {
          const Icon = summaryIcons[item.key]
          return <Card key={item.key} className="prakriti-summary-card"><div className="prakriti-summary-card__top"><span className={`prakriti-summary-card__icon prakriti-summary-card__icon--${item.key}`}><Icon size={18} aria-hidden="true" /></span><span className="prakriti-summary-card__demo">Demo total</span></div><strong className="prakriti-summary-card__value">{item.value}</strong><span className="prakriti-summary-card__label">{item.label}</span><span className="prakriti-summary-card__detail">Illustrative portfolio count</span></Card>
        })}
      </section>

      <Card padding="none" className="prakriti-list-panel">
        <div className="prakriti-list-panel__header"><div><h2>Assessment Records <span className="prakriti-demo-pill">FICTIONAL</span></h2><p>Past questionnaire responses and simple demo score totals.</p></div><span className="prakriti-results-count" aria-live="polite">{visibleAssessments.length} of {assessments.length} records</span></div>
        <div className="prakriti-filter-bar" role="search" aria-label="Filter assessments">
          <label className="prakriti-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search assessment ID or participant</span><input type="search" value={filters.query} onChange={(event) => updateFilter('query', event.target.value)} placeholder="Search assessment or participant..." /></label>
          <label className="prakriti-select-filter"><span className="sr-only">Filter by participant</span><select value={filters.participantId} onChange={(event) => updateFilter('participantId', event.target.value)}><option value="">All participants</option>{initialParticipants.map((participant) => <option key={participant.id} value={participant.id}>{participant.fullName} · {participant.id}</option>)}</select></label>
          <label className="prakriti-select-filter"><span className="sr-only">Filter by dominant Prakriti</span><select value={filters.dominant} onChange={(event) => updateFilter('dominant', event.target.value)}><option value="">All results</option>{dominantOptions.map((dominant) => <option key={dominant}>{dominant}</option>)}</select></label>
          <Button variant="outline" size="small" disabled={!hasFilters} onClick={clearFilters}><FilterX size={15} aria-hidden="true" /> Clear filters</Button>
        </div>

        {visibleAssessments.length ? <><p className="prakriti-table-hint">Swipe or scroll horizontally to view all assessment fields.</p><div className="prakriti-table-scroll" tabIndex="0" role="region" aria-label="Prakriti assessment records, horizontally scrollable"><table className="prakriti-table">
          <thead><tr><th scope="col">Assessment ID</th><th scope="col">Participant ID</th><th scope="col">Participant Name</th><th scope="col"><button className="prakriti-sort-button" type="button" onClick={() => updateFilter('sortDirection', filters.sortDirection === 'newest' ? 'oldest' : 'newest')} aria-label={`Sort ${filters.sortDirection === 'newest' ? 'oldest' : 'newest'} first`}>Assessment Date{filters.sortDirection === 'newest' ? <ArrowDownWideNarrow size={14} aria-hidden="true" /> : <ArrowUpWideNarrow size={14} aria-hidden="true" />}</button></th><th scope="col">Vata</th><th scope="col">Pitta</th><th scope="col">Kapha</th><th scope="col">Dominant Prakriti</th><th scope="col">Actions</th></tr></thead>
          <tbody>{visibleAssessments.map((assessment) => <tr key={assessment.id}>
            <td className="prakriti-table__id">{assessment.id}<small>DEMO</small></td><td className="prakriti-table__participant-id">{assessment.participantId}</td><td className="prakriti-table__name">{assessment.participantName}</td><td className="prakriti-table__date">{formatTrialDate(assessment.assessmentDate)}</td><td><span className="prakriti-score-value prakriti-score-value--vata">{assessment.scores.vata}</span></td><td><span className="prakriti-score-value prakriti-score-value--pitta">{assessment.scores.pitta}</span></td><td><span className="prakriti-score-value prakriti-score-value--kapha">{assessment.scores.kapha}</span></td><td><span className={`prakriti-result-pill${assessment.dominant === 'Balanced / Mixed' ? ' prakriti-result-pill--balanced' : ''}`}>{assessment.dominant}</span></td>
            <td><div className="prakriti-row-actions"><RowAction label="View" icon={Eye} onClick={() => setModal({ type: 'view', id: assessment.id })} /><RowAction label="Recalculate" icon={Pencil} onClick={() => setModal({ type: 'questionnaire', assessment })} /><RowAction label="Delete" icon={Trash2} danger onClick={() => setModal({ type: 'delete', id: assessment.id })} /></div></td>
          </tr>)}</tbody>
        </table></div></> : <EmptyState className="prakriti-empty-state" title="No assessments found" description="Try another search or adjust the selected filters." icon={ClipboardList} action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>} />}
      </Card>

      {modal?.type === 'questionnaire' && <PrakritiQuestionnaire assessment={modal.assessment} onClose={() => setModal(null)} onCalculate={showResult} />}
      {modal?.type === 'result' && <PrakritiResult result={modal.result} participantName={resultParticipant?.fullName ?? 'Demo participant'} onSave={saveResult} onClose={() => setModal(null)} />}
      {modal?.type === 'view' && activeAssessment && <PrakritiDetailsModal assessment={activeAssessment} onClose={() => setModal(null)} onEdit={(assessment) => setModal({ type: 'questionnaire', assessment })} />}
      {modal?.type === 'delete' && activeAssessment && <TrialModal title="Delete Demo Assessment?" description="This action only changes the current page's local demo state." onClose={() => setModal(null)} size="small"><div className="prakriti-delete-confirm"><p>Remove <strong>{activeAssessment.id}</strong> for {activeAssessment.participantName} from the visible demo records?</p><p>This fictional assessment will be removed from this page session only.</p><div className="trial-modal__footer"><Button variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button variant="danger" onClick={deleteAssessment}><Trash2 size={15} aria-hidden="true" /> Delete assessment</Button></div></div></TrialModal>}
    </main>
  )
}
