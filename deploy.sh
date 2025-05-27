#!/bin/bash
# GitHub Pages deployment script

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}StreamMonitor GitHub Pages Deployment Script${NC}"
echo -e "${YELLOW}==========================================${NC}"

# Update version information
echo -e "${YELLOW}Updating version information...${NC}"
node ./update-version.js

# Check for pending changes
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}Error: You have pending changes. Please commit or stash them before deploying.${NC}"
  git status
  exit 1
fi

# Get the username from the user if not already set in package.json
current_username=$(grep -o 'https://[^.]*\.github\.io' package.json | cut -d'/' -f3)
if [[ "$current_username" == "USERNAME" ]]; then
  echo -e "${YELLOW}Please enter your GitHub username:${NC}"
  read username
  
  # Update package.json with the correct username
  sed -i "s/USERNAME/$username/g" package.json
  echo -e "${GREEN}Updated homepage URL in package.json${NC}"
  
  # Commit the change
  git add package.json
  git commit -m "Update GitHub Pages homepage URL with correct username"
fi

# Run the build and deploy
echo -e "${YELLOW}Building and deploying the application...${NC}"
npm run deploy

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Deployment successful!${NC}"
  echo -e "${GREEN}Your application is now live at: $(grep -o 'https://.*\.github\.io/[^"]*' package.json)${NC}"
  
  # Display reminder about custom domain
  echo -e "${YELLOW}Reminder: If you want to use a custom domain, configure it in your GitHub repository settings.${NC}"
else
  echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
  exit 1
fi

exit 0
