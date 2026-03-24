const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    studyMaterial: {
      type: String,
      required: false,
    },
    videos: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        title: { type: String, required: true },
        url: { type: String, required: true },
        duration: { type: String, default: '' },
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);
