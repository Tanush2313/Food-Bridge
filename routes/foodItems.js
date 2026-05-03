import express from 'express';
import db from '../db.js';

const router = express.Router();

const runAsync = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve({ lastID: this.lastID, changes: this.changes });
  });
});

const getAsync = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  });
});

const allAsync = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  });
});

const normalizeItem = (row) => ({
  ...row,
  available: Boolean(row.available),
  latitude: Number(row.latitude) || 0,
  longitude: Number(row.longitude) || 0,
});

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foodItems = await allAsync('SELECT * FROM food_items ORDER BY id DESC');
    res.json(foodItems.map(normalizeItem));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single food item
router.get('/:id', async (req, res) => {
  try {
    const foodItem = await getAsync('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });
    res.json(normalizeItem(foodItem));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create food item
router.post('/', async (req, res) => {
  try {
    const result = await runAsync(
      `INSERT INTO food_items (business, location, food, quantity, time, pickupWindow, available, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.business,
        req.body.location,
        req.body.food,
        req.body.quantity,
        req.body.time,
        req.body.pickupWindow,
        req.body.available !== undefined ? (req.body.available ? 1 : 0) : 1,
        req.body.latitude || 0,
        req.body.longitude || 0,
      ]
    );
    const foodItem = await getAsync('SELECT * FROM food_items WHERE id = ?', [result.lastID]);
    res.status(201).json(normalizeItem(foodItem));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update food item
router.patch('/:id', async (req, res) => {
  try {
    const foodItem = await getAsync('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

    const updated = {
      business: req.body.business ?? foodItem.business,
      location: req.body.location ?? foodItem.location,
      food: req.body.food ?? foodItem.food,
      quantity: req.body.quantity ?? foodItem.quantity,
      time: req.body.time ?? foodItem.time,
      pickupWindow: req.body.pickupWindow ?? foodItem.pickupWindow,
      available: req.body.available !== undefined ? (req.body.available ? 1 : 0) : foodItem.available,
      latitude: req.body.latitude !== undefined ? req.body.latitude : foodItem.latitude,
      longitude: req.body.longitude !== undefined ? req.body.longitude : foodItem.longitude,
    };

    await runAsync(
      `UPDATE food_items SET business = ?, location = ?, food = ?, quantity = ?, time = ?, pickupWindow = ?, available = ?, latitude = ?, longitude = ? WHERE id = ?`,
      [
        updated.business,
        updated.location,
        updated.food,
        updated.quantity,
        updated.time,
        updated.pickupWindow,
        updated.available,
        updated.latitude,
        updated.longitude,
        req.params.id,
      ]
    );

    const updatedFoodItem = await getAsync('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    res.json(normalizeItem(updatedFoodItem));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete food item
router.delete('/:id', async (req, res) => {
  try {
    const foodItem = await getAsync('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

    await runAsync('DELETE FROM food_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;