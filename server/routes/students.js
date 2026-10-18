const express = require('express')
const router = express.Router()
const Student = require('../models/Student')

// GET /api/students
router.get('/', async (req, res) => {
  try {
    const { clan } = req.query
    const query = clan ? { clanName: clan } : {}
    const students = await Student.find(query).sort({ createdAt: -1 })
    res.json(students)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    let student = await Student.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }, { email: id }],
    })
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/students/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const student = await Student.findOneAndUpdate(
      {
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }],
      },
      { $set: updates },
      { new: true }
    )

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/students
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body)
    await student.save()
    res.status(201).json(student)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
