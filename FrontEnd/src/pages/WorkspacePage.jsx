import { ClipboardCheck } from 'lucide-react'
import Card from '../components/Card.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'

const sections = {
  overview: {
    title: 'Overview',
    description: 'A starting point for your clinical research workspace.',
    emptyTitle: 'Your workspace is ready',
  },
  'clinical-trials': {
    title: 'Clinical Trials',
    description: 'Manage study information and trial workflows in one place.',
    emptyTitle: 'Trial management is coming soon',
  },
  participants: {
    title: 'Participants',
    description: 'A dedicated space for participant records and study enrollment.',
    emptyTitle: 'Participant tools are coming soon',
  },
  visits: {
    title: 'Visits',
    description: 'Plan and coordinate study visits with a consistent workflow.',
    emptyTitle: 'Visit planning is coming soon',
  },
  'data-collection': {
    title: 'eCRF / Data Collection',
    description: 'A future home for electronic case report forms and study data capture.',
    emptyTitle: 'Data collection tools are coming soon',
  },
  'ayurveda-assessment': {
    title: 'Ayurveda Assessment',
    description: 'A dedicated area for Ayurveda assessment workflows.',
    emptyTitle: 'Ayurveda assessment tools are coming soon',
  },
  'adverse-events': {
    title: 'Adverse Events',
    description: 'Support adverse event documentation and review workflows.',
    emptyTitle: 'Adverse event tools are coming soon',
  },
  'regulatory-compliance': {
    title: 'Regulatory & Compliance',
    description: 'A future workspace for regulatory documentation and compliance activities.',
    emptyTitle: 'Compliance tools are coming soon',
  },
  'reports-analytics': {
    title: 'Reports & Analytics',
    description: 'A future destination for research reporting and analytics.',
    emptyTitle: 'Reports are coming soon',
  },
  'audit-trail': {
    title: 'Audit Trail',
    description: 'A dedicated place for reviewing traceable workspace activity.',
    emptyTitle: 'Audit trail tools are coming soon',
  },
  notifications: {
    title: 'Notifications',
    description: 'Keep track of important updates from your workspace.',
    emptyTitle: 'You are all caught up',
  },
  'user-management': {
    title: 'User Management',
    description: 'A future workspace for managing user access and roles.',
    emptyTitle: 'User management is coming soon',
  },
}

export default function WorkspacePage({ section }) {
  const page = sections[section] ?? sections.overview

  return (
    <div className="workspace-page">
      <PageHeader eyebrow="AIIA workspace" title={page.title} description={page.description} />
      <Card className="workspace-placeholder">
        <EmptyState
          icon={ClipboardCheck}
          title={page.emptyTitle}
          description="This area is reserved for a future module. No study records or clinical data are loaded here."
        />
      </Card>
    </div>
  )
}
