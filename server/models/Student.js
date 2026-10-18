const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
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
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      default: 'Engineering',
    },
    branch: {
      type: String,
      default: 'B.Tech CSE',
    },
    year: {
      type: String,
      default: '3rd year',
    },
    avatar: {
      type: String,
      default: '',
    },
    initials: {
      type: String,
      default: '',
    },
    clanName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended'],
      default: 'Active',
    },
    skills: {
      type: [String],
      default: [],
    },
    about: {
      type: String,
      default: '',
    },
    projectsCount: {
      type: Number,
      default: 0,
    },
    trophiesCount: {
      type: Number,
      default: 0,
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    suspensionDetails: {
      reason: String,
      startDate: String,
      endDate: String,
      durationDays: Number,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Student', studentSchema)
