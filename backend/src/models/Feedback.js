const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true
    },
    ratings: {
      contentQuality: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      usefulness: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      explanation: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    review: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    helpful: {
      type: String,
      enum: ['yes', 'no', null],
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Unique index: one feedback per user per topic
feedbackSchema.index({ userId: 1, topicId: 1 }, { unique: true });

// Indexes for aggregation queries
feedbackSchema.index({ topicId: 1, createdAt: -1 });
feedbackSchema.index({ 'ratings.contentQuality': 1 });
feedbackSchema.index({ helpful: 1 });

// Pre-save middleware to update timestamps
feedbackSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual field to calculate average rating for this feedback
feedbackSchema.virtual('averageRating').get(function () {
  const sum =
    this.ratings.contentQuality +
    this.ratings.usefulness +
    this.ratings.difficulty +
    this.ratings.explanation;
  return (sum / 4).toFixed(2);
});

// Ensure virtual fields are included in JSON output
feedbackSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
