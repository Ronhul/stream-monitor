import React, { useState, useEffect } from 'react';
import './App.css';
import StreamTile from './components/StreamTile';
import AddStreamForm from './components/AddStreamForm';
import { VERSION, BUILD_DATE } from './version';

function App() {
  const [streams, setStreams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const MAX_STREAMS = 8;

  // Function to add a new stream
  const addStream = (streamData) => {
    if (streams.length >= MAX_STREAMS) {
      alert('Maximum number of streams reached (8)');
      return;
    }
    setStreams([...streams, { 
      id: Date.now(),
      ...streamData,
      muted: true // All streams start muted
    }]);
  };

  // Function to remove a stream
  const removeStream = (streamId) => {
    setStreams(streams.filter(stream => stream.id !== streamId));
  };

  // Function to toggle audio
  const toggleAudio = (streamId) => {
    setStreams(streams.map(stream => 
      stream.id === streamId 
        ? {...stream, muted: !stream.muted} 
        : stream
    ));
  };

  // Calculate the grid layout based on the number of streams to make them evenly sized
  const getGridTemplateAreas = () => {
    switch (streams.length) {
      case 0:
        return '';
      case 1:
        return '"s0 s0 s0 s0"';
      case 2:
        return '"s0 s0 s1 s1"';
      case 3:
        return '"s0 s0 s1 s1" "s2 s2 . ."';
      case 4:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3"';
      case 5:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3" "s4 . . ."';
      case 6:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3" "s4 s4 s5 s5"';
      case 7:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3" "s4 s4 s5 s5" "s6 s6 . ."';
      case 8:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3" "s4 s4 s5 s5" "s6 s6 s7 s7"';
      default:
        return '';
    }
  };

  return (
    <div className="App">
      <header>
        <h1>StreamMonitor</h1>
        <p>View up to 8 streams simultaneously</p>
        <span className="version-info">v{VERSION} <small>({BUILD_DATE})</small></span>
        
        <button 
          className={`add-stream-button ${streams.length >= MAX_STREAMS ? 'disabled' : ''}`}
          onClick={() => setIsModalOpen(true)}
          disabled={streams.length >= MAX_STREAMS}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H9v4a1 1 0 1 1-2 0V9H3a1 1 0 0 1 0-2h4V3a1 1 0 0 1 1-1z" />
          </svg>
          {streams.length >= MAX_STREAMS ? 'Maximum Streams' : 'Add Stream'}
        </button>
      </header>
      
      <div 
        className="stream-grid" 
        style={{ gridTemplateAreas: getGridTemplateAreas() }}
      >
        {streams.map((stream, index) => (
          <div key={stream.id} className="stream-tile-wrapper">
            <StreamTile 
              stream={stream}
              onRemove={() => removeStream(stream.id)}
              onToggleAudio={() => toggleAudio(stream.id)}
            />
          </div>
        ))}
      </div>

      <AddStreamForm 
        onAddStream={addStream} 
        disabled={streams.length >= MAX_STREAMS} 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
