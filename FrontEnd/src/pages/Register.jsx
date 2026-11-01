import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../api/axiosInstance'

import AuthField from '../components/auth/AuthField.jsx'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import Button from '../components/Button.jsx'
import './AuthPages.css'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const initialValues = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' }

export default function Register() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [feedback, setFeedback] = useState('')

  const errors = {
    fullName: values.fullName.trim() ? '' : 'Enter your full name.',
    email: !values.email.trim()
      ? 'Enter your email address.'
      : !emailPattern.test(values.email.trim())
        ? 'Enter a valid email address.'
        : '',
    phone: values.phone.trim() ? '' : 'Enter your phone number.',
    password: !values.password
      ? 'Create a password.'
      : values.password.length < 8
        ? 'Use at least 8 characters.'
        : '',
    confirmPassword: !values.confirmPassword
      ? 'Confirm your password.'
      : values.confirmPassword !== values.password
        ? 'Passwords do not match.'
        : '',
    terms: termsAccepted ? '' : 'Accept the Terms and Conditions to continue.',
  }

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFeedback('')
  }


  async function handleSubmit(event) {

    event.preventDefault()

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      terms: true
    })

    // Frontend validation
    if (!Object.values(errors).every((error) => !error)) {
      setFeedback('Please review the highlighted fields.')
      return
    }

    try {

      setIsSubmitting(true)
      setFeedback('')

      // Send registration details to backend
      const response = await api.post('/api/auth/create', {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password
      })

      // Check registration response
      if (response.status === 201) {

        setFeedback('Registration successful! Redirecting to login...')

        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 1500)

      } else {

        setFeedback('Unexpected response from server.')

      }

    } catch (error) {

      console.error('Registration error:', error)

      setFeedback(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      )

    } finally {

      setIsSubmitting(false)

    }
  }

  return (
    <AuthLayout variant="register">
      <div className="auth-form-heading">
        <span className="auth-form-eyebrow">Join the research workspace</span>
        <h1>Create Your Account</h1>
        <p>Register to access the AIIA clinical research platform.</p>
      </div>

      <form className="auth-form auth-form--register" noValidate onSubmit={handleSubmit}>
        <AuthField
          id="register-full-name"
          name="fullName"
          label="Full Name"
          value={values.fullName}
          onChange={updateField}
          onBlur={() => setTouched((current) => ({ ...current, fullName: true }))}
          placeholder="Your full name"
          autoComplete="name"
          icon={UserRound}
          error={touched.fullName ? errors.fullName : ''}
        />
        <AuthField
          id="register-email"
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
          id="register-phone"
          name="phone"
          label="Phone Number"
          type="tel"
          value={values.phone}
          onChange={updateField}
          onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
          placeholder="Your contact number"
          autoComplete="tel"
          inputMode="tel"
          icon={Phone}
          error={touched.phone ? errors.phone : ''}
        />
        <div className="auth-form__password-row">
          <AuthField
            id="register-password"
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={updateField}
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            icon={LockKeyhole}
            error={touched.password ? errors.password : ''}
            minLength={8}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((current) => !current)}
          />
          <AuthField
            id="register-confirm-password"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={values.confirmPassword}
            onChange={updateField}
            onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            icon={LockKeyhole}
            error={touched.confirmPassword ? errors.confirmPassword : ''}
            minLength={8}
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword((current) => !current)}
          />
        </div>

        <div className="auth-terms-field">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => {
                setTermsAccepted(event.target.checked)
                setTouched((current) => ({ ...current, terms: true }))
                setFeedback('')
              }}
              aria-invalid={Boolean(touched.terms && errors.terms)}
              aria-describedby={touched.terms && errors.terms ? 'register-terms-error' : undefined}
            />
            <span className="auth-custom-checkbox" aria-hidden="true" />
            <span>I agree to the <a className="auth-text-link" href="#terms" onClick={(event) => event.preventDefault()}>Terms and Conditions</a></span>
          </label>
          {touched.terms && errors.terms && <span className="auth-field__error" id="register-terms-error">{errors.terms}</span>}
        </div>

        {feedback && <p className="auth-form-feedback" role="status">{feedback}</p>}
        <Button
          className="auth-submit"
          type="submit"
          variant="primary"
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}

          {!isSubmitting && (
            <ArrowRight size={17} aria-hidden="true" />
          )}
        </Button>
      </form>

      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  )
}
