const mongoose = require('mongoose')

const trophySchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    eventId: {
      type: String,
      default: '',
    },
    eventName: {
      type: String,
      default: '',
    },
    recipientType: {
      type: String,
      enum: ['clan', 'student'],
      default: 'clan',
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
    },
    clanRepresentatives: {
      type: [String],
      default: [],
    },
    awardDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Trophy', trophySchema)
