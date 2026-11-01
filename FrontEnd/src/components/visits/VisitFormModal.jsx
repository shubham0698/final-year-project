import { useState } from 'react'
import { AlertTriangle, Save } from 'lucide-react'
import Button from '../Button.jsx'
import TrialModal from '../trials/TrialModal.jsx'
import { initialParticipants } from '../../data/participantsData.js'
import { initialTrials } from '../../data/trialsData.js'
import { visitStatuses, visitTypes } from '../../data/visitsData.js'
import { isVisitBeforeEnrollment, validateVisit } from '../../utils/visitManagement.js'

function initialValues(visit) {
  return visit ? {
    participantId: visit.participantId,
    trialId: visit.trialId,
    visitType: visit.visitType,
    visitDate: visit.visitDate,
    visitTime: visit.visitTime,
    researcher: visit.researcher,
    status: visit.status,
    notes: visit.notes ?? '',
  } : {
    participantId: '', trialId: '', visitType: 'Screening', visitDate: '', visitTime: '',
    researcher: '', status: 'Scheduled', notes: '',
  }
}

function SelectField({ id, name, label, value, options, onChange, error, required = true, placeholder }) {
  return (
    <div className="visit-form-field">
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <select id={id} name={name} value={value} onChange={onChange} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <span className="visit-form-error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}

function TextField({ id, name = id, label, value, onChange, error, type = 'text', required = true, ...props }) {
  return (
    <div className="visit-form-field">
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <span className="visit-form-error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}

export default function VisitFormModal({ visit, onClose, onSave }) {
  const [values, setValues] = useState(() => initialValues(visit))
  const [submitted, setSubmitted] = useState(false)
  const errors = validateVisit(values)
  const editing = Boolean(visit)
  const dateBeforeEnrollment = isVisitBeforeEnrollment(values)

  function updateValue(event) {
    const { name, value } = event.target
    setValues((current) => {
      const next = { ...current, [name]: value }
      if (name === 'participantId') {
        const participant = initialParticipants.find((item) => item.id === value)
        next.trialId = participant?.trialId ?? ''
      }
      return next
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    onSave(values)
  }

  const errorFor = (name) => submitted ? errors[name] : ''

  return (
    <TrialModal title={editing ? 'Edit Visit' : 'Schedule Visit'} description={editing ? `Update the local demo visit ${visit.id}.` : 'Schedule a fictional visit in this local demo session.'} onClose={onClose} size="large">
      <form className="visit-form" onSubmit={handleSubmit} noValidate>
        <div className="visit-form-grid">
          <SelectField id="visit-participant" name="participantId" label="Participant" value={values.participantId} onChange={updateValue} error={errorFor('participantId')} placeholder="Select a participant" options={initialParticipants.map((participant) => ({ value: participant.id, label: `${participant.fullName} · ${participant.id}` }))} />
          <SelectField id="visit-trial" name="trialId" label="Associated Trial" value={values.trialId} onChange={updateValue} error={errorFor('trialId')} placeholder="Select a trial" options={initialTrials.map((trial) => ({ value: trial.id, label: `${trial.id} · ${trial.name}` }))} />
          <SelectField id="visit-type" name="visitType" label="Visit Type" value={values.visitType} onChange={updateValue} error={errorFor('visitType')} options={visitTypes.map((visitType) => ({ value: visitType, label: visitType }))} />
          <TextField id="visit-date" name="visitDate" label="Visit Date" type="date" value={values.visitDate} onChange={updateValue} error={errorFor('visitDate')} data-modal-autofocus="" />
          <TextField id="visit-time" name="visitTime" label="Visit Time" type="time" value={values.visitTime} onChange={updateValue} error={errorFor('visitTime')} />
          <TextField id="visit-researcher" name="researcher" label="Assigned Researcher" value={values.researcher} onChange={updateValue} error={errorFor('researcher')} autoComplete="off" />
          <SelectField id="visit-status" name="status" label="Visit Status" value={values.status} onChange={updateValue} error={errorFor('status')} options={visitStatuses.map((status) => ({ value: status, label: status }))} />
          <div className="visit-form-field visit-form-field--full">
            <label htmlFor="visit-notes">Notes <span>(optional)</span></label>
            <textarea id="visit-notes" name="notes" value={values.notes} onChange={updateValue} rows="3" />
          </div>
        </div>
        {dateBeforeEnrollment && <p className="visit-date-warning" role="status"><AlertTriangle size={16} aria-hidden="true" /><span>This date is earlier than the selected participant's recorded enrollment date. Review the date before scheduling.</span></p>}
        <p className="visit-form-demo-note">Demo only. Changes remain in temporary local page state and are not saved permanently.</p>
        <div className="trial-modal__footer">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit"><Save size={16} aria-hidden="true" /> {editing ? 'Save Changes' : 'Schedule Visit'}</Button>
        </div>
      </form>
    </TrialModal>
  )
}
