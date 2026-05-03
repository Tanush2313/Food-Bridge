import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'foodbridge.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite open error:', err);
    process.exit(1);
  }
});

const ensureColumn = (table, column, definition) => {
  db.all(`PRAGMA table_info(${table})`, (err, rows) => {
    if (err) {
      console.error(`SQLite PRAGMA error for ${table}:`, err);
      return;
    }
    const exists = rows.some((row) => row.name === column);
    if (!exists) {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
    }
  });
};

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business TEXT NOT NULL,
      location TEXT NOT NULL,
      food TEXT NOT NULL,
      quantity TEXT NOT NULL,
      time TEXT NOT NULL,
      pickupWindow TEXT NOT NULL,
      available INTEGER NOT NULL DEFAULT 1,
      latitude REAL NOT NULL DEFAULT 0,
      longitude REAL NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  ensureColumn('food_items', 'latitude', 'latitude REAL NOT NULL DEFAULT 0');
  ensureColumn('food_items', 'longitude', 'longitude REAL NOT NULL DEFAULT 0');

  db.get('SELECT COUNT(*) AS count FROM food_items', (err, row) => {
    if (err) {
      console.error('SQLite count error:', err);
      return;
    }
    if (!row || row.count === 0) {
      const insert = db.prepare(`
        INSERT INTO food_items (business, location, food, quantity, time, pickupWindow, available, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run('Sunrise Restaurant', 'Delhi', 'Biryani, Dal Makhani', '50 portions', '7:30 PM', '1 hour', 1, 28.6139, 77.2090);
      insert.run('Grand Hotel', 'Mumbai', 'Paneer Tikka, Naan', '100 portions', '8:00 PM', '2 hours', 1, 19.0760, 72.8777);
      insert.run('Cloud Kitchen Pro', 'Bangalore', 'Mixed Veg Curry, Rice', '75 portions', '6:30 PM', '90 minutes', 0, 12.9716, 77.5946);
      insert.finalize();
      console.log('Seeded initial food listings into SQLite database.');
    }
  });
});

export default db;
