import { useEffect, useState } from 'react'
import api from '../lib/api.js'

export default function MyBookings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/bookings/me')
        setItems(data)
      } catch (e) {
        console.error('Failed to load bookings:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">My Bookings</h2>
      {items.length === 0 ? (
        <div className="alert alert-info">
          <h5>No bookings yet</h5>
          <p>Start booking movies to see them here!</p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map(b => (
            <div key={b.id} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{b.title}</h5>
                    <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-muted mb-2">
                    <strong>📍</strong> {b.theatre_name} ({b.city})
                  </p>
                  <p className="text-muted mb-2">
                    <strong>🕐</strong> {new Date(b.start_time).toLocaleString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="h5 mb-0 text-primary">₹{b.total_amount_inr}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
