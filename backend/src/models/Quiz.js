const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['interactive', 'pdf'],
      default: 'interactive',
    },
    pdfUrl: {
      type: String,
      default: null,
    },
    questions: [
      {
        text: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        correctAnswer: {
          type: Number,
          required: true,
        },
        explanation: {
          type: String,
          default: '',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
