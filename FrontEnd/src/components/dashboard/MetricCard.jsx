import { TrendingDown, TrendingUp } from 'lucide-react'
import Card from '../Card.jsx'

export default function MetricCard({ metric, icon: Icon }) {
  const isPositive = metric.direction === 'up' || metric.direction === 'down-positive'
  const TrendIcon = metric.direction === 'down-positive' ? TrendingDown : TrendingUp

  return (
    <Card as="article" className={`metric-card metric-card--${metric.id}`} padding="medium" aria-label={`${metric.label}: ${metric.value}`}>
      <div className="metric-card__topline">
        <span className="metric-card__icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
        <span className="metric-card__mock-label">Mock</span>
      </div>
      <p className="metric-card__label">{metric.label}</p>
      <div className="metric-card__bottomline">
        <strong className="metric-card__value">{metric.value}</strong>
        <span className={`metric-card__trend${isPositive ? ' metric-card__trend--positive' : ''}`} aria-label={`Mock trend ${metric.trend} ${metric.detail}`}>
          <TrendIcon size={14} aria-hidden="true" />
          <span>{metric.trend}</span>
        </span>
      </div>
      <span className="metric-card__detail">{metric.detail} · mock trend</span>
    </Card>
  )
}
