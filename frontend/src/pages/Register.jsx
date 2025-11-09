import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import api from '../lib/api.js'

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
})

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleSubmit(values, { setSubmitting }) {
    setError('')
    try {
      await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password
      })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="register-wrapper d-flex justify-content-center align-items-center py-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #9a4ce9ff, #f1f8e9)'
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="text-center mb-3">
          <h3 className="fw-bold text-primary mb-1">Create Account </h3>
          <small className="text-muted">Join us to book your favorite movies</small>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                <small className="text-muted">
                  Must contain uppercase, lowercase, and a number
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100 fw-semibold"
                style={{
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? 'Creating Account...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3">
          <p className="mb-0">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .card {
          animation: fadeInUp 0.6s ease;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .btn-primary:hover {
          background-color: #1565c0 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  )
}
