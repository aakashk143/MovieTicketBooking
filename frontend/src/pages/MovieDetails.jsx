import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api.js'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/movies/${id}`)
        setMovie(data)
      } catch (e) {
        console.error('Failed to load movie:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Movie not found</div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              {movie.poster_url ? (
                <img
                  src={(movie.poster_url.startsWith('http') || movie.poster_url.startsWith('/')) ? movie.poster_url : `/posters/${movie.poster_url}`}
                  alt={movie.title}
                  className="img-fluid rounded shadow"
                  onError={(e) => { e.target.src = '/placeholder.jpg' }}
                />
              ) : (
                <div className="bg-secondary rounded d-flex align-items-center justify-content-center" style={{height: 400}}>
                  <span className="text-white">No Poster</span>
                </div>
              )}
            </div>
            <div className="col-md-8">
              <h2 className="fw-bold mb-3">{movie.title}</h2>
              <div className="mb-3">
                <span className="badge bg-primary me-2">{movie.genre}</span>
                <span className="badge bg-secondary me-2">{movie.language}</span>
                <span className="badge bg-info me-2">{movie.duration_mins} mins</span>
                {movie.rating && <span className="badge bg-warning text-dark">{movie.rating}</span>}
              </div>
              {movie.description && (
                <div className="mb-3">
                  <h5>Description</h5>
                  <p className="text-muted">{movie.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <h4 className="mb-3">Available Showtimes</h4>
      {movie.showtimes && movie.showtimes.length > 0 ? (
        <div className="row g-3">
          {movie.showtimes.map(st => (
            <div key={st.id} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{st.theatre_name}</h5>
                  <p className="text-muted mb-2">{st.theatre_city}</p>
                  <p className="mb-3">
                    <strong>Showtime:</strong> {new Date(st.start_time).toLocaleString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0 text-primary">₹{st.price_inr}</span>
                    <Link className="btn btn-primary" to={`/showtime/${st.id}/seats`}>Book Seats</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">No showtimes available for this movie.</div>
      )}
    </div>
  )
}
