const express = require('express')
const router = express.Router()
const Clan = require('../models/Clan')
const Student = require('../models/Student')

// GET /api/clans
router.get('/', async (req, res) => {
  try {
    const clans = await Clan.find().sort({ memberCount: -1 })
    res.json(clans)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/clans/:name
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params
    const decodedName = decodeURIComponent(name)
    const clan = await Clan.findOne({
      $or: [
        { name: new RegExp(`^${decodedName}$`, 'i') },
        { customId: decodedName },
        { _id: decodedName.match(/^[0-9a-fA-F]{24}$/) ? decodedName : null },
      ],
    })

    if (!clan) {
      return res.status(404).json({ message: 'Clan not found' })
    }
    res.json(clan)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/clans/:id/join
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params
    const { studentId, studentName = 'Aarav Khanna', branch = 'B.Tech CSE' } = req.body

    const clan = await Clan.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }, { name: id }],
    })

    if (!clan) {
      return res.status(404).json({ message: 'Clan not found' })
    }

    if (clan.status === 'Suspended') {
      return res.status(400).json({ message: 'Cannot join a suspended clan.' })
    }

    // Check if student is already in the clan
    const alreadyMember = clan.members.some((m) => m.studentId === studentId)
    if (!alreadyMember) {
      clan.members.push({
        studentId: studentId || `stu-${Date.now()}`,
        name: studentName,
        role: 'Member',
        branch,
      })
      clan.memberCount += 1
      await clan.save()
    }

    // Also update student's clanName
    if (studentId) {
      await Student.findOneAndUpdate(
        {
          $or: [{ _id: studentId.match(/^[0-9a-fA-F]{24}$/) ? studentId : null }, { customId: studentId }],
        },
        { $set: { clanName: clan.name } }
      )
    }

    res.json({ message: `Successfully joined ${clan.name}`, clan })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/clans/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const clan = await Clan.findOneAndUpdate(
      {
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }, { name: id }],
      },
      { $set: updates },
      { new: true }
    )

    if (!clan) {
      return res.status(404).json({ message: 'Clan not found' })
    }
    res.json(clan)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/clans
router.post('/', async (req, res) => {
  try {
    const clan = new Clan(req.body)
    await clan.save()
    res.status(201).json(clan)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
