import { useState } from 'react'
import { Save } from 'lucide-react'
import Button from '../Button.jsx'
import TrialModal from '../trials/TrialModal.jsx'
import { participantGenders, participantStatuses, participantTrials } from '../../data/participantsData.js'
import { validateParticipant } from '../../utils/participantManagement.js'

function initialValues(participant) {
  return participant ? {
    fullName: participant.fullName,
    age: String(participant.age),
    gender: participant.gender,
    phone: participant.phone,
    email: participant.email,
    trialId: participant.trialId,
    enrollmentDate: participant.enrollmentDate,
    status: participant.status,
    emergencyContact: participant.emergencyContact ?? '',
    notes: participant.notes ?? '',
  } : {
    fullName: '', age: '', gender: '', phone: '', email: '', trialId: '',
    enrollmentDate: new Date().toISOString().slice(0, 10), status: 'Screening', emergencyContact: '', notes: '',
  }
}

function Field({ id, name = id, label, values, onChange, error, type = 'text', required = false, ...props }) {
  return (
    <div className="participant-form-field">
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={values[name]}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && <span className="participant-form-error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}

function SelectField({ id, name, label, values, options, onChange, error, required = false }) {
  return (
    <div className="participant-form-field">
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <select id={id} name={name} value={values[name]} onChange={onChange} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <span className="participant-form-error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}

export default function ParticipantFormModal({ participant, onClose, onSave }) {
  const [values, setValues] = useState(() => initialValues(participant))
  const [submitted, setSubmitted] = useState(false)
  const errors = validateParticipant(values)
  const editing = Boolean(participant)

  function updateValue(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function errorFor(name) {
    return submitted ? errors[name] : ''
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    onSave({
      ...values,
      age: Number(values.age),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
    })
  }

  return (
    <TrialModal
      title={editing ? 'Edit Participant' : 'Add Participant'}
      description={editing ? `Update the fictional demo record ${participant.id}.` : 'Add a fictional participant record to this local demo session.'}
      onClose={onClose}
      size="large"
    >
      <form className="participant-form" onSubmit={handleSubmit} noValidate>
        <div className="participant-form-grid">
          <Field id="participant-name" name="fullName" label="Full Name" values={values} onChange={updateValue} error={errorFor('fullName')} required data-modal-autofocus="" autoComplete="off" />
          <Field id="participant-age" name="age" label="Age" values={values} onChange={updateValue} error={errorFor('age')} required type="number" min="1" max="120" step="1" />
          <SelectField id="participant-gender" name="gender" label="Gender" values={values} onChange={updateValue} error={errorFor('gender')} required options={participantGenders.map((gender) => ({ value: gender, label: gender }))} />
          <Field id="participant-phone" name="phone" label="Phone Number" values={values} onChange={updateValue} error={errorFor('phone')} required type="tel" autoComplete="off" />
          <Field id="participant-email" name="email" label="Email Address" values={values} onChange={updateValue} error={errorFor('email')} required type="email" autoComplete="off" />
          <SelectField id="participant-trial" name="trialId" label="Associated Clinical Trial" values={values} onChange={updateValue} error={errorFor('trialId')} required options={participantTrials.map((trial) => ({ value: trial.id, label: `${trial.id} · ${trial.name}` }))} />
          <Field id="participant-enrollment-date" name="enrollmentDate" label="Enrollment Date" values={values} onChange={updateValue} error={errorFor('enrollmentDate')} required type="date" />
          <SelectField id="participant-status" name="status" label="Participant Status" values={values} onChange={updateValue} error={errorFor('status')} required options={participantStatuses.map((status) => ({ value: status, label: status }))} />
          <Field id="participant-emergency-contact" name="emergencyContact" label="Emergency Contact (optional)" values={values} onChange={updateValue} type="tel" autoComplete="off" />
          <div className="participant-form-field participant-form-field--full">
            <label htmlFor="participant-notes">Notes <span>(optional)</span></label>
            <textarea id="participant-notes" name="notes" value={values.notes} onChange={updateValue} rows="3" />
          </div>
        </div>
        <p className="participant-form-demo-note">Demo only. Changes remain in temporary local page state and are not saved permanently.</p>
        <div className="trial-modal__footer">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit"><Save size={16} aria-hidden="true" /> {editing ? 'Save Changes' : 'Add Participant'}</Button>
        </div>
      </form>
    </TrialModal>
  )
}
