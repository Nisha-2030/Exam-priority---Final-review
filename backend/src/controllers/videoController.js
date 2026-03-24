const Video = require('../models/Video');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// ============ GET VIDEOS ============
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getVideosByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const videos = await Video.find({ topic: topicId })
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getVideosBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const videos = await Video.find({ subject: subjectId })
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============ CREATE VIDEO ============
const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, duration, subject, topic, instructor } = req.body;

    // Validate required fields
    if (!title || !description || !videoUrl || !subject || !topic) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, videoUrl, subject, topic',
      });
    }

    // Validate YouTube URL or uploaded video link
    if (!videoUrl.includes('youtube') && !videoUrl.includes('youtu.be') && !videoUrl.startsWith('http')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid video URL. Must be a YouTube URL or valid HTTP link',
      });
    }

    // Check if subject and topic exist
    const subjectExists = await Subject.findById(subject);
    const topicExists = await Topic.findById(topic);

    if (!subjectExists || !topicExists) {
      return res.status(404).json({
        success: false,
        error: 'Subject or Topic not found',
      });
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnail: thumbnail || extractYouTubeThumbnail(videoUrl),
      duration: duration || 0,
      subject,
      topic,
      instructor: instructor || 'Expert Instructor',
    });

    await video.save();
    await video.populate('subject', 'name').populate('topic', 'name');

    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============ UPDATE VIDEO ============
const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, thumbnail, duration, instructor } = req.body;

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        title: title || undefined,
        description: description || undefined,
        thumbnail: thumbnail || undefined,
        duration: duration || undefined,
        instructor: instructor || undefined,
      },
      { new: true }
    )
      .populate('subject', 'name')
      .populate('topic', 'name');

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }

    res.json({
      success: true,
      message: 'Video updated successfully',
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============ DELETE VIDEO ============
const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }

    res.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============ HELPER FUNCTIONS ============
const extractYouTubeThumbnail = (url) => {
  // Extract video ID from YouTube URL
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  }

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  
  return null;
};

module.exports = {
  getAllVideos,
  getVideosByTopic,
  getVideosBySubject,
  createVideo,
  updateVideo,
  deleteVideo,
};
