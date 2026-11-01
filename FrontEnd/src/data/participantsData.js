export const participantStatuses = ['Active', 'Screening', 'Enrolled', 'Completed', 'Withdrawn']
export const participantGenders = ['Female', 'Male', 'Other']

export const participantTrials = [
  { id: 'DEMO-CT-024', name: 'Ayurvedic Support in Metabolic Wellness' },
  { id: 'DEMO-CT-021', name: 'Herbal Care and Sleep Quality Study' },
  { id: 'DEMO-CT-019', name: 'Mindfulness and Stress Response' },
  { id: 'DEMO-CT-017', name: 'Nutrition Patterns in Healthy Adults' },
  { id: 'DEMO-CT-014', name: 'Yoga Practice and Mobility Research' },
  { id: 'DEMO-CT-011', name: 'Botanical Skin Comfort Assessment' },
]

// Every name and contact below is fictional. Email uses the reserved .test domain;
// phone numbers use the fictional 202-555-0100 through 0199 range.
export const initialParticipants = [
  { id: 'DEMO-PT-0486', fullName: 'Alex Example', age: 34, gender: 'Female', trialId: 'DEMO-CT-024', trialName: 'Ayurvedic Support in Metabolic Wellness', enrollmentDate: '2026-09-14', phone: '+1 202-555-0101', email: 'participant01@example.test', status: 'Active', emergencyContact: '+1 202-555-0151', notes: 'Fictional sample record for interface demonstration.' },
  { id: 'DEMO-PT-0485', fullName: 'Jordan Sample', age: 42, gender: 'Male', trialId: 'DEMO-CT-021', trialName: 'Herbal Care and Sleep Quality Study', enrollmentDate: '2026-09-08', phone: '+1 202-555-0102', email: 'participant02@example.test', status: 'Enrolled', emergencyContact: '', notes: 'Fictional sample record for interface demonstration.' },
  { id: 'DEMO-PT-0484', fullName: 'Riley Demo', age: 29, gender: 'Other', trialId: 'DEMO-CT-019', trialName: 'Mindfulness and Stress Response', enrollmentDate: '2026-08-26', phone: '+1 202-555-0103', email: 'participant03@example.test', status: 'Screening', emergencyContact: '+1 202-555-0153', notes: '' },
  { id: 'DEMO-PT-0483', fullName: 'Morgan Fiction', age: 51, gender: 'Female', trialId: 'DEMO-CT-017', trialName: 'Nutrition Patterns in Healthy Adults', enrollmentDate: '2026-08-19', phone: '+1 202-555-0104', email: 'participant04@example.test', status: 'Active', emergencyContact: '', notes: 'Fictional sample record for interface demonstration.' },
  { id: 'DEMO-PT-0482', fullName: 'Taylor Placeholder', age: 37, gender: 'Male', trialId: 'DEMO-CT-014', trialName: 'Yoga Practice and Mobility Research', enrollmentDate: '2026-08-11', phone: '+1 202-555-0105', email: 'participant05@example.test', status: 'Completed', emergencyContact: '+1 202-555-0155', notes: '' },
  { id: 'DEMO-PT-0481', fullName: 'Casey Fictional', age: 46, gender: 'Female', trialId: 'DEMO-CT-011', trialName: 'Botanical Skin Comfort Assessment', enrollmentDate: '2026-07-30', phone: '+1 202-555-0106', email: 'participant06@example.test', status: 'Active', emergencyContact: '', notes: 'Fictional sample record for interface demonstration.' },
  { id: 'DEMO-PT-0480', fullName: 'Avery Sample', age: 31, gender: 'Other', trialId: 'DEMO-CT-024', trialName: 'Ayurvedic Support in Metabolic Wellness', enrollmentDate: '2026-07-22', phone: '+1 202-555-0107', email: 'participant07@example.test', status: 'Withdrawn', emergencyContact: '+1 202-555-0157', notes: 'Fictional sample record for interface demonstration.' },
  { id: 'DEMO-PT-0479', fullName: 'Quinn Example', age: 58, gender: 'Male', trialId: 'DEMO-CT-021', trialName: 'Herbal Care and Sleep Quality Study', enrollmentDate: '2026-07-16', phone: '+1 202-555-0108', email: 'participant08@example.test', status: 'Active', emergencyContact: '', notes: '' },
  { id: 'DEMO-PT-0478', fullName: 'Emery Demo', age: 25, gender: 'Female', trialId: 'DEMO-CT-019', trialName: 'Mindfulness and Stress Response', enrollmentDate: '2026-06-29', phone: '+1 202-555-0109', email: 'participant09@example.test', status: 'Enrolled', emergencyContact: '+1 202-555-0159', notes: 'Fictional sample record for interface demonstration.' },
  { id: 'DEMO-PT-0477', fullName: 'Parker Placeholder', age: 63, gender: 'Male', trialId: 'DEMO-CT-017', trialName: 'Nutrition Patterns in Healthy Adults', enrollmentDate: '2026-06-18', phone: '+1 202-555-0110', email: 'participant10@example.test', status: 'Completed', emergencyContact: '', notes: '' },
  { id: 'DEMO-PT-0476', fullName: 'Drew Fiction', age: 40, gender: 'Female', trialId: 'DEMO-CT-014', trialName: 'Yoga Practice and Mobility Research', enrollmentDate: '2026-06-10', phone: '+1 202-555-0111', email: 'participant11@example.test', status: 'Active', emergencyContact: '+1 202-555-0161', notes: 'Fictional sample record for interface demonstration.' },
  { id: 'DEMO-PT-0475', fullName: 'Reese Sample', age: 33, gender: 'Other', trialId: 'DEMO-CT-011', trialName: 'Botanical Skin Comfort Assessment', enrollmentDate: '2026-05-27', phone: '+1 202-555-0112', email: 'participant12@example.test', status: 'Active', emergencyContact: '', notes: '' },
]

// Portfolio-level demo indicators; the table intentionally shows a small sample.
export const participantSummary = [
  { label: 'Total Participants', value: 486, detail: 'Across all demo trials', key: 'total' },
  { label: 'Active Participants', value: 352, detail: 'Currently participating', key: 'active' },
  { label: 'Completed Participation', value: 98, detail: 'Participation completed', key: 'completed' },
  { label: 'Withdrawn Participants', value: 36, detail: 'Withdrew from participation', key: 'withdrawn' },
]
