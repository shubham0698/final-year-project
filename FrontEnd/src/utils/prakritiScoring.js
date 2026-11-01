import { initialParticipants } from '../data/participantsData.js'

const doshas = ['vata', 'pitta', 'kapha']
const doshaLabels = { vata: 'Vata', pitta: 'Pitta', kapha: 'Kapha' }

export function calculatePrakritiScores(answers, questionCount = 15) {
  const counts = { vata: 0, pitta: 0, kapha: 0 }
  Object.values(answers ?? {}).forEach((answer) => {
    const key = String(answer).toLowerCase()
    if (doshas.includes(key)) counts[key] += 1
  })
  const highScore = Math.max(counts.vata, counts.pitta, counts.kapha)
  const topTypes = doshas.filter((dosha) => counts[dosha] === highScore && highScore > 0).map((dosha) => doshaLabels[dosha])
  const isBalanced = topTypes.length !== 1
  return {
    ...counts,
    total: questionCount,
    answered: Object.keys(answers ?? {}).length,
    topTypes,
    isBalanced,
    dominant: isBalanced ? 'Balanced / Mixed' : topTypes[0],
  }
}

export function validatePrakritiAnswers(answers, questionCount = 15) {
  const missing = []
  for (let index = 1; index <= questionCount; index += 1) {
    const key = `q${String(index).padStart(2, '0')}`
    if (!doshas.includes(String(answers?.[key] ?? '').toLowerCase())) missing.push(key)
  }
  return { isValid: missing.length === 0, missing, message: missing.length ? `Answer all ${questionCount} questions before calculating the demo result.` : '' }
}

export function filterAssessments(records, filters = {}) {
  const query = String(filters.query ?? '').trim().toLowerCase()
  const direction = filters.sortDirection === 'oldest' ? 1 : -1
  return records
    .filter((record) => (!query || record.id.toLowerCase().includes(query) || record.participantId.toLowerCase().includes(query) || record.participantName.toLowerCase().includes(query))
      && (!filters.participantId || record.participantId === filters.participantId)
      && (!filters.dominant || record.dominant === filters.dominant))
    .sort((first, second) => first.assessmentDate.localeCompare(second.assessmentDate) * direction)
}

function participantFor(id) {
  return initialParticipants.find((participant) => participant.id === id)
}

export function createAssessmentRecord(records, participantId, answers, scores, assessmentDate = new Date().toISOString().slice(0, 10)) {
  const participant = participantFor(participantId)
  if (!participant) return null
  const nextNumber = records.reduce((max, record) => {
    const match = record.id.match(/(\d+)$/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0) + 1
  return {
    id: `DEMO-PA-${String(nextNumber).padStart(3, '0')}`,
    participantId: participant.id,
    participantName: participant.fullName,
    assessmentDate,
    answers: { ...answers },
    scores: { vata: scores.vata, pitta: scores.pitta, kapha: scores.kapha },
    dominant: scores.dominant,
  }
}

export function updateAssessmentRecord(records, id, participantId, answers, scores, assessmentDate = new Date().toISOString().slice(0, 10)) {
  const replacement = createAssessmentRecord(records, participantId, answers, scores, assessmentDate)
  if (!replacement) return records
  return records.map((record) => record.id === id ? { ...replacement, id } : record)
}

export function removeAssessmentRecord(records, id) {
  return records.filter((record) => record.id !== id)
}
