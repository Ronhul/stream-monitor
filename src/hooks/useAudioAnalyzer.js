import { useState, useEffect, useRef } from 'react';

// Custom hook to analyze audio and provide visualization data
const useAudioAnalyzer = () => {
  // State to store the audio levels for visualization
  const [audioLevels, setAudioLevels] = useState(Array(16).fill(0));
  
  // References to store audio contexts
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Initialize audio context and analyzer when hook is first used
  useEffect(() => {
    // Create audio context if not exists
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 64;
        analyzerRef.current.smoothingTimeConstant = 0.7;
      } catch (err) {
        console.error('Error initializing audio analyzer:', err);
      }
    }
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Function to set the audio source
  const setAudioSource = (audioElement) => {
    if (!audioContextRef.current || !analyzerRef.current) return;
    
    try {
      // Disconnect previous source if exists
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      // Create media element source
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);
      
      // Start the visualization loop
      startVisualization();
    } catch (err) {
      console.error('Error setting audio source:', err);
    }
  };
  
  // Function to start the visualization loop
  const startVisualization = () => {
    if (!analyzerRef.current) return;
    
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateLevels = () => {
      // Get frequency data
      analyzerRef.current.getByteFrequencyData(dataArray);
      
      // Process the frequency data to get audio levels for visualization
      // We're using a subset of the frequency data to create visualization bars
      const numBars = 16;
      const step = Math.floor(bufferLength / numBars) || 1;
      
      const levels = Array(numBars).fill(0).map((_, i) => {
        const startIndex = i * step;
        const endIndex = startIndex + step;
        let sum = 0;
        
        // Average the values in this frequency range
        for (let j = startIndex; j < endIndex && j < bufferLength; j++) {
          sum += dataArray[j];
        }
        
        // Normalize to 0-1
        return (sum / step) / 255;
      });
      
      setAudioLevels(levels);
      animationFrameRef.current = requestAnimationFrame(updateLevels);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateLevels);
  };
  
  return { audioLevels, setAudioSource };
};

export default useAudioAnalyzer;
