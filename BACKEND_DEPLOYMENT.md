# Backend and MongoDB Deployment Guide for AWS EC2

This guide focuses **only on deploying your backend API and MongoDB database** to AWS EC2. 

> **📝 Note**: This guide assumes you have already deployed your frontend or are deploying it separately (e.g., Vercel, Netlify, S3, etc.). If you haven't set up your EC2 instance yet, complete Steps 1-9 from [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md) first.

---

## Prerequisites

- ✅ AWS EC2 instance running Ubuntu 22.04
- ✅ SSH access to your EC2 instance
- ✅ Node.js installed on EC2 (see setup script below if not)
- Your backend code ready

---

## Quick Setup (If EC2 is New)

If you're starting fresh, run this on your EC2 instance:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Verify installations
node --version
npm --version
pm2 --version
```

---

## STEP 1: Install MongoDB on EC2

### Option A: MongoDB on EC2 (Self-Hosted)

1. **Install MongoDB 7.0**

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org
```

2. **Start MongoDB**

```bash
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

3. **Secure MongoDB**

```bash
# Connect to MongoDB
mongosh

# In MongoDB shell, create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "YOUR_STRONG_PASSWORD_HERE",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})

# Create database and user for your app
use yourappdb
db.createUser({
  user: "appuser",
  pwd: "YOUR_APP_PASSWORD_HERE",
  roles: [ { role: "readWrite", db: "yourappdb" } ]
})

exit
```

4. **Enable Authentication**

```bash
sudo nano /etc/mongod.conf
```

Add these lines:
```yaml
security:
  authorization: enabled
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

5. **Test Connection**

```bash
mongosh -u appuser -p YOUR_APP_PASSWORD_HERE --authenticationDatabase yourappdb
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free M0 tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select region closest to your EC2 region
   - Cluster name: `your-app-cluster`

3. **Create Database User**
   - Go to "Database Access"
   - Add new user
   - Username: `appuser`
   - Password: [generate strong password]
   - Role: Read and write to any database

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add your EC2 instance public IP
   - Or use `0.0.0.0/0` for testing (allow all - not recommended for production)

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://appuser:<password>@your-app-cluster.xxxxx.mongodb.net/yourappdb?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

---

## STEP 2: Deploy Backend API

### 1. Upload Your Backend Code

**Option A: Using Git (Recommended)**

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_BACKEND_REPO.git backend
cd backend
```

**Option B: Using SCP**

From your local machine:
```bash
scp -i your-key.pem -r /path/to/backend ubuntu@YOUR_EC2_IP:/home/ubuntu/backend
```

### 2. Install Dependencies

```bash
cd /home/ubuntu/backend
npm install
```

### 3. Configure Environment Variables

Create `.env` file:

```bash
nano .env
```

Add your configuration:

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# MongoDB Configuration
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://appuser:YOUR_PASSWORD@your-cluster.xxxxx.mongodb.net/yourappdb?retryWrites=true&w=majority

# OR for local MongoDB on EC2:
# MONGODB_URI=mongodb://appuser:YOUR_PASSWORD@localhost:27017/yourappdb

# CORS Configuration (your frontend URL)
FRONTEND_URL=https://your-frontend-domain.com
# Or for testing:
# FRONTEND_URL=*

# Other app-specific variables
JWT_SECRET=your_jwt_secret_here
API_KEY=your_api_key_here
```

**Important**: Never commit `.env` to Git! Add it to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### 4. Test Your Backend Locally

```bash
# Test run
node server.js

# Or if using npm scripts:
npm start
```

Test the API:
```bash
curl http://localhost:5001/api/health
```

If working, press `Ctrl+C` to stop.

---

## STEP 3: Set Up PM2 Process Manager

PM2 keeps your Node.js app running 24/7 and restarts it if it crashes.

### 1. Start Your App with PM2

```bash
cd /home/ubuntu/backend

# Start the app
pm2 start server.js --name "backend-api"

# Or if using npm:
pm2 start npm --name "backend-api" -- start
```

### 2. Save PM2 Configuration

```bash
pm2 save
```

### 3. Set PM2 to Start on Boot

```bash
pm2 startup
```

This will output a command - copy and run it. It looks like:
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### 4. Manage Your Backend

Useful PM2 commands:

```bash
# View status
pm2 status

# View logs
pm2 logs backend-api

# View last 100 lines of logs
pm2 logs backend-api --lines 100

# Restart app
pm2 restart backend-api

# Stop app
pm2 stop backend-api

# Delete app from PM2
pm2 delete backend-api

# Monitor CPU/Memory
pm2 monit
```

---

## STEP 4: Configure Security Group

Your backend needs to be accessible. Update your EC2 Security Group:

1. Go to **EC2 Console** → **Security Groups**
2. Select your instance's security group
3. Click **Edit inbound rules**
4. Add rule:
   - **Type**: Custom TCP
   - **Port**: 5001 (or your backend port)
   - **Source**: 
     - For testing: `0.0.0.0/0` (anywhere)
     - For production: Your frontend's IP or use Application Load Balancer

5. Click **Save rules**

---

## STEP 5: Configure Nginx Reverse Proxy (Optional but Recommended)

Instead of exposing port 5001 directly, use Nginx as a reverse proxy on port 80.

### 1. Install Nginx (if not already installed)

```bash
sudo apt install -y nginx
```

### 2. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/backend-api
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;  # Or your domain name

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

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5001/api/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### 3. Enable Configuration

```bash
sudo ln -s /etc/nginx/sites-available/backend-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Update Security Group

If using Nginx:
- Remove port 5001 from security group
- Ensure port 80 (HTTP) is open
- Your backend will be accessible at: `http://YOUR_EC2_IP/api`

---

## STEP 6: Test Your Deployment

### 1. Test Backend Directly

```bash
# If using port 5001 directly
curl http://YOUR_EC2_IP:5001/api/health

# If using Nginx proxy
curl http://YOUR_EC2_IP/api/health
```

### 2. Test from Frontend

Update your frontend to use the EC2 backend URL:

```javascript
// In your frontend code
const API_URL = 'http://YOUR_EC2_IP:5001/api';
// Or if using Nginx:
const API_URL = 'http://YOUR_EC2_IP/api';

// Test API call
fetch(`${API_URL}/health`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### 3. Test MongoDB Connection

Check PM2 logs to verify MongoDB connection:

```bash
pm2 logs backend-api
```

Look for "MongoDB connected" or similar message.

---

## STEP 7: Update Backend Code (Deployment Workflow)

When you make changes to your backend:

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Navigate to backend
cd /home/ubuntu/backend

# Pull latest changes (if using Git)
git pull

# Install new dependencies (if any)
npm install

# Restart the app
pm2 restart backend-api

# Check logs
pm2 logs backend-api
```

### Quick Deploy Script

Create `deploy-backend.sh`:

```bash
#!/bin/bash
cd /home/ubuntu/backend
echo "Pulling latest changes..."
git pull
echo "Installing dependencies..."
npm install
echo "Restarting backend..."
pm2 restart backend-api
echo "Deployment complete!"
pm2 logs backend-api --lines 20
```

Make executable:
```bash
chmod +x deploy-backend.sh
```

---

## Troubleshooting

### Backend Won't Start

1. **Check PM2 logs**:
   ```bash
   pm2 logs backend-api --lines 50
   ```

2. **Common issues**:
   - MongoDB connection failed → Check MONGODB_URI in .env
   - Port already in use → Check if another process is using the port
   - Missing dependencies → Run `npm install`
   - Syntax errors → Check logs for error details

### Can't Connect to Backend

1. **Check PM2 status**:
   ```bash
   pm2 status
   # Should show "online"
   ```

2. **Check port is open**:
   ```bash
   sudo lsof -i :5001
   ```

3. **Check Security Group**:
   - Verify port 5001 is allowed in AWS Security Group

4. **Check firewall**:
   ```bash
   sudo ufw status
   # If active, allow your port:
   sudo ufw allow 5001
   ```

### MongoDB Connection Issues

**For MongoDB Atlas**:
1. Check IP whitelist includes EC2 public IP
2. Verify connection string is correct
3. Test connection:
   ```bash
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
   ```

**For Local MongoDB**:
1. Check MongoDB is running:
   ```bash
   sudo systemctl status mongod
   ```

2. Test connection:
   ```bash
   mongosh -u appuser -p --authenticationDatabase yourappdb
   ```

3. Check MongoDB logs:
   ```bash
   sudo tail -f /var/log/mongodb/mongod.log
   ```

### CORS Errors

If you get CORS errors from frontend:

1. **Update backend CORS configuration**:

```javascript
// In your server.js
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

2. **Update .env**:
```env
FRONTEND_URL=https://your-frontend-domain.com
```

3. **Restart backend**:
```bash
pm2 restart backend-api
```

---

## Production Best Practices

### 1. Use Environment Variables

Never hardcode:
- Database credentials
- API keys
- Secrets
- URLs

### 2. Enable HTTPS

For production, use SSL/TLS:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d api.yourdomain.com
```

### 3. Set Up Monitoring

```bash
# Install PM2 log rotation
pm2 install pm2-logrotate

# Monitor your app
pm2 monit
```

### 4. Database Backups

**For MongoDB on EC2**:
```bash
# Create backup
mongodump --uri="mongodb://appuser:pass@localhost:27017/yourappdb" --out=/home/ubuntu/backups/$(date +%Y%m%d)

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

**For MongoDB Atlas**:
- Backups are automatic with Atlas

### 5. Monitor Logs

```bash
# View real-time logs
pm2 logs backend-api --lines 100

# Save logs for debugging
pm2 logs backend-api --lines 1000 > backend-logs.txt
```

---

## Architecture Reference

```
┌─────────────────────────────────────────────────────────┐
│                     Client/Browser                       │
│              (Frontend - Deployed Separately)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS Requests
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    AWS EC2 Instance                      │
│                                                           │
│  ┌──────────────────────────────────────────────┐        │
│  │              Nginx (Port 80)                 │        │
│  │         (Reverse Proxy - Optional)           │        │
│  └────────────────┬─────────────────────────────┘        │
│                   │                                       │
│                   ▼                                       │
│  ┌──────────────────────────────────────────────┐        │
│  │         Backend API (Port 5001)              │        │
│  │              (PM2 Managed)                   │        │
│  │    - Express.js                              │        │
│  │    - REST API endpoints                      │        │
│  └────────────────┬─────────────────────────────┘        │
│                   │                                       │
│                   ▼                                       │
│  ┌──────────────────────────────────────────────┐        │
│  │  MongoDB (Port 27017)                        │        │
│  │  - Local installation                        │        │
│  │  OR                                          │        │
│  │  - MongoDB Atlas (Cloud)                     │        │
│  └──────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Reference

### Essential Commands

```bash
# PM2 Management
pm2 status                    # Check app status
pm2 logs backend-api          # View logs
pm2 restart backend-api       # Restart app
pm2 stop backend-api          # Stop app

# MongoDB (Local)
sudo systemctl status mongod  # Check MongoDB status
sudo systemctl restart mongod # Restart MongoDB
mongosh -u user -p            # Connect to MongoDB

# Nginx
sudo systemctl restart nginx  # Restart Nginx
sudo nginx -t                 # Test configuration

# Logs
pm2 logs backend-api --lines 100
sudo tail -f /var/log/mongodb/mongod.log
sudo tail -f /var/log/nginx/error.log
```

### Important Paths

- Backend: `/home/ubuntu/backend`
- Environment: `/home/ubuntu/backend/.env`
- Nginx config: `/etc/nginx/sites-available/backend-api`
- MongoDB config: `/etc/mongod.conf`
- PM2 logs: `~/.pm2/logs/`

---

## Next Steps

1. ✅ Backend API running on EC2 with PM2
2. ✅ MongoDB configured (local or Atlas)
3. ✅ Environment variables secured
4. 🔲 Set up domain name (optional)
5. 🔲 Enable HTTPS/SSL
6. 🔲 Set up monitoring and alerts
7. 🔲 Configure automated backups
8. 🔲 Set up CI/CD pipeline

---

**Your backend is now deployed! 🚀**

For complete documentation including frontend deployment, see [DEPLOYMENT.md](DEPLOYMENT.md).
