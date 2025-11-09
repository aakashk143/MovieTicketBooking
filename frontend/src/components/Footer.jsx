import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const newsletterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required')
})

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false)
  const [scrollTop, setScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleSubscribe(values, { setSubmitting, resetForm }) {
    setTimeout(() => {
      setSubscribed(true)
      resetForm()
      setSubmitting(false)
      setTimeout(() => setSubscribed(false), 2500)
    }, 400)
  }

  function openMap() {
    window.open('https://www.google.com/maps?q=Mumbai,+Maharashtra,+India', '_blank')
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <footer className="bg-dark text-light py-4 mt-4 position-relative">
        <div className="container small">
          <div className="row g-3">
            {/* Quick Links */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold mb-2 footer-title">🏠 Quick Links</h6>
              <ul className="list-unstyled mb-0">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/browse', label: 'Movies' },
                  { to: '/dashboard', label: 'Theatres' },
                  { to: '/browse', label: 'Book Tickets' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-light text-decoration-none footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold mb-2 footer-title">📱 Follow Us</h6>
              <div className="d-flex gap-2 flex-wrap">
                {[
                  { href: 'https://www.facebook.com/share/14MW6cpbvrQ/', icon: 'fa-facebook-f', color: '#1877f2' },
                  { href: 'https://www.instagram.com/aakashk_29/', icon: 'fa-instagram', color: '#e4405f' },
                 { href: 'https://www.linkedin.com/in/someshvart1', icon: 'fa-linkedin-in', color: '#0a66c2' },
                  { href: 'https://youtube.com', icon: 'fa-youtube', color: '#ff0000' }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    style={{ '--hover-color': social.color }}
                  >
                    <i className={`fab ${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold mb-2 footer-title">✉️ Newsletter</h6>
              {subscribed ? (
                <div className="alert alert-success py-1 mb-0 small text-center">
                  ✅ Subscribed!
                </div>
              ) : (
                <Formik initialValues={{ email: '' }} validationSchema={newsletterSchema} onSubmit={handleSubscribe}>
                  {({ isSubmitting, touched, errors }) => (
                    <Form>
                      <div className="mb-1">
                        <Field
                          type="email"
                          name="email"
                          placeholder="Your email"
                          className={`form-control form-control-sm ${
                            touched.email && errors.email ? 'is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback small" />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-sm w-100 subscribe-btn">
                        {isSubmitting ? '...' : 'Subscribe'}
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold mb-2 footer-title">📍 Contact</h6>
              <p className="mb-1 small">
                <i className="fas fa-map-marker-alt me-2"></i>Mumbai, India
              </p>
              <button onClick={openMap} className="btn btn-outline-light btn-sm mb-2 py-1 px-2">
                Map
              </button>
              <div>
                <a href="tel:+919876543210" className="text-light text-decoration-none d-block small mb-1">
                  <i className="fas fa-phone me-2"></i>+91 98765 43210
                </a>
                <a href="mailto:support@bookscreen.in" className="text-light text-decoration-none small">
                  <i className="fas fa-envelope me-2"></i>support@bookscreen.in
                </a>
              </div>
            </div>
          </div>

          <hr className="bg-light my-3" />

          <div className="text-center small">
            <p className="mb-1">
              <strong>🎬 BookScreen</strong> — Your movie booking hub
            </p>
            <p className="text-muted mb-0">&copy; 2024 BookScreen. Made with ❤️ for movie lovers</p>
          </div>
        </div>

        {scrollTop && (
          <button onClick={scrollToTop} className="scroll-top-btn">
            <i className="fas fa-arrow-up"></i>
          </button>
        )}
      </footer>

      <style>{`
        .footer-title {
          position: relative;
          padding-bottom: 5px;
        }
        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #0d6efd, #764ba2);
        }
        .footer-link {
          display: block;
          font-size: 0.9rem;
          transition: all 0.3s;
          padding: 2px 0;
        }
        .footer-link:hover {
          color: #0d6efd !important;
          transform: translateX(5px);
        }
        .social-icon {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          transition: all 0.3s;
        }
        .social-icon:hover {
          background: var(--hover-color);
          transform: translateY(-3px) scale(1.1);
        }
        .subscribe-btn {
          font-size: 0.85rem;
          padding: 4px 0;
        }
        .scroll-top-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        .scroll-top-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 5px 15px rgba(102,126,234,0.5);
        }
      `}</style>
    </>
  )
}
