#!/bin/bash
# Nginx Configuration Script for React/Next.js App
# Run this script on your EC2 instance after building your app

set -e

echo "=========================================="
echo "Nginx Configuration for React/Next.js App"
echo "=========================================="
echo ""

# Get project folder name
read -p "Enter your project folder name (e.g., my-app): " PROJECT_FOLDER

# Auto-detect build output folder
BUILD_PATH=""
if [ -d "/home/ubuntu/$PROJECT_FOLDER/out" ]; then
    BUILD_PATH="/home/ubuntu/$PROJECT_FOLDER/out"
    echo "✓ Detected Next.js project (output folder: out)"
elif [ -d "/home/ubuntu/$PROJECT_FOLDER/build" ]; then
    BUILD_PATH="/home/ubuntu/$PROJECT_FOLDER/build"
    echo "✓ Detected React project (output folder: build)"
elif [ -d "/home/ubuntu/$PROJECT_FOLDER/dist" ]; then
    BUILD_PATH="/home/ubuntu/$PROJECT_FOLDER/dist"
    echo "✓ Detected project (output folder: dist)"
else
    echo "ERROR: No build output folder found!"
    echo "Looked for: out/, build/, or dist/ in /home/ubuntu/$PROJECT_FOLDER/"
    echo ""
    echo "For Next.js: Make sure you have 'output: export' in next.config.js"
    echo "For React: Run 'npm run build' first"
    exit 1
fi

echo "✓ Build folder found at $BUILD_PATH"
echo ""

# Create Nginx configuration
echo "Creating Nginx configuration..."

# Determine if Next.js or React based on folder structure
IS_NEXTJS=false
if [ -d "/home/ubuntu/$PROJECT_FOLDER/out" ]; then
    IS_NEXTJS=true
fi

if [ "$IS_NEXTJS" = true ]; then
    # Next.js configuration
    sudo tee /etc/nginx/sites-available/react-app > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root $BUILD_PATH;
    index index.html;
    
    location / {
        try_files \$uri \$uri.html \$uri/ /index.html;
    }
    
    # Cache static assets for Next.js
    location /_next/static/ {
        alias $BUILD_PATH/_next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
EOF
else
    # React/standard configuration
    sudo tee /etc/nginx/sites-available/react-app > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root $BUILD_PATH;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
EOF
fi

echo "✓ Configuration file created"
echo ""

# Enable site
echo "Enabling site..."
sudo ln -sf /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Set permissions
echo "Setting permissions..."
sudo chmod -R 755 /home/ubuntu/$PROJECT_FOLDER

# Test configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "=========================================="
echo "Configuration Complete! ✓"
echo "=========================================="
echo ""
if [ "$IS_NEXTJS" = true ]; then
    echo "Next.js app configured successfully!"
else
    echo "React app configured successfully!"
fi
echo "Your app should now be accessible at:"
echo "http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo ""
