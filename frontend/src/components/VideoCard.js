import React, { useState } from 'react';
import './VideoCard.css';

const VideoCard = ({ video, onWatch }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div
      className="video-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="video-thumbnail-container">
        <img
          src={video.thumbnail || '/placeholder-video.jpg'}
          alt={video.title}
          className="video-thumbnail"
        />
        <div className={`video-overlay ${isHovered ? 'visible' : ''}`}>
          <button 
            className="watch-btn"
            onClick={() => onWatch(video)}
          >
            ▶ WATCH NOW
          </button>
        </div>
        <span className="video-duration">
          {video.duration > 0 
            ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}`
            : 'Live'}
        </span>
      </div>

      <div className="video-info">
        <h3 className="video-title" title={video.title}>{video.title}</h3>
        
        <p className="video-description" title={video.description}>
          {video.description}
        </p>

        <div className="video-meta">
          <span className="instructor">👨‍🏫 {video.instructor}</span>
          <span className="topic">{video.topic?.name || 'General'}</span>
        </div>

        <button 
          className="video-watch-btn-small"
          onClick={() => onWatch(video)}
        >
          Watch Video
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
