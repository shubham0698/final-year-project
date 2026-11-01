const studyNames = [
  'Integrative wellness observation',
  'Digestive health research cohort',
  'Sleep quality and routine study',
  'Lifestyle and wellbeing assessment',
  'Respiratory wellness follow-up',
  'Preventive care research cohort',
  'Ayurveda prakriti assessment study',
  'Participant experience observation',
  'Daily activity research programme',
  'Nutrition and routine assessment',
  'Community health observation',
  'Research documentation pilot',
  'Wellbeing measures follow-up',
  'Visit coordination study',
  'Participant-reported outcomes study',
  'Care pathway observation',
  'Digital research workflow pilot',
  'Longitudinal wellbeing cohort',
  'Research visit experience study',
  'Structured assessment programme',
  'Preventive health observation',
  'Participant information review',
  'Study operations assessment',
  'Clinical documentation workflow study',
]

const researchAreas = ['Integrative Health', 'Digestive Health', 'Sleep Research', 'Lifestyle Research', 'Respiratory Health', 'Preventive Care', 'Ayurveda', 'Participant Experience']
const phases = ['Phase I', 'Phase II', 'Phase III', 'Phase IV']
const investigators = ['Dr. Morgan Lee', 'Dr. Riley Shah', 'Dr. Jordan Patel', 'Dr. Casey Rao', 'Dr. Taylor Iyer', 'Dr. Alex Nair', 'Dr. Cameron Das', 'Dr. Samira Bose']

function isoDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10)
}

function makeTrial(index) {
  const number = studyNames.length - index
  const status = index < 12 ? 'Active' : index < 19 ? 'Completed' : 'Pending'
  const year = 2025 - Math.floor(index / 12)
  const month = ((index * 2) % 12) + 1
  const day = ((index * 7) % 25) + 1
  const targetParticipants = 90 + ((index * 37) % 210)
  const startDate = isoDate(year, month, day)
  const endDate = isoDate(year + 1, month, Math.min(day, 28))
  const participationRate = status === 'Completed' ? 1 : status === 'Active' ? 0.62 : 0.18

  return {
    id: `DEMO-CT-${String(number).padStart(3, '0')}`,
    name: studyNames[index],
    researchArea: researchAreas[index % researchAreas.length],
    phase: phases[index % phases.length],
    investigator: investigators[index % investigators.length],
    startDate,
    expectedEndDate: endDate,
    targetParticipants,
    participants: Math.round(targetParticipants * participationRate),
    description: `Sample ${studyNames[index].toLowerCase()} records for demonstrating trial administration and review workflows.`,
    status,
    updatedAt: isoDate(year, month, Math.min(day + 2, 28)),
  }
}

export const initialTrials = studyNames.map((_, index) => makeTrial(index))

export const trialPhases = ['Phase I', 'Phase II', 'Phase III', 'Phase IV']
export const trialStatuses = ['Active', 'Completed', 'Pending', 'Suspended']
