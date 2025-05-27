import React, { useRef, useEffect, useState } from 'react';
import './StreamTile.css';
import useAudioAnalyzer from '../hooks/useAudioAnalyzer';

const StreamTile = ({ stream, onRemove, onToggleAudio }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get audio levels from custom hook
  const { audioLevels, setAudioSource } = useAudioAnalyzer();

  useEffect(() => {
    const setupAudio = () => {
      if (audioRef.current && videoRef.current) {
        setAudioSource(audioRef.current);
      }
    };

    if (videoRef.current) {
      // Different setup based on stream type
      setupStream();
      setupAudio();
    }
  }, [stream.url, stream.type]);

  const setupStream = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Specific setup based on stream type
      switch(stream.type) {
        case 'youtube':
          // YouTube embeds handle their own loading
          break;
        case 'twitch':
          // Twitch embeds handle their own loading
          break;
        case 'telegram':
          // Telegram embeds handle their own loading
          break;
        default:
          setError('Unsupported stream type');
      }
    } catch (err) {
      console.error('Stream setup error:', err);
      setError('Failed to load stream');
    }
  };

  const renderStreamSource = () => {
    switch(stream.type) {
      case 'youtube':
        // Format: https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1
        const youtubeId = extractYoutubeId(stream.url);
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${stream.muted ? 1 : 0}&controls=0`}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsLoading(false)}
            ref={videoRef}
            title={`YouTube Stream ${stream.id}`}
          />
        );

      case 'twitch':
        // Format: https://player.twitch.tv/?channel=CHANNEL_NAME&parent=localhost
        const twitchChannel = extractTwitchChannel(stream.url);
        // Get domain for Twitch parent parameter
        const domain = window.location.hostname === 'localhost' ? 
          'localhost' : window.location.hostname.replace(/.*\.github\.io$/, 'github.io');
        
        return (
          <iframe
            src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${domain}&muted=${stream.muted}`}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsLoading(false)}
            ref={videoRef}
            title={`Twitch Stream ${stream.id}`}
          />
        );

      case 'telegram':
        return (
          <div className="telegram-container">
            <iframe
              src={stream.url}
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setIsLoading(false)}
              ref={videoRef}
              title={`Telegram Stream ${stream.id}`}
            />
          </div>
        );

      default:
        return <div className="error-message">Unsupported stream type</div>;
    }
  };

  // Helper functions to extract IDs/channels
  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const extractTwitchChannel = (url) => {
    const twitchRegExp = /(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\/)/;
    const match = url.match(twitchRegExp);
    return match ? match[1] : null;
  };

  return (
    <div className="stream-tile">
      <div className="stream-container">
        {isLoading && <div className="loading">Loading stream...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {/* Stream video */}
        <div className="video-container">
          {renderStreamSource()}
        </div>

        {/* Audio element for analyzing sound levels */}
        <audio ref={audioRef} style={{ display: 'none' }} />
        
        {/* Stream controls */}
        <div className="stream-controls">
          <button 
            className="audio-toggle" 
            onClick={onToggleAudio}
            aria-label={stream.muted ? "Unmute" : "Mute"}
          >
            {stream.muted ? '🔇' : '🔊'}
          </button>
          
          <button 
            className="remove-stream" 
            onClick={onRemove}
            aria-label="Remove stream"
          >
            ❌
          </button>
        </div>
        
        {/* Audio level visualization */}
        <div className="audio-levels">
          {audioLevels.map((level, i) => (
            <div 
              key={i} 
              className="level-bar" 
              style={{ 
                height: `${level * 100}%`,
                backgroundColor: `hsl(${120 - level * 120}, 100%, 50%)`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="stream-info">
        <span className="stream-type">{stream.type}</span>
      </div>
    </div>
  );
};

export default StreamTile;
