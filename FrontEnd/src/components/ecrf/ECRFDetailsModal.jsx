import { ClipboardList, Edit3, FileCheck2, Send, Save } from 'lucide-react'
import Button from '../Button.jsx'
import StatusBadge from '../StatusBadge.jsx'
import TrialModal from '../trials/TrialModal.jsx'
import { canTransitionEcrfStatus } from '../../utils/ecrfManagement.js'
import { formatTrialDate } from '../../utils/trialFormatting.js'

function Detail({ label, children }) {
  return <div className="ecrf-detail"><dt>{label}</dt><dd>{children || '—'}</dd></div>
}

export default function ECRFDetailsModal({ form, onClose, onEdit, onTransition }) {
  const measurements = form.measurements
  return (
    <TrialModal title="eCRF Form Details" description="Fictional demo form · sample values are not clinical findings." onClose={onClose} size="large">
      <div className="ecrf-details">
        <div className="ecrf-details__identity"><div><span className="ecrf-details__id">{form.id}</span><h3>{form.formName}</h3></div><StatusBadge status={form.status} /></div>

        <section className="ecrf-details-section" aria-labelledby="ecrf-detail-metadata"><div className="ecrf-details-section__heading"><ClipboardList size={16} aria-hidden="true" /><h4 id="ecrf-detail-metadata">Form Metadata</h4></div><dl className="ecrf-details-grid">
          <Detail label="Clinical Trial"><span>{form.trialName}</span><small>{form.trialId}</small></Detail>
          <Detail label="Participant"><span>{form.participantName}</span><small>{form.participantId}</small></Detail>
          <Detail label="Visit"><span>{form.visitType} · {formatTrialDate(form.visitDate)}</span><small>{form.visitId}</small></Detail>
          <Detail label="Created Date">{formatTrialDate(form.createdDate)}</Detail>
          <Detail label="Last Updated">{formatTrialDate(form.lastUpdated)}</Detail>
          <Detail label="Form Description">{form.description}</Detail>
        </dl></section>

        <section className="ecrf-details-section" aria-labelledby="ecrf-detail-measurements"><div className="ecrf-details-section__heading"><FileCheck2 size={16} aria-hidden="true" /><h4 id="ecrf-detail-measurements">Captured Sample Data</h4><span>Fictional UI values</span></div><dl className="ecrf-measurements-grid">
          <Detail label="Blood Pressure"><span>{measurements.systolic} / {measurements.diastolic} mmHg</span></Detail>
          <Detail label="Heart Rate">{measurements.heartRate} bpm</Detail>
          <Detail label="Body Temperature">{measurements.bodyTemperature} °C</Detail>
          <Detail label="Weight">{measurements.weight} kg</Detail>
          <Detail label="Symptoms / Observations">{measurements.symptoms || 'No demo observation entered'}</Detail>
          <Detail label="Investigator Notes">{measurements.investigatorNotes || 'No demo notes entered'}</Detail>
        </dl><p className="ecrf-demo-note">These values are synthetic examples for the interface only. They are not patient medical records, clinical findings, or decision support.</p></section>

        <div className="ecrf-review-actions" aria-label="Local review actions">
          <Button variant="outline" disabled={form.status === 'Draft'} onClick={() => onTransition(form, 'Draft')}><Save size={15} aria-hidden="true" /> Save Draft</Button>
          <Button variant="secondary" disabled={!canTransitionEcrfStatus(form.status, 'Submitted') || form.status === 'Submitted'} onClick={() => onTransition(form, 'Submitted')}><Send size={15} aria-hidden="true" /> Submit for Review</Button>
          <Button disabled={!canTransitionEcrfStatus(form.status, 'Reviewed') || form.status === 'Reviewed'} onClick={() => onTransition(form, 'Reviewed')}><FileCheck2 size={15} aria-hidden="true" /> Mark as Reviewed</Button>
        </div>
        <div className="trial-modal__footer"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={() => onEdit(form)}><Edit3 size={15} aria-hidden="true" /> Edit Form</Button></div>
      </div>
    </TrialModal>
  )
}
