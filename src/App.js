import React, { useState, useEffect } from 'react';
import './App.css';
import StreamTile from './components/StreamTile';
import AddStreamForm from './components/AddStreamForm';
import { VERSION, BUILD_DATE } from './version';

function App() {
  const [streams, setStreams] = useState([]);
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
        return '"add add add add"';
      case 1:
        return '"s0 s0 s0 s0" "add add add add"';
      case 2:
        return '"s0 s0 s1 s1" "add add add add"';
      case 3:
        return '"s0 s0 s1 s1" "s2 s2 add add"';
      case 4:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3" "add add add add"';
      case 5:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3" "s4 s4 add add"';
      case 6:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3" "s4 s4 s5 s5" "add add add add"';
      case 7:
        return '"s0 s0 s1 s1" "s2 s2 s3 s3" "s4 s4 s5 s5" "s6 s6 add add"';
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
      </header>
      
      <div 
        className="stream-grid" 
        style={{ gridTemplateAreas: getGridTemplateAreas() }}
      >
        {streams.map((stream, index) => (
          <div key={stream.id} style={{ gridArea: `s${index}` }}>
            <StreamTile 
              stream={stream}
              onRemove={() => removeStream(stream.id)}
              onToggleAudio={() => toggleAudio(stream.id)}
            />
          </div>
        ))}
        
        <div className="add-stream-container" style={{ gridArea: 'add' }}>
          <AddStreamForm onAddStream={addStream} disabled={streams.length >= MAX_STREAMS} />
        </div>
      </div>
    </div>
  );
}

export default App;
