#!/bin/bash
# This script creates a WSL-friendly wrapper around the React development server

# Get absolute path to the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if running in WSL
if grep -q Microsoft /proc/version; then
  echo "Running in WSL environment"
  
  # Create a temporary JS file to handle path resolution
  cat > "${PROJECT_DIR}/wsl-path-fix.js" << 'EOL'
// WSL Path resolution fix
const fs = require('fs');
const path = require('path');

// Override the path resolution to handle WSL paths correctly
const originalResolve = path.resolve;
path.resolve = function(...args) {
  const result = originalResolve.apply(path, args);
  // Check if this looks like a WSL path that's been misinterpreted
  if (result.includes('\\wsl.localhost')) {
    try {
      // Try to convert to a format Node can work with
      return result.replace(/\\\\wsl\.localhost\\[^\\]+\\/, '/');
    } catch (e) {
      console.error('Failed to fix WSL path:', e);
    }
  }
  return result;
};

// Now run the original script
require('./node_modules/react-scripts/scripts/start.js');
EOL

  echo "Starting with WSL path fix"
  # Run Node with our path fix script
  BROWSER=none DANGEROUSLY_DISABLE_HOST_CHECK=true WDS_SOCKET_HOST=localhost \
  NODE_PATH="${PROJECT_DIR}/node_modules" \
  node "${PROJECT_DIR}/wsl-path-fix.js"
else
  echo "Running in standard environment"
  # Just use the regular npm start
  cd "${PROJECT_DIR}" && npm run start-direct
fi
