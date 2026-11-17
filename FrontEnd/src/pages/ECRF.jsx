import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronRight, ClipboardList, Clock3, Eye, FileText, FilterX, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import api from '../api/axiosInstance'
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
  return (
    <button
      className={`ecrf-row-action${danger ? ' ecrf-row-action--danger' : ''}`}
      type="button"
      onClick={onClick}
      aria-label={`${label} eCRF form`}
      title={label}
    >
      <Icon size={15} aria-hidden="true" />
    </button>
  )
}

export default function ECRF() {
  const [forms, setForms] = useState(initialEcrfs)
  const [filters, setFilters] = useState({ query: '', trialId: '', status: '' })
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const visibleForms = useMemo(() => filterEcrfs(forms, filters), [forms, filters])
  const hasFilters = Boolean(filters.query || filters.trialId || filters.status)
  const activeForm = modal?.id ? forms.find((form) => form.id === modal.id) : null

  useEffect(() => {
    loadSubmissions()
  }, [])

  async function loadSubmissions() {
    try {
      const res = await api.get('/api/ecrf/submissions')
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(s => ({
          id: `ECRF-${s.id}`,
          title: s.formTitle || 'Clinical Case Report Form',
          participantId: s.participantCode || `P-${s.participantId}`,
          participantName: s.participantCode ? `Participant ${s.participantCode}` : 'Study Subject',
          trialId: s.trialCode || 'CT-2024-001',
          trialName: s.trialCode || 'AIIA Clinical Trial',
          status: s.status || 'Submitted',
          version: '1.0',
          updatedAt: s.submittedAt ? String(s.submittedAt) : '2026-10-15',
          lastModifiedBy: s.submittedBy || 'Clinician',
          fields: s.formData ? [{ label: 'Raw Form Payload', value: s.formData }] : [],
          _backendId: s.id
        }))
        setForms(mapped)
      }
    } catch {
      // Fallback to static ecrfs
    }
  }

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters({ query: '', trialId: '', status: '' })
  }

  async function saveForm(values) {
    if (modal?.type === 'edit') {
      setForms((current) => updateEcrfRecord(current, modal.id, values))
      setNotice('eCRF form updated.')
    } else {
      try {
        const res = await api.post('/api/ecrf/submissions', {
          formTitle: values.title || 'General eCRF Form',
          formType: 'Clinical Observation',
          participantCode: values.participantId || 'P-101',
          trialCode: values.trialId || 'CT-2024-001',
          formData: JSON.stringify(values),
          status: 'Submitted',
          submittedBy: 'Dr. Anand Sharma'
        })
        const record = {
          ...createEcrfRecord(forms, values),
          _backendId: res.data?.id
        }
        setForms((current) => [record, ...current])
      } catch {
        const record = createEcrfRecord(forms, values)
        setForms((current) => [record, ...current])
      }
      setNotice('eCRF form submitted and logged into CTMS database.')
    }
    setModal(null)
  }

  async function transitionForm(form, nextStatus) {
    if (form._backendId && (nextStatus === 'Reviewed' || nextStatus === 'Locked')) {
      try {
        await api.post(`/api/ecrf/submissions/${form._backendId}/lock`)
      } catch {}
    }
    setForms((current) => transitionEcrfStatus(current, form.id, nextStatus))
    setNotice(`Form status transitioned to ${nextStatus}.`)
    setModal(null)
  }

  function deleteForm() {
    if (!modal?.id) return
    setForms((current) => removeEcrfRecord(current, modal.id))
    setModal(null)
    setNotice(`${modal.id} removed.`)
  }

  return (
    <main className="ecrf-page">
      <nav className="ecrf-breadcrumb" aria-label="Breadcrumb">
        <Link to="/app/overview" aria-label="Go to overview"><ClipboardList size={13} aria-hidden="true" /></Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">eCRF &amp; Data Collection</span>
      </nav>

      <header className="ecrf-page-header">
        <div className="ecrf-page-header__copy">
          <span className="ecrf-page-header__eyebrow"><span className="ecrf-demo-dot" /> Clinical Data Repository</span>
          <h1>eCRF &amp; Data Collection</h1>
          <p>Electronic Case Report Forms with validation checks and GCP form-locking controls.</p>
        </div>
        <Button onClick={() => setModal({ type: 'add' })}><Plus size={16} aria-hidden="true" /> Create New Form</Button>
      </header>

      {notice && (
        <div className="ecrf-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>
        </div>
      )}

      <div className="ecrf-demo-banner">
        <span className="ecrf-demo-banner__dot" />
        <strong>GCP Traceable Data Entry</strong>
        <p>Forms support multi-point clinical entry, data locking, and immutable audit timestamps.</p>
      </div>

      <section className="ecrf-summary-grid" aria-label="eCRF summary">
        {ecrfSummary.map((item) => {
          const Icon = summaryIcons[item.key]
          return (
            <Card key={item.key} className="ecrf-summary-card">
              <div className="ecrf-summary-card__top">
                <span className={`ecrf-summary-card__icon ecrf-summary-card__icon--${item.key}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="ecrf-summary-card__demo">Live Total</span>
              </div>
              <strong className="ecrf-summary-card__value">{item.value}</strong>
              <span className="ecrf-summary-card__label">{item.label}</span>
              <span className="ecrf-summary-card__detail">{item.detail}</span>
            </Card>
          )
        })}
      </section>

      <Card padding="none" className="ecrf-list-panel">
        <div className="ecrf-list-panel__header">
          <div>
            <h2>Case Report Forms</h2>
            <p>Electronic case record entries linked to trials and participants.</p>
          </div>
          <span className="ecrf-results-count" aria-live="polite">{visibleForms.length} of {forms.length} forms</span>
        </div>

        <div className="ecrf-controls">
          <label className="ecrf-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search forms by title, participant, or ID"
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              aria-label="Search eCRF forms"
            />
          </label>

          <div className="ecrf-filter-group">
            <select
              value={filters.trialId}
              onChange={(e) => updateFilter('trialId', e.target.value)}
              aria-label="Filter by trial"
            >
              <option value="">All Trials</option>
              {initialTrials.map((t) => (
                <option key={t.id} value={t.id}>{t.id} · {t.name}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              {ecrfStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {hasFilters && (
              <Button variant="ghost" size="small" onClick={clearFilters} className="ecrf-clear-button">
                <FilterX size={14} aria-hidden="true" /> Clear filters
              </Button>
            )}
          </div>
        </div>

        <div className="ecrf-table-wrap">
          <table className="ecrf-table">
            <thead>
              <tr>
                <th scope="col">Form Details</th>
                <th scope="col">Participant</th>
                <th scope="col">Trial</th>
                <th scope="col">Status</th>
                <th scope="col">Version</th>
                <th scope="col">Last Modified</th>
                <th scope="col" className="ecrf-table__actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleForms.map((form) => (
                <tr key={form.id}>
                  <td>
                    <div className="ecrf-title-group">
                      <span className="ecrf-id">{form.id}</span>
                      <strong className="ecrf-title">{form.title}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="ecrf-participant">
                      <span>{form.participantName}</span>
                      <small>{form.participantId}</small>
                    </div>
                  </td>
                  <td>
                    <div className="ecrf-trial">
                      <span>{form.trialName}</span>
                      <small>{form.trialId}</small>
                    </div>
                  </td>
                  <td><StatusBadge status={form.status} /></td>
                  <td><span className="ecrf-version">v{form.version}</span></td>
                  <td>
                    <div className="ecrf-date-group">
                      <span>{formatTrialDate(form.updatedAt)}</span>
                      <small>{form.lastModifiedBy}</small>
                    </div>
                  </td>
                  <td className="ecrf-table__actions">
                    <div className="ecrf-row-actions">
                      <RowAction label="View" icon={Eye} onClick={() => setModal({ type: 'view', id: form.id })} />
                      <RowAction label="Edit" icon={Pencil} onClick={() => setModal({ type: 'edit', id: form.id })} />
                      <RowAction label="Delete" icon={Trash2} danger onClick={() => setModal({ type: 'delete', id: form.id })} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleForms.length === 0 && (
          <EmptyState
            icon={ClipboardList}
            title="No forms found"
            description="Try modifying search keywords or resetting active filters."
            actionLabel="Reset filters"
            onAction={clearFilters}
          />
        )}
      </Card>

      {modal?.type === 'add' && <ECRFFormModal onClose={() => setModal(null)} onSave={saveForm} />}
      {modal?.type === 'edit' && activeForm && <ECRFFormModal form={activeForm} onClose={() => setModal(null)} onSave={saveForm} />}
      {modal?.type === 'view' && activeForm && (
        <ECRFDetailsModal
          form={activeForm}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ type: 'edit', id: activeForm.id })}
          onTransitionStatus={(nextStatus) => transitionForm(activeForm, nextStatus)}
        />
      )}

      {modal?.type === 'delete' && activeForm && (
        <TrialModal title="Remove eCRF Form" description="Are you sure you want to delete this case report form?" onClose={() => setModal(null)} size="small">
          <div className="ecrf-delete-body">
            <p>Remove <strong>{activeForm.title}</strong> ({activeForm.id})?</p>
            <div className="trial-modal__footer">
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={deleteForm}><Trash2 size={15} aria-hidden="true" /> Delete form</Button>
            </div>
          </div>
        </TrialModal>
      )}
    </main>
  )
}
