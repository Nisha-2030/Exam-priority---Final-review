const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
    content: {
      type: String,
      required: true,
    },
    referenceBook: {
      type: String,
      required: false,
      default: '',
      description: 'Textbook reference name (optional or "nil")',
    },
    category: {
      type: String,
      enum: ['definition', 'formula', 'theory', 'example', 'note'],
      default: 'theory',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
