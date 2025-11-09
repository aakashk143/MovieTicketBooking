import mysql from 'mysql2/promise';

let pool = null;

// Create database connection pool
export function createPool() {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'cdac',
    database: process.env.MYSQL_DATABASE || 'movie_ticket_booking_website',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}

// Get database connection pool
export function getPool() {
  if (!pool) {
    return createPool();
  }
  return pool;
}

// Execute SQL query
export async function query(sql, params = []) {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

