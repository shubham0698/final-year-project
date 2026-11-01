import { Edit3, Info } from 'lucide-react'
import Button from '../Button.jsx'
import TrialModal from '../trials/TrialModal.jsx'
import { prakritiQuestions } from '../../data/ayurvedaData.js'
import { formatTrialDate } from '../../utils/trialFormatting.js'
import { PrakritiScoreChart } from './PrakritiResult.jsx'

export default function PrakritiDetailsModal({ assessment, onClose, onEdit }) {
  return (
    <TrialModal title="Assessment Details" description="Fictional past assessment · educational demo only, not a diagnosis." onClose={onClose} size="large">
      <div className="prakriti-details">
        <div className="prakriti-details__identity"><div><span className="prakriti-details__id">{assessment.id}</span><h3>{assessment.participantName}</h3><p>{assessment.participantId} · {formatTrialDate(assessment.assessmentDate)}</p></div><strong>{assessment.dominant}</strong></div>
        <div className="prakriti-details__score-layout">
          <section className="prakriti-details__scores"><h4>Illustrative Demo Scores</h4><PrakritiScoreChart scores={assessment.scores} compact /><div className="prakriti-disclaimer"><Info size={14} aria-hidden="true" /><span>Scores are a simple count of selected responses and are not clinically validated.</span></div></section>
          <section className="prakriti-details__answers"><h4>Past Questionnaire Answers <span>{Object.keys(assessment.answers).length} questions</span></h4><ol>{prakritiQuestions.map((question, index) => {
            const answer = assessment.answers[question.id]
            const label = answer ? question.options[answer] : 'No answer recorded'
            return <li key={question.id}><span className="prakriti-details__answer-number">{String(index + 1).padStart(2, '0')}</span><div><strong>{question.prompt}</strong><p><span className={`prakriti-details__dosha prakriti-details__dosha--${answer ?? 'none'}`}>{answer ? answer[0].toUpperCase() + answer.slice(1) : '—'}</span>{label}</p></div></li>
          })}</ol></section>
        </div>
        <p className="prakriti-disclaimer">This educational demonstration does not establish health status and must not be used for diagnosis or recommendations.</p>
        <div className="trial-modal__footer"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={() => onEdit(assessment)}><Edit3 size={15} aria-hidden="true" /> Recalculate Demo Assessment</Button></div>
      </div>
    </TrialModal>
  )
}
