const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
      description: 'YouTube URL or uploaded video link',
    },
    thumbnail: {
      type: String,
      default: null,
      description: 'Video thumbnail URL',
    },
    duration: {
      type: Number,
      default: 0,
      description: 'Video duration in seconds',
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    instructor: {
      type: String,
      default: 'Expert Instructor',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
