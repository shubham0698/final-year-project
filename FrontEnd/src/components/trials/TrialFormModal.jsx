import { useState } from 'react'
import { Save } from 'lucide-react'
import Button from '../Button.jsx'
import { trialPhases, trialStatuses } from '../../data/trialsData.js'
import { validateTrial } from '../../utils/trialManagement.js'
import TrialModal from './TrialModal.jsx'

function makeInitialValues(trial) {
  if (!trial) {
    return {
      name: '',
      researchArea: '',
      phase: trialPhases[0],
      investigator: '',
      startDate: '',
      expectedEndDate: '',
      targetParticipants: '',
      description: '',
      status: 'Pending',
    }
  }

  return {
    name: trial.name,
    researchArea: trial.researchArea,
    phase: trial.phase,
    investigator: trial.investigator,
    startDate: trial.startDate,
    expectedEndDate: trial.expectedEndDate,
    targetParticipants: String(trial.targetParticipants),
    description: trial.description,
    status: trial.status,
  }
}

function TextField({ id, name = id, label, value, onChange, error, type = 'text', required = true, min, step, autoFocus = false }) {
  return (
    <div className="trial-form-field">
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        step={step}
        data-modal-autofocus={autoFocus ? '' : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <span className="trial-form-error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}

export default function TrialFormModal({ trial, onClose, onSave }) {
  const [values, setValues] = useState(() => makeInitialValues(trial))
  const [submitted, setSubmitted] = useState(false)
  const errors = validateTrial(values)
  const editing = Boolean(trial)

  function updateValue(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return

    onSave({
      ...values,
      targetParticipants: Number(values.targetParticipants),
    })
  }

  function fieldError(name) {
    return submitted ? errors[name] : ''
  }

  return (
    <TrialModal
      title={editing ? 'Edit Clinical Trial' : 'Add New Trial'}
      description={editing ? `Update the demo details for ${trial.id}.` : 'Add a sample trial to this local demo view.'}
      onClose={onClose}
      size="large"
    >
      <form className="trial-form" onSubmit={handleSubmit} noValidate>
        <div className="trial-form__grid">
          <TextField id="trial-name" name="name" label="Trial Name" value={values.name} onChange={updateValue} error={fieldError('name')} autoFocus />
          <TextField id="trial-area" name="researchArea" label="Research Area" value={values.researchArea} onChange={updateValue} error={fieldError('researchArea')} />
          <div className="trial-form-field">
            <label htmlFor="trial-phase">Trial Phase <span aria-hidden="true">*</span></label>
            <select id="trial-phase" name="phase" value={values.phase} onChange={updateValue} aria-invalid={Boolean(fieldError('phase'))} aria-describedby={fieldError('phase') ? 'trial-phase-error' : undefined}>
              {trialPhases.map((phase) => <option key={phase}>{phase}</option>)}
            </select>
            {fieldError('phase') && <span className="trial-form-error" id="trial-phase-error">{fieldError('phase')}</span>}
          </div>
          <TextField id="trial-investigator" name="investigator" label="Principal Investigator" value={values.investigator} onChange={updateValue} error={fieldError('investigator')} />
          <TextField id="trial-start-date" name="startDate" label="Start Date" type="date" value={values.startDate} onChange={updateValue} error={fieldError('startDate')} />
          <TextField id="trial-end-date" name="expectedEndDate" label="Expected End Date" type="date" value={values.expectedEndDate} onChange={updateValue} error={fieldError('expectedEndDate')} />
          <TextField id="trial-target-participants" name="targetParticipants" label="Target Participants" type="number" min="1" step="1" value={values.targetParticipants} onChange={updateValue} error={fieldError('targetParticipants')} />
          <div className="trial-form-field">
            <label htmlFor="trial-status">Status <span aria-hidden="true">*</span></label>
            <select id="trial-status" name="status" value={values.status} onChange={updateValue} aria-invalid={Boolean(fieldError('status'))} aria-describedby={fieldError('status') ? 'trial-status-error' : undefined}>
              {trialStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            {fieldError('status') && <span className="trial-form-error" id="trial-status-error">{fieldError('status')}</span>}
          </div>
          <div className="trial-form-field trial-form-field--full">
            <label htmlFor="trial-description">Description <span aria-hidden="true">*</span></label>
            <textarea id="trial-description" name="description" value={values.description} onChange={updateValue} rows="4" required aria-invalid={Boolean(fieldError('description'))} aria-describedby={fieldError('description') ? 'trial-description-error' : undefined} />
            {fieldError('description') && <span className="trial-form-error" id="trial-description-error">{fieldError('description')}</span>}
          </div>
        </div>
        <div className="trial-form__demo-note">Changes are kept in local page state for this demo session only.</div>
        <div className="trial-modal__footer">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit"><Save size={16} aria-hidden="true" /> {editing ? 'Save Changes' : 'Add Trial'}</Button>
        </div>
      </form>
    </TrialModal>
  )
}
