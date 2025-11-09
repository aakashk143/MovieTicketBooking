// import { Link, Outlet } from 'react-router-dom'

// export default function AdminLayout() {
//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <nav className="navbar navbar-dark bg-dark">
//         <div className="container">
//           <Link to="/admin/dashboard" className="navbar-brand">🎬 Admin Console</Link>
//           <div className="d-flex gap-2">
//             <Link className="btn btn-sm btn-outline-light" to="/admin/movies">Movies</Link>
//             <Link className="btn btn-sm btn-outline-light" to="/admin/theatres">Theatres</Link>
//             <Link className="btn btn-sm btn-outline-light" to="/admin/showtimes">Showtimes</Link>
//             <Link className="btn btn-sm btn-outline-light" to="/admin/seats">Seats</Link>
//           </div>
//         </div>
//       </nav>
//       <main className="flex-grow-1">
//         <Outlet />
//       </main>
//       <footer className="bg-dark text-light py-3 mt-auto">
//         <div className="container small">Admin Console</div>
//       </footer>
//     </div>
//   )
// }


import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{
      background: 'linear-gradient(135deg, #f05885ff, #8d76ffff)',
      color: '#fff'
    }}>
      <nav className="navbar navbar-dark" style={{ backgroundColor: 'rgba(18, 12, 12, 0.85)' }}>
        <div className="container">
          <Link to="/admin/dashboard" className="navbar-brand fw-bold">🎬 Admin Console</Link>
          <div className="d-flex gap-2">
            <Link className="btn btn-sm btn-outline-light rounded-3" to="/admin/movies">Movies</Link>
            <Link className="btn btn-sm btn-outline-light rounded-3" to="/admin/theatres">Theatres</Link>
            <Link className="btn btn-sm btn-outline-light rounded-3" to="/admin/showtimes">Showtimes</Link>
            <Link className="btn btn-sm btn-outline-light rounded-3" to="/admin/seats">Seats</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1 p-4">
        <div className="container bg-dark bg-opacity-50 rounded-4 p-4 shadow-lg">
          <Outlet />
        </div>
      </main>

      <footer className="bg-dark text-light py-3 mt-auto">
        <div className="container small text-center">Admin Console © 2025</div>
      </footer>
    </div>
  )
}