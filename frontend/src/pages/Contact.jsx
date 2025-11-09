import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const contactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .required('Phone is required'),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required')
})

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(values, { setSubmitting, resetForm }) {
    setTimeout(() => {
      setSubmitted(true)
      resetForm()
      setSubmitting(false)
      setTimeout(() => setSubmitted(false), 5000)
    }, 1000)
  }

  function openMap() {
    window.open('https://www.google.com/maps?q=Mumbai,+Maharashtra,+India', '_blank')
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', // 🎨 Cinematic background
        color: 'white',
        minHeight: '100vh',
        paddingTop: '3rem',
        paddingBottom: '3rem'
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">📞 Contact Us</h1>
          <p className="lead text-light">Get in touch with us! We're here to help.</p>
        </div>

        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="card shadow-lg border-0 contact-card bg-light text-dark">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">Send us a Message</h3>

                {submitted && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>✅ Success!</strong> Your message has been sent. We'll get back to you soon!
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                  </div>
                )}

                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                  }}
                  validationSchema={contactSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label fw-semibold">
                            Full Name
                          </label>
                          <Field
                            type="text"
                            name="name"
                            id="name"
                            className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                            placeholder="Enter your name"
                          />
                          <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label fw-semibold">
                            Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter your email"
                          />
                          <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>

                        <div className="col-12">
                          <label htmlFor="phone" className="form-label fw-semibold">
                            Phone
                          </label>
                          <Field
                            type="tel"
                            name="phone"
                            id="phone"
                            className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                            placeholder="Enter your phone number"
                          />
                          <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                        </div>

                        <div className="col-12">
                          <label htmlFor="subject" className="form-label fw-semibold">
                            Subject
                          </label>
                          <Field
                            type="text"
                            name="subject"
                            id="subject"
                            className={`form-control ${touched.subject && errors.subject ? 'is-invalid' : ''}`}
                            placeholder="What is this about?"
                          />
                          <ErrorMessage name="subject" component="div" className="invalid-feedback" />
                        </div>

                        <div className="col-12">
                          <label htmlFor="message" className="form-label fw-semibold">
                            Message
                          </label>
                          <Field
                            as="textarea"
                            name="message"
                            id="message"
                            rows="5"
                            className={`form-control ${touched.message && errors.message ? 'is-invalid' : ''}`}
                            placeholder="Tell us more..."
                          />
                          <ErrorMessage name="message" component="div" className="invalid-feedback" />
                        </div>

                        <div className="col-12">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-lg w-100 contact-submit-btn"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Sending...
                              </>
                            ) : (
                              'Send Message'
                            )}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 h-100 contact-info-card bg-light text-dark">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">Contact Information</h3>

                <div className="contact-info-item mb-4">
                  <div className="d-flex align-items-start">
                    <div className="contact-icon me-3">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">📍 Location</h6>
                      <p className="text-muted mb-2">Mumbai, Maharashtra, India</p>
                      <button onClick={openMap} className="btn btn-outline-primary btn-sm map-btn">
                        <i className="fas fa-map-marked-alt me-2"></i>Show on Map
                      </button>
                    </div>
                  </div>
                </div>

                <div className="contact-info-item mb-4">
                  <div className="d-flex align-items-start">
                    <div className="contact-icon me-3">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">📞 Phone</h6>
                      <a href="tel:+919876543210" className="text-decoration-none contact-link">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-info-item mb-4">
                  <div className="d-flex align-items-start">
                    <div className="contact-icon me-3">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">✉️ Email</h6>
                      <a href="mailto:support@bookscreen.in" className="text-decoration-none contact-link">
                        support@bookscreen.in
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-top">
                  <h6 className="fw-bold mb-3">Follow Us</h6>
                  <div className="d-flex gap-3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-btn">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .contact-card { animation: slideInLeft 0.6s ease-out; }
          .contact-info-card { animation: slideInRight 0.6s ease-out; }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .contact-icon {
            width: 45px; height: 45px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 18px;
            transition: all 0.3s ease;
          }
          .contact-icon:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          }
          .contact-link {
            color: #0d6efd;
            transition: all 0.3s ease;
          }
          .contact-link:hover { color: #0a58ca; transform: translateX(5px); }
          .map-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
          }
          .social-btn {
            width: 40px; height: 40px;
            border-radius: 50%;
            background: #f8f9fa;
            display: flex; align-items: center; justify-content: center;
            color: #0d6efd;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          .social-btn:hover { transform: translateY(-5px) scale(1.1); color: white; }
          .social-btn:nth-child(1):hover { background: #1877f2; }
          .social-btn:nth-child(2):hover { background: #e4405f; }
          .social-btn:nth-child(3):hover { background: #1da1f2; }
          .social-btn:nth-child(4):hover { background: #ff0000; }
          .contact-submit-btn {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          .contact-submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
          }
          .contact-submit-btn::before {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            width: 0; height: 0;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }
          .contact-submit-btn:hover::before {
            width: 300px; height: 300px;
          }
        `}</style>
      </div>
    </div>
  )
}
