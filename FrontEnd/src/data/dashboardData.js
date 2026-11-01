export const dashboardKpis = [
  {
    id: 'trials',
    label: 'Total Clinical Trials',
    value: '24',
    trend: '+3',
    detail: 'vs. prior period',
    direction: 'up',
  },
  {
    id: 'active-trials',
    label: 'Active Trials',
    value: '12',
    trend: '+2',
    detail: 'vs. prior period',
    direction: 'up',
  },
  {
    id: 'participants',
    label: 'Total Participants',
    value: '486',
    trend: '+8%',
    detail: 'vs. prior period',
    direction: 'up',
  },
  {
    id: 'reviews',
    label: 'Pending Reviews',
    value: '18',
    trend: '−2',
    detail: 'vs. prior period',
    direction: 'down-positive',
  },
]

export const enrollmentData = [
  { month: 'Jan', participants: 42 },
  { month: 'Feb', participants: 58 },
  { month: 'Mar', participants: 51 },
  { month: 'Apr', participants: 76 },
  { month: 'May', participants: 68 },
  { month: 'Jun', participants: 91 },
]

export const trialStatusData = [
  { name: 'Active', value: 12, color: '#0F8B8D' },
  { name: 'Completed', value: 7, color: '#16A085' },
  { name: 'Pending', value: 3, color: '#E7AE4A' },
  { name: 'Suspended', value: 2, color: '#91A0B1' },
]

export const recentTrials = [
  {
    id: 'DEMO-CT-024',
    name: 'DEMO: Integrative wellness study',
    investigator: 'Dr. Morgan Lee',
    participants: 86,
    status: 'Active',
    updated: '31 Oct 2026',
  },
  {
    id: 'DEMO-CT-023',
    name: 'DEMO: Digestive health observation',
    investigator: 'Dr. Riley Shah',
    participants: 54,
    status: 'Pending',
    updated: '30 Oct 2026',
  },
  {
    id: 'DEMO-CT-022',
    name: 'DEMO: Sleep quality assessment',
    investigator: 'Dr. Jordan Patel',
    participants: 112,
    status: 'Active',
    updated: '29 Oct 2026',
  },
  {
    id: 'DEMO-CT-021',
    name: 'DEMO: Lifestyle outcomes review',
    investigator: 'Dr. Casey Rao',
    participants: 73,
    status: 'Completed',
    updated: '28 Oct 2026',
  },
  {
    id: 'DEMO-CT-020',
    name: 'DEMO: Respiratory wellness cohort',
    investigator: 'Dr. Taylor Iyer',
    participants: 41,
    status: 'Suspended',
    updated: '27 Oct 2026',
  },
  {
    id: 'DEMO-CT-019',
    name: 'DEMO: Preventive care follow-up',
    investigator: 'Dr. Alex Nair',
    participants: 120,
    status: 'Active',
    updated: '26 Oct 2026',
  },
]

export const recentActivities = [
  {
    id: 'activity-1',
    type: 'trial',
    description: 'Trial registration updated',
    context: 'DEMO-CT-024 · Integrative wellness study',
    time: '12 min ago',
  },
  {
    id: 'activity-2',
    type: 'participant',
    description: 'Participant enrolled',
    context: 'DEMO-CT-022 · Sleep quality assessment',
    time: '48 min ago',
  },
  {
    id: 'activity-3',
    type: 'visit',
    description: 'Visit scheduled',
    context: 'DEMO-CT-019 · Preventive care follow-up',
    time: '2 hours ago',
  },
  {
    id: 'activity-4',
    type: 'event',
    description: 'Adverse event submitted',
    context: 'DEMO-CT-020 · Respiratory wellness cohort',
    time: '3 hours ago',
  },
  {
    id: 'activity-5',
    type: 'review',
    description: 'eCRF review completed',
    context: 'DEMO-CT-023 · Digestive health observation',
    time: 'Yesterday',
  },
]
