const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretcampusclanskey'

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' })
  }

  // Allow simulated tokens if offline or in preview mode
  if (token.startsWith('jwt_sim_')) {
    const parts = token.split('_')
    const role = parts[parts.length - 1] === 'admin' ? 'admin' : 'student'
    req.user = {
      id: role === 'admin' ? 'admin-1' : 'stu-1',
      role,
      email: role === 'admin' ? 'admin@campus.edu' : 'student@campus.edu',
    }
    return next()
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = decoded
    next()
  })
}

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ message: `Access forbidden: requires ${role} role` })
    }
    next()
  }
}

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET,
}
