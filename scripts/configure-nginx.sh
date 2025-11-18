#!/bin/bash
# Nginx Configuration Script for React App
# Run this script on your EC2 instance after building your React app

set -e

echo "=========================================="
echo "Nginx Configuration for React App"
echo "=========================================="
echo ""

# Get project folder name
read -p "Enter your React project folder name (e.g., my-react-app): " PROJECT_FOLDER

# Verify build folder exists
BUILD_PATH="/home/ubuntu/$PROJECT_FOLDER/build"
if [ ! -d "$BUILD_PATH" ]; then
    echo "ERROR: Build folder not found at $BUILD_PATH"
    echo "Please make sure you've run 'npm run build' first"
    exit 1
fi

echo "✓ Build folder found at $BUILD_PATH"
echo ""

# Create Nginx configuration
echo "Creating Nginx configuration..."
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
echo "Your React app should now be accessible at:"
echo "http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo ""
