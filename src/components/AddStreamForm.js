import React, { useState } from 'react';
import './AddStreamForm.css';

const AddStreamForm = ({ onAddStream, disabled, isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('youtube');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    onAddStream({ url, type });
    setUrl('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }
  
  // Modal backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="add-stream-modal-backdrop" onClick={handleBackdropClick}>
      <div className="add-stream-modal">
        <h3>Add New Stream</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="stream-type">Stream Type:</label>
            <select 
              id="stream-type" 
              value={type} 
              onChange={(e) => setType(e.target.value)}
            >
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
              <option value="telegram">Telegram</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="stream-url">Stream URL:</label>
            <input
              id="stream-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                type === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 
                type === 'twitch' ? 'https://www.twitch.tv/...' :
                'https://t.me/...'
              }
              autoFocus
              required
            />
          </div>
          
          <div className="form-help">
            {type === 'twitch' && <span>Enter a Twitch channel URL or just the channel name</span>}
            {type === 'youtube' && <span>Enter a YouTube video URL</span>}
            {type === 'telegram' && <span>Enter a Telegram video URL</span>}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="add-button"
              disabled={disabled}
            >
              {disabled ? 'Max Streams Reached' : 'Add Stream'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStreamForm;
