const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_clans'
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`)
  } catch (error) {
    console.error(`[MongoDB] Connection warning/error: ${error.message}`)
    console.log('[MongoDB] Running with in-memory / local fallback mode.')
  }
}

module.exports = connectDB
