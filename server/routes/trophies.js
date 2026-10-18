const express = require('express')
const router = express.Router()
const Trophy = require('../models/Trophy')
const Notification = require('../models/Notification')
const Clan = require('../models/Clan')

// GET /api/trophies
router.get('/', async (req, res) => {
  try {
    const trophies = await Trophy.find().sort({ createdAt: -1 })
    res.json(trophies)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/trophies
router.post('/', async (req, res) => {
  try {
    const { name, description, eventId, eventName, recipientType = 'clan', recipientName, clanRepresentatives = [] } = req.body

    const trophy = new Trophy({
      customId: `trophy-${Date.now()}`,
      name,
      description,
      eventId,
      eventName,
      recipientType,
      recipientName,
      clanRepresentatives,
      awardDate: new Date().toISOString().split('T')[0],
    })
    await trophy.save()

    // Increment clan trophiesCount if awarded to a clan
    if (recipientType === 'clan') {
      await Clan.findOneAndUpdate(
        { name: recipientName },
        { $inc: { trophiesCount: 1 } }
      )
    }

    // Automatically generate 'Trophy Allocated' notification
    const notification = new Notification({
      category: 'Trophy Allocated',
      title: `Trophy Allocated: ${name}`,
      description: `${name} has been officially allocated to ${recipientName}. ${description || ''}`,
      meta: `Awarded to ${recipientName} · Allocation by Campus Admin`,
      time: 'Just now',
      unread: true,
      badgeColor: 'amber',
      icon: 'trophy',
      actionLabel: 'View Trophy',
    })
    await notification.save()

    res.status(201).json({ trophy, notification })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
