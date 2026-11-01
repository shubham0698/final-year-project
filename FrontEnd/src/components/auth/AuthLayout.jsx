import { ArrowUpRight, ClipboardCheck, FlaskConical, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../Card.jsx'

export default function AuthLayout({ children, variant }) {
  return (
    <main className="auth-page">
      <div className={`auth-shell auth-shell--${variant}`}>
        <section className="auth-main" aria-label="AIIA account form">
          <Link className="auth-brand" to="/" aria-label="AIIA Clinical Trial Management System home">
            <span className="auth-brand__mark" aria-hidden="true">A</span>
            <span className="auth-brand__copy"><strong>AIIA</strong><span>Clinical Trial Management System</span></span>
          </Link>

          <Card className="auth-card" padding="small">
            {children}
          </Card>

          <p className="auth-footnote">AIIA Clinical Trial Management System <span aria-hidden="true">·</span> Interface preview only</p>
        </section>

        <aside className="auth-visual" aria-label="About the AIIA research platform">
          <div className="auth-visual__orb auth-visual__orb--one" />
          <div className="auth-visual__orb auth-visual__orb--two" />
          <div className="auth-visual__content">
            <div className="auth-visual__eyebrow"><span /> Clinical research workspace</div>
            <h2>Research moves forward when every detail has a place.</h2>
            <p>A considered workspace for the people and processes behind clinical trials.</p>

            <div className="auth-visual__illustration" aria-hidden="true">
              <div className="auth-illustration__topline"><span /><span /><span /></div>
              <div className="auth-illustration__body">
                <div className="auth-illustration__rail"><span /><span /><span /><span /></div>
                <div className="auth-illustration__workspace">
                  <div className="auth-illustration__title"><span /><span /></div>
                  <div className="auth-illustration__cards"><span /><span /><span /></div>
                  <div className="auth-illustration__chart"><i /><i /><i /><i /><i /><i /></div>
                </div>
              </div>
            </div>

            <div className="auth-visual__features">
              <span><ShieldCheck size={16} aria-hidden="true" /> Thoughtful by design</span>
              <span><ClipboardCheck size={16} aria-hidden="true" /> Built around research workflows</span>
              <span><FlaskConical size={16} aria-hidden="true" /> One connected workspace</span>
            </div>
          </div>
          <div className="auth-visual__footer"><span>AIIA Clinical Trials</span><ArrowUpRight size={16} aria-hidden="true" /></div>
        </aside>
      </div>
    </main>
  )
}
