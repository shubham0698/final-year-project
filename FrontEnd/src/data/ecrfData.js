import { initialParticipants } from './participantsData.js'
import { initialTrials } from './trialsData.js'
import { initialVisits } from './visitsData.js'

export const ecrfStatuses = ['Draft', 'In Progress', 'Submitted', 'Reviewed']

const sampleRows = [
  ['DEMO-CRF-001', 'Screening Assessment', 'DEMO-VS-001', '2026-10-02', '2026-10-02', 'Submitted', 'Fictional sample data for UI demonstration only.', { systolic: 118, diastolic: 76, heartRate: 72, bodyTemperature: 36.7, weight: 68.4, symptoms: 'Demo observation: sample entry.', investigatorNotes: 'Synthetic values; not clinical findings.' }],
  ['DEMO-CRF-002', 'Follow-up Vitals', 'DEMO-VS-002', '2026-10-03', '2026-10-03', 'Reviewed', 'Fictional sample data for UI demonstration only.', { systolic: 122, diastolic: 79, heartRate: 70, bodyTemperature: 36.5, weight: 72.1, symptoms: 'Demo observation: sample entry.', investigatorNotes: 'Synthetic values; not clinical findings.' }],
  ['DEMO-CRF-003', 'Baseline Data Collection', 'DEMO-VS-003', '2026-10-05', '2026-10-06', 'In Progress', 'Fictional sample data for UI demonstration only.', { systolic: 115, diastolic: 74, heartRate: 68, bodyTemperature: 36.6, weight: 59.8, symptoms: 'Demo observation: sample entry.', investigatorNotes: 'Synthetic values; not clinical findings.' }],
  ['DEMO-CRF-004', 'Participant Visit Record', 'DEMO-VS-004', '2026-10-07', '2026-10-07', 'Draft', 'Fictional sample data for UI demonstration only.', { systolic: 124, diastolic: 81, heartRate: 75, bodyTemperature: 36.8, weight: 81.2, symptoms: 'Demo observation: sample entry.', investigatorNotes: 'Synthetic values; not clinical findings.' }],
  ['DEMO-CRF-005', 'Final Visit Summary', 'DEMO-VS-005', '2026-10-09', '2026-10-10', 'Submitted', 'Fictional sample data for UI demonstration only.', { systolic: 120, diastolic: 78, heartRate: 73, bodyTemperature: 36.4, weight: 64.5, symptoms: 'Demo observation: sample entry.', investigatorNotes: 'Synthetic values; not clinical findings.' }],
  ['DEMO-CRF-006', 'Baseline Assessment', 'DEMO-VS-006', '2026-10-10', '2026-10-10', 'Reviewed', 'Fictional sample data for UI demonstration only.', { systolic: 117, diastolic: 75, heartRate: 71, bodyTemperature: 36.6, weight: 76.3, symptoms: 'Demo observation: sample entry.', investigatorNotes: 'Synthetic values; not clinical findings.' }],
  ['DEMO-CRF-007', 'Follow-up Data Form', 'DEMO-VS-008', '2026-10-14', '2026-10-15', 'Draft', 'Fictional sample data for UI demonstration only.', { systolic: 121, diastolic: 77, heartRate: 69, bodyTemperature: 36.5, weight: 70.6, symptoms: 'Demo observation: sample entry.', investigatorNotes: 'Synthetic values; not clinical findings.' }],
  ['DEMO-CRF-008', 'Screening Vitals Record', 'DEMO-VS-009', '2026-10-16', '2026-10-16', 'In Progress', 'Fictional sample data for UI demonstration only.', { systolic: 116, diastolic: 73, heartRate: 67, bodyTemperature: 36.7, weight: 62.9, symptoms: 'Demo observation: sample entry.', investigatorNotes: 'Synthetic values; not clinical findings.' }],
]

export const initialEcrfs = sampleRows.map(([id, formName, visitId, createdDate, lastUpdated, status, description, measurements]) => {
  const visit = initialVisits.find((record) => record.id === visitId)
  const participant = initialParticipants.find((record) => record.id === visit?.participantId)
  const trial = initialTrials.find((record) => record.id === visit?.trialId)
  return {
    id,
    formName,
    trialId: trial?.id ?? '',
    trialName: trial?.name ?? '',
    participantId: participant?.id ?? '',
    participantName: participant?.fullName ?? '',
    visitId: visit?.id ?? '',
    visitType: visit?.visitType ?? '',
    visitDate: visit?.visitDate ?? '',
    createdDate,
    lastUpdated,
    description,
    status,
    measurements,
  }
})

// Portfolio-level demo totals; the table intentionally displays a small sample.
export const ecrfSummary = [
  { key: 'total', label: 'Total Forms', value: 18, detail: 'Across the demo portfolio' },
  { key: 'completed', label: 'Completed Forms', value: 10, detail: 'Marked reviewed in demo data' },
  { key: 'pending', label: 'Pending Review', value: 5, detail: 'Submitted demo forms' },
  { key: 'draft', label: 'Draft Forms', value: 3, detail: 'Draft demo forms' },
]
