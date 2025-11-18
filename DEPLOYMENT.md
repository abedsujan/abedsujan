# AWS EC2 Deployment Guide for React Application

This guide provides step-by-step instructions to deploy your React application to AWS EC2, starting with a static website and eventually adding MongoDB and a REST API backend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Deploy Static React Website](#phase-1-deploy-static-react-website)
3. [Phase 2: Add MongoDB and REST API](#phase-2-add-mongodb-and-rest-api)
4. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- An AWS account ([Sign up here](https://aws.amazon.com/))
- Your React project ready locally
- Basic knowledge of command line/terminal
- SSH client installed on your computer

---

## Phase 1: Deploy Static React Website

### Step 1: Launch an EC2 Instance

1. **Log in to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Navigate to EC2 Dashboard

2. **Launch Instance**
   - Click "Launch Instance"
   - **Name**: Give your instance a name (e.g., "my-react-app")
   - **AMI**: Select "Ubuntu Server 22.04 LTS (HVM), SSD Volume Type"
   - **Instance Type**: Select `t2.micro` (Free tier eligible)
   - **Key Pair**: 
     - Click "Create new key pair"
     - Name: `my-react-app-key`
     - Type: RSA
     - Format: `.pem` (for Mac/Linux) or `.ppk` (for Windows with PuTTY)
     - Download and save securely

3. **Configure Network Settings**
   - Click "Edit" on Network settings
   - **Firewall (Security Groups)**: Create security group
   - Add the following rules:
     - SSH (port 22) - Your IP
     - HTTP (port 80) - Anywhere (0.0.0.0/0)
     - HTTPS (port 443) - Anywhere (0.0.0.0/0)
     - Custom TCP (port 3000) - Anywhere (0.0.0.0/0) - for development

4. **Configure Storage**
   - Default 8 GB is usually sufficient for static site
   - For future database needs, consider 20-30 GB

5. **Launch Instance**
   - Click "Launch Instance"
   - Wait for instance state to become "Running"
   - Note your instance's **Public IP address**

### Step 2: Connect to Your EC2 Instance

1. **Set Permissions on Key File** (Mac/Linux)
   ```bash
   chmod 400 my-react-app-key.pem
   ```

2. **Connect via SSH**
   ```bash
   ssh -i my-react-app-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
   ```
   Replace `YOUR_EC2_PUBLIC_IP` with your instance's public IP address

### Step 3: Set Up the Server Environment

Once connected to your EC2 instance, run these commands:

1. **Update System Packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js and npm**
   ```bash
   # Install Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

3. **Install Nginx (Web Server)**
   ```bash
   sudo apt install -y nginx
   
   # Start Nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   
   # Check status
   sudo systemctl status nginx
   ```

4. **Install Git**
   ```bash
   sudo apt install -y git
   ```

### Step 4: Deploy Your React Application

1. **Upload Your React Project**

   **Option A: Using Git (Recommended)**
   ```bash
   # If your project is on GitHub
   cd /home/ubuntu
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

   **Option B: Using SCP from your local machine**
   ```bash
   # Run this from your LOCAL machine (not EC2)
   scp -i my-react-app-key.pem -r /path/to/your/react/project ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/
   ```

2. **Install Dependencies and Build**
   ```bash
   cd /home/ubuntu/your-project-folder
   npm install
   npm run build
   ```

3. **Configure Nginx to Serve Your React App**
   ```bash
   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/react-app
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       
       server_name YOUR_EC2_PUBLIC_IP;
       
       root /home/ubuntu/your-project-folder/build;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 10240;
       gzip_proxied expired no-cache no-store private auth;
       gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
   }
   ```

4. **Enable the Site**
   ```bash
   # Create symbolic link
   sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/
   
   # Remove default site
   sudo rm /etc/nginx/sites-enabled/default
   
   # Test Nginx configuration
   sudo nginx -t
   
   # Reload Nginx
   sudo systemctl reload nginx
   ```

5. **Set Correct Permissions**
   ```bash
   sudo chown -R www-data:www-data /home/ubuntu/your-project-folder/build
   sudo chmod -R 755 /home/ubuntu/your-project-folder/build
   ```

### Step 5: Access Your Application

Open your browser and navigate to:
```
http://YOUR_EC2_PUBLIC_IP
```

Your React application should now be live! 🎉

### Step 6: (Optional) Set Up a Domain Name

1. **Purchase a Domain** (from GoDaddy, Namecheap, Route 53, etc.)

2. **Configure DNS**
   - Add an A record pointing to your EC2 public IP
   - Wait for DNS propagation (5-30 minutes)

3. **Update Nginx Configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/react-app
   ```
   Change `server_name YOUR_EC2_PUBLIC_IP;` to `server_name yourdomain.com www.yourdomain.com;`

4. **Reload Nginx**
   ```bash
   sudo systemctl reload nginx
   ```

### Step 7: (Optional) Set Up SSL/HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts
# Certbot will automatically configure Nginx for HTTPS
```

---

## Phase 2: Add MongoDB and REST API

Once your static site is running, follow these steps to add backend functionality.

### Step 1: Install MongoDB

1. **Install MongoDB**
   ```bash
   # Import MongoDB public GPG key
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
   
   # Create admin user (in MongoDB shell)
   use admin
   db.createUser({
     user: "admin",
     pwd: "YOUR_STRONG_PASSWORD",
     roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
   })
   
   # Create database and user for your app
   use yourappdb
   db.createUser({
     user: "appuser",
     pwd: "YOUR_APP_PASSWORD",
     roles: [ { role: "readWrite", db: "yourappdb" } ]
   })
   
   exit
   ```

4. **Enable Authentication**
   ```bash
   sudo nano /etc/mongod.conf
   ```
   
   Add/uncomment these lines:
   ```yaml
   security:
     authorization: enabled
   ```
   
   Restart MongoDB:
   ```bash
   sudo systemctl restart mongod
   ```

### Step 2: Set Up Your Backend API

1. **Create Backend Folder**
   ```bash
   cd /home/ubuntu
   mkdir backend
   cd backend
   npm init -y
   ```

2. **Install Dependencies**
   ```bash
   npm install express mongoose cors dotenv
   npm install --save-dev nodemon
   ```

3. **Create Basic Express Server**
   ```bash
   nano server.js
   ```
   
   Example server.js:
   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   require('dotenv').config();
   
   const app = express();
   
   // Middleware
   app.use(cors());
   app.use(express.json());
   
   // MongoDB Connection
   mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   })
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.error('MongoDB connection error:', err));
   
   // Routes
   app.get('/api/health', (req, res) => {
     res.json({ status: 'OK', message: 'Server is running' });
   });
   
   // Import your routes here
   // app.use('/api/data', require('./routes/dataRoutes'));
   
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

4. **Create Environment File**
   ```bash
   nano .env
   ```
   
   Add:
   ```
   MONGODB_URI=mongodb://appuser:YOUR_APP_PASSWORD@localhost:27017/yourappdb
   PORT=5000
   NODE_ENV=production
   ```

### Step 3: Set Up Process Manager (PM2)

1. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

2. **Start Your Backend**
   ```bash
   cd /home/ubuntu/backend
   pm2 start server.js --name "backend-api"
   
   # Save PM2 configuration
   pm2 save
   
   # Set PM2 to start on system boot
   pm2 startup
   # Run the command that PM2 outputs
   ```

3. **Manage Your Backend**
   ```bash
   pm2 status          # Check status
   pm2 logs backend-api # View logs
   pm2 restart backend-api # Restart
   pm2 stop backend-api    # Stop
   ```

### Step 4: Configure Nginx as Reverse Proxy

Update your Nginx configuration to proxy API requests:

```bash
sudo nano /etc/nginx/sites-available/react-app
```

Update the configuration:
```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name YOUR_EC2_PUBLIC_IP;
    
    # React app
    root /home/ubuntu/your-project-folder/build;
    index index.html;
    
    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # React app routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
```

Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Update Security Group

Add port 5000 to your EC2 security group (optional, if you want direct access):
- Go to EC2 Console → Security Groups
- Edit inbound rules
- Add: Custom TCP, Port 5000, Source: Anywhere (or restrict as needed)

### Step 6: Migrate Data from JSON to MongoDB

Create a migration script:

```bash
cd /home/ubuntu/backend
nano migrate.js
```

Example migration script:
```javascript
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Define your schema
const DataSchema = new mongoose.Schema({
  // Define based on your JSON structure
  name: String,
  description: String,
  // ... other fields
}, { timestamps: true });

const Data = mongoose.model('Data', DataSchema);

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Read JSON file
    const jsonData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    
    // Insert data
    await Data.insertMany(jsonData);
    console.log('Data migrated successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();
```

Run migration:
```bash
node migrate.js
```

### Step 7: Update React App to Use API

Update your React app to fetch from `/api/...` instead of the JSON file:

```javascript
// Before (using JSON)
import data from './data.json';

// After (using API)
const [data, setData] = useState([]);

useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.error(err));
}, []);
```

Rebuild and redeploy your React app:
```bash
cd /home/ubuntu/your-project-folder
npm run build
sudo systemctl reload nginx
```

---

## Troubleshooting

### Common Issues

**1. Cannot connect to EC2 instance via SSH**
- Check security group allows SSH (port 22) from your IP
- Verify key file permissions: `chmod 400 my-react-app-key.pem`
- Ensure using correct username: `ubuntu` for Ubuntu AMI

**2. Website not loading**
- Check Nginx status: `sudo systemctl status nginx`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Verify security group allows HTTP (port 80)
- Check build folder exists and has correct permissions

**3. Backend API not working**
- Check PM2 status: `pm2 status`
- View logs: `pm2 logs backend-api`
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check .env file has correct MongoDB connection string

**4. MongoDB connection issues**
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`
- Test connection: `mongosh -u appuser -p --authenticationDatabase yourappdb`

**5. 502 Bad Gateway**
- Backend server not running - check PM2
- Wrong proxy_pass port in Nginx config
- Firewall blocking the port

### Useful Commands

```bash
# Check what's running on a port
sudo lsof -i :80
sudo lsof -i :5000

# Check disk space
df -h

# Check memory usage
free -h

# View system logs
sudo journalctl -xe

# Restart services
sudo systemctl restart nginx
sudo systemctl restart mongod
pm2 restart all
```

### Security Checklist

- [ ] Changed default MongoDB password
- [ ] SSH key file permissions set to 400
- [ ] Security group restricts SSH to your IP only
- [ ] Environment variables not committed to Git
- [ ] SSL/HTTPS enabled for production
- [ ] MongoDB authentication enabled
- [ ] Regular system updates scheduled
- [ ] Backups configured for database

---

## Next Steps and Best Practices

### 1. Set Up Automated Deployments

Consider using GitHub Actions or similar CI/CD:
```bash
# Install GitHub CLI
sudo apt install gh

# Or use git hooks for deployment
```

### 2. Database Backups

```bash
# Create backup script
nano /home/ubuntu/backup-mongo.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mongodump --uri="mongodb://appuser:YOUR_APP_PASSWORD@localhost:27017/yourappdb" \
  --out="$BACKUP_DIR/backup_$TIMESTAMP"

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

```bash
chmod +x /home/ubuntu/backup-mongo.sh

# Schedule with cron
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-mongo.sh
```

### 3. Monitoring

```bash
# Install monitoring tools
sudo apt install htop
sudo npm install -g pm2-logrotate
pm2 install pm2-logrotate
```

### 4. Environment-Specific Builds

Update your `package.json`:
```json
{
  "scripts": {
    "build:dev": "REACT_APP_API_URL=http://localhost:5000 npm run build",
    "build:prod": "REACT_APP_API_URL=https://yourdomain.com npm run build"
  }
}
```

---

## Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## Summary

You now have:
- ✅ React app deployed on AWS EC2
- ✅ Nginx serving your static files
- ✅ MongoDB database for data storage
- ✅ Express REST API backend
- ✅ PM2 managing your Node.js process
- ✅ Reverse proxy for API requests

Your application is production-ready! 🚀
