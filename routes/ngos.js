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
  const { name, location, latitude = 0, longitude = 0 } = req.body
  db.run('INSERT INTO ngos (name, location, latitude, longitude) VALUES (?, ?, ?, ?)', [name, location, latitude, longitude], function(err) {
    if (err) {
      console.error('Error creating NGO:', err)
      res.status(500).json({ error: 'Failed to create NGO' })
    } else {
      db.get('SELECT * FROM ngos WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ error: 'Failed to retrieve NGO' })
        } else {
          res.status(201).json(row)
        }
      })
    }
  })
})

export default router
