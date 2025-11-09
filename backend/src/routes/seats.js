import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get seats for a showtime with booking status
router.get('/:showtimeId', async (req, res) => {
  try {
    const showtimeId = req.params.showtimeId;
    const seats = await query(
      `SELECT s.id, s.row_label, s.seat_number, 
              COALESCE(bs.status, 'available') as status
       FROM seats s
       LEFT JOIN booking_seats bs ON bs.seat_id = s.id AND bs.showtime_id = ?
       WHERE s.theatre_id = (SELECT theatre_id FROM showtimes WHERE id = ?)
       ORDER BY s.row_label, s.seat_number`,
      [showtimeId, showtimeId]
    );
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get seats' });
  }
});

// Admin: Create seat for a theatre
router.post('/admin', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { theatre_id, row_label, seat_number } = req.body;
    
    if (!theatre_id || !row_label || !seat_number) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await query(
      'INSERT INTO seats (theatre_id, row_label, seat_number) VALUES (?, ?, ?)',
      [theatre_id, row_label, seat_number]
    );
    res.json({ message: 'Seat created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create seat' });
  }
});

// Admin: Delete seat
router.delete('/admin/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM seats WHERE id=?', [req.params.id]);
    res.json({ message: 'Seat deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete seat' });
  }
});

export default router;


