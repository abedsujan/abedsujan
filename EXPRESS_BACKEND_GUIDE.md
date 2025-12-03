# Complete Backend Deployment Guide - Node.js Express to AWS EC2

**Project**: Car Numberplate Search Backend  
**Stack**: Express.js + MongoDB Atlas + PM2  
**Target**: AWS EC2 (t2.micro free tier)

---

## 📋 Prerequisites Checklist

- [ ] AWS Account created
- [ ] MongoDB Atlas cluster setup
- [ ] MongoDB connection string ready
- [ ] Backend code in repository or local machine
- [ ] Domain name (optional, for SSL)

---

## PART 1: Launch AWS EC2 Instance

### Step 1: Create EC2 Instance

1. **Login to AWS Console**
   - Go to https://console.aws.amazon.com/
   - Navigate to EC2 Dashboard

2. **Launch Instance**
   - Click **"Launch Instance"**
   - **Name**: `backend-server` (or any name)
   - **AMI**: Select **Ubuntu Server 22.04 LTS (HVM)**
   - **Instance type**: **t2.micro** (Free tier eligible)

3. **Create Key Pair**
   - Click **"Create new key pair"**
   - **Name**: `backend-key`
   - **Type**: RSA
   - **Format**: `.pem` (Mac/Linux) or `.ppk` (Windows/PuTTY)
   - Click **"Create key pair"** - downloads automatically
   - ⚠️ **IMPORTANT**: Save this file securely!

4. **Configure Network Settings**
   - Click **"Edit"** on Network settings
   - Create security group with these rules:

   | Type | Protocol | Port | Source | Description |
   |------|----------|------|--------|-------------|
   | SSH | TCP | 22 | My IP | SSH access |
   | HTTP | TCP | 80 | 0.0.0.0/0 | HTTP access |
   | HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS access |
   | Custom TCP | TCP | 5001 | 0.0.0.0/0 | Backend API |

   > **Note**: For production, restrict 5001 to your frontend's IP only

5. **Configure Storage**
   - Keep default **8 GB** (sufficient for backend)
   - Or increase to **20 GB** if needed

6. **Launch Instance**
   - Click **"Launch Instance"**
   - Wait for instance state to become **"Running"**
   - Note your **Public IPv4 address** (e.g., 3.85.123.45)

---

## PART 2: Connect to EC2 Instance

### Step 2: SSH into Your EC2

**On Mac/Linux:**

```bash
# Set permissions on key file
chmod 400 backend-key.pem

# Connect to EC2
ssh -i backend-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**On Windows (PowerShell):**

```powershell
ssh -i backend-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**On Windows (PuTTY):**
1. Open PuTTY
2. Host Name: `ubuntu@YOUR_EC2_PUBLIC_IP`
3. Connection → SSH → Auth → Browse to your `.ppk` file
4. Click "Open"

Type `yes` when prompted about authenticity.

You should now see: `ubuntu@ip-xxx-xxx-xxx-xxx:~$`

---

## PART 3: Setup Server Environment

### Step 3: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

This takes 2-3 minutes.

### Step 4: Install Node.js 18.x

```bash
# Download and run Node.js setup script
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version    # Should show v18.x.x
npm --version     # Should show 9.x.x or higher
```

### Step 5: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 6: Install Git

```bash
sudo apt install -y git
git --version
```

---

## PART 4: Deploy Your Backend

### Step 7: Upload Backend Code

**Option A: Clone from GitHub (Recommended)**

```bash
# Navigate to home directory
cd /home/ubuntu

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Navigate to backend folder
cd YOUR_REPO/backend
```

**Option B: Create Backend Manually**

```bash
# Create backend directory
mkdir -p /home/ubuntu/backend
cd /home/ubuntu/backend

# Initialize npm
npm init -y
```

**Option C: Upload via SCP**

From your **local machine**:

```bash
# Upload entire backend folder
scp -i backend-key.pem -r /path/to/your/backend ubuntu@YOUR_EC2_IP:/home/ubuntu/backend
```

### Step 8: Install Dependencies

```bash
cd /home/ubuntu/backend

# Install dependencies
npm install express mongoose cors dotenv

# If you have package.json, just run:
npm install
```

### Step 9: Create Environment Variables

```bash
cd /home/ubuntu/backend

# Create .env file
nano .env
```

Add your configuration:

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# CORS - Your frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Or allow all for testing:
# FRONTEND_URL=*
```

**Replace**:
- `username` - your MongoDB Atlas username
- `password` - your MongoDB Atlas password
- `cluster` - your cluster name
- `dbname` - your database name
- `your-frontend-domain.com` - your actual frontend URL

**Save and Exit**:
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

**⚠️ Security**: Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### Step 10: Verify Your Backend Code

Check your `server.js` has proper structure:

```bash
nano server.js
```

Ensure it looks similar to this:

```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Your API endpoints
app.get('/api/cars', async (req, res) => {
  // Your code here
});

app.get('/api/cars/search', async (req, res) => {
  // Your code here
});

app.get('/api/cars/:plate', async (req, res) => {
  // Your code here
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
```

---

## PART 5: Setup PM2 (Process Manager)

### Step 11: Start Backend with PM2

```bash
cd /home/ubuntu/backend

# Start the backend
pm2 start server.js --name "backend-api"

# Check status
pm2 status
```

You should see:

```
┌─────┬──────────────┬─────────┬─────────┐
│ id  │ name         │ status  │ memory  │
├─────┼──────────────┼─────────┼─────────┤
│ 0   │ backend-api  │ online  │ 50 MB   │
└─────┴──────────────┴─────────┴─────────┘
```

### Step 12: View Logs

```bash
# Real-time logs
pm2 logs backend-api

# Last 100 lines
pm2 logs backend-api --lines 100
```

Look for:
- ✓ MongoDB connected
- ✓ Server running on port 5001

Press `Ctrl + C` to exit logs.

### Step 13: Save PM2 Configuration

```bash
# Save current PM2 processes
pm2 save
```

### Step 14: Enable Auto-Start on Reboot

```bash
# Generate startup script
pm2 startup
```

This will output a command like:

```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

**Copy and run the command it shows you.**

Then save again:

```bash
pm2 save
```

Now your backend will automatically start when EC2 reboots! ✅

---

## PART 6: Configure MongoDB Atlas

### Step 15: Update MongoDB Atlas Whitelist

1. **Login to MongoDB Atlas**
   - Go to https://cloud.mongodb.com/

2. **Navigate to Network Access**
   - Click **"Network Access"** in left sidebar

3. **Add IP Address**
   - Click **"Add IP Address"**
   - **Option 1**: Add your EC2 public IP
   - **Option 2**: Click **"Allow access from anywhere"** (`0.0.0.0/0`) for testing
   - Click **"Confirm"**

> **Note**: For production, use only your EC2 IP for better security

---

## PART 7: Test Your Backend

### Step 16: Test Locally on EC2

```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Should return:
# {"status":"OK","message":"Backend is running"}
```

### Step 17: Test from Internet

From your **local computer** or browser:

```bash
# Test health endpoint
curl http://YOUR_EC2_PUBLIC_IP:5001/api/health

# Test cars endpoint
curl http://YOUR_EC2_PUBLIC_IP:5001/api/cars
```

**In browser**, navigate to:
```
http://YOUR_EC2_PUBLIC_IP:5001/api/health
```

You should see the JSON response!

### Step 18: Test from Frontend

Update your frontend code to use EC2 backend:

```javascript
// In your frontend code
const API_BASE_URL = 'http://YOUR_EC2_PUBLIC_IP:5001';

// Example API call
fetch(`${API_BASE_URL}/api/cars`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Search endpoint
fetch(`${API_BASE_URL}/api/cars/search?query=ABC123`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Get specific car
fetch(`${API_BASE_URL}/api/cars/ABC123`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

## PART 8: Update Backend Code (Deployment Workflow)

### When You Make Code Changes:

```bash
# SSH into EC2
ssh -i backend-key.pem ubuntu@YOUR_EC2_IP

# Navigate to backend
cd /home/ubuntu/backend

# If using Git:
git pull origin main

# If dependencies changed:
npm install

# Restart backend
pm2 restart backend-api

# Check logs
pm2 logs backend-api --lines 50
```

### Quick Deploy Script

Create a deploy script:

```bash
nano /home/ubuntu/deploy.sh
```

Add:

```bash
#!/bin/bash
echo "🚀 Deploying backend..."
cd /home/ubuntu/backend
git pull origin main
npm install
pm2 restart backend-api
echo "✓ Deployment complete!"
pm2 logs backend-api --lines 20
```

Make executable:

```bash
chmod +x /home/ubuntu/deploy.sh
```

Use it:

```bash
~/deploy.sh
```

---

## PART 9: Nginx Reverse Proxy (Optional - For SSL/Production)

### Why Use Nginx?

- ✅ SSL/HTTPS support
- ✅ Better security
- ✅ Load balancing (future)
- ✅ Hide backend port (5001)

### Step 19: Install Nginx

```bash
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Step 20: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/backend-api
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;  # Or your domain: api.yourdomain.com

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://localhost:5001/api/health;
    }
}
```

Replace `YOUR_EC2_PUBLIC_IP` with your actual IP or domain.

### Step 21: Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/backend-api /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If OK, reload Nginx
sudo systemctl reload nginx
```

Now your API is accessible at:
- `http://YOUR_EC2_IP/api/health`
- `http://YOUR_EC2_IP/api/cars`

**Update frontend to use**:
```javascript
const API_BASE_URL = 'http://YOUR_EC2_IP';  // No port needed!
```

---

## PART 10: Setup SSL with Let's Encrypt (Optional)

### Prerequisites:
- Domain name pointing to your EC2 IP (e.g., `api.yourdomain.com`)

### Step 22: Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Step 23: Get SSL Certificate

```bash
# Replace with your domain
sudo certbot --nginx -d api.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)
```

Certbot will automatically:
- ✅ Get SSL certificate
- ✅ Update Nginx config
- ✅ Enable HTTPS

### Step 24: Test HTTPS

```
https://api.yourdomain.com/api/health
```

### Step 25: Auto-Renewal

Certbot auto-renews certificates. Test renewal:

```bash
sudo certbot renew --dry-run
```

**Update frontend to use HTTPS**:
```javascript
const API_BASE_URL = 'https://api.yourdomain.com';
```

---

## 🔧 Troubleshooting

### Backend Won't Start

**Check PM2 logs**:
```bash
pm2 logs backend-api --lines 100
```

**Common issues**:

1. **MongoDB connection failed**
   ```
   Error: Failed to connect to MongoDB
   ```
   **Fix**:
   - Check MongoDB Atlas IP whitelist
   - Verify MONGODB_URI in `.env`
   - Test connection: `mongosh "YOUR_MONGODB_URI"`

2. **Port already in use**
   ```
   Error: Port 5001 is already in use
   ```
   **Fix**:
   ```bash
   # Find process using port
   sudo lsof -i :5001
   
   # Kill it
   sudo kill -9 PID
   
   # Restart backend
   pm2 restart backend-api
   ```

3. **Module not found**
   ```
   Error: Cannot find module 'express'
   ```
   **Fix**:
   ```bash
   cd /home/ubuntu/backend
   npm install
   pm2 restart backend-api
   ```

### Can't Access Backend from Internet

1. **Check PM2 status**:
   ```bash
   pm2 status
   # Should show "online"
   ```

2. **Check port is listening**:
   ```bash
   sudo lsof -i :5001
   # Should show node process
   ```

3. **Check Security Group**:
   - Go to EC2 Console → Security Groups
   - Verify port 5001 is open to `0.0.0.0/0`

4. **Check firewall**:
   ```bash
   sudo ufw status
   # If active:
   sudo ufw allow 5001
   ```

5. **Test locally first**:
   ```bash
   curl http://localhost:5001/api/health
   ```

### CORS Errors

**Error in browser**:
```
Access to fetch has been blocked by CORS policy
```

**Fix**:

1. Update `server.js`:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend.com', 'http://localhost:3000'],
     credentials: true
   }));
   ```

2. Update `.env`:
   ```env
   FRONTEND_URL=https://your-frontend.com
   ```

3. Restart:
   ```bash
   pm2 restart backend-api
   ```

### Nginx Issues

**Check Nginx status**:
```bash
sudo systemctl status nginx
```

**Test configuration**:
```bash
sudo nginx -t
```

**View error logs**:
```bash
sudo tail -f /var/log/nginx/error.log
```

**Restart Nginx**:
```bash
sudo systemctl restart nginx
```

---

## 📊 PM2 Management Commands

```bash
# View all processes
pm2 list

# View specific app status
pm2 show backend-api

# View logs (real-time)
pm2 logs backend-api

# View last 200 lines
pm2 logs backend-api --lines 200

# Restart app
pm2 restart backend-api

# Stop app
pm2 stop backend-api

# Start app
pm2 start backend-api

# Delete from PM2
pm2 delete backend-api

# Monitor CPU/Memory
pm2 monit

# Save configuration
pm2 save

# Clear logs
pm2 flush
```

---

## 🔐 Security Checklist

- [ ] MongoDB Atlas IP whitelist configured
- [ ] `.env` file not committed to Git
- [ ] Strong MongoDB password used
- [ ] SSH key file permissions set to `400`
- [ ] Security group restricts SSH to your IP only
- [ ] CORS configured for your frontend only
- [ ] HTTPS enabled (if using domain)
- [ ] Regular system updates: `sudo apt update && sudo apt upgrade`

---

## 📝 Quick Reference

### Important Paths
```
Backend directory: /home/ubuntu/backend
Environment file: /home/ubuntu/backend/.env
PM2 logs: ~/.pm2/logs/
Nginx config: /etc/nginx/sites-available/backend-api
```

### Your Backend URLs

**Without Nginx**:
```
Health check: http://YOUR_EC2_IP:5001/api/health
Cars list: http://YOUR_EC2_IP:5001/api/cars
Car search: http://YOUR_EC2_IP:5001/api/cars/search?query=ABC
Specific car: http://YOUR_EC2_IP:5001/api/cars/ABC123
```

**With Nginx**:
```
Health check: http://YOUR_EC2_IP/api/health
Cars list: http://YOUR_EC2_IP/api/cars
Car search: http://YOUR_EC2_IP/api/cars/search?query=ABC
Specific car: http://YOUR_EC2_IP/api/cars/ABC123
```

**With SSL**:
```
Health check: https://api.yourdomain.com/api/health
Cars list: https://api.yourdomain.com/api/cars
Car search: https://api.yourdomain.com/api/cars/search?query=ABC
Specific car: https://api.yourdomain.com/api/cars/ABC123
```

---

## ✅ Deployment Complete!

Your backend is now:
- ✅ Running on AWS EC2
- ✅ Connected to MongoDB Atlas
- ✅ Managed by PM2 (auto-restarts)
- ✅ Auto-starts on server reboot
- ✅ Accessible from your frontend

**Next Steps**:
1. Test all API endpoints
2. Update frontend to use new backend URL
3. Monitor PM2 logs for any errors
4. Consider setting up domain + SSL for production

**Need help?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues.

---

**Your Backend URL**: `http://YOUR_EC2_PUBLIC_IP:5001`

Update your frontend's API configuration to point to this URL! 🚀
