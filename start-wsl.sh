#!/bin/bash
# Helper script for running React in WSL

# Set environment variables to fix common WSL issues
export BROWSER=none
export DANGEROUSLY_DISABLE_HOST_CHECK=true
export WDS_SOCKET_HOST=localhost
export CHOKIDAR_USEPOLLING=true
export NODE_ENV=development

# Go to the script's directory
cd "$(dirname "$0")"

# Run the direct start script
npm run start-wsl
