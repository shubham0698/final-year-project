import { initialParticipants } from './participantsData.js'
import { initialTrials } from './trialsData.js'

export const visitStatuses = ['Scheduled', 'Completed', 'Missed', 'Cancelled']
export const visitTypes = ['Screening', 'Baseline', 'Follow-up', 'Final', 'Unscheduled']

const visitRows = [
  ['DEMO-VS-001', 'DEMO-PT-0486', 'Screening', '2026-10-02', '09:00', 'Scheduled', 'Fictional demo visit.'],
  ['DEMO-VS-002', 'DEMO-PT-0485', 'Follow-up', '2026-10-03', '10:30', 'Completed', 'Fictional demo visit.'],
  ['DEMO-VS-003', 'DEMO-PT-0484', 'Baseline', '2026-10-05', '11:00', 'Completed', 'Fictional demo visit.'],
  ['DEMO-VS-004', 'DEMO-PT-0483', 'Follow-up', '2026-10-07', '13:30', 'Scheduled', 'Fictional demo visit.'],
  ['DEMO-VS-005', 'DEMO-PT-0482', 'Final', '2026-10-09', '14:00', 'Missed', 'Fictional demo visit.'],
  ['DEMO-VS-006', 'DEMO-PT-0481', 'Baseline', '2026-10-10', '09:30', 'Completed', 'Fictional demo visit.'],
  ['DEMO-VS-007', 'DEMO-PT-0480', 'Unscheduled', '2026-10-12', '15:00', 'Cancelled', 'Fictional demo visit.'],
  ['DEMO-VS-008', 'DEMO-PT-0479', 'Follow-up', '2026-10-14', '10:00', 'Scheduled', 'Fictional demo visit.'],
  ['DEMO-VS-009', 'DEMO-PT-0478', 'Screening', '2026-10-16', '08:30', 'Completed', 'Fictional demo visit.'],
  ['DEMO-VS-010', 'DEMO-PT-0477', 'Final', '2026-10-19', '11:30', 'Scheduled', 'Fictional demo visit.'],
  ['DEMO-VS-011', 'DEMO-PT-0476', 'Follow-up', '2026-10-22', '13:00', 'Scheduled', 'Fictional demo visit.'],
  ['DEMO-VS-012', 'DEMO-PT-0475', 'Baseline', '2026-10-24', '09:00', 'Completed', 'Fictional demo visit.'],
  ['DEMO-VS-013', 'DEMO-PT-0486', 'Follow-up', '2026-10-28', '10:30', 'Scheduled', 'Fictional demo visit.'],
  ['DEMO-VS-014', 'DEMO-PT-0485', 'Final', '2026-10-30', '14:30', 'Scheduled', 'Fictional demo visit.'],
]

export const initialVisits = visitRows.map(([id, participantId, visitType, visitDate, visitTime, status, notes]) => {
  const participant = initialParticipants.find((record) => record.id === participantId)
  const trial = initialTrials.find((record) => record.id === participant?.trialId)
  return {
    id,
    participantId,
    participantName: participant?.fullName ?? 'Demo participant',
    participantEnrollmentDate: participant?.enrollmentDate ?? '',
    trialId: trial?.id ?? '',
    trialName: trial?.name ?? 'Demo trial',
    visitType,
    visitDate,
    visitTime,
    researcher: trial?.investigator ?? 'Demo Researcher',
    status,
    notes,
  }
})

export const visitSummary = [
  { label: 'Total Visits', value: 128, detail: 'Across the demo portfolio', icon: 'total' },
  { label: 'Scheduled', value: 42, detail: 'Planned or upcoming', icon: 'scheduled' },
  { label: 'Completed', value: 68, detail: 'Marked complete in demo data', icon: 'completed' },
  { label: 'Missed / Cancelled', value: 18, detail: 'Combined demo count', icon: 'missed' },
]
