import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all movies (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { genre, location } = req.query;
    const filters = [];
    const params = [];

    if (genre) {
      filters.push('m.genre = ?');
      params.push(genre);
    }
    if (location) {
      filters.push('t.city = ?');
      params.push(location);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const rows = await query(
      `SELECT DISTINCT m.id, m.title, m.genre, m.duration_mins, m.language, m.rating, m.poster_url, m.description 
       FROM movies m 
       LEFT JOIN showtimes s ON s.movie_id = m.id 
       LEFT JOIN theatres t ON t.id = s.theatre_id 
       ${where}
       ORDER BY m.title ASC`,
      params
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get movies' });
  }
});

// Get movie by ID with showtimes
router.get('/:id', async (req, res) => {
  try {
    const movies = await query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!movies.length) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const movie = movies[0];
    const showtimes = await query(
      `SELECT s.id, s.start_time, s.price_inr, t.name as theatre_name, t.city as theatre_city 
       FROM showtimes s 
       JOIN theatres t ON t.id = s.theatre_id 
       WHERE s.movie_id = ? 
       ORDER BY s.start_time ASC`,
      [req.params.id]
    );

    res.json({ ...movie, showtimes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get movie' });
  }
});

// Admin: Create movie
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, genre, duration_mins, language, rating, poster_url, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    await query(
      'INSERT INTO movies (title, genre, duration_mins, language, rating, poster_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, genre, duration_mins, language, rating, poster_url, description]
    );
    
    res.json({ message: 'Movie created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create movie' });
  }
});

// Admin: Update movie
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, genre, duration_mins, language, rating, poster_url, description } = req.body;
    
    await query(
      'UPDATE movies SET title=?, genre=?, duration_mins=?, language=?, rating=?, poster_url=?, description=? WHERE id=?',
      [title, genre, duration_mins, language, rating, poster_url, description, req.params.id]
    );
    
    res.json({ message: 'Movie updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie' });
  }
});

// Admin: Delete movie
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete movie' });
  }
});

export default router;


