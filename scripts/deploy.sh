#!/bin/bash
# Quick Deploy Script
# Run this script whenever you want to update your React app

set -e

echo "=========================================="
echo "React App Deployment"
echo "=========================================="
echo ""

# Get current directory name
CURRENT_DIR=$(basename "$PWD")

echo "Project folder: $CURRENT_DIR"
echo ""

# Pull latest changes if using Git
if [ -d .git ]; then
    echo "Pulling latest changes from Git..."
    git pull
    echo "✓ Git pull complete"
    echo ""
fi

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Build the app
echo "Building React app..."
npm run build
echo "✓ Build complete"
echo ""

# Reload Nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx
echo "✓ Nginx reloaded"
echo ""

echo "=========================================="
echo "Deployment Complete! ✓"
echo "=========================================="
echo ""
echo "Your app has been updated and is now live!"
echo ""
