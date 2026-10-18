const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'Trophy Allocated',
        'New Candidate Application',
        'Event Reminder',
        'Achievement Published',
        'Weekly Leaderboard',
        'Recruitment Update',
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    meta: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: 'Just now',
    },
    unread: {
      type: Boolean,
      default: true,
    },
    badgeColor: {
      type: String,
      default: 'amber',
    },
    icon: {
      type: String,
      default: 'bell',
    },
    actionLabel: {
      type: String,
      default: 'View Details',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Notification', notificationSchema)
