import React, { useState, useEffect } from 'react';
import { getVideosByTopic, getVideosBySubject, getAllVideos } from '../services/videoService';
import './VideoList.css';

const VideoList = ({ topicId, subjectId, onVideoSelect, onLoadingChange }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      onLoadingChange?.(true);

      let data;
      if (topicId) {
        data = await getVideosByTopic(topicId);
      } else if (subjectId) {
        data = await getVideosBySubject(subjectId);
      } else {
        data = await getAllVideos();
      }

      setVideos(data);
    } catch (err) {
      setError(err);
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [topicId, subjectId]);

  if (loading) {
    return (
      <div className="video-list-container">
        <div className="loading-spinner"></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-list-container">
        <p className="error-message">⚠️ Failed to load videos</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="video-list-container">
        <p className="empty-message">🎬 No videos available</p>
      </div>
    );
  }

  return (
    <div className="video-list-container">
      <div className="video-list-header">
        <h3>📹 Video Lectures ({videos.length})</h3>
      </div>
      <div className="video-list-scroll">
        {videos.map((video) => (
          <div key={video._id} className="video-list-item">
            <div className="video-thumbnail-wrapper">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="video-thumbnail-small"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/160x90?text=Video';
                }}
              />
              <div className="video-duration-badge-small">{video.duration || '00:00'}</div>
              <button 
                className="watch-button-small"
                onClick={() => onVideoSelect?.(video)}
                title="Watch video"
              >
                ▶ WATCH
              </button>
            </div>
            <div className="video-info-small">
              <p className="video-title-small">{video.title || 'Untitled'}</p>
              <p className="video-instructor-small">{video.instructor || 'Unknown'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
