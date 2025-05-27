#!/usr/bin/env node

/**
 * This script updates the version.js file with the current version from package.json
 * It is intended to be run as a pre-build step in the npm build process
 */

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get the version
const version = packageJson.version;

// Get current date in YYYY-MM-DD format
const today = new Date();
const buildDate = today.toISOString().split('T')[0];

// Create the content for version.js
const versionFileContent = `// This file contains the version information for the StreamMonitor app
// The version is automatically updated from package.json
export const VERSION = '${version}';
export const BUILD_DATE = '${buildDate}';
`;

// Write the file
const versionFilePath = path.join(__dirname, 'src', 'version.js');
fs.writeFileSync(versionFilePath, versionFileContent);

console.log(`Updated version.js with version ${version} and build date ${buildDate}`);
