#!/bin/bash
# EC2 Server Setup Script
# Run this script on your EC2 instance after connecting via SSH

set -e  # Exit on error

echo "=========================================="
echo "EC2 Server Setup for React Deployment"
echo "=========================================="
echo ""

# Update system
echo "Step 1: Updating system packages..."
sudo apt update
sudo apt upgrade -y
echo "✓ System updated"
echo ""

# Install Node.js
echo "Step 2: Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
echo "✓ Node.js installed"
node --version
npm --version
echo ""

# Install Nginx
echo "Step 3: Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
echo "✓ Nginx installed and started"
echo ""

# Install Git
echo "Step 4: Installing Git..."
sudo apt install -y git
echo "✓ Git installed"
git --version
echo ""

# Install PM2 (for future backend use)
echo "Step 5: Installing PM2 (process manager)..."
sudo npm install -g pm2
echo "✓ PM2 installed"
echo ""

echo "=========================================="
echo "Setup Complete! ✓"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Upload your React project to this server"
echo "2. Run: cd your-project && npm install && npm run build"
echo "3. Configure Nginx to serve your app"
echo ""
echo "See STEP_BY_STEP_GUIDE.md for detailed instructions"
