import { initialParticipants } from '../data/participantsData.js'
import { ecrfStatuses } from '../data/ecrfData.js'
import { initialTrials } from '../data/trialsData.js'
import { initialVisits } from '../data/visitsData.js'

export function filterEcrfs(records, filters = {}) {
  const query = String(filters.query ?? '').trim().toLowerCase()
  return records.filter((form) => {
    const matchesQuery = !query
      || form.id.toLowerCase().includes(query)
      || form.formName.toLowerCase().includes(query)
      || form.participantId.toLowerCase().includes(query)
    return matchesQuery
      && (!filters.trialId || form.trialId === filters.trialId)
      && (!filters.status || form.status === filters.status)
  })
}

function validNumber(value) {
  return value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value)) && Number(value) > 0
}

function validInRange(value, minimum, maximum) {
  return validNumber(value) && Number(value) >= minimum && Number(value) <= maximum
}

function selectedRecords(values) {
  const participant = initialParticipants.find((item) => item.id === values.participantId)
  const trial = initialTrials.find((item) => item.id === values.trialId)
  const visit = initialVisits.find((item) => item.id === values.visitId)
  return { participant, trial, visit }
}

export function validateEcrf(values) {
  const errors = {}
  const { participant, trial, visit } = selectedRecords(values)
  if (!String(values.formName ?? '').trim()) errors.formName = 'Enter a form name.'
  if (!trial) errors.trialId = 'Select an associated clinical trial.'
  if (!participant) errors.participantId = 'Select a participant.'
  if (participant && trial && participant.trialId !== trial.id) errors.trialId = 'Choose the trial associated with this participant.'
  if (!visit) errors.visitId = 'Select a visit.'
  else if (visit.participantId !== values.participantId || visit.trialId !== values.trialId) errors.visitId = 'Choose a visit for the selected participant and trial.'
  if (!String(values.description ?? '').trim()) errors.description = 'Enter a form description.'

  if (!validInRange(values.systolic, 50, 250)) errors.systolic = 'Enter a positive demo value from 50 to 250 mmHg.'
  if (!validInRange(values.diastolic, 30, 150)) errors.diastolic = 'Enter a positive demo value from 30 to 150 mmHg.'
  if (!validInRange(values.heartRate, 30, 220)) errors.heartRate = 'Enter a positive demo value from 30 to 220 bpm.'
  if (!validInRange(values.bodyTemperature, 25, 45)) errors.bodyTemperature = 'Enter a positive demo value from 25 to 45 °C.'
  if (!validInRange(values.weight, 1, 500)) errors.weight = 'Enter a positive demo value from 1 to 500 kg.'
  return errors
}

function normalizeForm(values, id, existing = {}) {
  const { participant, trial, visit } = selectedRecords(values)
  return {
    ...existing,
    id,
    formName: values.formName.trim(),
    trialId: trial.id,
    trialName: trial.name,
    participantId: participant.id,
    participantName: participant.fullName,
    visitId: visit.id,
    visitType: visit.visitType,
    visitDate: visit.visitDate,
    description: values.description.trim(),
    measurements: {
      systolic: Number(values.systolic),
      diastolic: Number(values.diastolic),
      heartRate: Number(values.heartRate),
      bodyTemperature: Number(values.bodyTemperature),
      weight: Number(values.weight),
      symptoms: String(values.symptoms ?? '').trim(),
      investigatorNotes: String(values.investigatorNotes ?? '').trim(),
    },
    lastUpdated: new Date().toISOString().slice(0, 10),
  }
}

export function createEcrfRecord(records, values) {
  const nextNumber = records.reduce((max, form) => {
    const match = form.id.match(/(\d+)$/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0) + 1
  const id = `DEMO-CRF-${String(nextNumber).padStart(3, '0')}`
  return { ...normalizeForm(values, id), createdDate: new Date().toISOString().slice(0, 10), status: 'Draft' }
}

export function updateEcrfRecord(records, id, values) {
  return records.map((form) => form.id === id
    ? { ...normalizeForm(values, id, form), status: 'In Progress' }
    : form)
}

export function removeEcrfRecord(records, id) {
  return records.filter((form) => form.id !== id)
}

export function canTransitionEcrfStatus(currentStatus, nextStatus) {
  if (!ecrfStatuses.includes(nextStatus)) return false
  if (currentStatus === nextStatus) return true
  if (nextStatus === 'Draft') return true
  if (nextStatus === 'In Progress' || nextStatus === 'Submitted') return currentStatus === 'Draft' || currentStatus === 'In Progress'
  if (nextStatus === 'Reviewed') return currentStatus === 'Submitted'
  return false
}

export function transitionEcrfStatus(records, id, nextStatus) {
  return records.map((form) => form.id === id && canTransitionEcrfStatus(form.status, nextStatus)
    ? { ...form, status: nextStatus, lastUpdated: new Date().toISOString().slice(0, 10) }
    : form)
}
