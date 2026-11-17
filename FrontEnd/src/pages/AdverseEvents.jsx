import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  ShieldAlert,
  X
} from 'lucide-react'
import api from '../api/axiosInstance'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import TrialModal from '../components/trials/TrialModal.jsx'
import './AdverseEvents.css'

const fallbackEvents = [
  {
    id: 1,
    trialCode: 'CT-2024-001',
    participantCode: 'P-101',
    eventTerm: 'Mild Gastric Discomfort & Acidity',
    onsetDate: '2026-10-28',
    resolvedDate: '2026-11-02',
    severity: 'Mild',
    isSae: false,
    causality: 'Possible',
    outcome: 'Recovered',
    reportedDate: '2026-10-29',
    ndctReported: true,
    actionTaken: 'Advised post-meal drug administration with lukewarm water',
    details: 'Patient reported slight heartburn when taken on empty stomach. Resolved completely.'
  },
  {
    id: 2,
    trialCode: 'CT-2024-001',
    participantCode: 'P-102',
    eventTerm: 'Severe Allergic Urticaria & Angioedema',
    onsetDate: '2026-11-14',
    severity: 'Severe',
    isSae: true,
    seriousnessCriteria: 'Hospitalization',
    causality: 'Probable',
    outcome: 'Ongoing',
    reportedDate: '2026-11-15',
    ndctReported: false,
    actionTaken: 'Study Drug Discontinued',
    details: 'Admitted to observation ward. Intravenous antihistamines given. 24h NDCT regulatory alert active.'
  }
]

export default function AdverseEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [saeOnly, setSaeOnly] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const [formData, setFormData] = useState({
    trialCode: 'CT-2024-001',
    participantCode: '',
    eventTerm: '',
    onsetDate: '',
    severity: 'Mild',
    isSae: false,
    seriousnessCriteria: 'Hospitalization',
    causality: 'Possible',
    outcome: 'Ongoing',
    actionTaken: '',
    details: '',
    ndctReported: false
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setLoading(true)
    try {
      const res = await api.get('/api/adverse-events')
      if (res.data && res.data.length > 0) {
        setEvents(res.data)
      } else {
        setEvents(fallbackEvents)
      }
    } catch {
      setEvents(fallbackEvents)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch =
        e.eventTerm?.toLowerCase().includes(search.toLowerCase()) ||
        e.participantCode?.toLowerCase().includes(search.toLowerCase()) ||
        e.trialCode?.toLowerCase().includes(search.toLowerCase())

      const matchesSeverity = severityFilter === 'ALL' || e.severity === severityFilter
      const matchesSae = !saeOnly || e.isSae

      return matchesSearch && matchesSeverity && matchesSae
    })
  }, [events, search, severityFilter, saeOnly])

  const stats = useMemo(() => {
    const total = events.length
    const saeCount = events.filter(e => e.isSae).length
    const ongoing = events.filter(e => e.outcome === 'Ongoing').length
    const ndctPending = events.filter(e => e.isSae && !e.ndctReported).length
    return { total, saeCount, ongoing, ndctPending }
  }, [events])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await api.post('/api/adverse-events', formData)
      setEvents(prev => [res.data, ...prev])
    } catch {
      const newEntry = { ...formData, id: Date.now() }
      setEvents(prev => [newEntry, ...prev])
    }
    setShowModal(false)
    setFormData({
      trialCode: 'CT-2024-001',
      participantCode: '',
      eventTerm: '',
      onsetDate: '',
      severity: 'Mild',
      isSae: false,
      seriousnessCriteria: 'Hospitalization',
      causality: 'Possible',
      outcome: 'Ongoing',
      actionTaken: '',
      details: '',
      ndctReported: false
    })
  }

  return (
    <div className="ae-page">
      <PageHeader
        eyebrow="Safety & Pharmacovigilance"
        title="Adverse Event Management"
        description="Monitor, record, and report Adverse Events (AE) and Serious Adverse Events (SAE) compliant with NDCT Rules 2019."
      >
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Report Adverse Event
        </Button>
      </PageHeader>

      {stats.ndctPending > 0 && (
        <div className="ae-regulatory-banner">
          <ShieldAlert size={24} color="#d97706" />
          <div>
            <h4>Immediate Regulatory Action Required (NDCT Rules 2019)</h4>
            <p>
              There are <strong>{stats.ndctPending} Serious Adverse Event(s)</strong> awaiting 24-hour mandatory submission to the CDSCO and Institutional Ethics Committee.
            </p>
          </div>
        </div>
      )}

      <div className="ae-summary-grid">
        <div className="ae-summary-card">
          <div className="ae-summary-card__top">
            <span className="ae-summary-card__icon ae-summary-card__icon--info">
              <AlertTriangle size={18} />
            </span>
          </div>
          <div className="ae-summary-card__value">{stats.total}</div>
          <div className="ae-summary-card__label">Total Adverse Events</div>
        </div>

        <div className="ae-summary-card">
          <div className="ae-summary-card__top">
            <span className="ae-summary-card__icon ae-summary-card__icon--danger">
              <ShieldAlert size={18} />
            </span>
          </div>
          <div className="ae-summary-card__value">{stats.saeCount}</div>
          <div className="ae-summary-card__label">Serious Adverse Events (SAE)</div>
        </div>

        <div className="ae-summary-card">
          <div className="ae-summary-card__top">
            <span className="ae-summary-card__icon ae-summary-card__icon--warning">
              <Clock size={18} />
            </span>
          </div>
          <div className="ae-summary-card__value">{stats.ongoing}</div>
          <div className="ae-summary-card__label">Active / Ongoing</div>
        </div>

        <div className="ae-summary-card">
          <div className="ae-summary-card__top">
            <span className="ae-summary-card__icon ae-summary-card__icon--success">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="ae-summary-card__value">{stats.total - stats.ongoing}</div>
          <div className="ae-summary-card__label">Resolved / Recovered</div>
        </div>
      </div>

      <div className="ae-filter-bar">
        <div className="ae-search-input">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search event, participant, or trial..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="ae-filter-select"
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
          >
            <option value="ALL">All Severities</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={saeOnly}
              onChange={e => setSaeOnly(e.target.checked)}
            />
            SAE Only
          </label>
        </div>
      </div>

      <div className="ae-table-container">
        {filteredEvents.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No adverse events found"
            description="No adverse event reports match your current search criteria."
          />
        ) : (
          <table className="ae-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Trial Code</th>
                <th>Event Term</th>
                <th>Severity</th>
                <th>Classification</th>
                <th>Causality</th>
                <th>Outcome</th>
                <th>NDCT 2019</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <td><strong>{event.participantCode}</strong></td>
                  <td>{event.trialCode}</td>
                  <td>{event.eventTerm}</td>
                  <td>
                    <StatusBadge
                      status={event.severity === 'Severe' ? 'danger' : event.severity === 'Moderate' ? 'warning' : 'info'}
                      label={event.severity}
                    />
                  </td>
                  <td>
                    {event.isSae ? (
                      <span className="ae-badge-sae">SAE</span>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Non-Serious</span>
                    )}
                  </td>
                  <td>{event.causality}</td>
                  <td>
                    <StatusBadge
                      status={event.outcome === 'Ongoing' ? 'warning' : 'success'}
                      label={event.outcome}
                    />
                  </td>
                  <td>
                    {event.isSae ? (
                      event.ndctReported ? (
                        <StatusBadge status="approved" label="Reported (24h)" />
                      ) : (
                        <StatusBadge status="rejected" label="Pending (Urgent)" />
                      )
                    ) : (
                      <span style={{ color: '#94a3b8' }}>N/A</span>
                    )}
                  </td>
                  <td>
                    <Button size="small" variant="ghost" onClick={() => setSelectedEvent(event)}>
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <TrialModal title="Report Adverse Event (Safety Form)" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Trial Code *</label>
                <input
                  type="text"
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  value={formData.trialCode}
                  onChange={e => setFormData({ ...formData, trialCode: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Participant Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. P-101"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  value={formData.participantCode}
                  onChange={e => setFormData({ ...formData, participantCode: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Adverse Event Term *</label>
              <input
                type="text"
                required
                placeholder="e.g. Skin Rash, Elevated Bilirubin, Severe Dyspepsia"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                value={formData.eventTerm}
                onChange={e => setFormData({ ...formData, eventTerm: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Onset Date *</label>
                <input
                  type="date"
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  value={formData.onsetDate}
                  onChange={e => setFormData({ ...formData, onsetDate: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Severity</label>
                <select
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Life-Threatening">Life-Threatening</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Causality</label>
                <select
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  value={formData.causality}
                  onChange={e => setFormData({ ...formData, causality: e.target.value })}
                >
                  <option value="Definite">Definite</option>
                  <option value="Probable">Probable</option>
                  <option value="Possible">Possible</option>
                  <option value="Unlikely">Unlikely</option>
                  <option value="Not Related">Not Related</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#dc2626' }}>
                <input
                  type="checkbox"
                  checked={formData.isSae}
                  onChange={e => setFormData({ ...formData, isSae: e.target.checked })}
                />
                Mark as Serious Adverse Event (SAE)
              </label>
              {formData.isSae && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Seriousness Criteria</label>
                  <select
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                    value={formData.seriousnessCriteria}
                    onChange={e => setFormData({ ...formData, seriousnessCriteria: e.target.value })}
                  >
                    <option value="Hospitalization">Inpatient Hospitalization</option>
                    <option value="Life-Threatening">Life-Threatening</option>
                    <option value="Persistent Disability">Persistent Disability / Incapacity</option>
                    <option value="Congenital Anomaly">Congenital Anomaly</option>
                    <option value="Death">Death</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Action Taken</label>
              <input
                type="text"
                placeholder="e.g. Dose altered, study drug interrupted, symptomatic treatment provided"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                value={formData.actionTaken}
                onChange={e => setFormData({ ...formData, actionTaken: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Clinical Narrative / Details</label>
              <textarea
                rows={3}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                value={formData.details}
                onChange={e => setFormData({ ...formData, details: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Safety Report
              </Button>
            </div>
          </form>
        </TrialModal>
      )}

      {selectedEvent && (
        <TrialModal title={`Adverse Event Details - ${selectedEvent.participantCode}`} onClose={() => setSelectedEvent(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div><strong>Event Term:</strong> {selectedEvent.eventTerm}</div>
            <div><strong>Trial:</strong> {selectedEvent.trialCode}</div>
            <div><strong>Onset Date:</strong> {selectedEvent.onsetDate}</div>
            <div><strong>Severity:</strong> {selectedEvent.severity}</div>
            <div><strong>Is SAE:</strong> {selectedEvent.isSae ? 'YES (Serious Adverse Event)' : 'No'}</div>
            {selectedEvent.seriousnessCriteria && <div><strong>Criteria:</strong> {selectedEvent.seriousnessCriteria}</div>}
            <div><strong>Causality:</strong> {selectedEvent.causality}</div>
            <div><strong>Outcome:</strong> {selectedEvent.outcome}</div>
            <div><strong>Action Taken:</strong> {selectedEvent.actionTaken || 'None'}</div>
            <div><strong>Details:</strong> {selectedEvent.details}</div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={() => setSelectedEvent(null)}>Close</Button>
            </div>
          </div>
        </TrialModal>
      )}
    </div>
  )
}

