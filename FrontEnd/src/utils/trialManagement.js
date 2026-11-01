export function filterTrials(trials, { query = '', status = 'All', phase = 'All' } = {}) {
  const normalizedQuery = query.trim().toLowerCase()
  return trials.filter((trial) => {
    const matchesQuery = !normalizedQuery
      || trial.id.toLowerCase().includes(normalizedQuery)
      || trial.name.toLowerCase().includes(normalizedQuery)
    const matchesStatus = status === 'All' || trial.status === status
    const matchesPhase = phase === 'All' || trial.phase === phase
    return matchesQuery && matchesStatus && matchesPhase
  })
}

export function validateTrial(values) {
  const errors = {}
  const requiredFields = ['name', 'researchArea', 'phase', 'investigator', 'startDate', 'expectedEndDate', 'targetParticipants', 'description', 'status']

  for (const field of requiredFields) {
    if (!String(values[field] ?? '').trim()) errors[field] = 'This field is required.'
  }

  if (String(values.targetParticipants ?? '').trim()) {
    const count = Number(values.targetParticipants)
    if (!Number.isInteger(count) || count < 1) errors.targetParticipants = 'Enter a whole number greater than zero.'
  }

  if (values.startDate && values.expectedEndDate && values.expectedEndDate < values.startDate) {
    errors.expectedEndDate = 'Expected end date cannot be earlier than the start date.'
  }

  return errors
}

export function getTrialSummary(trials) {
  return {
    total: trials.length,
    active: trials.filter((trial) => trial.status === 'Active').length,
    completed: trials.filter((trial) => trial.status === 'Completed').length,
    pending: trials.filter((trial) => trial.status === 'Pending').length,
  }
}

export function createTrialRecord(values, id, updatedAt) {
  return { id, ...values, participants: 0, updatedAt }
}

export function updateTrialRecord(trials, id, values, updatedAt) {
  return trials.map((trial) => trial.id === id ? { ...trial, ...values, updatedAt } : trial)
}

export function removeTrialRecord(trials, id) {
  return trials.filter((trial) => trial.id !== id)
}
