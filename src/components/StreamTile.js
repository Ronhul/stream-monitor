import React, { useRef, useState } from 'react';
import './StreamTile.css';

const StreamTile = ({ stream, onRemove, onToggleAudio }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize stream on mount or when URL/type changes
  React.useEffect(() => {
    if (videoRef.current) {
      // Different setup based on stream type
      setupStream();
    }
  }, [stream.url, stream.type]);

  const setupStream = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate the stream URL before attempting to load
      switch(stream.type) {
        case 'youtube':
          const youtubeId = extractYoutubeId(stream.url);
          if (!youtubeId) {
            setError('Invalid YouTube URL. Please check the URL and try again.');
          }
          break;
          
        case 'twitch':
          const twitchChannel = extractTwitchChannel(stream.url);
          if (!twitchChannel) {
            setError('Invalid Twitch URL. Please provide a valid channel URL or name.');
          }
          break;
          
        case 'telegram':
          if (!stream.url || !stream.url.includes('t.me')) {
            setError('Invalid Telegram URL. Please check the URL and try again.');
          }
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
            style={{width: '100%', height: '100%', border: 'none', objectFit: 'contain'}}
          />
        );

      case 'twitch':
        // Format: https://player.twitch.tv/?channel=CHANNEL_NAME&parent=localhost
        const twitchChannel = extractTwitchChannel(stream.url);
        
        if (!twitchChannel) {
          setError('Invalid Twitch URL. Please provide a valid Twitch channel URL.');
          setIsLoading(false);
          return <div className="error-message">Invalid Twitch URL</div>;
        }
        
        // Get all possible parent domains
        // Twitch allows multiple parent domains separated by "&parent="
        const currentDomain = window.location.hostname;
        let parentDomains = ['localhost', '127.0.0.1']; // Common local testing domains
        
        // Add the actual domain if it's not localhost
        if (currentDomain !== 'localhost' && currentDomain !== '127.0.0.1') {
          // If GitHub pages, just use "github.io" which covers all subdomains
          if (currentDomain.includes('github.io')) {
            parentDomains.push('github.io');
          } else {
            parentDomains.push(currentDomain);
          }
        }
        
        // Format all domains as parent parameters
        const parentParams = parentDomains.map(domain => `parent=${domain}`).join('&');
        
        return (
          <iframe
            src={`https://player.twitch.tv/?channel=${twitchChannel}&${parentParams}&muted=${stream.muted ? 'true' : 'false'}`}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Failed to load Twitch stream');
              setIsLoading(false);
            }}
            ref={videoRef}
            title={`Twitch Stream ${stream.id}`}
            style={{width: '100%', height: '100%', border: 'none', objectFit: 'contain'}}
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
              style={{width: '100%', height: '100%', border: 'none', objectFit: 'contain'}}
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
    if (!url) return null;
    
    // Handle pasted channel name directly (without URL)
    if (/^[a-zA-Z0-9_]{4,25}$/.test(url.trim())) {
      return url.trim().toLowerCase();
    }
    
    // Handle various Twitch URL formats
    const patterns = [
      // Standard format: https://www.twitch.tv/channelname
      /(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]{4,25})(?:$|\/|\?)/,
      
      // Player URL: https://player.twitch.tv/?channel=channelname
      /(?:https?:\/\/)?player\.twitch\.tv\/\?.*channel=([a-zA-Z0-9_]{4,25})(?:$|&)/,
      
      // Clip format: https://clips.twitch.tv/channelname/etc
      /(?:https?:\/\/)?clips\.twitch\.tv\/([a-zA-Z0-9_]{4,25})(?:$|\/|\?)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1].toLowerCase();
      }
    }
    
    return null;
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
      </div>
      
      <div className="stream-info">
        <span className="stream-type">{stream.type}</span>
      </div>
    </div>
  );
};

export default StreamTile;
