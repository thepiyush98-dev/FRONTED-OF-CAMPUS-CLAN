const mongoose = require('mongoose')

const postCommentSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true,
  },
  authorInitials: {
    type: String,
    default: 'CC',
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const postSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorAvatar: {
      type: String,
      default: '',
    },
    authorInitials: {
      type: String,
      default: 'CC',
    },
    authorRole: {
      type: String,
      default: 'Student Member',
    },
    clanName: {
      type: String,
      default: 'Campus Community',
    },
    timestamp: {
      type: String,
      default: 'Just now',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [postCommentSchema],
      default: [],
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Post', postSchema)
