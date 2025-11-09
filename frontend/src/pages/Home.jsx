import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { user } = useAuth()
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
        minHeight: '100vh'
      }}
    >
      <div
        className="mb-4 text-white"
        style={{
          backgroundImage: "url('/posters/theater screen.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="py-5" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div className="container text-center">
            <h1 className="display-4 fw-bold mb-3">🎬 Welcome to BookScreen</h1>
            <p className="lead">
              Your ultimate destination for booking movie tickets with ease and excitement!
            </p>
            {!user && (
              <div className="mt-4">
                <Link to="/register" className="btn btn-light btn-lg me-2">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Login
                </Link>
              </div>
            )}
            {user && (
              <div className="mt-4">
                <Link to="/browse" className="btn btn-light btn-lg">
                  Browse Movies
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm bg-light text-dark">
              <div className="card-body text-center">
                <h2 className="mb-3">🎯</h2>
                <h5 className="card-title">Browse Movies</h5>
                <p className="card-text">
                  Find movies by genre, location, and theatre. Explore showtimes and book your favorite films.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm bg-light text-dark">
              <div className="card-body text-center">
                <h2 className="mb-3">🎫</h2>
                <h5 className="card-title">Book Seats</h5>
                <p className="card-text">
                  Choose your preferred seats from an interactive seat map. Real-time availability updates.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm bg-light text-dark">
              <div className="card-body text-center">
                <h2 className="mb-3">✅</h2>
                <h5 className="card-title">Manage Bookings</h5>
                <p className="card-text">
                  View all your bookings in one place. Track your movie history and upcoming shows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-5">
            <h4 className="mb-3 text-white">Admin</h4>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="card h-100 shadow-sm bg-light text-dark">
                  <div className="card-body text-center">
                    <h2 className="mb-2">🛠️</h2>
                    <h6 className="card-title">Dashboard</h6>
                    <Link to="/admin/dashboard" className="btn btn-sm btn-primary mt-2">
                      Open
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100 shadow-sm bg-light text-dark">
                  <div className="card-body text-center">
                    <h2 className="mb-2">🎬</h2>
                    <h6 className="card-title">Movies</h6>
                    <Link to="/admin/movies" className="btn btn-sm btn-outline-primary mt-2">
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100 shadow-sm bg-light text-dark">
                  <div className="card-body text-center">
                    <h2 className="mb-2">🏛️</h2>
                    <h6 className="card-title">Theatres</h6>
                    <Link to="/admin/theatres" className="btn btn-sm btn-outline-primary mt-2">
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100 shadow-sm bg-light text-dark">
                  <div className="card-body text-center">
                    <h2 className="mb-2">🕒</h2>
                    <h6 className="card-title">Showtimes</h6>
                    <Link to="/admin/showtimes" className="btn btn-sm btn-outline-primary mt-2">
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
