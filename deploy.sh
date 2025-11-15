#!/bin/bash

# Exit on any error
set -e

# --- Frontend Build ---
echo "Building React frontend..."
cd ../
npm install
npm run build
cd server

# --- Backend Setup ---
echo "Setting up backend in AZdeploy directory..."

# Create AZdeploy directory if it doesn't exist
mkdir -p ../AZdeploy

# Copy server files
cp package.json ../AZdeploy/
cp package-lock.json ../AZdeploy/
cp server.js ../AZdeploy/
cp .env ../AZdeploy/
cp -r ../node_modules ../AZdeploy/

# Copy server data files
cp answers.json ../AZdeploy/
cp confidence-questions.json ../AZdeploy/
cp questions.json ../AZdeploy/
cp Question1.json ../AZdeploy/
cp Question2.json ../AZdeploy/

# Copy frontend build to AZdeploy
cp -r ../build ../AZdeploy/

# --- Install Dependencies in AZdeploy ---
echo "Installing dependencies in AZdeploy..."
cd ../AZdeploy
npm install --production

echo "Deployment package is ready in AZdeploy directory."
