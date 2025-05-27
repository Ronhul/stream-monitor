#!/usr/bin/env bash

# Script to easily bump version of StreamMonitor
# Usage: ./bump-version.sh <patch|minor|major>

set -e

# Check parameter
if [[ $# -ne 1 || ($1 != "patch" && $1 != "minor" && $1 != "major") ]]; then
  echo "Usage: $0 <patch|minor|major>"
  exit 1
fi

VERSION_TYPE=$1
CURRENT_DIR=$(dirname "$0")

cd "$CURRENT_DIR"

# Run npm version command
echo "Bumping $VERSION_TYPE version..."
npm version $VERSION_TYPE

# Update version.js
node ./update-version.js

# Show new version
NEW_VERSION=$(node -e "console.log(require('./package.json').version)")
echo "Version updated to $NEW_VERSION"
echo "Don't forget to commit and push the changes!"
