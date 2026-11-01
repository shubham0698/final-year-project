import { initialParticipants } from './participantsData.js'
import { calculatePrakritiScores } from '../utils/prakritiScoring.js'

export const prakritiQuestions = [
  { id: 'q01', prompt: 'When planning a new activity, which approach feels most familiar in this learning example?', options: { vata: 'I enjoy exploring several possibilities.', pitta: 'I prefer a clear goal and sequence.', kapha: 'I like a steady plan with time to settle in.' } },
  { id: 'q02', prompt: 'Which pace do you tend to prefer for everyday tasks?', options: { vata: 'Varied and changeable.', pitta: 'Focused and purposeful.', kapha: 'Measured and consistent.' } },
  { id: 'q03', prompt: 'Which kind of learning setting do you usually enjoy?', options: { vata: 'Open-ended and full of new ideas.', pitta: 'Organized around clear objectives.', kapha: 'Calm, familiar, and unhurried.' } },
  { id: 'q04', prompt: 'How do you prefer to approach a busy day?', options: { vata: 'With flexibility to follow changing interests.', pitta: 'With priorities arranged in order.', kapha: 'With a dependable routine.' } },
  { id: 'q05', prompt: 'Which description best fits your preferred communication style?', options: { vata: 'Expressive and spontaneous.', pitta: 'Direct and concise.', kapha: 'Thoughtful and patient.' } },
  { id: 'q06', prompt: 'When choosing a hobby, what draws your interest?', options: { vata: 'Trying something new and varied.', pitta: 'Developing a skill toward a goal.', kapha: 'Practicing something familiar over time.' } },
  { id: 'q07', prompt: 'Which environment do you tend to find comfortable for focused work?', options: { vata: 'A lively place with changing activity.', pitta: 'A well-organized workspace.', kapha: 'A quiet and familiar place.' } },
  { id: 'q08', prompt: 'How do you usually prefer to make everyday choices?', options: { vata: 'I like to keep options open.', pitta: 'I compare options and decide promptly.', kapha: 'I take time and value what is familiar.' } },
  { id: 'q09', prompt: 'Which kind of schedule feels most appealing?', options: { vata: 'A flexible schedule with variety.', pitta: 'A structured schedule with milestones.', kapha: 'A steady schedule with few changes.' } },
  { id: 'q10', prompt: 'In a group activity, which role do you often enjoy?', options: { vata: 'Sharing ideas and exploring directions.', pitta: 'Helping organize the task.', kapha: 'Supporting the group steadily.' } },
  { id: 'q11', prompt: 'Which way of spending free time sounds most like your preference?', options: { vata: 'Sampling different activities.', pitta: 'Working toward a personal project.', kapha: 'Enjoying a familiar, relaxed activity.' } },
  { id: 'q12', prompt: 'How do you prefer to receive new information?', options: { vata: 'In short, varied pieces.', pitta: 'In a clear, well-ordered explanation.', kapha: 'With time to review and absorb it.' } },
  { id: 'q13', prompt: 'Which description best matches your approach to change?', options: { vata: 'I often welcome something different.', pitta: 'I look for a useful direction for change.', kapha: 'I prefer gradual, considered changes.' } },
  { id: 'q14', prompt: 'What helps you stay engaged with a long activity?', options: { vata: 'New ideas and variety along the way.', pitta: 'A clear objective to work toward.', kapha: 'A reliable rhythm and steady progress.' } },
  { id: 'q15', prompt: 'Which general description feels closest to your preferred routine?', options: { vata: 'Flexible and varied.', pitta: 'Organized and goal-oriented.', kapha: 'Steady and familiar.' } },
]

function makeAnswers(counts, offset = 0) {
  const list = [
    ...Array(counts.vata).fill('vata'),
    ...Array(counts.pitta).fill('pitta'),
    ...Array(counts.kapha).fill('kapha'),
  ]
  const shift = offset % list.length
  const rotated = [...list.slice(shift), ...list.slice(0, shift)]
  return Object.fromEntries(prakritiQuestions.map((question, index) => [question.id, rotated[index]]))
}

const sampleAssessments = [
  ['DEMO-PT-0486', '2026-10-01', { vata: 7, pitta: 5, kapha: 3 }],
  ['DEMO-PT-0485', '2026-09-29', { vata: 4, pitta: 7, kapha: 4 }],
  ['DEMO-PT-0484', '2026-09-26', { vata: 5, pitta: 4, kapha: 6 }],
  ['DEMO-PT-0483', '2026-09-22', { vata: 6, pitta: 5, kapha: 4 }],
  ['DEMO-PT-0482', '2026-09-18', { vata: 3, pitta: 8, kapha: 4 }],
  ['DEMO-PT-0481', '2026-09-13', { vata: 4, pitta: 5, kapha: 6 }],
  ['DEMO-PT-0480', '2026-09-08', { vata: 8, pitta: 4, kapha: 3 }],
  ['DEMO-PT-0479', '2026-09-02', { vata: 5, pitta: 6, kapha: 4 }],
  ['DEMO-PT-0478', '2026-08-28', { vata: 4, pitta: 4, kapha: 7 }],
  ['DEMO-PT-0477', '2026-08-21', { vata: 5, pitta: 5, kapha: 5 }],
]

export const initialAssessments = sampleAssessments.map(([participantId, assessmentDate, counts], index) => {
  const participant = initialParticipants.find((record) => record.id === participantId)
  const answers = makeAnswers(counts, index)
  const scores = calculatePrakritiScores(answers, prakritiQuestions.length)
  return {
    id: `DEMO-PA-${String(index + 1).padStart(3, '0')}`,
    participantId,
    participantName: participant.fullName,
    assessmentDate,
    answers,
    scores: { vata: scores.vata, pitta: scores.pitta, kapha: scores.kapha },
    dominant: scores.dominant,
  }
})

export const prakritiSummary = [
  { key: 'total', label: 'Total Assessments', value: 86 },
  { key: 'vata', label: 'Vata Dominant', value: 28 },
  { key: 'pitta', label: 'Pitta Dominant', value: 34 },
  { key: 'kapha', label: 'Kapha Dominant', value: 24 },
]
