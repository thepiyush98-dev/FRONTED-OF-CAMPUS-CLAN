const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 })
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/notifications/read-all
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({}, { $set: { unread: false } })
    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params
    const notif = await Notification.findByIdAndUpdate(id, { $set: { unread: false } }, { new: true })
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    res.json(notif)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/notifications/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const notif = await Notification.findByIdAndDelete(id)
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    res.json({ message: 'Notification deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/notifications
router.post('/', async (req, res) => {
  try {
    const notif = new Notification(req.body)
    await notif.save()
    res.status(201).json(notif)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
