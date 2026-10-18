require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const studentRoutes = require('./routes/students')
const clanRoutes = require('./routes/clans')
const eventRoutes = require('./routes/events')
const postRoutes = require('./routes/posts')
const notificationRoutes = require('./routes/notifications')
const trophyRoutes = require('./routes/trophies')

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logger for development
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`)
  next()
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Campus Clans MERN API',
  })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/clans', clanRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/trophies', trophyRoutes)

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack || err.message)
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
  })
})

const PORT = process.env.BACKEND_PORT || 5000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Campus Clans Server] Express API running on http://localhost:${PORT}`)
    console.log(`[Campus Clans Server] Health check available at http://localhost:${PORT}/api/health`)
  })
}

module.exports = app
