
// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import api from '../lib/api.js'

// export default function Browse() {
//   const [movies, setMovies] = useState([])
//   const [genre, setGenre] = useState('')
//   const [location, setLocation] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(true)

//   async function load() {
//     setLoading(true)
//     setError('')
//     try {
//       const params = {}
//       if (genre) params.genre = genre
//       if (location) params.location = location
//       const { data } = await api.get('/movies', { params, timeout: 5000 })
//       setMovies(data)
//     } catch (e) {
//       // Fallback to local list so posters and titles still show
//       try {
//         const res = await fetch('/movies.local.json')
//         const data = await res.json()
//         setMovies(data)
//         setError('Showing local movies because backend is unreachable.')
//       } catch {
//         setError('Unable to load movies. Please check your connection.')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }
  
//   useEffect(() => { load() }, [])
  
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (genre || location) load()
//     }, 500)
//     return () => clearTimeout(timer)
//   }, [genre, location])

//   // ✅ Utility to handle missing or relative poster paths
//   const getPosterPath = (posterUrl) => {
//     if (!posterUrl) return '/placeholder.jpg'
//     if (posterUrl.startsWith('http') || posterUrl.startsWith('/')) return posterUrl
//     return `/posters/${posterUrl}`
//   }

//   return (
//     <div className="container py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold">Browse Movies</h2>
//       </div>
      
//       {error && (
//         <div className="alert alert-warning alert-dismissible fade show" role="alert">
//           {error}
//           <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
//         </div>
//       )}
      
//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-4">
//               <label className="form-label fw-semibold">Filter by Genre</label>
//               <input 
//                 className="form-control" 
//                 placeholder="e.g. Action, Romance, Thriller" 
//                 value={genre} 
//                 onChange={(e)=>setGenre(e.target.value)} 
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label fw-semibold">Filter by Location</label>
//               <input 
//                 className="form-control" 
//                 placeholder="e.g. Bengaluru, Mumbai" 
//                 value={location} 
//                 onChange={(e)=>setLocation(e.target.value)} 
//               />
//             </div>
//             <div className="col-md-4 d-flex align-items-end">
//               <button className="btn btn-primary w-100" onClick={load} disabled={loading}>
//                 {loading ? 'Searching...' : 'Search Movies'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {loading && movies.length === 0 ? (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3 text-muted">Loading movies...</p>
//         </div>
//       ) : movies.length === 0 ? (
//         <div className="alert alert-info text-center">
//           <h5>No movies found</h5>
//           <p>Try adjusting your filters or check back later.</p>
//         </div>
//       ) : (
//         <div className="row g-4">
//           {movies.map(m => (
//             <div key={m.id} className="col-lg-3 col-md-4 col-sm-6">
//               <div className="card h-100 shadow-sm hover-shadow" style={{transition: 'all 0.3s'}}>
//                 <img
//                   src={getPosterPath(m.poster_url)}
//                   className="card-img-top"
//                   alt={m.title}
//                   style={{ objectFit: 'cover', height: 320 }}
//                   onError={(e) => {
//                     e.target.src = '/placeholder.jpg'
//                     e.target.alt = 'Poster not available'
//                   }}
//                 />
//                 <div className="card-body d-flex flex-column">
//                   <h5 className="card-title fw-bold">{m.title}</h5>
//                   <p className="card-text text-muted small mb-2">
//                     <span className="badge bg-primary me-1">{m.genre}</span>
//                     <span className="badge bg-secondary me-1">{m.language}</span>
//                     {m.rating && <span className="badge bg-info">{m.rating}</span>}
//                   </p>
//                   {m.description && (
//                     <p className="card-text small text-muted">
//                       {m.description.substring(0, 80)}...
//                     </p>
//                   )}
//                   <Link className="btn btn-primary mt-auto" to={`/movie/${m.id}`}>
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api.js'

export default function Browse() {
  const [movies, setMovies] = useState([])
  const [genre, setGenre] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (genre) params.genre = genre
      if (location) params.location = location
      const { data } = await api.get('/movies', { params, timeout: 5000 })
      setMovies(data)
    } catch (e) {
      try {
        const res = await fetch('/movies.local.json')
        const data = await res.json()
        setMovies(data)
        setError('Showing local movies because backend is unreachable.')
      } catch {
        setError('Unable to load movies. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (genre || location) load()
    }, 500)
    return () => clearTimeout(timer)
  }, [genre, location])

  // ✅ Poster helper (so no missing import)
  const getPosterPath = (posterUrl) => {
    if (!posterUrl) return '/posters/placeholder.jpg'
    if (posterUrl.startsWith('http') || posterUrl.startsWith('/')) return posterUrl
    return `/posters/${posterUrl}`
  }

  return (
    <div
      className="browse-wrapper py-4"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: 'white'
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">🎬 Browse Movies</h2>
        </div>

        {error && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        {/* Filter Section */}
        <div className="card shadow-lg mb-4 border-0">
          <div className="card-body bg-light text-dark rounded-3">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Filter by Genre</label>
                <input
                  className="form-control"
                  placeholder="e.g. Action, Romance, Thriller"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Filter by Location</label>
                <input
                  className="form-control"
                  placeholder="e.g. Bengaluru, Mumbai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={load} disabled={loading}>
                  {loading ? 'Searching...' : 'Search Movies'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Movies Section */}
        {loading && movies.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-light">Loading movies...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="alert alert-info text-center bg-light text-dark border-0 rounded-3">
            <h5>No movies found</h5>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="row g-4">
            {movies.map((m) => (
              <div key={m.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 movie-card shadow-lg border-0">
                  <img
                    src={getPosterPath(m.poster_url)}
                    className="card-img-top"
                    alt={m.title || 'Movie Poster'}
                    style={{ objectFit: 'cover', height: 320 }}
                    onError={(e) => {
                      e.target.src = '/posters/placeholder.jpg'
                      e.target.alt = 'Poster not available'
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark">{m.title}</h5>
                    <p className="card-text text-muted small mb-2">
                      <span className="badge bg-primary me-1">{m.genre}</span>
                      <span className="badge bg-secondary me-1">{m.language}</span>
                      {m.rating && <span className="badge bg-info">{m.rating}</span>}
                    </p>
                    {m.description && (
                      <p className="card-text small text-muted">
                        {m.description.substring(0, 80)}...
                      </p>
                    )}
                    <Link className="btn btn-outline-primary mt-auto" to={`/movie/${m.id}`}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🎨 Page Styling */}
      <style>{`
        .movie-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
        }
        .movie-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        .browse-wrapper {
          animation: fadeIn 0.8s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
``
