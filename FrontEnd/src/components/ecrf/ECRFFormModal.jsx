import { useMemo, useState } from 'react'
import { Save } from 'lucide-react'
import Button from '../Button.jsx'
import TrialModal from '../trials/TrialModal.jsx'
import { initialParticipants } from '../../data/participantsData.js'
import { initialTrials } from '../../data/trialsData.js'
import { initialVisits } from '../../data/visitsData.js'
import { validateEcrf } from '../../utils/ecrfManagement.js'

function initialValues(form) {
  return form ? {
    formName: form.formName,
    trialId: form.trialId,
    participantId: form.participantId,
    visitId: form.visitId,
    description: form.description,
    ...form.measurements,
    systolic: String(form.measurements.systolic),
    diastolic: String(form.measurements.diastolic),
    heartRate: String(form.measurements.heartRate),
    bodyTemperature: String(form.measurements.bodyTemperature),
    weight: String(form.measurements.weight),
  } : {
    formName: '', trialId: '', participantId: '', visitId: '', description: '',
    systolic: '', diastolic: '', heartRate: '', bodyTemperature: '', weight: '', symptoms: '', investigatorNotes: '',
  }
}

function TextField({ id, name = id, label, value, onChange, error, type = 'text', hint, ...props }) {
  return (
    <div className="ecrf-field">
      <label htmlFor={id}>{label}<span aria-hidden="true"> *</span></label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} required aria-invalid={Boolean(error)} aria-describedby={[error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined} {...props} />
      {hint && <small className="ecrf-field__hint" id={`${id}-hint`}>{hint}</small>}
      {error && <span className="ecrf-field__error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}

function SelectField({ id, name, label, value, options, onChange, error, placeholder }) {
  return (
    <div className="ecrf-field">
      <label htmlFor={id}>{label}<span aria-hidden="true"> *</span></label>
      <select id={id} name={name} value={value} onChange={onChange} required aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <span className="ecrf-field__error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}

export default function ECRFFormModal({ form, onClose, onSave }) {
  const [values, setValues] = useState(() => initialValues(form))
  const [submitted, setSubmitted] = useState(false)
  const errors = validateEcrf(values)
  const editing = Boolean(form)
  const participants = useMemo(() => initialParticipants.filter((participant) => !values.trialId || participant.trialId === values.trialId), [values.trialId])
  const visits = useMemo(() => initialVisits.filter((visit) => (!values.trialId || visit.trialId === values.trialId) && (!values.participantId || visit.participantId === values.participantId)), [values.trialId, values.participantId])

  function updateValue(event) {
    const { name, value } = event.target
    setValues((current) => {
      const next = { ...current, [name]: value }
      if (name === 'trialId') {
        const participant = initialParticipants.find((item) => item.id === current.participantId)
        if (participant && participant.trialId !== value) next.participantId = ''
        next.visitId = ''
      }
      if (name === 'participantId') {
        const participant = initialParticipants.find((item) => item.id === value)
        next.trialId = participant?.trialId ?? current.trialId
        next.visitId = ''
      }
      if (name === 'visitId') {
        const visit = initialVisits.find((item) => item.id === value)
        if (visit) {
          next.participantId = visit.participantId
          next.trialId = visit.trialId
        }
      }
      return next
    })
  }

  function errorFor(name) {
    return submitted ? errors[name] : ''
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    onSave({ ...values, formName: values.formName.trim(), description: values.description.trim() })
  }

  return (
    <TrialModal title={editing ? 'Edit eCRF Form' : 'Create New eCRF Form'} description={editing ? `Update the fictional demo form ${form.id}.` : 'Create a fictional case report form in this local demo session.'} onClose={onClose} size="large">
      <form className="ecrf-form" onSubmit={handleSubmit} noValidate>
        <section className="ecrf-form-section" aria-labelledby="ecrf-metadata-heading">
          <div className="ecrf-form-section__heading"><span className="ecrf-form-section__number">01</span><div><h3 id="ecrf-metadata-heading">Form Details</h3><p>Link this sample form to a demo trial, participant, and visit.</p></div></div>
          <div className="ecrf-form-grid">
            <TextField id="ecrf-form-name" name="formName" label="Form Name" value={values.formName} onChange={updateValue} error={errorFor('formName')} data-modal-autofocus="" autoComplete="off" />
            <SelectField id="ecrf-trial" name="trialId" label="Associated Trial" value={values.trialId} onChange={updateValue} error={errorFor('trialId')} placeholder="Select a trial" options={initialTrials.map((trial) => ({ value: trial.id, label: `${trial.id} · ${trial.name}` }))} />
            <SelectField id="ecrf-participant" name="participantId" label="Participant" value={values.participantId} onChange={updateValue} error={errorFor('participantId')} placeholder="Select a participant" options={participants.map((participant) => ({ value: participant.id, label: `${participant.fullName} · ${participant.id}` }))} />
            <SelectField id="ecrf-visit" name="visitId" label="Visit" value={values.visitId} onChange={updateValue} error={errorFor('visitId')} placeholder="Select a visit" options={visits.map((visit) => ({ value: visit.id, label: `${visit.visitType} · ${visit.visitDate} · ${visit.id}` }))} />
            <div className="ecrf-field ecrf-field--full"><label htmlFor="ecrf-description">Form Description<span aria-hidden="true"> *</span></label><textarea id="ecrf-description" name="description" value={values.description} onChange={updateValue} rows="2" required aria-invalid={Boolean(errorFor('description'))} aria-describedby={errorFor('description') ? 'ecrf-description-error' : undefined} />{errorFor('description') && <span className="ecrf-field__error" id="ecrf-description-error">{errorFor('description')}</span>}</div>
          </div>
        </section>

        <section className="ecrf-form-section" aria-labelledby="ecrf-measurements-heading">
          <div className="ecrf-form-section__heading"><span className="ecrf-form-section__number">02</span><div><h3 id="ecrf-measurements-heading">Structured Data Collection</h3><p>All sample measurements below are fictional UI values, not clinical findings.</p></div></div>
          <div className="ecrf-form-grid ecrf-form-grid--measurements">
            <TextField id="ecrf-systolic" name="systolic" label="Blood Pressure · Systolic" type="number" min="50" max="250" step="1" value={values.systolic} onChange={updateValue} error={errorFor('systolic')} hint="Demo range: 50–250 mmHg" />
            <TextField id="ecrf-diastolic" name="diastolic" label="Blood Pressure · Diastolic" type="number" min="30" max="150" step="1" value={values.diastolic} onChange={updateValue} error={errorFor('diastolic')} hint="Demo range: 30–150 mmHg" />
            <TextField id="ecrf-heart-rate" name="heartRate" label="Heart Rate" type="number" min="30" max="220" step="1" value={values.heartRate} onChange={updateValue} error={errorFor('heartRate')} hint="Demo range: 30–220 bpm" />
            <TextField id="ecrf-temperature" name="bodyTemperature" label="Body Temperature" type="number" min="25" max="45" step="0.1" value={values.bodyTemperature} onChange={updateValue} error={errorFor('bodyTemperature')} hint="Demo range: 25–45 °C" />
            <TextField id="ecrf-weight" name="weight" label="Weight" type="number" min="1" max="500" step="0.1" value={values.weight} onChange={updateValue} error={errorFor('weight')} hint="Demo range: 1–500 kg" />
            <div className="ecrf-field ecrf-field--full"><label htmlFor="ecrf-symptoms">Symptoms / Observations</label><textarea id="ecrf-symptoms" name="symptoms" value={values.symptoms} onChange={updateValue} rows="2" /></div>
            <div className="ecrf-field ecrf-field--full"><label htmlFor="ecrf-investigator-notes">Investigator Notes</label><textarea id="ecrf-investigator-notes" name="investigatorNotes" value={values.investigatorNotes} onChange={updateValue} rows="2" /></div>
          </div>
        </section>
        <p className="ecrf-demo-note">Demo only. Form data stays in temporary local page state and is not saved permanently. Sample values are not medical records or clinical findings.</p>
        <div className="trial-modal__footer"><Button variant="outline" type="button" onClick={onClose}>Cancel</Button><Button type="submit"><Save size={16} aria-hidden="true" /> {editing ? 'Save Changes' : 'Create Form'}</Button></div>
      </form>
    </TrialModal>
  )
}
