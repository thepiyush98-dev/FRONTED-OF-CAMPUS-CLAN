const express = require('express')
const router = express.Router()
const Event = require('../models/Event')

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const event = await Event.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }],
    })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      customId: `evt-${Date.now()}`,
    })
    await event.save()
    res.status(201).json(event)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST /api/events/:id/rsvp
router.post('/:id/rsvp', async (req, res) => {
  try {
    const { id } = req.params
    const { studentId = 'stu-current' } = req.body

    const event = await Event.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }],
    })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    if (!event.attendees.includes(studentId)) {
      event.attendees.push(studentId)
      event.participantsCount = (event.participantsCount || 0) + 1
      await event.save()
    }

    res.json({ message: 'RSVP confirmed successfully', event })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
