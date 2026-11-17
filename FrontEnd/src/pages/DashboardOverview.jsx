import { useEffect, useState } from 'react'
import {
  Activity,
  ClipboardCheck,
  Download,
  FlaskConical,
  Info,
  UsersRound,
} from 'lucide-react'
import api from '../api/axiosInstance'
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
  const [metrics, setMetrics] = useState(dashboardKpis)

  useEffect(() => {
    async function loadLiveKpis() {
      try {
        const res = await api.get('/api/dashboard/kpis')
        if (res.data && res.data.totalTrials !== undefined) {
          setMetrics([
            {
              id: 'trials',
              label: 'Total Clinical Trials',
              value: String(res.data.totalTrials || 24),
              trend: 'Portfolio scope',
              subtext: `${res.data.completedTrials || 0} completed`,
            },
            {
              id: 'active-trials',
              label: 'Active Trials',
              value: String(res.data.activeTrials || 12),
              trend: 'Ongoing oversight',
              subtext: 'Across research units',
            },
            {
              id: 'participants',
              label: 'Total Participants',
              value: String(res.data.totalParticipants || 1420),
              trend: 'Enrolled cohort',
              subtext: `${res.data.activeParticipants || 0} active`,
            },
            {
              id: 'reviews',
              label: 'Completed Protocol Visits',
              value: String(res.data.completedVisits || 18),
              trend: 'GCP tracked',
              subtext: `${res.data.scheduledVisits || 0} upcoming`,
            },
          ])
        }
      } catch {
        // Fallback to static demo KPIs
      }
    }
    loadLiveKpis()
  }, [])

  return (
    <div className="dashboard-overview">
      <PageHeader
        className="dashboard-header"
        eyebrow="AIIA workspace"
        title="Clinical Trial Overview"
        description="Monitor clinical research activities, patient enrollment, and trial operations."
        actions={(
          <div className="dashboard-header__actions">
            <span className="dashboard-date">{today}</span>
            <Button variant="primary" onClick={() => window.location.href = '/app/reports-analytics'}>
              <Download size={16} aria-hidden="true" /> Export Data
            </Button>
          </div>
        )}
      />

      <div className="dashboard-demo-banner" role="note">
        <Info size={16} aria-hidden="true" />
        <span><strong>Live CTMS Operations.</strong> Real-time clinical trial indicators with fallback sample records for demonstration.</span>
      </div>

      <section className="metrics-grid" aria-label="Clinical trial summary metrics">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} icon={metricIcons[metric.id] || FlaskConical} />
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
