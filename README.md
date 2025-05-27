# StreamMonitor

A React-based application for monitoring multiple video streams simultaneously. This application allows users to view up to 8 different streaming sources at once (YouTube, Twitch, Telegram) in a responsive tile layout.

**Current Version:** 0.1.0

## Features

- Display up to 8 different stream sources in a responsive grid
- Support for YouTube, Twitch, and Telegram streams
- Auto-fitting tiles based on viewport size
- Audio visualization for each stream
- Mute/unmute controls for each stream
- Simple interface to add and remove streams
- All streams muted by default

## Usage

### Adding Streams

1. Click the "+ Add Stream" button
2. Select the stream type (YouTube, Twitch, or Telegram)
3. Enter the URL of the stream
4. Click "Add Stream"

#### Supported URL Formats

**YouTube:**
- Regular YouTube URLs: https://www.youtube.com/watch?v=VIDEO_ID
- Short YouTube URLs: https://youtu.be/VIDEO_ID
- YouTube Embed URLs: https://www.youtube.com/embed/VIDEO_ID

**Twitch:**
- Channel URLs: https://www.twitch.tv/CHANNEL_NAME
- Channel name only: Just enter the Twitch username (e.g., "ninja")
- Player URLs: https://player.twitch.tv/?channel=CHANNEL_NAME

**Telegram:**
- Public channel video URLs: https://t.me/CHANNEL_NAME/VIDEO_ID

### Managing Streams

- Click the mute/unmute button (🔇/🔊) to toggle audio for a particular stream
- Click the remove button (❌) to remove a stream from the view

## Technical Implementation

- Built with React
- Uses Web Audio API for sound level visualization
- Responsive layout that adjusts according to the number of active streams
- Containerized iframes for external stream sources

## Versioning

The StreamMonitor app follows semantic versioning (MAJOR.MINOR.PATCH):

- MAJOR version changes indicate incompatible API changes
- MINOR version changes indicate added functionality in a backward compatible manner
- PATCH version changes indicate backward compatible bug fixes

The current version is displayed in the top-right corner of the application. The version is automatically synchronized between package.json and the application during build.

### Version History

- 0.1.0 - Initial release with basic functionality for monitoring multiple streams

### Updating Version

To update the version, use the provided `bump-version.sh` script:

```bash
# For a patch update (0.1.0 -> 0.1.1)
./bump-version.sh patch

# For a minor update (0.1.0 -> 0.2.0)
./bump-version.sh minor

# For a major update (0.1.0 -> 1.0.0)
./bump-version.sh major
```

The script will:
1. Update the version in package.json
2. Update the version.js file with the new version and current build date
3. Display the new version number

Note: The version is also automatically updated during npm start, build, and deploy commands.

## Getting Started

To run this application locally:

1. Make sure you have Node.js installed
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

### Running in WSL (Windows Subsystem for Linux)

If you're using WSL and encounter path-related issues, you have multiple options:

**Option 1: Use the cross-platform Node.js script (Recommended)**
```bash
npm run start-js
```
This approach uses a custom Node.js script that works across all platforms including WSL.

**Option 2: Use the direct Node approach**
```bash
npm run start-wsl
```
This bypasses some of the path resolution issues by directly running the start script.

**Option 4: Use the Windows batch file (from Windows Command Prompt)**
```cmd
start-windows.bat
```
Run this from Windows Command Prompt or by double-clicking the file in Windows Explorer.

**Option 5: Run the VS Code task**
Press `Ctrl+Shift+P`, select "Tasks: Run Task", then choose "Start StreamMonitor (WSL Compatible)"

## Deployment

### GitHub Pages

This app can be deployed to GitHub Pages using the following steps:

#### Option 1: Using the Deployment Script (Recommended)

Run the provided deployment script which will guide you through the process:
```bash
./deploy.sh
```

This script will:
- Check for pending changes
- Prompt for your GitHub username if needed
- Update the package.json file automatically
- Build and deploy to GitHub Pages

#### Option 2: Manual Deployment

1. Update the `homepage` field in `package.json` to match your GitHub username:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/StreamMonitor"
   ```

2. Configure Git and connect to your GitHub repository:
   ```bash
   git config --global user.email "your-email@example.com"
   git config --global user.name "Your Name"
   git remote add origin https://github.com/YOUR_USERNAME/StreamMonitor.git
   ```

3. Deploy the app to GitHub Pages:
   ```bash
   npm run deploy
   ```

4. After deployment, your app will be available at:
   `https://YOUR_USERNAME.github.io/StreamMonitor`

## Browser Support

This application works best in modern browsers that support the Web Audio API:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes on Stream Sources

- YouTube streams require the standard YouTube URL format
- Twitch streams require the channel name or URL
- Telegram streams require the direct embed URL
