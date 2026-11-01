import { participantStatuses, participantTrials } from '../data/participantsData.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?[0-9\s().-]{7,24}$/

export function filterParticipants(records, filters = {}) {
  const query = String(filters.query ?? '').trim().toLowerCase()
  return records.filter((participant) => {
    const matchesQuery = !query
      || participant.id.toLowerCase().includes(query)
      || participant.fullName.toLowerCase().includes(query)
    const matchesTrial = !filters.trialId || participant.trialId === filters.trialId
    const matchesStatus = !filters.status || participant.status === filters.status
    const matchesGender = !filters.gender || participant.gender === filters.gender
    return matchesQuery && matchesTrial && matchesStatus && matchesGender
  })
}

export function validateParticipant(values) {
  const errors = {}
  const name = String(values.fullName ?? '').trim()
  const age = Number(values.age)
  const phone = String(values.phone ?? '').trim()
  const email = String(values.email ?? '').trim()
  const date = String(values.enrollmentDate ?? '')

  if (!name) errors.fullName = 'Enter the participant name.'
  if (!values.age || !Number.isInteger(age) || age < 1 || age > 120) errors.age = 'Enter an age from 1 to 120.'
  if (!['Female', 'Male', 'Other'].includes(values.gender)) errors.gender = 'Choose a gender.'
  const phoneDigits = phone.replace(/\D/g, '').length
  if (!phone || !phonePattern.test(phone) || phoneDigits < 7 || phoneDigits > 15) errors.phone = 'Enter a valid phone number with 7 to 15 digits.'
  if (!email) errors.email = 'Enter an email address.'
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'
  if (!participantTrials.some((trial) => trial.id === values.trialId)) errors.trialId = 'Select an associated clinical trial.'
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    errors.enrollmentDate = 'Enter a valid enrollment date.'
  }
  if (!participantStatuses.includes(values.status)) errors.status = 'Choose a participant status.'
  return errors
}

export function createParticipantRecord(records, values) {
  const nextNumber = records.reduce((max, participant) => {
    const match = participant.id.match(/(\d+)$/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0) + 1
  const trial = participantTrials.find((item) => item.id === values.trialId)
  return {
    id: `DEMO-PT-${String(nextNumber).padStart(4, '0')}`,
    ...values,
    fullName: values.fullName.trim(),
    age: Number(values.age),
    trialName: trial?.name ?? '',
    email: String(values.email ?? '').trim(),
    emergencyContact: String(values.emergencyContact ?? '').trim(),
    notes: String(values.notes ?? '').trim(),
  }
}

export function updateParticipantRecord(records, id, values) {
  const trial = participantTrials.find((item) => item.id === values.trialId)
  return records.map((participant) => participant.id === id
    ? {
      ...participant,
      ...values,
      id,
      fullName: values.fullName.trim(),
      age: Number(values.age),
      trialName: trial?.name ?? '',
      email: String(values.email ?? '').trim(),
      emergencyContact: String(values.emergencyContact ?? '').trim(),
      notes: String(values.notes ?? '').trim(),
    }
    : participant)
}

export function removeParticipantRecord(records, id) {
  return records.filter((participant) => participant.id !== id)
}
