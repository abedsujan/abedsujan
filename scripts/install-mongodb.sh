#!/bin/bash
# MongoDB Installation Script
# Run this when you're ready to add database functionality

set -e

echo "=========================================="
echo "MongoDB Installation"
echo "=========================================="
echo ""

# Import MongoDB public GPG key
echo "Step 1: Adding MongoDB repository..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt update
echo "✓ Repository added"
echo ""

# Install MongoDB
echo "Step 2: Installing MongoDB..."
sudo apt install -y mongodb-org
echo "✓ MongoDB installed"
echo ""

# Start MongoDB
echo "Step 3: Starting MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod
echo "✓ MongoDB started and enabled"
echo ""

# Check status
sudo systemctl status mongod --no-pager

echo ""
echo "=========================================="
echo "MongoDB Installation Complete! ✓"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Secure MongoDB by creating admin user"
echo "2. Enable authentication"
echo "3. Create database and app user"
echo ""
echo "See DEPLOYMENT.md Phase 2 for detailed instructions"
