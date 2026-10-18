const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    month: {
      type: String,
      default: 'OCT',
    },
    day: {
      type: String,
      default: '15',
    },
    type: {
      type: String,
      default: 'Workshop',
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Campus Innovation Hub',
    },
    time: {
      type: String,
      default: '10:00 AM',
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Upcoming', 'Ended'],
      default: 'Upcoming',
    },
    participationMode: {
      type: String,
      enum: ['individual', 'clan', 'both'],
      default: 'both',
    },
    accentColor: {
      type: String,
      default: 'amber',
    },
    participantsCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: '',
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    externalLink: {
      type: String,
      default: '',
    },
    trophiesAwarded: {
      type: Boolean,
      default: false,
    },
    attendees: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Event', eventSchema)
