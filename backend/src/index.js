import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createPool, query } from './lib/db.js';
import bcrypt from 'bcryptjs';
import authRouter from './routes/auth.js';
import moviesRouter from './routes/movies.js';
import theatresRouter from './routes/theatres.js';
import showtimesRouter from './routes/showtimes.js';
import seatsRouter from './routes/seats.js';
import bookingsRouter from './routes/bookings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Initialize database connection
createPool();

// Create admin user on startup (if configured)
async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Administrator';

    if (!adminEmail || !adminPassword) {
      return; // No admin credentials configured
    }

    // Check if admin already exists
    const existing = await query('SELECT id, role FROM users WHERE email = ?', [adminEmail]);
    
    if (existing.length) {
      // Make sure existing user is admin
      if (existing[0].role !== 'admin') {
        await query("UPDATE users SET role='admin' WHERE id = ?", [existing[0].id]);
        console.log(`Admin user ${adminEmail} promoted to admin`);
      }
      return;
    }

    // Create new admin user
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [adminName, adminEmail, passwordHash, 'admin']
    );
    console.log(`Admin user ${adminEmail} created`);
  } catch (error) {
    console.error('Failed to create admin user:', error.message);
  }
}

// Create admin user on startup
createAdminUser();

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/theatres', theatresRouter);
app.use('/api/showtimes', showtimesRouter);
app.use('/api/seats', seatsRouter);
app.use('/api/bookings', bookingsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


