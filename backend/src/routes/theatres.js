import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all theatres
router.get('/', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM theatres ORDER BY city, name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get theatres' });
  }
});

// Admin: Create theatre
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, city } = req.body;
    
    if (!name || !city) {
      return res.status(400).json({ message: 'Name and city are required' });
    }

    await query('INSERT INTO theatres (name, city) VALUES (?, ?)', [name, city]);
    res.json({ message: 'Theatre created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create theatre' });
  }
});

// Admin: Update theatre
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, city } = req.body;
    
    await query('UPDATE theatres SET name=?, city=? WHERE id=?', [name, city, req.params.id]);
    res.json({ message: 'Theatre updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update theatre' });
  }
});

// Admin: Delete theatre
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM theatres WHERE id = ?', [req.params.id]);
    res.json({ message: 'Theatre deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete theatre' });
  }
});

export default router;


