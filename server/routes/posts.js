const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/posts
router.post('/', async (req, res) => {
  try {
    const { authorName = 'Aarav Khanna', authorRole = 'Student', clanName = 'Pixel Pirates', content, tags = [], imageUrl = '' } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty' })
    }

    const initials = authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const post = new Post({
      authorName,
      authorRole,
      authorInitials: initials,
      clanName,
      content,
      tags,
      imageUrl,
      timestamp: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    })

    await post.save()
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST /api/posts/:id/like
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Toggle like
    post.likesCount = (post.likesCount || 0) + 1
    await post.save()
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/posts/:id/comment
router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params
    const { authorName = 'Aarav Khanna', text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const initials = authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    post.comments.push({
      authorName,
      authorInitials: initials,
      text,
      timestamp: 'Just now',
    })
    post.commentsCount = (post.commentsCount || 0) + 1
    await post.save()

    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
