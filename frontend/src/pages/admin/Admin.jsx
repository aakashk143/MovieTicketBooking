import { Routes, Route, Link } from 'react-router-dom'
import Movies from './Movies.jsx'
import Theatres from './Theatres.jsx'
import Showtimes from './Showtimes.jsx'
import Seats from './Seats.jsx'

export default function Admin() {
  return (
    <div className="container py-4">
      <h3>Admin</h3>
      <div className="mb-3">
        <Link to="movies" className="btn btn-outline-primary me-2">Movies</Link>
        <Link to="theatres" className="btn btn-outline-primary me-2">Theatres</Link>
        <Link to="showtimes" className="btn btn-outline-primary me-2">Showtimes</Link>
        <Link to="seats" className="btn btn-outline-primary">Seats</Link>
      </div>
      <Routes>
        <Route path="movies" element={<Movies />} />
        <Route path="theatres" element={<Theatres />} />
        <Route path="showtimes" element={<Showtimes />} />
        <Route path="seats" element={<Seats />} />
      </Routes>
    </div>
  )
}


