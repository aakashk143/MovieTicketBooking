import express from 'express';
import { getPool, query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Simple in-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Generate OTP for booking
router.post('/generate-otp', requireAuth, async (req, res) => {
  try {
    const { showtime_id, seat_ids } = req.body;
    
    if (!showtime_id || !Array.isArray(seat_ids) || seat_ids.length === 0) {
      return res.status(400).json({ message: 'Missing showtime or seats' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP
    const otpKey = `${req.user.id}_${showtime_id}`;
    otpStore.set(otpKey, {
      otp,
      expiresAt,
      seat_ids,
      showtime_id
    });

    // Return OTP (in production, send via SMS/Email)
    res.json({
      message: 'OTP generated successfully',
      otp: otp,
      expires_in: 300
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate OTP' });
  }
});

// Verify OTP and create booking
router.post('/verify-otp', requireAuth, async (req, res) => {
  const conn = await getPool().getConnection();
  
  try {
    const { showtime_id, seat_ids, otp } = req.body;
    
    if (!showtime_id || !Array.isArray(seat_ids) || !otp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await conn.beginTransaction();

    // Verify OTP
    const otpKey = `${req.user.id}_${showtime_id}`;
    const storedOtp = otpStore.get(otpKey);

    if (!storedOtp) {
      throw new Error('OTP not found. Please generate a new OTP.');
    }

    if (storedOtp.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > storedOtp.expiresAt) {
      otpStore.delete(otpKey);
      throw new Error('OTP expired. Please generate a new OTP.');
    }

    // Verify seats match
    const seatIdsStr = seat_ids.sort().join(',');
    const storedSeatIdsStr = storedOtp.seat_ids.sort().join(',');
    if (seatIdsStr !== storedSeatIdsStr) {
      throw new Error('Seat selection mismatch');
    }

    // Get showtime details
    const [showtimeRows] = await conn.query(
      'SELECT id, theatre_id, price_inr, start_time FROM showtimes WHERE id = ?',
      [showtime_id]
    );
    
    if (!showtimeRows.length) {
      throw new Error('Invalid showtime');
    }

    const showtime = showtimeRows[0];
    const theatreId = showtime.theatre_id;

    // Validate seats belong to theatre
    const placeholders = seat_ids.map(() => '?').join(',');
    const [validSeats] = await conn.query(
      `SELECT id FROM seats WHERE id IN (${placeholders}) AND theatre_id = ?`,
      [...seat_ids, theatreId]
    );
    
    if (validSeats.length !== seat_ids.length) {
      throw new Error('Some seats are invalid');
    }

    // Check if seats are already booked
    const [bookedSeats] = await conn.query(
      `SELECT seat_id FROM booking_seats WHERE showtime_id = ? AND seat_id IN (${placeholders}) AND status = 'booked'`,
      [showtime_id, ...seat_ids]
    );
    
    if (bookedSeats.length > 0) {
      throw new Error('Some seats are already booked');
    }

    // Calculate total amount
    const total_amount_inr = showtime.price_inr * seat_ids.length;

    // Create booking
    const [bookingResult] = await conn.query(
      'INSERT INTO bookings (user_id, showtime_id, total_amount_inr, status) VALUES (?, ?, ?, ?)',
      [req.user.id, showtime_id, total_amount_inr, 'confirmed']
    );
    const bookingId = bookingResult.insertId;

    // Mark seats as booked
    const seatValues = seat_ids.map(() => '(?, ?, ?, ?)').join(',');
    const seatParams = seat_ids.flatMap((sid) => [bookingId, showtime_id, sid, 'booked']);
    await conn.query(
      `INSERT INTO booking_seats (booking_id, showtime_id, seat_id, status) VALUES ${seatValues}`,
      seatParams
    );

    // Remove OTP after successful booking
    otpStore.delete(otpKey);

    await conn.commit();
    
    res.json({
      message: 'Booking successful',
      booking_id: bookingId,
      amount: total_amount_inr,
      showtime: showtime.start_time
    });
  } catch (error) {
    await conn.rollback();
    res.status(400).json({ message: error.message || 'Booking failed' });
  } finally {
    conn.release();
  }
});

// Get user's bookings
router.get('/me', requireAuth, async (req, res) => {
  try {
    const rows = await query(
      `SELECT b.id, b.total_amount_inr, b.status, s.start_time, m.title, t.name as theatre_name, t.city
       FROM bookings b
       JOIN showtimes s ON s.id = b.showtime_id
       JOIN movies m ON m.id = s.movie_id
       JOIN theatres t ON t.id = s.theatre_id
       WHERE b.user_id = ?
       ORDER BY s.start_time DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get bookings' });
  }
});

export default router;
