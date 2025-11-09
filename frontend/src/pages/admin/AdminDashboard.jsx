import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="container py-4">
      <h3>Admin Dashboard</h3>
      <p>Manage catalogue and schedule.</p>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/admin/movies" className="btn btn-primary">Manage Movies</Link>
        <Link to="/admin/theatres" className="btn btn-primary">Manage Theatres</Link>
        <Link to="/admin/showtimes" className="btn btn-primary">Manage Showtimes</Link>
        <Link to="/admin/seats" className="btn btn-primary">Manage Seats</Link>
      </div>
    </div>
  )
}


