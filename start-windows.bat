@echo off
rem Windows batch file to start the React app in WSL

rem Navigate to the Windows drive letter for the WSL path
rem Assuming WSL is running in C drive, modify if needed
cd /d C:

rem Use wsl command to run a script inside WSL
wsl bash -c "cd \"$(wslpath '%~dp0')\" && npm run start-direct"

rem If WSL command fails, try direct approach
if %ERRORLEVEL% NEQ 0 (
  echo WSL command failed, trying direct approach...
  cd %~dp0
  npm run start-direct
)
