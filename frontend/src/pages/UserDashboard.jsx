import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api.js'

export default function UserDashboard() {
  const [cities, setCities] = useState([])
  const [city, setCity] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/theatres')
        const list = Array.from(new Set(data.map(t => t.city)))
        setCities(list)
      } catch {}
    })()
  }, [])

  async function search() {
    setLoading(true)
    try {
      const params = {}
      if (city) params.location = city
      const { data } = await api.get('/movies', { params })
      setMovies(data)
    } catch (e) {
      console.error('Failed to load movies:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">User Dashboard</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Choose City</label>
              <select className="form-select" value={city} onChange={e=>setCity(e.target.value)}>
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={search} disabled={loading}>
                {loading ? 'Searching...' : 'Find Movies'}
              </button>
            </div>
            <div className="col-md-3">
              <Link to="/browse" className="btn btn-outline-primary w-100">Browse All Movies</Link>
            </div>
          </div>
        </div>
      </div>
      
      {loading && movies.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className="alert alert-info">
          <h5>No movies found</h5>
          <p>Select a city and click "Find Movies" or browse all movies.</p>
        </div>
      ) : (
        <div className="row g-4">
          {movies.map(m => (
            <div key={m.id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                {m.poster_url ? (
                  <img 
                    src={(m.poster_url.startsWith('http')||m.poster_url.startsWith('/'))?m.poster_url:`/posters/${m.poster_url}`} 
                    className="card-img-top" 
                    alt={m.title} 
                    style={{objectFit:'cover',height:280}} 
                  />
                ) : null}
                <div className="card-body">
                  <h5 className="card-title">{m.title}</h5>
                  <p className="card-text">
                    <span className="badge bg-primary me-1">{m.genre}</span>
                    <span className="badge bg-secondary">{m.language}</span>
                  </p>
                  <Link className="btn btn-primary w-100" to={`/movie/${m.id}`}>View Showtimes</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
