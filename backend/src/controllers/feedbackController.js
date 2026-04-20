const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Quiz = require('../models/Quiz');
const Topic = require('../models/Topic');
const Progress = require('../models/Progress');

/**
 * Add or update feedback for a topic
 * User can update their own feedback; one per user per topic
 * POST /api/feedback
 * Body: { topicId, ratings: { contentQuality, usefulness, difficulty, explanation }, review?, helpful? }
 */
exports.addOrUpdateFeedback = async (req, res) => {
  try {
    const { topicId, ratings, review = '', helpful = null } = req.body;
    const userId = req.user.id;

    // Validation
    if (!topicId || !ratings) {
      return res.status(400).json({
        success: false,
        message: 'Topic ID and ratings are required'
      });
    }

    // Validate topicId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Topic ID format'
      });
    }

    // Validate rating values
    const { contentQuality, usefulness, difficulty, explanation } = ratings;
    if (
      !contentQuality ||
      !usefulness ||
      !difficulty ||
      !explanation ||
      contentQuality < 1 ||
      contentQuality > 5 ||
      usefulness < 1 ||
      usefulness > 5 ||
      difficulty < 1 ||
      difficulty > 5 ||
      explanation < 1 ||
      explanation > 5
    ) {
      return res.status(400).json({
        success: false,
        message: 'All ratings must be between 1 and 5'
      });
    }

    // Verify topic exists
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Check for existing feedback
    let feedback = await Feedback.findOne({ userId, topicId });

    if (feedback) {
      // Update existing feedback
      feedback.ratings = ratings;
      feedback.review = review;
      feedback.helpful = helpful;
      await feedback.save();
    } else {
      // Create new feedback
      feedback = new Feedback({
        userId,
        topicId,
        ratings,
        review,
        helpful
      });
      await feedback.save();
    }

    // Populate user info for response
    await feedback.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Feedback saved successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error in addOrUpdateFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all feedback for a specific topic
 * GET /api/feedback/topic/:topicId
 * Query: ?page=1&limit=10 (optional)
 */
exports.getTopicFeedback = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Verify topic exists
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Get paginated feedback
    const feedbacks = await Feedback.find({ topicId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalCount = await Feedback.countDocuments({ topicId });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total: totalCount,
      page: pageNum,
      pages: Math.ceil(totalCount / limitNum),
      data: feedbacks
    });
  } catch (error) {
    console.error('Error in getTopicFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Calculate average ratings for a specific topic
 * Uses MongoDB aggregation pipeline
 * GET /api/feedback/analytics/topic/:topicId
 */
exports.getTopicAverageRatings = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topicIdStr = String(topicId);

    const result = await Feedback.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $toString: '$topicId' }, topicIdStr] }
        }
      },
      {
        $group: {
          _id: '$topicId',
          totalFeedbacks: { $sum: 1 },
          avgContentQuality: { $avg: '$ratings.contentQuality' },
          avgUsefulness: { $avg: '$ratings.usefulness' },
          avgDifficulty: { $avg: '$ratings.difficulty' },
          avgExplanation: { $avg: '$ratings.explanation' },
          overallRating: {
            $avg: {
              $divide: [
                {
                  $add: [
                    '$ratings.contentQuality',
                    '$ratings.usefulness',
                    '$ratings.difficulty',
                    '$ratings.explanation'
                  ]
                },
                4
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          topicId: '$_id',
          totalFeedbacks: 1,
          avgContentQuality: { $round: ['$avgContentQuality', 2] },
          avgUsefulness: { $round: ['$avgUsefulness', 2] },
          avgDifficulty: { $round: ['$avgDifficulty', 2] },
          avgExplanation: { $round: ['$avgExplanation', 2] },
          overallRating: { $round: ['$overallRating', 2] }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No feedback found for this topic',
        data: {
          topicId,
          totalFeedbacks: 0,
          avgContentQuality: 0,
          avgUsefulness: 0,
          avgDifficulty: 0,
          avgExplanation: 0,
          overallRating: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error in getTopicAverageRatings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get helpful vs not helpful count for a topic
 * GET /api/feedback/analytics/helpful/:topicId
 */
exports.getHelpfulCount = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topicIdStr = String(topicId);

    const result = await Feedback.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $toString: '$topicId' }, topicIdStr] }
        }
      },
      {
        $group: {
          _id: '$helpful',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          helpful: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Format the response
    const response = {
      yes: 0,
      no: 0,
      notVoted: 0
    };

    result.forEach((item) => {
      if (item.helpful === 'yes') response.yes = item.count;
      else if (item.helpful === 'no') response.no = item.count;
      else response.notVoted = item.count;
    });

    res.status(200).json({
      success: true,
      data: response,
      total: response.yes + response.no + response.notVoted
    });
  } catch (error) {
    console.error('Error in getHelpfulCount:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Calculate content score for a topic
 * Formula: contentScore = (0.5 * avgRating) + (0.5 * (avgQuizScore / 20))
 * GET /api/feedback/analytics/content-score/:topicId
 */
exports.getContentScore = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topicIdStr = String(topicId);

    // Get average rating for the topic
    const ratingResult = await Feedback.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $toString: '$topicId' }, topicIdStr] }
        }
      },
      {
        $group: {
          _id: '$topicId',
          avgContentQuality: { $avg: '$ratings.contentQuality' },
          avgUsefulness: { $avg: '$ratings.usefulness' },
          avgDifficulty: { $avg: '$ratings.difficulty' },
          avgExplanation: { $avg: '$ratings.explanation' }
        }
      },
      {
        $project: {
          overallRating: {
            $divide: [
              {
                $add: [
                  '$avgContentQuality',
                  '$avgUsefulness',
                  '$avgDifficulty',
                  '$avgExplanation'
                ]
              },
              4
            ]
          }
        }
      }
    ]);

    const avgRating = ratingResult.length > 0 ? ratingResult[0].overallRating : 0;

    // Get average quiz score for the topic
    const quizScoreResult = await Progress.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $toString: '$topic' }, topicIdStr] }
        }
      },
      {
        $unwind: '$quizAttempts'
      },
      {
        $group: {
          _id: '$topic',
          avgScore: { $avg: '$quizAttempts.score' },
          totalAttempts: { $sum: 1 }
        }
      }
    ]);

    const avgQuizScore = quizScoreResult.length > 0 ? quizScoreResult[0].avgScore : 0;
    const totalAttempts = quizScoreResult.length > 0 ? quizScoreResult[0].totalAttempts : 0;

    // Calculate content score
    const contentScore = 0.5 * avgRating + 0.5 * (avgQuizScore / 20);

    res.status(200).json({
      success: true,
      data: {
        topicId,
        avgRating: parseFloat(avgRating.toFixed(2)),
        avgQuizScore: parseFloat(avgQuizScore.toFixed(2)),
        totalQuizAttempts: totalAttempts,
        contentScore: parseFloat(contentScore.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error in getContentScore:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all topics with their content scores (for admin dashboard)
 * GET /api/feedback/analytics/all-topics
 * Query: ?sort=contentScore (asc/desc)
 */
exports.getAllTopicsAnalytics = async (req, res) => {
  try {
    const { sort = 'desc' } = req.query;

    // Get all topics with their ratings and quiz scores
    const result = await Topic.aggregate([
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'topicId',
          as: 'feedbacks'
        }
      },
      {
        $lookup: {
          from: 'progresses',
          localField: '_id',
          foreignField: 'topic',
          as: 'progressDocs'
        }
      },
      {
        $addFields: {
          feedbackCount: { $size: '$feedbacks' },
          helpfulYesCount: {
            $size: {
              $filter: {
                input: '$feedbacks',
                as: 'fb',
                cond: { $eq: ['$$fb.helpful', 'yes'] }
              }
            }
          },
          helpfulNoCount: {
            $size: {
              $filter: {
                input: '$feedbacks',
                as: 'fb',
                cond: { $eq: ['$$fb.helpful', 'no'] }
              }
            }
          }
        }
      },
      {
        $unwind: {
          path: '$feedbacks',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          feedbackCount: { $first: '$feedbackCount' },
          helpfulYes: { $first: '$helpfulYesCount' },
          helpfulNo: { $first: '$helpfulNoCount' },
          contentQuality: { $avg: '$feedbacks.ratings.contentQuality' },
          usefulness: { $avg: '$feedbacks.ratings.usefulness' },
          difficulty: { $avg: '$feedbacks.ratings.difficulty' },
          explanation: { $avg: '$feedbacks.ratings.explanation' }
        }
      },
      {
        $addFields: {
          avgRating: {
            $divide: [
              { $add: ['$contentQuality', '$usefulness', '$difficulty', '$explanation'] },
              4
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'progresses',
          localField: '_id',
          foreignField: 'topic',
          as: 'progressData'
        }
      },
      {
        $unwind: {
          path: '$progressData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$progressData.quizAttempts',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          feedbackCount: { $first: '$feedbackCount' },
          contentQuality: { $first: '$contentQuality' },
          usefulness: { $first: '$usefulness' },
          difficulty: { $first: '$difficulty' },
          explanation: { $first: '$explanation' },
          avgRating: { $first: '$avgRating' },
          helpfulYes: { $first: '$helpfulYes' },
          helpfulNo: { $first: '$helpfulNo' },
          totalQuizScore: {
            $sum: {
              $cond: [
                { $ifNull: ['$progressData.quizAttempts', false] },
                '$progressData.quizAttempts.score',
                0
              ]
            }
          },
          totalQuizAttempts: {
            $sum: {
              $cond: [
                { $ifNull: ['$progressData.quizAttempts', false] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $addFields: {
          avgQuizScore: {
            $cond: [
              { $eq: ['$totalQuizAttempts', 0] },
              0,
              { $divide: ['$totalQuizScore', '$totalQuizAttempts'] }
            ]
          },
          quizAttempts: '$totalQuizAttempts',
          contentScore: {
            $add: [
              { $multiply: [0.5, '$avgRating'] },
              { $multiply: [0.5, { $divide: [{ $cond: [{ $eq: ['$totalQuizAttempts', 0] }, 0, { $divide: ['$totalQuizScore', '$totalQuizAttempts'] }] }, 20] }] }
            ]
          }
        }
      },
      {
        $addFields: {
          status: {
            $cond: [
              { $gt: ['$contentScore', 4] },
              'Highly Effective',
              { $cond: [{ $gte: ['$contentScore', 3] }, 'Moderate', 'Needs Improvement'] }
            ]
          }
        }
      },
      {
        $match: {
          $or: [{ feedbackCount: { $gt: 0 } }, { totalQuizAttempts: { $gt: 0 } }]
        }
      },
      {
        $sort: {
          contentScore: sort === 'asc' ? 1 : -1
        }
      },
      {
        $project: {
          name: 1,
          feedbackCount: 1,
          avgRating: { $round: ['$avgRating', 2] },
          contentQuality: { $round: ['$contentQuality', 2] },
          usefulness: { $round: ['$usefulness', 2] },
          difficulty: { $round: ['$difficulty', 2] },
          explanation: { $round: ['$explanation', 2] },
          helpfulYes: 1,
          helpfulNo: 1,
          avgQuizScore: { $round: ['$avgQuizScore', 2] },
          contentScore: { $round: ['$contentScore', 2] },
          status: 1,
          quizAttempts: 1
        }
      }
    ]);

    // Debug: Check first topic data
    if (result.length > 0) {
      console.log('First topic full data:', JSON.stringify(result[0], null, 2));
    }
    
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Error in getAllTopicsAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Extract keywords from feedback reviews for a topic
 * GET /api/feedback/analytics/keywords/:topicId
 */
exports.getCommonKeywords = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { limit = 10 } = req.query;

    // Get all reviews for the topic
    const feedbacks = await Feedback.find(
      { topicId, review: { $ne: '' } },
      'review'
    ).lean();

    if (feedbacks.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No reviews found',
        data: []
      });
    }

    // Common stop words
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'as',
      'is',
      'was',
      'are',
      'been',
      'be',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'can',
      'this',
      'that',
      'these',
      'those',
      'it',
      'its',
      'i',
      'you',
      'we',
      'they',
      'me',
      'him',
      'her',
      'us',
      'them'
    ]);

    // Extract and count keywords
    const keywords = {};
    feedbacks.forEach((fb) => {
      const words = fb.review
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !stopWords.has(word));

      words.forEach((word) => {
        keywords[word] = (keywords[word] || 0) + 1;
      });
    });

    // Sort by frequency
    const sorted = Object.entries(keywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, parseInt(limit))
      .map(([word, count]) => ({ word, count }));

    res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted
    });
  } catch (error) {
    console.error('Error in getCommonKeywords:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get user's feedback for a specific topic
 * GET /api/feedback/user/:topicId
 */
exports.getUserFeedback = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user.id;

    const feedback = await Feedback.findOne({ userId, topicId }).populate(
      'topicId',
      'name'
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'No feedback found for this user and topic'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error in getUserFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete feedback (admin only)
 * DELETE /api/feedback/:feedbackId
 */
exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all feedbacks from all topics
 * Admin only - for aggregated analytics
 * GET /api/feedback/all
 */
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'name email')
      .populate('topicId', 'name')
      .lean();

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error in getAllFeedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
