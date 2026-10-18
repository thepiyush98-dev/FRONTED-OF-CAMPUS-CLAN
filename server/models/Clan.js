const mongoose = require('mongoose')

const clanMemberSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  role: {
    type: String,
    default: 'Member',
  },
  branch: String,
})

const clanSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    initials: {
      type: String,
      default: '',
    },
    speciality: {
      type: String,
      default: 'General Technology',
    },
    bannerColor: {
      type: String,
      default: 'from-blue-700 to-slate-900',
    },
    memberCount: {
      type: Number,
      default: 1,
    },
    leaderName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended'],
      default: 'Active',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    fullDescription: {
      type: String,
      default: '',
    },
    projectsCount: {
      type: Number,
      default: 0,
    },
    activeProjects: {
      type: [String],
      default: [],
    },
    recruitmentOpenings: {
      type: [String],
      default: [],
    },
    trophiesCount: {
      type: Number,
      default: 0,
    },
    members: {
      type: [clanMemberSchema],
      default: [],
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

module.exports = mongoose.model('Clan', clanSchema)
