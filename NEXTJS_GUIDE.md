# Next.js Deployment Guide for AWS EC2

This guide is specifically for deploying **Next.js** applications to AWS EC2. If you have a standard Create React App, use [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md) instead.

---

## Next.js vs React: Key Differences

**Next.js** requires different configuration than standard React apps:
- **Build output**: Next.js creates an `out` folder (for static export) instead of `build`
- **Configuration**: Requires `next.config.js` setup for static export
- **Export command**: Uses `next export` or automatic export with `output: 'export'`

---

## Prerequisites

- AWS account
- Next.js project ready locally
- Basic command line knowledge

---

## PART 1: Configure Your Next.js Project for Static Export

### Step 1: Update next.config.js

Before deploying, configure your Next.js app for static export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: Change the output directory (default is 'out')
  // distDir: 'dist',
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
```

**Important Notes:**
- `output: 'export'` enables static HTML export
- `images.unoptimized: true` is required because static export doesn't support Next.js Image Optimization
- Some Next.js features are not supported in static export mode (API routes, server-side rendering, etc.)

### Step 2: Update package.json

Add or update your build script:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

With `output: 'export'` in next.config.js, `next build` will automatically create the `out` folder.

### Step 3: Test Locally

```bash
npm run build
```

Check that the `out` folder was created:
```bash
ls -la out/
# You should see index.html and other static files
```

---

## PART 2: Deploy to AWS EC2

Follow the same steps as the React guide, but with Next.js-specific changes:

### Step 1-4: AWS Setup (Same as React Guide)

Follow [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md) Steps 1-9 to:
- Create AWS account
- Launch EC2 instance
- Connect via SSH
- Install Node.js, Nginx, Git

### Step 5: Upload Your Next.js Project

**Option A: Using GitHub (Recommended)**

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

**Option B: Using SCP**

```bash
# From your LOCAL computer
scp -i my-react-key.pem -r /path/to/your/nextjs/project ubuntu@YOUR_IP:/home/ubuntu/my-app
```

### Step 6: Build Your Next.js App

```bash
cd /home/ubuntu/your-project-folder
npm install
npm run build
```

**Verify the output:**
```bash
ls -la out/
# Should show index.html and _next/ folder
```

### Step 7: Configure Nginx for Next.js

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/nextjs-app
```

Paste this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    # Point to the 'out' folder (Next.js static export output)
    root /home/ubuntu/YOUR_FOLDER_NAME/out;
    index index.html;
    
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }
    
    # Cache static assets
    location /_next/static/ {
        alias /home/ubuntu/YOUR_FOLDER_NAME/out/_next/static/;
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
```

**IMPORTANT**: Replace `YOUR_FOLDER_NAME` with your actual folder name!

### Step 8: Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
```

If you see "syntax is ok":
```bash
sudo systemctl reload nginx
```

### Step 9: Fix Permissions

```bash
sudo chmod -R 755 /home/ubuntu/your-project-folder
```

### Step 10: Access Your Website

Open browser and go to: `http://YOUR_EC2_IP`

Your Next.js app should be live! 🎉

---

## Quick Deploy Script for Next.js

Save this as `deploy-nextjs.sh`:

```bash
#!/bin/bash
# Next.js Deployment Script

set -e

echo "=========================================="
echo "Next.js App Deployment"
echo "=========================================="
echo ""

# Pull latest changes if using Git
if [ -d .git ]; then
    echo "Pulling latest changes..."
    git pull
    echo "✓ Git pull complete"
    echo ""
fi

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Build the app
echo "Building Next.js app..."
npm run build
echo "✓ Build complete"
echo ""

# Verify output folder exists
if [ -d "out" ]; then
    echo "✓ Output folder 'out' found"
elif [ -d "build" ]; then
    echo "✓ Output folder 'build' found"
else
    echo "⚠ Warning: No output folder found"
fi
echo ""

# Reload Nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx
echo "✓ Nginx reloaded"
echo ""

echo "=========================================="
echo "Deployment Complete! ✓"
echo "=========================================="
echo ""
```

Make it executable:
```bash
chmod +x deploy-nextjs.sh
```

Run it when updating:
```bash
./deploy-nextjs.sh
```

---

## Troubleshooting Next.js Deployment

### ❌ Problem: No `out` folder after build

**Solution 1: Check next.config.js**

Make sure you have:
```javascript
const nextConfig = {
  output: 'export',
}
```

**Solution 2: Use older Next.js export method**

If you're on an older version of Next.js:
```bash
npm run build && npx next export
```

Update package.json:
```json
{
  "scripts": {
    "build": "next build && next export"
  }
}
```

### ❌ Problem: Pages don't load correctly

**Check routing configuration:**

Next.js uses `.html` extensions for static files. Update Nginx:
```nginx
location / {
    try_files $uri $uri.html $uri/ /index.html;
}
```

### ❌ Problem: Images not loading

**Solution:**

In next.config.js, ensure:
```javascript
images: {
  unoptimized: true,
}
```

### ❌ Problem: "Error: API routes not supported"

Next.js API routes don't work with static export. You have two options:

**Option 1**: Remove API routes and use an external API
**Option 2**: Deploy Next.js in server mode (see Advanced section below)

---

## Advanced: Server-Side Next.js (with PM2)

If you need server-side rendering or API routes, deploy Next.js as a Node.js app:

### 1. Don't use static export

Remove `output: 'export'` from next.config.js

### 2. Build normally

```bash
npm run build
```

### 3. Install PM2

```bash
sudo npm install -g pm2
```

### 4. Start with PM2

```bash
pm2 start npm --name "nextjs-app" -- start
pm2 save
pm2 startup
```

### 5. Configure Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Next.js Features Compatibility

| Feature | Static Export | Server Mode |
|---------|--------------|-------------|
| Static pages | ✅ | ✅ |
| Dynamic routes | ✅ | ✅ |
| API routes | ❌ | ✅ |
| SSR (getServerSideProps) | ❌ | ✅ |
| SSG (getStaticProps) | ✅ | ✅ |
| ISR (revalidate) | ❌ | ✅ |
| Image Optimization | ❌ | ✅ |
| Middleware | ❌ | ✅ |

---

## Quick Reference

### Important Paths
- Next.js output: `/home/ubuntu/your-project/out`
- Nginx config: `/etc/nginx/sites-available/nextjs-app`

### Update Your App
```bash
cd /home/ubuntu/your-project
git pull
npm install
npm run build
sudo systemctl reload nginx
```

### Check Build Output
```bash
# For static export
ls -la out/

# Check for index.html
cat out/index.html
```

---

## Comparison: React vs Next.js Deployment

| Aspect | Create React App | Next.js (Static) |
|--------|------------------|------------------|
| Build command | `npm run build` | `npm run build` |
| Output folder | `build/` | `out/` |
| Configuration | None needed | `next.config.js` |
| Nginx root | `/path/to/build` | `/path/to/out` |
| Image handling | Standard | Needs `unoptimized: true` |

---

## Need Help?

- Next.js static export not working? Check [next.config.js configuration](#step-1-update-nextconfigjs)
- Want to use API routes? See [Advanced: Server-Side Next.js](#advanced-server-side-nextjs-with-pm2)
- General deployment issues? Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**You're all set!** Your Next.js app is now deployed on AWS EC2! 🚀
