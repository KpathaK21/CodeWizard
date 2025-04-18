#!/bin/bash

# Script to build the frontend for Dr.Debug

echo "🔨 Building Dr.Debug frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Navigate to the frontend directory
cd frontend || { echo "❌ Frontend directory not found."; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the frontend
echo "🏗️ Building the frontend..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Frontend built successfully!"
    echo "The frontend is now ready to be served by the Flask backend."
else
    echo "❌ Frontend build failed."
    exit 1
fi