import {
  Activity,
  ClipboardCheck,
  Download,
  FlaskConical,
  Info,
  UsersRound,
} from 'lucide-react'
import Button from '../components/Button.jsx'
import EnrollmentChart from '../components/dashboard/EnrollmentChart.jsx'
import MetricCard from '../components/dashboard/MetricCard.jsx'
import RecentActivity from '../components/dashboard/RecentActivity.jsx'
import RecentTrialsTable from '../components/dashboard/RecentTrialsTable.jsx'
import TrialStatusChart from '../components/dashboard/TrialStatusChart.jsx'
import PageHeader from '../components/PageHeader.jsx'
import {
  dashboardKpis,
  enrollmentData,
  recentActivities,
  recentTrials,
  trialStatusData,
} from '../data/dashboardData.js'
import './DashboardOverview.css'

const metricIcons = {
  trials: FlaskConical,
  'active-trials': Activity,
  participants: UsersRound,
  reviews: ClipboardCheck,
}

const today = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date())

export default function DashboardOverview() {
  return (
    <div className="dashboard-overview">
      <PageHeader
        className="dashboard-header"
        eyebrow="AIIA workspace"
        title="Clinical Trial Overview"
        description="Monitor clinical research activities and trial operations."
        actions={(
          <div className="dashboard-header__actions">
            <span className="dashboard-date">{today}</span>
            <Button variant="primary" disabled aria-label="Export Report — demo only">
              <Download size={16} aria-hidden="true" /> Export Report
            </Button>
          </div>
        )}
      />

      <div className="dashboard-demo-banner" role="note">
        <Info size={16} aria-hidden="true" />
        <span><strong>Demo data.</strong> Metrics, charts, trial records, and activity below are static sample content for interface preview only.</span>
      </div>

      <section className="metrics-grid" aria-label="Clinical trial summary metrics">
        {dashboardKpis.map((metric) => (
          <MetricCard key={metric.id} metric={metric} icon={metricIcons[metric.id]} />
        ))}
      </section>

      <section className="dashboard-charts" aria-label="Enrollment and trial status charts">
        <EnrollmentChart data={enrollmentData} />
        <TrialStatusChart data={trialStatusData} />
      </section>

      <section className="dashboard-lower-grid" aria-label="Recent trial records and activity">
        <RecentTrialsTable trials={recentTrials} />
        <RecentActivity activities={recentActivities} />
      </section>
    </div>
  )
}
