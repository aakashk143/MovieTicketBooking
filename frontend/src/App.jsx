import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Browse from './pages/Browse.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import SeatBooking from './pages/SeatBooking.jsx'
import MyBookings from './pages/MyBookings.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Footer from './components/Footer.jsx'
import NavBar from './components/NavBar.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Movies from './pages/admin/Movies.jsx'
import Theatres from './pages/admin/Theatres.jsx'
import Showtimes from './pages/admin/Showtimes.jsx'
import Seats from './pages/admin/Seats.jsx'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function AdminProtected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'admin' ? children : <Navigate to="/" replace />
}

function UserShell() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/browse" element={<Protected><Browse /></Protected>} />
          <Route path="/movie/:id" element={<Protected><MovieDetails /></Protected>} />
          <Route path="/showtime/:id/seats" element={<Protected><SeatBooking /></Protected>} />
          <Route path="/bookings" element={<Protected><MyBookings /></Protected>} />
          <Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminProtected><AdminLayout /></AdminProtected>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="movies" element={<Movies />} />
          <Route path="theatres" element={<Theatres />} />
          <Route path="showtimes" element={<Showtimes />} />
          <Route path="seats" element={<Seats />} />
        </Route>
        <Route path="/*" element={<UserShell />} />
      </Routes>
    </AuthProvider>
  )
}


