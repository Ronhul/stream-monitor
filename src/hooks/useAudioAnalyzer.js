import { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook to analyze audio and provide visualization data
const useAudioAnalyzer = () => {
  // State to store the audio levels for visualization
  const [audioLevels, setAudioLevels] = useState(Array(16).fill(0));
  
  // References to store audio contexts
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const simulationFrameRef = useRef(null);
  const isSimulatingRef = useRef(false);
  
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
      
      if (simulationFrameRef.current) {
        cancelAnimationFrame(simulationFrameRef.current);
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
  
  // Function to simulate audio levels for iframe streams where we can't access audio
  const simulateLevels = useCallback((active = true) => {
    // Stop any existing simulation
    if (simulationFrameRef.current) {
      cancelAnimationFrame(simulationFrameRef.current);
      simulationFrameRef.current = null;
    }
    
    // Stop real audio analysis if it's running
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // If not active, set all levels to 0 and return
    if (!active) {
      setAudioLevels(Array(16).fill(0));
      isSimulatingRef.current = false;
      return;
    }
    
    isSimulatingRef.current = true;
    
    // Function to generate realistic looking audio levels
    const simulateFrame = () => {
      // Generate realistic looking audio levels between 0.1 and 0.8
      const newLevels = Array(16).fill(0).map(() => {
        // Base value
        const baseValue = Math.random() * 0.4 + 0.05;
        
        // Add some peaks occasionally for realism
        const isPeak = Math.random() > 0.85;
        const peak = isPeak ? Math.random() * 0.3 : 0;
        
        return Math.min(0.8, baseValue + peak);
      });
      
      setAudioLevels(newLevels);
      simulationFrameRef.current = requestAnimationFrame(simulateFrame);
    };
    
    simulationFrameRef.current = requestAnimationFrame(simulateFrame);
  }, []);
  
  // Function to stop simulation
  const stopSimulation = useCallback(() => {
    if (simulationFrameRef.current) {
      cancelAnimationFrame(simulationFrameRef.current);
      simulationFrameRef.current = null;
    }
    
    if (isSimulatingRef.current) {
      setAudioLevels(Array(16).fill(0));
      isSimulatingRef.current = false;
    }
  }, []);
  
  return { audioLevels, setAudioSource, simulateLevels, stopSimulation };
};

export default useAudioAnalyzer;
