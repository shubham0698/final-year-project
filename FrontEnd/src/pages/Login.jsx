import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthField from '../components/auth/AuthField.jsx'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import Button from '../components/Button.jsx'
import './AuthPages.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [feedback, setFeedback] = useState('')

  const errors = {
    email: !values.email.trim()
      ? 'Enter your email address.'
      : !emailPattern.test(values.email.trim())
        ? 'Enter a valid email address.'
        : '',
    password: values.password ? '' : 'Enter your password.',
  }

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFeedback('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setTouched({ email: true, password: true })
    if (!errors.email && !errors.password) {
      setFeedback('This interface preview does not sign in to an account.')
    } else {
      setFeedback('Please review the highlighted fields.')
    }
  }

  return (
    <AuthLayout variant="login">
      <div className="auth-form-heading">
        <span className="auth-form-eyebrow">Secure workspace access</span>
        <h1>Welcome Back</h1>
        <p>Sign in to access your clinical research workspace.</p>
      </div>

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <AuthField
          id="login-email"
          name="email"
          label="Email Address"
          type="email"
          value={values.email}
          onChange={updateField}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          placeholder="you@organization.org"
          autoComplete="email"
          inputMode="email"
          icon={Mail}
          error={touched.email ? errors.email : ''}
        />
        <AuthField
          id="login-password"
          name="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={updateField}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={LockKeyhole}
          error={touched.password ? errors.password : ''}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((current) => !current)}
        />

        <div className="auth-form-options">
          <label className="auth-checkbox-label">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            <span className="auth-custom-checkbox" aria-hidden="true" />
            <span>Remember me</span>
          </label>
          <a className="auth-text-link" href="#forgot-password" onClick={(event) => event.preventDefault()}>Forgot password?</a>
        </div>

        {feedback && <p className="auth-form-feedback" role="status">{feedback}</p>}
        <Button className="auth-submit" type="submit" variant="primary" size="large">
          Sign In <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </form>

      <p className="auth-switch">New to AIIA? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  )
}
