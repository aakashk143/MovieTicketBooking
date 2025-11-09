import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api.js'

export default function SeatBooking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [seats, setSeats] = useState([])
  const [selected, setSelected] = useState([])
  const [showtime, setShowtime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpExpiresIn, setOtpExpiresIn] = useState(0)
  const [generatingOtp, setGeneratingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [seatsData, showtimesData] = await Promise.all([
          api.get(`/seats/${id}`),
          api.get(`/showtimes`)
        ])
        setSeats(seatsData.data)
        const st = showtimesData.data.find(s => s.id === Number(id))
        if (st) {
          setShowtime(st)
          updateTimeRemaining(st.start_time)
        }
      } catch (e) {
        console.error('Failed to load seats:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (showtime) {
      const interval = setInterval(() => {
        updateTimeRemaining(showtime.start_time)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [showtime])

  useEffect(() => {
    if (otpExpiresIn > 0) {
      const timer = setInterval(() => {
        setOtpExpiresIn(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [otpExpiresIn])

  function updateTimeRemaining(startTime) {
    const now = new Date()
    const showTime = new Date(startTime)
    const diff = showTime - now

    if (diff <= 0) {
      setTimeRemaining({ expired: true })
      return
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeRemaining({ hours, minutes, seconds, expired: false })
  }

  function toggleSeat(seat) {
    if (seat.status !== 'available') return
    setSelected((prev) => prev.includes(seat.id) ? prev.filter(s => s !== seat.id) : [...prev, seat.id])
  }

  async function generateOtp() {
    if (!selected.length) return
    setGeneratingOtp(true)
    try {
      const { data } = await api.post('/bookings/generate-otp', {
        showtime_id: Number(id),
        seat_ids: selected
      })
      setShowOtpModal(true)
      setOtpExpiresIn(data.expires_in)
      // In production, OTP would be sent via SMS/Email
      alert(`OTP sent! (Demo: ${data.otp})`)
    } catch (e) {
      alert('Failed to generate OTP: ' + (e?.response?.data?.message || 'Unknown error'))
    } finally {
      setGeneratingOtp(false)
    }
  }

  async function verifyOtpAndBook() {
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP')
      return
    }
    setVerifyingOtp(true)
    try {
      const { data } = await api.post('/bookings/verify-otp', {
        showtime_id: Number(id),
        seat_ids: selected,
        otp: otp
      })
      alert(`✅ ${data.message}\nAmount: ₹${data.amount}\nBooking ID: ${data.booking_id}`)
      navigate('/bookings')
    } catch (e) {
      alert('Booking failed: ' + (e?.response?.data?.message || 'Unknown error'))
      if (e?.response?.data?.message?.includes('expired') || e?.response?.data?.message?.includes('Invalid')) {
        setShowOtpModal(false)
        setOtp('')
      }
    } finally {
      setVerifyingOtp(false)
    }
  }

  const grouped = seats.reduce((acc, s) => {
    acc[s.row_label] = acc[s.row_label] || []
    acc[s.row_label].push(s)
    return acc
  }, {})

  const totalPrice = showtime ? showtime.price_inr * selected.length : 0

  function formatTime(time) {
    if (!time || time.expired) return 'Showtime passed'
    const { hours, minutes, seconds } = time
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

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
      {showtime && (
        <div className="alert alert-info mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5 className="mb-1">{showtime.movie_title || 'Movie'}</h5>
              <p className="mb-1"><strong>📍</strong> {showtime.theatre_name} • {showtime.theatre_city}</p>
              <p className="mb-0">
                <strong>🕐 Showtime:</strong> {new Date(showtime.start_time).toLocaleString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-inline-block p-3 bg-white rounded shadow-sm">
                <div className="text-muted small mb-1">Time Remaining</div>
                <div className={`h4 mb-0 fw-bold ${timeRemaining?.expired ? 'text-danger' : 'text-primary'}`}>
                  {formatTime(timeRemaining)}
                </div>
                {!timeRemaining?.expired && (
                  <div className="small text-muted mt-1">Until show starts</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Select Your Seats</h4>
        {selected.length > 0 && (
          <div className="text-end">
            <p className="mb-0"><strong>Selected: {selected.length} seat(s)</strong></p>
            <p className="mb-0 text-primary h5">Total: ₹{totalPrice}</p>
          </div>
        )}
      </div>
      
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="mb-3 d-flex gap-3 flex-wrap">
            <span className="badge bg-success p-2">🟢 Available</span>
            <span className="badge bg-secondary p-2">🔒 Locked</span>
            <span className="badge bg-danger p-2">🔴 Booked</span>
            <span className="badge bg-primary p-2">✅ Selected</span>
          </div>
          
          <div className="text-center mb-3">
            <div className="bg-dark text-white p-2 rounded">SCREEN</div>
          </div>
          
          {Object.keys(grouped).sort().map(row => (
            <div key={row} className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <strong className="text-nowrap" style={{width: '60px'}}>Row {row}</strong>
                <div className="d-flex flex-wrap gap-1">
                  {grouped[row].sort((a,b)=>a.seat_number-b.seat_number).map(seat => {
                    const isSel = selected.includes(seat.id)
                    let cls = 'btn btn-sm'
                    if (seat.status === 'booked') cls += ' btn-danger'
                    else if (seat.status === 'locked') cls += ' btn-secondary'
                    else if (isSel) cls += ' btn-success'
                    else cls += ' btn-outline-success'
                    
                    return (
                      <button 
                        key={seat.id} 
                        className={cls} 
                        onClick={() => toggleSeat(seat)} 
                        disabled={seat.status !== 'available'}
                        style={{minWidth: '45px'}}
                      >
                        {seat.seat_number}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="row align-items-center mb-4">
        <div className="col-md-6 text-center mb-3 mb-md-0">
          <img 
            src="/posters/online tickect.jpg" 
            alt="Online Ticket" 
            className="img-fluid rounded shadow-lg"
            style={{ maxHeight: '400px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="col-md-6 text-center">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <h5 className="mb-3 fw-bold">Ready to Book?</h5>
            <button 
              className="btn btn-primary btn-lg px-5 mb-2" 
              onClick={generateOtp} 
              disabled={!selected.length || generatingOtp || timeRemaining?.expired}
              style={{ minWidth: '250px' }}
            >
              {generatingOtp ? 'Generating OTP...' : `Continue to Book - ₹${totalPrice}`}
            </button>
            {timeRemaining?.expired && (
              <p className="text-danger mt-2 mb-0">⚠️ This showtime has already started</p>
            )}
            {selected.length > 0 && (
              <p className="text-muted mt-2 small">Selected {selected.length} seat{selected.length > 1 ? 's' : ''} • Total: ₹{totalPrice}</p>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🔐 Enter OTP to Confirm Booking</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowOtpModal(false)
                    setOtp('')
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">
                  We've sent a 6-digit OTP to verify your booking. Please enter it below.
                </p>
                
                {otpExpiresIn > 0 && (
                  <div className="alert alert-warning mb-3">
                    <strong>⏱️ OTP expires in:</strong> {Math.floor(otpExpiresIn / 60)}:{(otpExpiresIn % 60).toString().padStart(2, '0')}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    className="form-control form-control-lg text-center"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold'}}
                    autoFocus
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={verifyOtpAndBook}
                    disabled={otp.length !== 6 || verifyingOtp || otpExpiresIn === 0}
                  >
                    {verifyingOtp ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Verifying...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={generateOtp}
                    disabled={generatingOtp}
                  >
                    {generatingOtp ? 'Resending...' : 'Resend OTP'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
