import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import './VideoSection.css';

const VideoSection = ({ topicId, subjectId, isLoading = false, onLoadingChange }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    loadVideos();
  }, [topicId, subjectId]);

  const loadVideos = async () => {
    setLocalLoading(true);
    onLoadingChange?.(true);
    
    try {
      const { getVideosByTopic, getVideosBySubject, getAllVideos } = 
        await import('../services/videoService');
      
      let data;
      if (topicId) {
        data = await getVideosByTopic(topicId);
      } else if (subjectId) {
        data = await getVideosBySubject(subjectId);
      } else {
        data = await getAllVideos();
      }

      setVideos(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading videos:', err);
      setError('Failed to load videos');
      setVideos([]);
    } finally {
      setLocalLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handleWatchVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="video-section">
      <div className="section-header">
        <h2>🎥 Video Lectures</h2>
        <p>Expert instructors explaining key concepts</p>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {localLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading videos...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎬</span>
          <p>No videos available</p>
          <small>Video lectures will be added soon</small>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onWatch={handleWatchVideo}
            />
          ))}
        </div>
      )}

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default VideoSection;
