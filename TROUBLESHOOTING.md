# Troubleshooting Guide

This guide helps you solve common issues when deploying React apps to AWS EC2.

---

## Table of Contents
1. [Connection Issues](#connection-issues)
2. [Website Not Loading](#website-not-loading)
3. [Build Errors](#build-errors)
4. [Nginx Problems](#nginx-problems)
5. [Backend API Issues](#backend-api-issues)
6. [MongoDB Problems](#mongodb-problems)
7. [Performance Issues](#performance-issues)

---

## Connection Issues

### ❌ Problem: Can't SSH into EC2 instance

**Error message:**
```
Permission denied (publickey)
```

**Solutions:**

1. **Check key file permissions:**
   ```bash
   chmod 400 my-react-key.pem
   ```

2. **Verify correct username:**
   ```bash
   # For Ubuntu AMI
   ssh -i my-react-key.pem ubuntu@YOUR_IP
   
   # NOT 'ec2-user' or 'root'
   ```

3. **Check Security Group:**
   - Go to EC2 Console
   - Select your instance → Security tab
   - Verify SSH (port 22) is allowed from your IP
   - Click on security group → Edit inbound rules
   - Add rule: SSH, Port 22, Source: My IP

4. **Verify instance is running:**
   - Check instance state in EC2 console
   - Should show "Running"

5. **Get the correct IP:**
   - Use Public IPv4 address (not private)
   - IP changes if instance stops/starts

---

## Website Not Loading

### ❌ Problem: Browser shows "This site can't be reached"

**Solutions:**

1. **Check instance is running:**
   ```bash
   # In EC2 Console, verify instance state = "Running"
   ```

2. **Verify Security Group allows HTTP:**
   - Port 80 should be open to 0.0.0.0/0
   - Go to Security Groups → Inbound rules
   - Should see: HTTP, TCP, 80, 0.0.0.0/0

3. **Check Nginx is running:**
   ```bash
   sudo systemctl status nginx
   ```
   
   If not running:
   ```bash
   sudo systemctl start nginx
   ```

4. **Test from EC2 instance itself:**
   ```bash
   curl localhost
   # Should return HTML
   ```

5. **Check if port 80 is in use:**
   ```bash
   sudo lsof -i :80
   # Should show nginx
   ```

### ❌ Problem: "502 Bad Gateway"

**This means Nginx is running but can't reach the backend**

**Solutions:**

1. **Check backend is running:**
   ```bash
   pm2 status
   # Should show backend-api as "online"
   ```

2. **Restart backend:**
   ```bash
   pm2 restart backend-api
   ```

3. **Check backend port:**
   ```bash
   sudo lsof -i :5000
   # Should show node
   ```

4. **Verify Nginx proxy configuration:**
   ```bash
   cat /etc/nginx/sites-available/react-app
   # Check proxy_pass http://localhost:5000
   ```

### ❌ Problem: "403 Forbidden"

**Nginx can't read your files**

**Solutions:**

1. **Fix permissions:**
   ```bash
   sudo chmod -R 755 /home/ubuntu
   sudo chown -R www-data:www-data /home/ubuntu/your-project/build
   ```

2. **Verify build folder exists:**
   ```bash
   ls -la /home/ubuntu/your-project/build
   # Should show index.html
   ```

### ❌ Problem: React routing not working (404 on refresh)

**Example: /about works when navigated to, but 404 on refresh**

**Solution:**

Update Nginx config to handle client-side routing:
```bash
sudo nano /etc/nginx/sites-available/react-app
```

Ensure you have:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Then reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Build Errors

### ❌ Problem: `npm install` fails

**Error:** `ENOSPC: no space left on device`

**Solution:**
```bash
# Check disk space
df -h

# Clean npm cache
npm cache clean --force

# Remove node_modules and retry
rm -rf node_modules package-lock.json
npm install
```

**Error:** `Permission denied`

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
npm install
```

### ❌ Problem: `npm run build` fails

**Error:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Error:** Module not found

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Nginx Problems

### ❌ Problem: "nginx: configuration file test failed"

**Solution:**

1. **View detailed error:**
   ```bash
   sudo nginx -t
   # Read the error message carefully
   ```

2. **Common syntax errors:**
   - Missing semicolon `;`
   - Unmatched curly braces `{}`
   - Wrong file path

3. **Restore from backup:**
   ```bash
   # If you made a mistake
   sudo cp /etc/nginx/sites-available/react-app.backup /etc/nginx/sites-available/react-app
   ```

### ❌ Problem: Changes not taking effect

**Solution:**

1. **Test configuration:**
   ```bash
   sudo nginx -t
   ```

2. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

3. **If reload doesn't work, restart:**
   ```bash
   sudo systemctl restart nginx
   ```

4. **Clear browser cache:**
   - Press Ctrl+Shift+R (hard refresh)
   - Or open in incognito/private window

### ❌ Problem: Nginx won't start

**Solution:**

1. **Check error logs:**
   ```bash
   sudo tail -50 /var/log/nginx/error.log
   ```

2. **Check if port 80 is already in use:**
   ```bash
   sudo lsof -i :80
   # Kill other process if needed
   ```

3. **Verify configuration:**
   ```bash
   sudo nginx -t
   ```

---

## Backend API Issues

### ❌ Problem: API returns 404

**Solutions:**

1. **Verify backend is running:**
   ```bash
   pm2 status
   pm2 logs backend-api
   ```

2. **Test API directly:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check Nginx proxy configuration:**
   ```bash
   sudo nginx -t
   cat /etc/nginx/sites-available/react-app
   ```

4. **Verify route exists in server.js:**
   ```bash
   cat /home/ubuntu/backend/server.js
   ```

### ❌ Problem: CORS errors

**Error in browser:** `Access to fetch has been blocked by CORS policy`

**Solution:**

In your `server.js`:
```javascript
const cors = require('cors');
app.use(cors());

// Or more specific:
app.use(cors({
  origin: ['http://your-domain.com', 'http://YOUR_EC2_IP']
}));
```

Restart backend:
```bash
pm2 restart backend-api
```

### ❌ Problem: PM2 process keeps crashing

**Solutions:**

1. **Check logs:**
   ```bash
   pm2 logs backend-api --lines 100
   ```

2. **Common issues:**
   - MongoDB connection failed
   - Port already in use
   - Missing environment variables

3. **Verify .env file:**
   ```bash
   cat /home/ubuntu/backend/.env
   ```

4. **Test server manually:**
   ```bash
   cd /home/ubuntu/backend
   node server.js
   # See errors directly
   ```

---

## MongoDB Problems

### ❌ Problem: Can't connect to MongoDB

**Error:** `MongoServerError: Authentication failed`

**Solutions:**

1. **Verify MongoDB is running:**
   ```bash
   sudo systemctl status mongod
   ```

2. **Check connection string in .env:**
   ```bash
   cat /home/ubuntu/backend/.env
   # Should be: mongodb://username:password@localhost:27017/dbname
   ```

3. **Test MongoDB connection:**
   ```bash
   mongosh -u appuser -p --authenticationDatabase yourappdb
   ```

4. **Recreate user if needed:**
   ```bash
   mongosh
   use yourappdb
   db.createUser({
     user: "appuser",
     pwd: "password",
     roles: [ { role: "readWrite", db: "yourappdb" } ]
   })
   ```

### ❌ Problem: MongoDB won't start

**Solutions:**

1. **Check logs:**
   ```bash
   sudo tail -50 /var/log/mongodb/mongod.log
   ```

2. **Check disk space:**
   ```bash
   df -h
   # MongoDB needs free space
   ```

3. **Fix permissions:**
   ```bash
   sudo chown -R mongodb:mongodb /var/lib/mongodb
   sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
   ```

4. **Restart MongoDB:**
   ```bash
   sudo systemctl restart mongod
   ```

### ❌ Problem: Data not appearing

**Solutions:**

1. **Verify data was inserted:**
   ```bash
   mongosh -u appuser -p
   use yourappdb
   db.yourCollection.find().limit(5)
   ```

2. **Check API is querying correct database:**
   ```javascript
   // In your backend code
   console.log('DB URI:', process.env.MONGODB_URI);
   ```

3. **Test API endpoint:**
   ```bash
   curl http://localhost:5000/api/data
   ```

---

## Performance Issues

### ❌ Problem: Website is slow

**Solutions:**

1. **Enable Gzip compression in Nginx:**
   Already in our config, verify:
   ```bash
   grep -A 5 "gzip on" /etc/nginx/sites-available/react-app
   ```

2. **Optimize React build:**
   ```bash
   # In package.json, make sure using production build
   npm run build
   ```

3. **Check instance resources:**
   ```bash
   # CPU usage
   top
   
   # Memory usage
   free -h
   
   # Disk I/O
   iostat
   ```

4. **Consider upgrading instance type:**
   - t2.micro → t2.small for better performance

### ❌ Problem: Running out of disk space

**Solutions:**

1. **Check disk usage:**
   ```bash
   df -h
   du -sh /home/ubuntu/* | sort -h
   ```

2. **Clean up:**
   ```bash
   # Remove old node_modules
   find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
   
   # Clean npm cache
   npm cache clean --force
   
   # Clean apt cache
   sudo apt clean
   
   # Remove old logs
   sudo journalctl --vacuum-time=7d
   ```

3. **Expand EBS volume:**
   - In AWS Console: EC2 → Volumes
   - Modify volume size
   - Resize filesystem on instance

---

## Diagnostic Commands

### Quick Health Check Script

Create and run this:
```bash
#!/bin/bash
echo "=== System Health Check ==="
echo ""
echo "1. Instance Info:"
curl -s http://169.254.169.254/latest/meta-data/public-ipv4
echo ""
echo ""
echo "2. Disk Space:"
df -h / | tail -1
echo ""
echo "3. Memory:"
free -h | grep Mem
echo ""
echo "4. Nginx Status:"
sudo systemctl is-active nginx
echo ""
echo "5. Nginx Config Test:"
sudo nginx -t 2>&1 | tail -1
echo ""
echo "6. MongoDB Status:"
sudo systemctl is-active mongod
echo ""
echo "7. PM2 Processes:"
pm2 list | grep backend-api
echo ""
echo "8. Ports in Use:"
sudo lsof -i :80 -i :5000 -i :27017
```

Save as `health-check.sh`, make executable, and run:
```bash
chmod +x health-check.sh
./health-check.sh
```

---

## Getting Help

### Information to Collect

When asking for help, provide:

1. **Error messages:**
   ```bash
   sudo tail -50 /var/log/nginx/error.log
   pm2 logs backend-api --lines 50
   sudo journalctl -u mongod --no-pager -n 50
   ```

2. **Configuration files:**
   ```bash
   cat /etc/nginx/sites-available/react-app
   cat /home/ubuntu/backend/.env
   ```

3. **System info:**
   ```bash
   uname -a
   node --version
   nginx -v
   ```

4. **Current status:**
   ```bash
   sudo systemctl status nginx mongod
   pm2 status
   ```

### Useful Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/manual/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [React Documentation](https://react.dev/)

---

## Emergency Procedures

### Complete Reset

If everything is broken and you want to start fresh:

1. **Stop all services:**
   ```bash
   pm2 kill
   sudo systemctl stop nginx
   sudo systemctl stop mongod
   ```

2. **Remove configurations:**
   ```bash
   sudo rm /etc/nginx/sites-enabled/react-app
   sudo rm /etc/nginx/sites-available/react-app
   ```

3. **Restart from Step 1:**
   Follow STEP_BY_STEP_GUIDE.md from the beginning

### Quick Recovery

If just the app is broken:

```bash
# Navigate to project
cd /home/ubuntu/your-project

# Get fresh code
git fetch origin
git reset --hard origin/main

# Rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# Restart services
sudo systemctl reload nginx
pm2 restart all
```

---

## Prevention Tips

1. **Always test before making changes:**
   ```bash
   sudo nginx -t  # Before changing Nginx config
   pm2 logs       # Check logs regularly
   ```

2. **Keep backups:**
   ```bash
   # Backup Nginx config
   sudo cp /etc/nginx/sites-available/react-app /etc/nginx/sites-available/react-app.backup
   
   # Backup MongoDB
   mongodump --uri="mongodb://user:pass@localhost/dbname"
   ```

3. **Monitor resources:**
   ```bash
   # Set up regular monitoring
   watch -n 5 'df -h; free -h; pm2 status'
   ```

4. **Keep system updated:**
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

5. **Use version control:**
   - Always commit code before deploying
   - Tag releases
   - Keep .env in .gitignore

---

**Still stuck?** Review the [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md) or [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.
