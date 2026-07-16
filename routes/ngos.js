import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
  db.all('SELECT * FROM ngos ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching NGOs:', err)
      res.status(500).json({ error: 'Failed to fetch NGOs' })
    } else {
      res.json(rows)
    }
  })
})

router.post('/', (req, res) => {
  const { name, city, people = 0, verified = true, latitude = 0, longitude = 0 } = req.body;
  if (!name || !city || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Missing required NGO fields' });
  }

  const insertWithNewSchema = () => db.run(
    'INSERT INTO ngos (name, location, city, people, verified, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, city || name || '', city, people, verified ? 1 : 0, latitude, longitude],
    function(err) {
      if (err) {
        if (/no such column: city|no such column: people|no such column: verified/i.test(err.message)) {
          return insertWithLegacySchema();
        }
        console.error('Error creating NGO:', err);
        return res.status(500).json({ error: 'Failed to create NGO' });
      }
      db.get('SELECT * FROM ngos WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve NGO' });
        }
        return res.status(201).json(row);
      });
    }
  );

  const insertWithLegacySchema = () => db.run(
    'INSERT INTO ngos (name, location, latitude, longitude) VALUES (?, ?, ?, ?)',
    [name, city || name || '', latitude, longitude],
    function(err) {
      if (err) {
        console.error('Error creating NGO with legacy schema:', err);
        return res.status(500).json({ error: 'Failed to create NGO' });
      }
      db.get('SELECT * FROM ngos WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve NGO' });
        }
        return res.status(201).json({ ...row, city: row.city || row.location || city, people: row.people || people, verified: row.verified ?? 1 });
      });
    }
  );

  return insertWithNewSchema();
});

export default router
