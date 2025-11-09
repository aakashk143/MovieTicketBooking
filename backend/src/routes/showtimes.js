import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all showtimes (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { movie_id, theatre_id } = req.query;
    const filters = [];
    const params = [];

    if (movie_id) {
      filters.push('s.movie_id = ?');
      params.push(movie_id);
    }
    if (theatre_id) {
      filters.push('s.theatre_id = ?');
      params.push(theatre_id);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const rows = await query(
      `SELECT s.*, m.title as movie_title, t.name as theatre_name, t.city as theatre_city
       FROM showtimes s 
       JOIN movies m ON m.id = s.movie_id
       JOIN theatres t ON t.id = s.theatre_id
       ${where}
       ORDER BY s.start_time ASC`,
      params
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get showtimes' });
  }
});

// Admin: Create showtime
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { movie_id, theatre_id, start_time, price_inr } = req.body;
    
    if (!movie_id || !theatre_id || !start_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await query(
      'INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr) VALUES (?, ?, ?, ?)',
      [movie_id, theatre_id, start_time, price_inr || 250]
    );
    
    res.json({ message: 'Showtime created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create showtime' });
  }
});

// Admin: Update showtime
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { movie_id, theatre_id, start_time, price_inr } = req.body;
    
    await query(
      'UPDATE showtimes SET movie_id=?, theatre_id=?, start_time=?, price_inr=? WHERE id=?',
      [movie_id, theatre_id, start_time, price_inr, req.params.id]
    );
    
    res.json({ message: 'Showtime updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update showtime' });
  }
});

// Admin: Delete showtime
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM showtimes WHERE id=?', [req.params.id]);
    res.json({ message: 'Showtime deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete showtime' });
  }
});

export default router;


