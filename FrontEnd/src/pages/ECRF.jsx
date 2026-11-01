import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronRight, ClipboardList, Clock3, Eye, FileText, FilterX, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import TrialModal from '../components/trials/TrialModal.jsx'
import ECRFDetailsModal from '../components/ecrf/ECRFDetailsModal.jsx'
import ECRFFormModal from '../components/ecrf/ECRFFormModal.jsx'
import { ecrfStatuses, ecrfSummary, initialEcrfs } from '../data/ecrfData.js'
import { initialTrials } from '../data/trialsData.js'
import { canTransitionEcrfStatus, createEcrfRecord, filterEcrfs, removeEcrfRecord, transitionEcrfStatus, updateEcrfRecord } from '../utils/ecrfManagement.js'
import { formatTrialDate } from '../utils/trialFormatting.js'
import './ECRF.css'

const summaryIcons = { total: ClipboardList, completed: CheckCircle2, pending: Clock3, draft: FileText }

function RowAction({ label, icon: Icon, onClick, danger = false }) {
  return <button className={`ecrf-row-action${danger ? ' ecrf-row-action--danger' : ''}`} type="button" onClick={onClick} aria-label={`${label} eCRF form`} title={label}><Icon size={15} aria-hidden="true" /></button>
}

export default function ECRF() {
  const [forms, setForms] = useState(initialEcrfs)
  const [filters, setFilters] = useState({ query: '', trialId: '', status: '' })
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const visibleForms = useMemo(() => filterEcrfs(forms, filters), [forms, filters])
  const hasFilters = Boolean(filters.query || filters.trialId || filters.status)
  const activeForm = modal?.id ? forms.find((form) => form.id === modal.id) : null

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters({ query: '', trialId: '', status: '' })
  }

  function saveForm(values) {
    if (modal?.type === 'edit') {
      setForms((current) => updateEcrfRecord(current, modal.id, values))
      setNotice('eCRF form updated and moved to In Progress in this local demo session. The change is temporary.')
    } else {
      setForms((current) => [createEcrfRecord(current, values), ...current])
      setNotice('eCRF form created as a local demo draft. It is not saved permanently.')
    }
    setModal(null)
  }

  function transitionForm(form, nextStatus) {
    if (!canTransitionEcrfStatus(form.status, nextStatus) || form.status === nextStatus) {
      setNotice(`The ${form.status} to ${nextStatus} transition is not available for this demo form.`)
      return
    }
    setForms((current) => transitionEcrfStatus(current, form.id, nextStatus))
    const messages = {
      Draft: 'Form saved as a local demo draft.',
      Submitted: 'Form submitted for review in this local demo session.',
      Reviewed: 'Form marked as reviewed in this local demo session.',
    }
    setNotice(`${messages[nextStatus]} No permanent data was saved.`)
    setModal(null)
  }

  function deleteForm() {
    if (!modal?.id) return
    setForms((current) => removeEcrfRecord(current, modal.id))
    setModal(null)
    setNotice(`${modal.id} removed from this local demo session. The change is temporary.`)
  }

  return (
    <main className="ecrf-page">
      <nav className="ecrf-breadcrumb" aria-label="Breadcrumb"><Link to="/app/overview" aria-label="Go to overview"><ClipboardList size={13} aria-hidden="true" /></Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">eCRF &amp; Data Collection</span></nav>

      <header className="ecrf-page-header"><div className="ecrf-page-header__copy"><span className="ecrf-page-header__eyebrow"><span className="ecrf-demo-dot" /> Structured data workspace</span><h1>eCRF &amp; Data Collection</h1><p>Capture, review, and manage structured clinical research data.</p></div><Button onClick={() => setModal({ type: 'add' })}><Plus size={16} aria-hidden="true" /> Create New Form</Button></header>

      {notice && <div className="ecrf-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
      <div className="ecrf-demo-banner"><span className="ecrf-demo-banner__dot" /><strong>Demo data</strong><p>All forms and sample measurements are fictional UI examples, not patient records or clinical findings.</p></div>

      <section className="ecrf-summary-grid" aria-label="eCRF summary">
        {ecrfSummary.map((item) => {
          const Icon = summaryIcons[item.key]
          return <Card key={item.key} className="ecrf-summary-card"><div className="ecrf-summary-card__top"><span className={`ecrf-summary-card__icon ecrf-summary-card__icon--${item.key}`}><Icon size={18} aria-hidden="true" /></span><span className="ecrf-summary-card__demo">Demo total</span></div><strong className="ecrf-summary-card__value">{item.value}</strong><span className="ecrf-summary-card__label">{item.label}</span><span className="ecrf-summary-card__detail">{item.detail}</span></Card>
        })}
      </section>

      <Card padding="none" className="ecrf-list-panel">
        <div className="ecrf-list-panel__header"><div><h2>Case Report Forms <span className="ecrf-demo-pill">FICTIONAL</span></h2><p>Sample structured forms linked to demo trials, participants, and visits.</p></div><span className="ecrf-results-count" aria-live="polite">{visibleForms.length} of {forms.length} forms</span></div>
        <div className="ecrf-filter-bar" role="search" aria-label="Filter eCRF forms">
          <label className="ecrf-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search form ID, form name, or participant ID</span><input type="search" value={filters.query} onChange={(event) => updateFilter('query', event.target.value)} placeholder="Search form, name, or participant ID..." /></label>
          <label className="ecrf-select-filter"><span className="sr-only">Filter by clinical trial</span><select value={filters.trialId} onChange={(event) => updateFilter('trialId', event.target.value)}><option value="">All trials</option>{initialTrials.map((trial) => <option key={trial.id} value={trial.id}>{trial.id} · {trial.name}</option>)}</select></label>
          <label className="ecrf-select-filter"><span className="sr-only">Filter by form status</span><select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}><option value="">All statuses</option>{ecrfStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <Button variant="outline" size="small" disabled={!hasFilters} onClick={clearFilters}><FilterX size={15} aria-hidden="true" /> Clear filters</Button>
        </div>

        {visibleForms.length ? <><p className="ecrf-table-hint">Swipe or scroll horizontally to view all form details.</p><div className="ecrf-table-scroll" tabIndex="0" role="region" aria-label="eCRF forms table, horizontally scrollable"><table className="ecrf-table">
          <thead><tr><th scope="col">Form ID</th><th scope="col">Form Name</th><th scope="col">Clinical Trial</th><th scope="col">Participant ID</th><th scope="col">Visit</th><th scope="col">Created Date</th><th scope="col">Last Updated</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
          <tbody>{visibleForms.map((form) => <tr key={form.id}>
            <td className="ecrf-table__id">{form.id}<small>DEMO</small></td>
            <td className="ecrf-table__name">{form.formName}</td>
            <td className="ecrf-table__trial"><span>{form.trialName}</span><small>{form.trialId}</small></td>
            <td className="ecrf-table__participant">{form.participantId}</td>
            <td>{form.visitType}<small className="ecrf-table__subtext">{form.visitId}</small></td>
            <td className="ecrf-table__date">{formatTrialDate(form.createdDate)}</td><td className="ecrf-table__date">{formatTrialDate(form.lastUpdated)}</td><td><StatusBadge status={form.status} /></td>
            <td><div className="ecrf-row-actions"><RowAction label="View" icon={Eye} onClick={() => setModal({ type: 'view', id: form.id })} /><RowAction label="Edit" icon={Pencil} onClick={() => setModal({ type: 'edit', id: form.id })} /><RowAction label="Delete" icon={Trash2} danger onClick={() => setModal({ type: 'delete', id: form.id })} /></div></td>
          </tr>)}</tbody>
        </table></div></> : <EmptyState className="ecrf-empty-state" title="No forms found" description="Try a different search or adjust the selected filters." icon={ClipboardList} action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>} />}
      </Card>

      {modal?.type === 'add' && <ECRFFormModal onClose={() => setModal(null)} onSave={saveForm} />}
      {modal?.type === 'edit' && activeForm && <ECRFFormModal form={activeForm} onClose={() => setModal(null)} onSave={saveForm} />}
      {modal?.type === 'view' && activeForm && <ECRFDetailsModal form={activeForm} onClose={() => setModal(null)} onEdit={(form) => setModal({ type: 'edit', id: form.id })} onTransition={transitionForm} />}
      {modal?.type === 'delete' && activeForm && <TrialModal title="Delete Demo eCRF Form?" description="This action only changes the current page's local demo state." onClose={() => setModal(null)} size="small"><div className="ecrf-delete-confirm"><p>Remove <strong>{activeForm.formName}</strong> ({activeForm.id}) from the visible demo forms?</p><p>This fictional form will be removed from the current page session only.</p><div className="trial-modal__footer"><Button variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button variant="danger" onClick={deleteForm}><Trash2 size={15} aria-hidden="true" /> Delete form</Button></div></div></TrialModal>}
    </main>
  )
}
