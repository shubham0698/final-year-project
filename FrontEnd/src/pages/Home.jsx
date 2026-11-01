import { useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarClock,
  ChartNoAxesCombined,
  Check,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  History,
  Leaf,
  Menu,
  ScrollText,
  ShieldCheck,
  TriangleAlert,
  UserRoundPlus,
  UsersRound,
  Waypoints,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import './Home.css'

const platformFeatures = [
  {
    title: 'Clinical Trial Management',
    description: 'Organize study details, timelines, and operational tasks in one clear workspace.',
    icon: FlaskConical,
    tone: 'teal',
  },
  {
    title: 'Participant Management',
    description: 'Keep participant information structured and connected to the study journey.',
    icon: UsersRound,
    tone: 'blue',
  },
  {
    title: 'Ayurveda Prakriti Assessment',
    description: 'Support dedicated assessment workflows within a consistent research process.',
    icon: Leaf,
    tone: 'green',
  },
  {
    title: 'Regulatory & Compliance',
    description: 'Keep essential research documentation organized for review and follow-up.',
    icon: ShieldCheck,
    tone: 'gold',
  },
]

const workflowSteps = [
  { title: 'Register and Configure Trial', description: 'Set up the study workspace and its core details.', icon: FileCheck2 },
  { title: 'Enroll Participants', description: 'Organize participant records around the study.', icon: UserRoundPlus },
  { title: 'Manage Visits and Research Data', description: 'Coordinate visits and collect structured information.', icon: CalendarClock },
  { title: 'Monitor Safety and Generate Reports', description: 'Review activity and prepare research summaries.', icon: ChartNoAxesCombined },
]

const additionalFeatures = [
  { title: 'eCRF & Data Collection', description: 'Structured forms for research information.', icon: ClipboardList },
  { title: 'Visit Scheduling', description: 'Plan and coordinate study visit activity.', icon: CalendarClock },
  { title: 'Adverse Event Monitoring', description: 'Organize safety event documentation and review.', icon: TriangleAlert },
  { title: 'Reports & Analytics', description: 'A space for study reporting and useful summaries.', icon: ChartNoAxesCombined },
  { title: 'Audit Trail', description: 'Keep workspace activity easy to review.', icon: History },
  { title: 'Notifications', description: 'Bring relevant workspace updates into view.', icon: Bell },
]

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Research', href: '#research' },
  { label: 'Contact', href: '#contact' },
]

function Brand({ footer = false }) {
  return (
    <Link className={`landing-brand${footer ? ' landing-brand--footer' : ''}`} to="/" aria-label="AIIA home">
      <span className="landing-brand__mark" aria-hidden="true">A</span>
      <span className="landing-brand__text"><strong>AIIA</strong><span>Clinical Trial Management</span></span>
    </Link>
  )
}

function SectionHeading({ id, eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`landing-section-heading landing-section-heading--${align}`}>
      <span className="landing-eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

function HeroIllustration() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-art__orbit hero-art__orbit--outer" />
      <div className="hero-art__orbit hero-art__orbit--inner" />
      <div className="hero-art__glow" />
      <div className="hero-dashboard">
        <div className="hero-dashboard__topbar">
          <span className="hero-dashboard__brandmark">A</span>
          <span className="hero-dashboard__heading"><i /><i /></span>
          <span className="hero-dashboard__avatar">A</span>
        </div>
        <div className="hero-dashboard__body">
          <div className="hero-dashboard__sidebar"><i /><i /><i /><i /><i /></div>
          <div className="hero-dashboard__content">
            <div className="hero-dashboard__title"><i /><i /></div>
            <div className="hero-dashboard__summary">
              <div><span><FlaskConical size={14} /></span><i /><b /></div>
              <div><span><UsersRound size={14} /></span><i /><b /></div>
              <div><span><ClipboardCheck size={14} /></span><i /><b /></div>
            </div>
            <div className="hero-dashboard__lower">
              <div className="hero-dashboard__chart">
                <div className="hero-dashboard__chart-title"><i /><i /></div>
                <div className="hero-dashboard__bars"><i /><i /><i /><i /><i /><i /><i /></div>
                <div className="hero-dashboard__chart-axis"><i /><i /><i /><i /></div>
              </div>
              <div className="hero-dashboard__list"><i /><i /><i /><i /><i /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-float hero-float--study"><span><Waypoints size={17} /></span><div><i /><i /></div><Check size={15} /></div>
      <div className="hero-float hero-float--participant"><span><UsersRound size={17} /></span><div><i /><i /></div></div>
      <div className="hero-art__caption"><span /> Thoughtfully connected research workflows</div>
    </div>
  )
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header__inner">
          <Brand />
          <button
            className="landing-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="landing-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
          <nav className={`landing-nav${menuOpen ? ' landing-nav--open' : ''}`} id="landing-navigation" aria-label="Main navigation">
            <div className="landing-nav__links">
              {navigation.map(({ label, href }) => (
                <a key={href} href={href} onClick={closeMenu}>{label}</a>
              ))}
            </div>
            <div className="landing-nav__actions">
              <Button as={Link} to="/login" variant="outline" size="small" onClick={closeMenu}>Log in</Button>
              <Button as={Link} to="/register" variant="primary" size="small" onClick={closeMenu}>Get Started <ArrowRight size={15} aria-hidden="true" /></Button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="home" aria-labelledby="hero-title">
          <div className="landing-container landing-hero__grid">
            <div className="landing-hero__copy">
              <span className="landing-eyebrow"><span className="landing-eyebrow__dot" /> A considered clinical research workspace</span>
              <h1 id="hero-title">Advancing Clinical Research Through <span>Intelligent Digital Management</span></h1>
              <p>A unified platform designed to streamline clinical trial operations, participant management, research documentation, and regulatory workflows.</p>
              <div className="landing-hero__actions">
                <Button as={Link} to="/login" variant="primary" size="large">Explore Platform <ArrowRight size={17} aria-hidden="true" /></Button>
                <Button as={Link} to="/register" variant="outline" size="large">Get Started</Button>
              </div>
              <div className="landing-hero__note"><ShieldCheck size={15} aria-hidden="true" /> Designed for organized research operations</div>
            </div>
            <HeroIllustration />
          </div>
          <a className="landing-hero__scroll" href="#features" aria-label="Scroll to platform highlights"><ArrowDown size={17} aria-hidden="true" /></a>
        </section>

        <section className="landing-section landing-features" id="features" aria-labelledby="features-title">
          <div className="landing-container">
            <SectionHeading
              id="features-title"
              eyebrow="Platform highlights"
              title="Research operations, thoughtfully organized"
              description="Purposeful tools bring the essential parts of a clinical research workflow into one considered platform."
              align="center"
            />
            <div className="feature-grid">
              {platformFeatures.map(({ title, description, icon: Icon, tone }, index) => (
                <Card as="article" className="feature-card" key={title}>
                  <div className={`feature-card__icon feature-card__icon--${tone}`}><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></div>
                  <span className="feature-card__index">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <a href="#research" aria-label={`Learn how ${title} fits the platform workflow`}><ArrowUpRight size={17} aria-hidden="true" /></a>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-about" id="about" aria-labelledby="about-title">
          <div className="landing-container landing-about__grid">
            <div className="landing-about__copy">
              <SectionHeading
                id="about-title"
                eyebrow="About the platform"
                title="A clearer way to coordinate research work"
                description="AIIA CTMS supports organized clinical research workflows, structured participant information, documentation, and trial monitoring."
              />
              <p className="landing-about__detail">Bring everyday study operations into a shared workspace. Keep trial information easy to follow, connect participant records to study activity, and make documentation easier for teams to organize and review.</p>
              <Button as={Link} to="/login" variant="outline">Explore the platform <ArrowRight size={16} aria-hidden="true" /></Button>
            </div>
            <div className="about-visual" aria-label="Illustration of connected research workflow areas">
              <div className="about-visual__halo about-visual__halo--one" />
              <div className="about-visual__halo about-visual__halo--two" />
              <div className="about-node about-node--center"><span className="about-node__brand">A</span><strong>AIIA CTMS</strong><small>Research workspace</small></div>
              <div className="about-node about-node--trials"><span><FlaskConical size={19} /></span><strong>Study operations</strong></div>
              <div className="about-node about-node--people"><span><UsersRound size={19} /></span><strong>Participant records</strong></div>
              <div className="about-node about-node--records"><span><ScrollText size={19} /></span><strong>Research records</strong></div>
              <div className="about-node about-node--monitor"><span><ChartNoAxesCombined size={19} /></span><strong>Trial monitoring</strong></div>
              <div className="about-visual__connector about-visual__connector--one" />
              <div className="about-visual__connector about-visual__connector--two" />
              <div className="about-visual__connector about-visual__connector--three" />
              <div className="about-visual__connector about-visual__connector--four" />
            </div>
          </div>
        </section>

        <section className="landing-section landing-workflow" id="research" aria-labelledby="workflow-title">
          <div className="landing-container">
            <SectionHeading
              id="workflow-title"
              eyebrow="A connected workflow"
              title="From study setup to ongoing review"
              description="A flexible sequence of work areas helps teams keep important study activities in view."
              align="center"
            />
            <ol className="workflow-grid">
              {workflowSteps.map(({ title, description, icon: Icon }, index) => (
                <li className="workflow-step" key={title}>
                  <div className="workflow-step__marker"><Icon size={22} strokeWidth={1.8} aria-hidden="true" /><span>{index + 1}</span></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="landing-section landing-capabilities" aria-labelledby="capabilities-title">
          <div className="landing-container">
            <SectionHeading
              id="capabilities-title"
              eyebrow="One connected workspace"
              title="Tools for the work around every study"
              description="Keep day-to-day research activities connected with dedicated areas for coordination, documentation, and review."
              align="center"
            />
            <div className="capability-grid">
              {additionalFeatures.map(({ title, description, icon: Icon }) => (
                <article className="capability-item" key={title}>
                  <span className="capability-item__icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-cta" id="contact" aria-labelledby="cta-title">
          <div className="landing-container landing-cta__inner">
            <div className="landing-cta__copy">
              <span className="landing-eyebrow">AIIA Clinical Trial Management System</span>
              <h2 id="cta-title">Bring Your Clinical Research Workflow Together</h2>
              <p>Explore a workspace designed to help organize the moving parts of clinical research.</p>
            </div>
            <div className="landing-cta__actions">
              <Button as={Link} to="/register" variant="secondary" size="large">Create Account <ArrowRight size={17} aria-hidden="true" /></Button>
              <Button as={Link} to="/login" variant="outline" size="large">Sign In</Button>
            </div>
            <div className="landing-cta__decoration" aria-hidden="true"><span /><span /><span /></div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer__main">
            <div className="landing-footer__brand-block">
              <Brand footer />
              <p>A considered workspace for clinical trial operations, participant information, and research documentation.</p>
            </div>
            <div className="landing-footer__links">
              <div><h2>Explore</h2><a href="#about">About</a><a href="#features">Platform features</a><a href="#research">Research workflow</a></div>
              <div><h2>Account</h2><Link to="/login">Sign in</Link><Link to="/register">Create an account</Link></div>
            </div>
          </div>
          <div className="landing-footer__bottom"><span>© {new Date().getFullYear()} AIIA Clinical Trial Management System</span><span>Interface preview · No clinical services are provided here</span></div>
        </div>
      </footer>
    </div>
  )
}

export default Home
