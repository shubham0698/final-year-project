import { initialParticipants } from '../data/participantsData.js'
import { initialTrials } from '../data/trialsData.js'
import { visitStatuses, visitTypes } from '../data/visitsData.js'

export function filterVisits(visits, filters = {}) {
  const query = String(filters.query ?? '').trim().toLowerCase()
  return visits.filter((visit) => {
    const matchesQuery = !query || visit.id.toLowerCase().includes(query) || visit.participantName.toLowerCase().includes(query)
    return matchesQuery
      && (!filters.trialId || visit.trialId === filters.trialId)
      && (!filters.status || visit.status === filters.status)
      && (!filters.visitType || visit.visitType === filters.visitType)
  })
}

function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function isValidTime(value) {
  const match = String(value ?? '').match(/^(\d{2}):(\d{2})$/)
  return Boolean(match && Number(match[1]) < 24 && Number(match[2]) < 60)
}

export function validateVisit(values) {
  const errors = {}
  if (!initialParticipants.some((participant) => participant.id === values.participantId)) errors.participantId = 'Select a participant.'
  if (!initialTrials.some((trial) => trial.id === values.trialId)) errors.trialId = 'Select a clinical trial.'
  if (!visitTypes.includes(values.visitType)) errors.visitType = 'Select a visit type.'
  if (!isValidISODate(values.visitDate)) errors.visitDate = 'Enter a valid visit date.'
  if (!isValidTime(values.visitTime)) errors.visitTime = 'Enter a valid visit time.'
  if (!String(values.researcher ?? '').trim()) errors.researcher = 'Enter an assigned researcher.'
  if (!visitStatuses.includes(values.status)) errors.status = 'Select a visit status.'
  return errors
}

export function isVisitBeforeEnrollment(values, participants = initialParticipants) {
  const participant = participants.find((record) => record.id === values.participantId)
  return Boolean(participant?.enrollmentDate && isValidISODate(values.visitDate) && values.visitDate < participant.enrollmentDate)
}

function enrichVisit(values, id) {
  const participant = initialParticipants.find((record) => record.id === values.participantId)
  const trial = initialTrials.find((record) => record.id === values.trialId)
  return {
    ...values,
    id,
    participantName: participant?.fullName ?? '',
    participantEnrollmentDate: participant?.enrollmentDate ?? '',
    trialName: trial?.name ?? '',
    researcher: String(values.researcher).trim(),
    notes: String(values.notes ?? '').trim(),
  }
}

export function createVisitRecord(visits, values) {
  const nextNumber = visits.reduce((max, visit) => {
    const match = visit.id.match(/(\d+)$/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0) + 1
  return enrichVisit(values, `DEMO-VS-${String(nextNumber).padStart(3, '0')}`)
}

export function updateVisitRecord(visits, id, values) {
  return visits.map((visit) => visit.id === id ? enrichVisit(values, id) : visit)
}

export function removeVisitRecord(visits, id) {
  return visits.filter((visit) => visit.id !== id)
}

export function updateVisitStatus(visits, id, status) {
  if (!visitStatuses.includes(status)) return visits
  return visits.map((visit) => visit.id === id ? { ...visit, status } : visit)
}

export function getMonthGrid(year, month) {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDay + 1
    if (day < 1 || day > daysInMonth) return null
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  })
}

export function shiftCalendarMonth({ year, month }, direction) {
  const shifted = new Date(Date.UTC(year, month - 1 + direction, 1))
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1 }
}

export function formatVisitTime(value) {
  if (!isValidTime(value)) return value || '—'
  const [hours, minutes] = value.split(':').map(Number)
  const date = new Date(Date.UTC(2020, 0, 1, hours, minutes))
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(date)
}
