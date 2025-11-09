import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function NavBar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top ${
          scrolled ? 'navbar-scrolled' : 'navbar-default'
        }`}
      >
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold brand-animated">
            🎬 BookScreen
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMain"
            aria-controls="navMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMain">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link nav-link-animated ${
                    location.pathname === '/' ? 'active' : ''
                  }`}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link nav-link-animated ${
                    location.pathname === '/about' ? 'active' : ''
                  }`}
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link nav-link-animated ${
                    location.pathname === '/contact' ? 'active' : ''
                  }`}
                  to="/contact"
                >
                  Contact
                </Link>
              </li>

              {user && (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link nav-link-animated ${
                        location.pathname === '/browse' ? 'active' : ''
                      }`}
                      to="/browse"
                    >
                      Browse
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link nav-link-animated ${
                        location.pathname === '/bookings' ? 'active' : ''
                      }`}
                      to="/bookings"
                    >
                      My Bookings
                    </Link>
                  </li>
                </>
              )}

              {user?.role === 'admin' && (
                <li className="nav-item">
                  <Link
                    className={`nav-link nav-link-animated ${
                      location.pathname.includes('/admin') ? 'active' : ''
                    }`}
                    to="/admin/dashboard"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>

            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item d-flex align-items-center me-3">
                    <span className="text-light user-badge">
                      👤 {user.name}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-light btn-sm btn-animated"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item me-2">
                    <Link
                      className="btn btn-outline-light btn-sm btn-animated"
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn btn-accent btn-sm btn-animated"
                      to="/register"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Space below navbar */}
      <div style={{ height: '76px' }}></div>

      <style>{`
        /* Default gradient navbar */
        .navbar-default {
          background: linear-gradient(90deg, #1976d2, #0d47a1);
          transition: all 0.4s ease;
          box-shadow: none;
        }

        /* On scroll - glassy effect */
        .navbar-scrolled {
          background: rgba(25, 118, 210, 0.9);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 18px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }

        /* Brand animation */
        .brand-animated {
          transition: all 0.3s ease;
          color: #fff !important;
        }
        .brand-animated:hover {
          transform: scale(1.1);
          text-shadow: 0 0 10px rgba(255,255,255,0.4);
        }

        /* Link animations */
        .nav-link-animated {
          position: relative;
          transition: all 0.3s ease;
        }
        .nav-link-animated::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #90caf9;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link-animated:hover::after,
        .nav-link-animated.active::after {
          width: 70%;
        }
        .nav-link-animated:hover {
          color: #e3f2fd !important;
          transform: translateY(-2px);
        }

        /* Buttons */
        .btn-animated {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-animated::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-animated:hover::before {
          width: 300px;
          height: 300px;
        }
        .btn-animated:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        /* Accent (Register) button */
        .btn-accent {
          background: #90caf9;
          color: #0d47a1;
          border: none;
          transition: all 0.3s ease;
        }
        .btn-accent:hover {
          background: #64b5f6;
          color: #fff;
        }

        /* User badge */
        .user-badge {
          padding: 6px 14px;
          background: rgba(255,255,255,0.15);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        .user-badge:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.05);
        }
      `}</style>
    </>
  )
}
