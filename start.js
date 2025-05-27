// Cross-platform script to start React app
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Set environment variables
process.env.BROWSER = 'none';
process.env.DANGEROUSLY_DISABLE_HOST_CHECK = 'true';
process.env.WDS_SOCKET_HOST = 'localhost';
process.env.CHOKIDAR_USEPOLLING = 'true';

// Detect Windows Subsystem for Linux
const isWSL = os.release().toLowerCase().includes('microsoft') || 
              (fs.existsSync('/proc/version') && 
               fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft'));

console.log(`Running in ${isWSL ? 'WSL' : 'standard'} environment`);

// Path to the react-scripts start script
const reactScriptsPath = path.resolve(
  __dirname,
  'node_modules',
  'react-scripts',
  'scripts',
  'start.js'
);

// Verify the script exists
if (!fs.existsSync(reactScriptsPath)) {
  console.error(`Error: Could not find React Scripts at ${reactScriptsPath}`);
  process.exit(1);
}

// Run the React start script directly
console.log('Starting React application...');
try {
  // Use require to run the start script in the current process
  require(reactScriptsPath);
} catch (err) {
  console.error('Error starting React application:', err);
  process.exit(1);
}
