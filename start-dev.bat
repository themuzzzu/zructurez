
@echo off
echo Starting Vite development server...

:: Check if node_modules exists
if not exist "node_modules" (
  echo node_modules not found. Running npm install first...
  call npm install
)

:: Check if Vite exists in node_modules
if not exist "node_modules\.bin\vite" (
  echo Vite not found. Installing Vite...
  call npm install --save-dev vite @vitejs/plugin-react-swc
)

:: Run Vite
echo Starting Vite development server...
npx vite
