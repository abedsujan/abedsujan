# Quick Reference Cheat Sheet

## Essential Commands

### Connecting to EC2
```bash
# Mac/Linux
ssh -i my-react-key.pem ubuntu@YOUR_IP

# Windows (PowerShell)
ssh -i my-react-key.pem ubuntu@YOUR_IP
```

### First Time Setup
```bash
# Run on EC2 instance
curl -o setup-server.sh https://raw.githubusercontent.com/abedsujan/abedsujan/main/scripts/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

### Deploy React App
```bash
# Upload via Git
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
npm run build

# Configure Nginx
curl -o configure-nginx.sh https://raw.githubusercontent.com/abedsujan/abedsujan/main/scripts/configure-nginx.sh
chmod +x configure-nginx.sh
./configure-nginx.sh
```

### Update Your App
```bash
cd /home/ubuntu/your-project
git pull
npm install
npm run build
sudo systemctl reload nginx
```

## Common Nginx Commands
```bash
# Start/Stop/Restart Nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

## Debugging Commands
```bash
# Check what's running on port 80
sudo lsof -i :80

# Check disk space
df -h

# Check memory
free -h

# Check build folder
ls -la /home/ubuntu/your-project/build

# View Nginx config
cat /etc/nginx/sites-available/react-app
```

## File Locations
- **Project**: `/home/ubuntu/your-project/`
- **Build folder**: `/home/ubuntu/your-project/build`
- **Nginx config**: `/etc/nginx/sites-available/react-app`
- **Nginx logs**: `/var/log/nginx/`

## Security Group Ports
Make sure these ports are open in your AWS Security Group:
- **22** - SSH (Your IP only)
- **80** - HTTP (0.0.0.0/0)
- **443** - HTTPS (0.0.0.0/0)
- **3000** - Dev server (optional, 0.0.0.0/0)

## Troubleshooting

### Site not loading?
1. Check Nginx is running: `sudo systemctl status nginx`
2. Check logs: `sudo tail -20 /var/log/nginx/error.log`
3. Verify build exists: `ls /home/ubuntu/your-project/build`
4. Check security group allows port 80
5. Restart Nginx: `sudo systemctl restart nginx`

### Can't SSH?
1. Check security group allows port 22 from your IP
2. Verify key permissions: `chmod 400 my-react-key.pem`
3. Check instance is running in AWS console
4. Use correct username: `ubuntu`

### Build fails?
1. Check Node version: `node --version` (should be 18+)
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Check for errors in build output
4. Ensure enough disk space: `df -h`

## Get Your EC2 IP
```bash
# From inside EC2
curl http://169.254.169.254/latest/meta-data/public-ipv4

# From AWS Console
EC2 → Instances → Select your instance → See "Public IPv4 address"
```

## Useful Git Commands
```bash
# Clone repository
git clone https://github.com/username/repo.git

# Pull latest changes
git pull

# Check status
git status

# View commit history
git log --oneline
```

## MongoDB Commands (Phase 2)
```bash
# Start/Stop MongoDB
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl status mongod

# Connect to MongoDB
mongosh -u username -p

# Backup database
mongodump --uri="mongodb://user:pass@localhost:27017/dbname"

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## PM2 Commands (for Backend)
```bash
# Start app
pm2 start server.js --name "backend-api"

# Status
pm2 status

# Logs
pm2 logs backend-api

# Restart
pm2 restart backend-api

# Stop
pm2 stop backend-api

# Save config
pm2 save

# Auto-start on boot
pm2 startup
```

## Tips
- Always test Nginx config before reloading: `sudo nginx -t`
- Use `pm2 logs` to debug backend issues
- Keep backups of important files before editing
- Use `screen` or `tmux` for long-running processes
- Monitor disk space regularly
- Update packages: `sudo apt update && sudo apt upgrade`
