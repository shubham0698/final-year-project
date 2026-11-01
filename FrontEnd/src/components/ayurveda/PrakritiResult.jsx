import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Check, Save } from 'lucide-react'
import Button from '../Button.jsx'
import Card from '../Card.jsx'
import TrialModal from '../trials/TrialModal.jsx'

const scoreColors = { Vata: '#6b7fb5', Pitta: '#d28b42', Kapha: '#168b78' }

function chartData(scores) {
  return [
    { name: 'Vata', score: scores.vata, color: scoreColors.Vata },
    { name: 'Pitta', score: scores.pitta, color: scoreColors.Pitta },
    { name: 'Kapha', score: scores.kapha, color: scoreColors.Kapha },
  ]
}

export function PrakritiScoreChart({ scores, compact = false }) {
  const data = chartData(scores)
  return (
    <div className={`prakriti-result-chart${compact ? ' prakriti-result-chart--compact' : ''}`} role="img" aria-label={`Illustrative demo score chart. Vata ${scores.vata}, Pitta ${scores.pitta}, Kapha ${scores.kapha}.`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E8EDF2" strokeDasharray="3 4" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#536477', fontSize: 12, fontWeight: 600 }} dy={8} />
          <YAxis allowDecimals={false} domain={[0, 15]} axisLine={false} tickLine={false} tick={{ fill: '#8996A8', fontSize: 10 }} tickCount={6} />
          <Tooltip cursor={{ fill: 'rgba(15, 139, 141, 0.06)' }} contentStyle={{ border: '1px solid #E2E8EF', borderRadius: 10, boxShadow: '0 8px 24px rgba(20,43,69,.10)', fontSize: 12 }} formatter={(value, name) => [`${value} of 15 answers`, `${name} · illustrative demo score`]} />
          <Bar dataKey="score" name="Score" radius={[5, 5, 0, 0]} maxBarSize={54} isAnimationActive={false}>{data.map((item) => <Cell key={item.name} fill={item.color} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function PrakritiResult({ result, participantName, onSave, onClose }) {
  const scoreItems = [
    { name: 'Vata', score: result.scores.vata, color: scoreColors.Vata },
    { name: 'Pitta', score: result.scores.pitta, color: scoreColors.Pitta },
    { name: 'Kapha', score: result.scores.kapha, color: scoreColors.Kapha },
  ]

  return (
    <TrialModal title="Illustrative Assessment Result" description="Educational demo only · not a diagnosis or medically validated assessment." onClose={onClose} size="large">
      <div className="prakriti-result">
        <div className={`prakriti-result__summary${result.scores.isBalanced ? ' prakriti-result__summary--balanced' : ''}`}>
          <span className="prakriti-result__eyebrow">Demo result for {participantName}</span>
          <h3>{result.scores.dominant}</h3>
          <p>{result.scores.isBalanced
            ? `The highest demo scores are tied across ${result.scores.topTypes.join(' and ')}. This is shown as a balanced / mixed result rather than selecting one.`
            : `${result.scores.dominant} received the most selected responses in this illustrative scoring example.`}</p>
        </div>
        <div className="prakriti-result__content">
          <Card padding="medium" className="prakriti-result__chart-card"><div className="prakriti-result__section-heading"><div><h4>Response Score Distribution</h4><p>Each selected answer contributes one demo point.</p></div><span>15 questions</span></div><PrakritiScoreChart scores={result.scores} /></Card>
          <div className="prakriti-result__score-list" aria-label="Illustrative scores">
            {scoreItems.map((item) => <Card key={item.name} className="prakriti-score-card"><span className="prakriti-score-card__dot" style={{ backgroundColor: item.color }} /><div><span>{item.name}</span><small>Demo score</small></div><strong>{item.score}<small> / 15</small></strong></Card>)}
          </div>
        </div>
        <p className="prakriti-disclaimer">This simple scoring is for educational interface demonstration only. It is not a validated assessment, medical diagnosis, measure of health, or source of recommendations.</p>
        <div className="trial-modal__footer"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={() => onSave(result)}><Save size={15} aria-hidden="true" /> Save to Demo Assessments</Button></div>
      </div>
    </TrialModal>
  )
}
