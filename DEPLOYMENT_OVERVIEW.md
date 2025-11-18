# Deployment Process Overview

## Phase 1: Static React Website Deployment

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: AWS Setup                                           │
├─────────────────────────────────────────────────────────────┤
│ • Create AWS Account                                        │
│ • Launch EC2 Instance (Ubuntu 22.04, t2.micro)             │
│ • Configure Security Groups (SSH, HTTP, HTTPS)             │
│ • Download SSH Key (.pem file)                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Connect to EC2                                      │
├─────────────────────────────────────────────────────────────┤
│ • chmod 400 my-react-key.pem                               │
│ • ssh -i my-react-key.pem ubuntu@YOUR_IP                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Server Setup                                        │
├─────────────────────────────────────────────────────────────┤
│ • Update system packages                                    │
│ • Install Node.js 18.x                                     │
│ • Install Nginx                                            │
│ • Install Git                                              │
│                                                             │
│ 💡 Quick: Run setup-server.sh script                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Upload React Project                               │
├─────────────────────────────────────────────────────────────┤
│ Option A: Git Clone                                         │
│   git clone https://github.com/user/repo.git               │
│                                                             │
│ Option B: SCP Upload                                        │
│   scp -r project/ ubuntu@IP:/home/ubuntu/                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Build React App                                    │
├─────────────────────────────────────────────────────────────┤
│ • npm install                                              │
│ • npm run build                                            │
│ • Creates /build folder with static files                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Configure Nginx                                    │
├─────────────────────────────────────────────────────────────┤
│ • Create /etc/nginx/sites-available/react-app             │
│ • Point to /home/ubuntu/project/build                      │
│ • Enable site and reload Nginx                            │
│                                                             │
│ 💡 Quick: Run configure-nginx.sh script                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ ✅ RESULT: Live Website!                                   │
├─────────────────────────────────────────────────────────────┤
│ Access at: http://YOUR_EC2_IP                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 2: Add MongoDB & Backend API

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Install MongoDB                                    │
├─────────────────────────────────────────────────────────────┤
│ • Install MongoDB 7.0                                      │
│ • Start MongoDB service                                    │
│ • Create admin user                                        │
│ • Enable authentication                                    │
│                                                             │
│ 💡 Quick: Run install-mongodb.sh script                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Create Backend API                                 │
├─────────────────────────────────────────────────────────────┤
│ • Create /home/ubuntu/backend folder                       │
│ • npm init & install express, mongoose                    │
│ • Create server.js with API routes                        │
│ • Create .env with MongoDB connection                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Setup PM2 Process Manager                          │
├─────────────────────────────────────────────────────────────┤
│ • npm install -g pm2                                       │
│ • pm2 start server.js --name backend-api                  │
│ • pm2 save & pm2 startup                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Update Nginx Config                                │
├─────────────────────────────────────────────────────────────┤
│ • Add reverse proxy for /api routes                        │
│ • Proxy requests to localhost:5000                        │
│ • Reload Nginx                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Migrate Data                                       │
├─────────────────────────────────────────────────────────────┤
│ • Create migration script                                  │
│ • Import JSON data to MongoDB                             │
│ • Verify data in database                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Update React App                                   │
├─────────────────────────────────────────────────────────────┤
│ • Replace JSON imports with API calls                      │
│ • Fetch data from /api endpoints                          │
│ • Rebuild: npm run build                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ ✅ RESULT: Full-Stack Application!                         │
├─────────────────────────────────────────────────────────────┤
│ • Frontend: http://YOUR_EC2_IP                            │
│ • API: http://YOUR_EC2_IP/api                             │
│ • Database: MongoDB running locally                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture Diagram

### Phase 1: Static Site
```
┌──────────┐
│  User    │
│ Browser  │
└────┬─────┘
     │ HTTP Request
     ▼
┌─────────────────────┐
│   EC2 Instance      │
│  ┌──────────────┐   │
│  │    Nginx     │   │
│  │  Port 80     │   │
│  └──────┬───────┘   │
│         │           │
│         ▼           │
│  ┌──────────────┐   │
│  │   Static     │   │
│  │   Files      │   │
│  │   (build/)   │   │
│  └──────────────┘   │
└─────────────────────┘
```

### Phase 2: Full-Stack
```
┌──────────┐
│  User    │
│ Browser  │
└────┬─────┘
     │ HTTP Request
     ▼
┌─────────────────────────────────────┐
│          EC2 Instance               │
│  ┌──────────────┐                   │
│  │    Nginx     │                   │
│  │  Port 80     │                   │
│  └──────┬───────┘                   │
│         │                           │
│    ┌────┴────┐                      │
│    │         │                      │
│    ▼         ▼                      │
│  ┌────┐  ┌─────────┐                │
│  │ /  │  │  /api   │                │
│  │    │  │         │                │
│  ▼    │  ▼         │                │
│ ┌──┐  │ ┌────────┐ │                │
│ │  │  │ │Express │ │                │
│ │St│  │ │API     │ │                │
│ │at│  │ │(PM2)   │ │                │
│ │ic│  │ │Port    │ │                │
│ │  │  │ │5000    │ │                │
│ └──┘  │ └───┬────┘ │                │
│       │     │      │                │
│       │     ▼      │                │
│       │ ┌────────┐ │                │
│       │ │MongoDB │ │                │
│       │ │Port    │ │                │
│       │ │27017   │ │                │
│       │ └────────┘ │                │
│       └────────────┘                │
└─────────────────────────────────────┘
```

---

## File Structure

### On EC2 Instance

```
/home/ubuntu/
├── your-react-app/
│   ├── src/
│   ├── public/
│   ├── build/              ← Nginx serves from here
│   │   ├── index.html
│   │   ├── static/
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── backend/               ← Phase 2
    ├── server.js
    ├── routes/
    ├── models/
    ├── .env
    ├── package.json
    └── ...

/etc/nginx/
├── nginx.conf
├── sites-available/
│   └── react-app          ← Your Nginx config
└── sites-enabled/
    └── react-app          ← Symlink to sites-available
```

---

## Network Flow

### User Request Flow
```
1. User types: http://YOUR_EC2_IP
2. Request hits AWS Security Group → Port 80 allowed
3. Request reaches Nginx on EC2
4. Nginx checks location rules:
   
   If URL starts with /api:
   → Proxy to Express (localhost:5000)
   → Express queries MongoDB
   → Returns JSON response
   
   Otherwise:
   → Serve from /build folder
   → Return HTML/CSS/JS files
   
5. Response sent back to user's browser
```

---

## Key Concepts

### Static vs Dynamic Hosting

**Static (Phase 1):**
- Pre-built HTML/CSS/JS files
- Nginx serves files directly
- Fast, simple, cheap
- Data hardcoded or in JSON

**Dynamic (Phase 2):**
- Server generates responses
- Database stores data
- Can handle user input
- Requires backend server

### Why Nginx?
- Web server (serves static files)
- Reverse proxy (forwards API requests)
- Load balancer (future scaling)
- SSL termination (HTTPS)
- Fast and efficient

### Why PM2?
- Keeps Node.js running 24/7
- Auto-restarts on crashes
- Easy process management
- Logs management
- Zero-downtime reloads

---

## Security Layers

```
┌─────────────────────────────────────┐
│ AWS Security Group (Firewall)       │
│ • Allow: SSH (22) from your IP     │
│ • Allow: HTTP (80) from anywhere   │
│ • Block: Everything else           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Nginx (Web Server)                  │
│ • Filters bad requests             │
│ • Rate limiting                    │
│ • SSL/TLS encryption               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Backend API                         │
│ • Authentication middleware        │
│ • Input validation                 │
│ • CORS configuration               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ MongoDB                             │
│ • Authentication enabled           │
│ • User permissions                 │
│ • Local access only                │
└─────────────────────────────────────┘
```

---

## Common Commands Quick Reference

| Task | Command |
|------|---------|
| Connect to EC2 | `ssh -i key.pem ubuntu@IP` |
| Update app | `cd project && git pull && npm run build` |
| Reload Nginx | `sudo systemctl reload nginx` |
| View Nginx logs | `sudo tail -f /var/log/nginx/error.log` |
| Backend status | `pm2 status` |
| Backend logs | `pm2 logs backend-api` |
| Restart backend | `pm2 restart backend-api` |
| MongoDB status | `sudo systemctl status mongod` |
| Connect to MongoDB | `mongosh -u user -p` |

---

## Deployment Checklist

### Before Starting
- [ ] AWS account created
- [ ] Credit card added (for verification)
- [ ] React project ready and working locally
- [ ] Basic terminal/command line knowledge

### Phase 1 Complete When
- [ ] EC2 instance running
- [ ] Can SSH into instance
- [ ] Nginx installed and running
- [ ] React app built successfully
- [ ] Website accessible at http://YOUR_IP
- [ ] All pages/routes working correctly

### Phase 2 Complete When
- [ ] MongoDB installed and secured
- [ ] Backend API running via PM2
- [ ] Nginx proxying API requests
- [ ] Data migrated from JSON to MongoDB
- [ ] React app fetching from API
- [ ] Both frontend and backend working together

---

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Buy domain from registrar
   - Point DNS to EC2 IP
   - Update Nginx config

2. **HTTPS/SSL** (Recommended)
   - Install Certbot
   - Get Let's Encrypt certificate
   - Auto-renew setup

3. **Monitoring** (Recommended)
   - Set up CloudWatch
   - Configure alerts
   - Monitor costs

4. **Backups** (Important)
   - MongoDB backups
   - Code repository on GitHub
   - Regular snapshots

5. **Scaling** (Future)
   - Load balancer
   - Auto-scaling groups
   - CDN for static files

---

For detailed step-by-step instructions, see:
- **[STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)** - Beginner-friendly guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive documentation
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command cheat sheet
