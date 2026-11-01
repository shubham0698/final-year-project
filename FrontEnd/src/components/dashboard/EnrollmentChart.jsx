import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../Card.jsx'

export default function EnrollmentChart({ data }) {
  return (
    <Card className="dashboard-panel" padding="medium">
      <div className="dashboard-panel__heading">
        <div>
          <h2>Participant Enrollment</h2>
          <p>Monthly enrollment · mock data</p>
        </div>
        <span className="chart-period">Jan – Jun</span>
      </div>
      <div className="chart-plot chart-plot--enrollment" role="img" aria-label="Bar chart of monthly mock participant enrollment from January through June">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E8EDF2" strokeDasharray="3 4" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#748397', fontSize: 12 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8996A8', fontSize: 11 }} tickCount={5} />
            <Tooltip
              cursor={{ fill: 'rgba(15, 139, 141, 0.06)' }}
              contentStyle={{ border: '1px solid #E2E8EF', borderRadius: 10, boxShadow: '0 8px 24px rgba(20,43,69,.10)', fontSize: 12 }}
              formatter={(value) => [`${value} participants`, 'Enrollment (mock)']}
            />
            <Bar dataKey="participants" name="Participants" fill="#0F8B8D" radius={[5, 5, 0, 0]} maxBarSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
