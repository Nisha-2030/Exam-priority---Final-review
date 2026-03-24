import React from 'react';
import './VideoModal.css';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="video-player-wrapper">
          <iframe
            className="video-player"
            src={getEmbedUrl(video.videoUrl)}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="video-modal-info">
          <h2 className="video-modal-title">{video.title}</h2>
          
          <p className="video-modal-description">{video.description}</p>

          <div className="video-modal-meta">
            <span className="meta-badge">
              <strong>Instructor:</strong> {video.instructor}
            </span>
            <span className="meta-badge">
              <strong>Topic:</strong> {video.topic?.name || 'General'}
            </span>
            <span className="meta-badge">
              <strong>Duration:</strong> {video.duration > 0 ? `${Math.floor(video.duration / 60)} min` : 'Live'}
            </span>
          </div>

          <div className="video-modal-footer">
            <button className="btn-download" onClick={onClose}>
              📥 Download Notes
            </button>
            <button className="btn-share" onClick={onClose}>
              🔗 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
