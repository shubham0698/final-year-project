import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '../Button.jsx'
import TrialModal from '../trials/TrialModal.jsx'
import { initialParticipants } from '../../data/participantsData.js'
import { prakritiQuestions } from '../../data/ayurvedaData.js'
import { calculatePrakritiScores, validatePrakritiAnswers } from '../../utils/prakritiScoring.js'

const doshaNames = { vata: 'Vata', pitta: 'Pitta', kapha: 'Kapha' }

export default function PrakritiQuestionnaire({ assessment, onClose, onCalculate }) {
  const [participantId, setParticipantId] = useState(assessment?.participantId ?? '')
  const [answers, setAnswers] = useState(assessment?.answers ?? {})
  const [step, setStep] = useState(0)
  const [participantError, setParticipantError] = useState('')
  const [questionError, setQuestionError] = useState('')
  const question = prakritiQuestions[step]
  const answeredCount = prakritiQuestions.reduce((count, item) => count + (answers[item.id] ? 1 : 0), 0)
  const participant = initialParticipants.find((item) => item.id === participantId)

  function selectAnswer(questionId, dosha) {
    setAnswers((current) => ({ ...current, [questionId]: dosha }))
    setQuestionError('')
  }

  function calculate() {
    const validation = validatePrakritiAnswers(answers, prakritiQuestions.length)
    if (!participantId) setParticipantError('Select a fictional participant to continue.')
    if (!validation.isValid) {
      setQuestionError(validation.message)
      const firstMissing = prakritiQuestions.findIndex((item) => validation.missing.includes(item.id))
      setStep(Math.max(firstMissing, 0))
      return
    }
    if (!participant) {
      setParticipantError('Select a fictional participant to continue.')
      return
    }
    onCalculate({
      participantId,
      answers: { ...answers },
      scores: calculatePrakritiScores(answers, prakritiQuestions.length),
      editId: assessment?.id,
    })
  }

  return (
    <TrialModal title={assessment ? 'Edit Demo Assessment' : 'New Prakriti Assessment'} description="Educational questionnaire · not a diagnostic or validated assessment." onClose={onClose} size="large">
      <div className="prakriti-questionnaire">
        <div className="prakriti-questionnaire__participant">
          <label htmlFor="prakriti-participant">Fictional Participant <span aria-hidden="true">*</span></label>
          <select id="prakriti-participant" value={participantId} onChange={(event) => { setParticipantId(event.target.value); setParticipantError('') }} aria-invalid={Boolean(participantError)} aria-describedby={participantError ? 'prakriti-participant-error' : 'prakriti-participant-help'}>
            <option value="">Select a demo participant</option>
            {initialParticipants.map((item) => <option value={item.id} key={item.id}>{item.fullName} · {item.id}</option>)}
          </select>
          {participantError ? <span id="prakriti-participant-error" className="prakriti-form-error">{participantError}</span> : <span id="prakriti-participant-help" className="prakriti-questionnaire__hint">Participant names come from fictional sample records.</span>}
        </div>

        <div className="prakriti-questionnaire__progress">
          <div className="prakriti-questionnaire__progress-top"><span>Question {step + 1} of {prakritiQuestions.length}</span><strong>{answeredCount}/{prakritiQuestions.length} answered</strong></div>
          <div className="prakriti-progress-track" role="progressbar" aria-label="Questionnaire completion" aria-valuemin="0" aria-valuemax={prakritiQuestions.length} aria-valuenow={answeredCount}><span style={{ width: `${(answeredCount / prakritiQuestions.length) * 100}%` }} /></div>
          <div className="prakriti-step-dots" aria-label={`Viewing question ${step + 1} of ${prakritiQuestions.length}`}>{prakritiQuestions.map((item, index) => <button type="button" key={item.id} className={`${index === step ? 'is-current ' : ''}${answers[item.id] ? 'is-answered' : ''}`} aria-label={`Go to question ${index + 1}${answers[item.id] ? ', answered' : ', unanswered'}`} aria-current={index === step ? 'step' : undefined} onClick={() => setStep(index)} />)}</div>
        </div>

        <section className="prakriti-question" aria-live="polite" aria-labelledby={`prakriti-prompt-${question.id}`}>
          <span className="prakriti-question__eyebrow">Educational prompt {String(step + 1).padStart(2, '0')}</span>
          <fieldset>
            <legend id={`prakriti-prompt-${question.id}`}>{question.prompt}</legend>
            <div className="prakriti-answer-options">
              {Object.entries(question.options).map(([dosha, label]) => (
                <label key={dosha} className={`prakriti-answer-option prakriti-answer-option--${dosha}${answers[question.id] === dosha ? ' is-selected' : ''}`}>
                  <input type="radio" name={`answer-${question.id}`} value={dosha} checked={answers[question.id] === dosha} onChange={() => selectAnswer(question.id, dosha)} />
                  <span className="prakriti-answer-option__body"><strong>{doshaNames[dosha]}</strong><span>{label}</span></span>
                  {answers[question.id] === dosha && <CheckCircle2 size={17} aria-hidden="true" />}
                </label>
              ))}
            </div>
          </fieldset>
          {questionError && <p className="prakriti-form-error" role="alert">{questionError}</p>}
        </section>

        <p className="prakriti-disclaimer">This questionnaire is an illustrative educational demo. It is not medically validated, does not determine health status, and does not provide recommendations.</p>
        <div className="prakriti-questionnaire__footer">
          <Button variant="outline" disabled={step === 0} onClick={() => { setStep((current) => Math.max(0, current - 1)); setQuestionError('') }}><ArrowLeft size={15} aria-hidden="true" /> Previous</Button>
          <span className="prakriti-questionnaire__footer-step">{step + 1} / {prakritiQuestions.length}</span>
          {step < prakritiQuestions.length - 1
            ? <Button onClick={() => { setStep((current) => Math.min(prakritiQuestions.length - 1, current + 1)); setQuestionError('') }}>Next <ArrowRight size={15} aria-hidden="true" /></Button>
            : <Button onClick={calculate}>Calculate Demo Result <ArrowRight size={15} aria-hidden="true" /></Button>}
        </div>
      </div>
    </TrialModal>
  )
}
