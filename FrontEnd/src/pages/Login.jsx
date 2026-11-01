import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import AuthField from '../components/auth/AuthField.jsx'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import Button from '../components/Button.jsx'
import api from '../api/axiosInstance'

import './AuthPages.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {

  const navigate = useNavigate()

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Frontend validation
  const errors = {
    email: !values.email.trim()
      ? 'Enter your email address.'
      : !emailPattern.test(values.email.trim())
        ? 'Enter a valid email address.'
        : '',

    password: values.password ? '' : 'Enter your password.',
  }

  // Update form fields
  function updateField(event) {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value
    }))

    setFeedback('')
  }

  // Handle login
  async function handleSubmit(event) {

    event.preventDefault()

    setTouched({
      email: true,
      password: true
    })

    // Check frontend validation
    if (errors.email || errors.password) {
      setFeedback('Please review the highlighted fields.')
      return
    }

    try {

      setIsSubmitting(true)
      setFeedback('')

      // Send credentials to Spring Boot backend
      const response = await api.post('/api/auth/login', {
        email: values.email.trim(),
        password: values.password.trim()
      })

      // Extract JWT token
      const token = response.data.token

      if (!token) {
        throw new Error('Authentication token was not received.')
      }

      // Store JWT in cookie
      Cookies.set('token', token, {
        expires: remember ? 7 : undefined,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax'
      })

      setFeedback('Login successful!')

      // Redirect to application dashboard
      navigate('/app', { replace: true })

    } catch (error) {

      console.error('Login error:', error)

      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.'

      setFeedback(message)

    } finally {

      setIsSubmitting(false)

    }
  }

  return (
    <AuthLayout variant="login">

      <div className="auth-form-heading">
        <span className="auth-form-eyebrow">
          Secure workspace access
        </span>

        <h1>Welcome Back</h1>

        <p>
          Sign in to access your clinical research workspace.
        </p>
      </div>

      <form
        className="auth-form"
        noValidate
        onSubmit={handleSubmit}
      >

        <AuthField
          id="login-email"
          name="email"
          label="Email Address"
          type="email"
          value={values.email}
          onChange={updateField}
          onBlur={() =>
            setTouched((current) => ({
              ...current,
              email: true
            }))
          }
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
          onBlur={() =>
            setTouched((current) => ({
              ...current,
              password: true
            }))
          }
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={LockKeyhole}
          error={touched.password ? errors.password : ''}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword((current) => !current)
          }
        />

        <div className="auth-form-options">

          <label className="auth-checkbox-label">

            <input
              type="checkbox"
              checked={remember}
              onChange={(event) =>
                setRemember(event.target.checked)
              }
            />

            <span
              className="auth-custom-checkbox"
              aria-hidden="true"
            />

            <span>Remember me</span>

          </label>

          <a
            className="auth-text-link"
            href="#forgot-password"
            onClick={(event) => event.preventDefault()}
          >
            Forgot password?
          </a>

        </div>

        {feedback && (
          <p
            className="auth-form-feedback"
            role="status"
          >
            {feedback}
          </p>
        )}

        <Button
          className="auth-submit"
          type="submit"
          variant="primary"
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}

          {!isSubmitting && (
            <ArrowRight size={17} aria-hidden="true" />
          )}

        </Button>

      </form>

      <p className="auth-switch">
        New to AIIA? <Link to="/register">Create an account</Link>
      </p>

    </AuthLayout>
  )
}
