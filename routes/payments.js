import express from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import db from '../db.js'

const router = express.Router()

const hasRazorpayCredentials = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
const razorpay = hasRazorpayCredentials
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  : null

const estimateAmountFromListing = (row) => {
  const explicitAmount = Number(row.payment_amount || 0)
  if (explicitAmount > 0) return explicitAmount

  const quantityText = String(row.quantity || '')
  const parsedQuantity = Number(quantityText.match(/[\d.]+/)?.[0] || 0)
  return Math.max(parsedQuantity * 50, 500)
}

router.post('/razorpay/order', (req, res) => {
  if (!hasRazorpayCredentials || !razorpay) {
    res.status(500).json({ error: 'Razorpay is not configured' })
    return
  }

  const { listingId, ngoId = null } = req.body

  db.get('SELECT * FROM food_items WHERE id = ?', [listingId], async (err, row) => {
    if (err) {
      console.error('Error loading food item for Razorpay order:', err)
      res.status(500).json({ error: 'Failed to load food item' })
      return
    }

    if (!row) {
      res.status(404).json({ error: 'Food item not found' })
      return
    }

    const amountInRupees = estimateAmountFromListing(row)
    const amount = Math.round(amountInRupees * 100)
    const orderOptions = {
      amount,
      currency: 'INR',
      receipt: `food_${row.id}_${Date.now()}`,
      notes: {
        listingId: String(row.id),
        ngoId: ngoId ? String(ngoId) : '',
        business: row.business,
        food: row.food
      }
    }

    try {
      const order = await razorpay.orders.create(orderOptions)
      res.json({
        keyId: process.env.RAZORPAY_KEY_ID,
        order,
        amount,
        currency: 'INR'
      })
    } catch (createError) {
      console.error('Error creating Razorpay order:', createError)
      res.status(500).json({ error: 'Failed to create Razorpay order' })
    }
  })
})

router.post('/razorpay/verify', (req, res) => {
  if (!hasRazorpayCredentials) {
    res.status(500).json({ error: 'Razorpay is not configured' })
    return
  }

  const {
    listingId,
    ngoId = null,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body

  if (!listingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing Razorpay verification data' })
    return
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    res.status(400).json({ error: 'Invalid payment signature' })
    return
  }

  db.run(
    `UPDATE food_items
     SET available = 0,
         payment_method = 'razorpay',
         payment_status = 'paid',
         razorpay_order_id = ?,
         razorpay_payment_id = ?,
         razorpay_signature = ?,
         ngo_id = ?
     WHERE id = ?`,
    [razorpay_order_id, razorpay_payment_id, razorpay_signature, ngoId, listingId],
    function(updateErr) {
      if (updateErr) {
        console.error('Error verifying Razorpay payment:', updateErr)
        res.status(500).json({ error: 'Failed to save payment' })
        return
      }

      db.get('SELECT * FROM food_items WHERE id = ?', [listingId], (selectErr, updatedRow) => {
        if (selectErr) {
          res.status(500).json({ error: 'Failed to retrieve updated food item' })
        } else {
          res.json(updatedRow)
        }
      })
    }
  )
})

export default router