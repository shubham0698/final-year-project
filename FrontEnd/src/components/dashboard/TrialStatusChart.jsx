import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Card from '../Card.jsx'

function StatusLegend({ payload = [] }) {
  return (
    <ul className="status-legend" aria-label="Trial status legend">
      {payload.map((item) => (
        <li key={item.value}>
          <span className="status-legend__label"><span style={{ backgroundColor: item.color }} />{item.value}</span>
          <strong>{item.payload.value}</strong>
        </li>
      ))}
    </ul>
  )
}

export default function TrialStatusChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="dashboard-panel" padding="medium">
      <div className="dashboard-panel__heading">
        <div>
          <h2>Trial Status Distribution</h2>
          <p>Current portfolio · mock data</p>
        </div>
      </div>
      <div className="status-chart-layout" role="img" aria-label={`Donut chart showing mock trial status distribution across ${total} trials`}>
        <div className="chart-plot chart-plot--status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">
                {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ border: '1px solid #E2E8EF', borderRadius: 10, boxShadow: '0 8px 24px rgba(20,43,69,.10)', fontSize: 12 }}
                formatter={(value, name) => [`${value} trials`, `${name} (mock)`]}
              />
              <Legend content={<StatusLegend />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="status-chart-total" aria-hidden="true"><strong>{total}</strong><span>trials</span></div>
        </div>
      </div>
    </Card>
  )
}
