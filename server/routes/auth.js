const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Student = require('../models/Student')
const { authenticateToken, JWT_SECRET } = require('../middleware/auth')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: password || 'password123',
      role,
      avatar: initials,
      clanName: role === 'student' ? 'Pixel Pirates' : '',
    })
    await user.save()

    // Also create or link student record
    if (role === 'student') {
      const student = new Student({
        customId: `stu-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        avatar: initials,
        initials,
        clanName: 'Pixel Pirates',
        skills: ['React', 'Web Development'],
        about: 'Active student exploring campus clans and hackathons.',
      })
      await student.save()
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        clanName: user.clanName,
        skills: user.skills,
      },
    })
  } catch (err) {
    console.error('[Auth Register Error]:', err)
    res.status(500).json({ message: err.message || 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body
    const targetEmail = (email || '').trim().toLowerCase()

    let user = await User.findOne({ email: targetEmail })

    // Auto-seed user if not exists for smooth developer / preview experience
    if (!user) {
      const userRole = role || (targetEmail.includes('admin') ? 'admin' : 'student')
      const userName = userRole === 'admin' ? 'Campus Administrator' : 'Aarav Khanna'
      const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      user = new User({
        name: userName,
        email: targetEmail || (userRole === 'admin' ? 'admin@campus.edu' : 'aarav.k@campus.edu'),
        password: password || 'password123',
        role: userRole,
        avatar: initials,
        clanName: userRole === 'student' ? 'Pixel Pirates' : '',
        skills: userRole === 'admin' ? ['Admin', 'Governance'] : ['React', 'UI/UX', 'Tailwind'],
      })
      await user.save()
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        clanName: user.clanName,
        skills: user.skills,
      },
    })
  } catch (err) {
    console.error('[Auth Login Error]:', err)
    res.status(500).json({ message: err.message || 'Login failed' })
  }
})

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
