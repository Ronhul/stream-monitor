import React, { useState } from 'react';
import './AddStreamForm.css';

const AddStreamForm = ({ onAddStream, disabled }) => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('youtube');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    onAddStream({ url, type });
    setUrl('');
    setIsExpanded(false);
  };

  if (disabled) {
    return (
      <div className="add-stream-form disabled">
        <p>Maximum number of streams reached (8)</p>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div className="add-stream-form collapsed">
        <button 
          className="expand-button"
          onClick={() => setIsExpanded(true)}
        >
          + Add Stream
        </button>
      </div>
    );
  }

  return (
    <div className="add-stream-form expanded">
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
              type === 'youtube' 
                ? 'https://www.youtube.com/watch?v=...' 
                : type === 'twitch'
                ? 'https://www.twitch.tv/...'
                : 'Telegram stream URL'
            }
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => setIsExpanded(false)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="add-button"
          >
            Add Stream
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStreamForm;
